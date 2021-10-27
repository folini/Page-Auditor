// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card, iLink} from '../card'
import {Report} from '../report'
import {Mode} from '../colorCode'
import {disposableId, formatNumber, fileExists} from '../main'
import {Suggestions} from './suggestions'
import {Errors} from './errors'
import {Tips} from './tips'
import {codeBlock} from '../codeBlock'
import {htmlDecode} from 'js-htmlencode'
import {SitemapList} from '../sitemapList'

export const readFile = (url: string) =>
    fileExists(url)
        .then(() => {
            if (url.match(/\.gz($|\?)/) !== null) {
                return Promise.resolve('')
            }
            return fetch(url)
                .then(response => {
                    if (!response.ok || response.status !== 200) {
                        return Promise.reject()
                    }
                    return response.text()
                })
                .catch(() => Promise.reject())
        })
        .catch(() => Promise.reject())

const sitemapCard = (url: string, sitemaps: SitemapList, report: Report) =>
    readFile(url)
        .then(sitemapBody => {
            if (url.endsWith('.gz')) {
                const fileName = url.replace(/(.*)\/([a-z0-9\-_\.]+(\.xml)?(\.gz)?)(.*)/i, '$2')
                const table = [
                    ['File Name', fileName],
                    ['File Size', `n/a`],
                    ['Pages', `n/a`],
                    ['Sub Sitemap', `n/a`],
                    ['Compressed', 'Yes'],
                    ['Compression type', 'Gzip'],
                ]

                const card = new Card()
                    .open(`Sitemap #${sitemaps.doneList.length + 1} (Compressed)`, fileName, 'icon-sitemap')
                    .addParagraph(`Found a compressed <code>sitemap.xml</code> file at the url:`)
                    .addCodeBlock(url, Mode.txt)
                    .addTable('Sitemap Analysis', table, getSitemapToolbarLinks(url, ''))
                    .addParagraph(`Unable to display the content of compressed files.`)
                    .tag('card-ok')
                report.addCard(card)
                sitemaps.addToDone([url])
                fileExists(url).catch(_ => Tips.compressedSitemapNotFound(card, url))
                return
            }

            if (sitemapBody.match(/not found/gim) !== null || sitemapBody.match(/error 404/gim) !== null) {
                const card = Errors.sitemap_404(url)
                report.addCard(card)
                Tips.malformedSitemapXml(card)
                sitemaps.addToDone([url])
                return
            }

            if (sitemapBody.includes(`<head>`) || sitemapBody.includes(`<meta`)) {
                const card = Errors.sitemap_IsHTMLFormat(url, sitemapBody)
                report.addCard(card)
                Tips.malformedSitemapXml(card)
                sitemaps.addToDone([url])
                return
            }

            const fileName = url.replace(/(.*)\/([a-z0-9\-_\.]+(\.xml)?)(\?.*)?/i, '$2')

            const divId = disposableId()
            const btnLabel = `Sitemap`
            const links = sitemapAllLinks(sitemapBody)
            const linksToSitemaps = sitemapLinksToSitemap(sitemapBody)
            const linksToPages = links.length - linksToSitemaps.length
            const sitemapXmlDescription =
                `A good XML sitemap acts as a roadmap of your website that leads Google to all your important pages. ` +
                `XML sitemaps can be good for SEO, as they allow Google to find your essential website pages quickly, even if your internal linking isn't perfect.`
            const table = [
                ['File Name', fileName],
                ['File Size', formatNumber(sitemapBody.length) + ' bytes'],
                ['Sitemap Type', linksToSitemaps.length > 0 ? 'Sitemap Index' : 'Sitemap'],
                ['Pages', `${linksToPages === 0 ? 'No' : formatNumber(linksToPages)} pages linked`],
                [
                    'Sub Sitemap',
                    linksToSitemaps.length == 0
                        ? 'No links to other sitemaps'
                        : `${formatNumber(linksToSitemaps.length)} sitemaps linked`,
                ],
                ['Compressed', 'No Compression Detected'],
            ]

            const card = new Card()
                .open(`Sitemap  #${sitemaps.doneList.length + 1}`, fileName, 'icon-sitemap')
                .addParagraph(`Found a <code>sitemap.xml</code> file at the url:`)
                .addCodeBlock(url, Mode.txt)
                .addParagraph(sitemapXmlDescription)
                .addTable('Sitemap Analysis', table, getSitemapToolbarLinks(url, divId))
                .addExpandableBlock(btnLabel, codeBlock(sitemapBody, Mode.xml, divId))
                .tag('card-ok')

            report.addCard(card)

            if (sitemapBody.length > Suggestions.sitemapMaxSize()) {
                Tips.uncompressedLargeSitemap(card, url, sitemapBody.length)
            }
            if (!fileName.includes('.xml')) {
                Tips.sitemapWithoutXmlExtension(card, url)
            }
            sitemaps.addToDone([url])
            sitemaps.addToReady(sitemapLinksToSitemap(sitemapBody))

            return
        })
        .catch(() => sitemaps.addToFailed([url]))

export const createSiteMapCards = (sitemaps: SitemapList, report: Report) => {
    const promises = sitemaps.readyList.map(url => sitemapCard(url, sitemaps, report))

    return Promise.allSettled(promises).then(() => sitemaps.readyList.map(url => sitemapCard(url, sitemaps, report)))
}

const sanitizeUrls = (urls: string[]) => {
    return urls.map(url => url.replace(`http://`, `https://`))
}

const directives = (robotsTxtBody: string) =>
    robotsTxtBody.split('\n').filter(line => !line.startsWith('#') && line.trim().length > 0)

export const processRobotsTxt = (robotsTxtBody: string, url: string, report: Report) => {
    if (robotsTxtBody.match(/page not found/gim) !== null || robotsTxtBody.match(/error 404/gim) !== null) {
        const card = Errors.robotsTxt_NotFound(url)
        report.addCard(card)
        Tips.missingRobotsTxt(card)
        return
    }

    if (robotsTxtBody.includes(`<head>`) || robotsTxtBody.includes(`<meta`)) {
        const card = Errors.robotsTxt_HTMLFormat(url, robotsTxtBody)
        report.addCard(card)
        Tips.malformedRobotsTxt(card)
        return
    }

    if (robotsTxtBody.replace(/[\s\n]/g, '').length === 0) {
        const card = Errors.robotsTxt_IsEmpty(url)
        report.addCard(card)
        Tips.emptyRobotsTxt(card)
        return
    }

    if (directives(robotsTxtBody).length === 0) {
        const card = Errors.robotsTxt_OnlyComments(url, robotsTxtBody)
        report.addCard(card)
        Tips.emptyRobotsTxt(card)
        return
    }

    const card = robotsTxtCard(url, robotsTxtBody)
    report.addCard(card)
}

const robotsTxtCard = (url: string, robotsTxtBody: string): Card => {
    const divId = disposableId()
    const btnLabel = `Robots.Txt`
    const robotsTxtDescription =
        `A <code>robots.txt</code> file tells search engine crawlers which URLs the crawler can access on your site. ` +
        `This is used mainly to avoid overloading your site with requests. ` +
        `It is not a mechanism for keeping a web page out of Google.`

    const directives = robotsTxtBody
        .split('\n')
        .filter(line => line.trim().length > 0)
        .filter(line => !line.startsWith('#'))

    let userAgent = robotsTxtBody.match(/^User-agent:\s+(.*)$/gim) ?? []
    userAgent = userAgent.map(ua => ua.replace(/^User-agent:\s+/gi, '')).sort()
    userAgent = [...new Set(userAgent)]

    let linksToSitemap = robotsTxtBody.match(/^Sitemap:\s+(.*)$/gim) ?? []
    linksToSitemap = linksToSitemap.map(sm => sm.replace(/^Sitemap:\s+/gi, '').trim()).sort()

    let allowDirectives = directives.filter(line => line.startsWith('Allow:'))
    let disallowDirectives = directives.filter(line => line.startsWith('Disallow:'))
    let crawlDelayDirectives = directives.filter(line => line.startsWith('Crawl-delay:'))
    let hostDirectives = directives.filter(line => line.startsWith('Host:'))

    const table = [
        ['File Name', 'robots.txt'],
        ['File Size', formatNumber(robotsTxtBody.length) + ' bytes'],
    ]
    const directiveDescriptions: string[] = []
    if (userAgent.length > 0) {
        directiveDescriptions.push(formatNumber(userAgent.length) + ' "User-agent" statements')
    }
    if (linksToSitemap.length > 0) {
        directiveDescriptions.push(formatNumber(linksToSitemap.length) + ' "Sitemap" statements')
    }
    if (allowDirectives.length > 0) {
        directiveDescriptions.push(formatNumber(allowDirectives.length) + ' "Allow" statements')
    }
    if (disallowDirectives.length > 0) {
        directiveDescriptions.push(formatNumber(disallowDirectives.length) + ' "Disallow" statements')
    }
    if (crawlDelayDirectives.length > 0) {
        directiveDescriptions.push(formatNumber(crawlDelayDirectives.length) + ' "Crawl-delay" statements')
    }
    if (hostDirectives.length > 0) {
        directiveDescriptions.push(formatNumber(hostDirectives.length) + ' "Host" statements')
    }

    table.push(['Robot Directives', directiveDescriptions.join('<br>')])
    if (userAgent.length > 0) {
        table.push([`User Agent${userAgent.length > 1 ? 's' : ''} List`, userAgent.join('<br>')])
    }
    if (linksToSitemap.length > 0) {
        table.push([
            `Sitemap${linksToSitemap.length > 1 ? 's' : ''} List`,
            linksToSitemap.map(sm => `<a href='${sm}' target='_new'>${sm}</a>`).join('<br>'),
        ])
    }

    const card = new Card()
        .open('Robot.Txt', `Robots.txt file`, 'icon-rep')
        .addParagraph(`Found a <code>Robots.txt</code> file at the url:`)
        .addCodeBlock(url, Mode.txt)
        .addParagraph(robotsTxtDescription)
        .addTable('Robots.txt Analysis', table, robotsToolbarLinks(url, divId))
        .addExpandableBlock(btnLabel, codeBlock(robotsTxtBody, Mode.txt, divId))
        .tag(`card-ok`)

    if (linksToSitemap.length === 0) {
        Tips.addSitemapLinkToRobotsTxt(card, new URL(url).origin)
    }

    const unsafeUrls = linksToSitemap.filter(url => url.includes(`http://`))
    if (unsafeUrls.length > 0) {
        Tips.unsafeSitemapLinkInRobots(card as Card, unsafeUrls)
    }

    linksToSitemap = linksToSitemap.map(url => url.replace('http://', 'https://'))
    const duplicateUrls = linksToSitemap.filter(uUrl => linksToSitemap.filter(url => url === uUrl).length > 1)
    if (duplicateUrls.length > 0) {
        Tips.duplicateSitemapsInRobots(card, duplicateUrls)
    }

    ;[...new Set(linksToSitemap)].forEach(url =>
        fileExists(url).catch(() => {
            Tips.sitemapInRobotsDoesNotExist(card, url)
        })
    )

    return card
}

export const sitemapUrlsFromRobotsTxt = (robotsTxtBody: string) =>
    robotsTxtBody
        .split('\n')
        .filter(line => line.startsWith('Sitemap: '))
        .map(line => line.split(': ')[1].trim())
        .filter(line => line.length > 0)

export const sitemapLinksToSitemap = (sitemapBody: string) => {
    let subSitemaps = (sitemapBody.match(
        /<sitemap>\s*<loc>(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9\-]+\.[^(\s|<|>)]{2,})<\/loc>/gim
    ) ?? []) as string[]
    subSitemaps = subSitemaps.map(link => link.replace(/(<\/?sitemap>|<\/?loc>)/gm, '').trim())
    subSitemaps = subSitemaps.map(link => htmlDecode(link))
    return sanitizeUrls(subSitemaps)
}

export const sitemapAllLinks = (sitemapBody: string) => {
    let subSitemaps = (sitemapBody.match(
        /<loc>(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9\-]+\.[^(\s|<|>)]{2,})<\/loc>/gim
    ) ?? []) as string[]
    subSitemaps = subSitemaps.map(link => link.replace(/<\/?loc>/gm, '').trim())
    subSitemaps = subSitemaps.map(link => htmlDecode(link))
    return sanitizeUrls(subSitemaps)
}

export const robotsToolbarLinks = (robotsUrl: string, divId: string) => [
    {
        label: `Validate`,
        url: `https://en.ryte.com/free-tools/robots-txt/?refresh=1&useragent=Googlebot&submit=Evaluate&url=${encodeURI(
            robotsUrl
        )}`,
    },
]

export const getSitemapToolbarLinks = (sitemapUrl: string, divId: string): iLink[] => [
    {
        url: `https://www.xml-sitemaps.com/validate-xml-sitemap.html?op=validate-xml-sitemap&go=1&sitemapurl=${encodeURI(
            sitemapUrl
        )}`,
        label: `Validate`,
    },
]
