// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------

import {Card, iLink} from '../card'
import {Report} from '../report'
import {Mode} from '../colorCode'
import {disposableId, copyToClipboard, formatNumber, fileExists} from '../main'
import * as Suggestions from './suggestionCards'
import * as Warnings from './warningCards'
import * as Errors from './errorCards'
import {Tips} from "./tips"
import {codeBlock} from '../codeBlock'
import {htmlDecode} from 'js-htmlencode'

const maxNumberOfSitemapsToLoad = 15
export type UrlsToCompress = [size: number, urls: string]

const getSitemapBody = (url: string, report: Report) => {
    if (url.startsWith(`chrome://`)) {
        const card = Errors.unableToAnalyzeChromeTabs()
        report.addCard(card)
        Tips.noSitemapInChromeBrowserPages(card)
        return Promise.reject()
    }
    if (url.match(/\.gz($|\?)/) !== null) {
        // Do not load compressed files
        return Promise.resolve('')
    }
    return fetch(url)
        .then(res => {
            if (res.status !== 200) {
                const card = Errors.sitemapUnableToOpen(url, res.status, res.statusText)              
                report.addCard(card)
                Tips.missingSitemapXml(card)
                return Promise.reject()
            }
            return res.text()
        })
        .then(sitemapBody => {
            if (sitemapBody.includes(`page not found`)) {
                const card = Errors.sitemapNotFound(url)
                report.addCard(card)
                Tips.missingSitemapXml(card)
                return Promise.reject()
            }
            return sitemapBody
        })
        .catch(err => {
            return Promise.reject()
        })
}

export const createSiteMapCards = (
    urlsToProcess: string[],
    urlsProcessed: string[],
    urlsSuccessful: string[],
    report: Report
) => 
    urlsToProcess.map(url =>
        getSitemapBody(url, report)
            .then(sitemapBody => {

                if (sitemapBody.match(/not found/gim) !== null || sitemapBody.match(/error 404/gim) !== null) {
                    const card = Errors.sitemapReturns404(url)
                    report.addCard(card)
                    Tips.malformedSitemapXml(card)
                    urlsProcessed.push(url)
                    urlsToProcess = urlsToProcess.filter(u => u !== url)
                    return Promise.resolve()
                }

                if (sitemapBody.includes(`<head>`) || sitemapBody.includes(`<meta`)) {
                    const card = Errors.sitemapIsHTMLPage(url, sitemapBody)
                    report.addCard(card)
                    Tips.malformedSitemapXml(card)
                    urlsProcessed.push(url)
                    urlsToProcess = urlsToProcess.filter(u => u !== url)
                    return Promise.resolve()
                }

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
                            .open(`Compressed Sitemap`, fileName, getSitemapToolbarLinks(url, ''), 'icon-sitemap')
                            .addParagraph(`Found a compressed <code>sitemap.xml</code> file at the url:`)
                            .addCodeBlock(url, Mode.txt)
                            .addTable('Sitemap Analysis', table)
                            .addParagraph(`Unable to display the content of compressed files.`)
                            .tag('card-ok')
                    report.addCard(card)
                    urlsSuccessful.push(url)
                    urlsProcessed.push(url)
                    urlsToProcess = urlsToProcess.filter(u => u !== url)
                    fileExists(url).catch(_ => Tips.compressedSitemapNotFound(card, url))
                    return  Promise.resolve()
                }

                const fileName = url.replace(/(.*)\/([a-z0-9\-_\.]+(\.xml)?)(\?.*)?/i, '$2')

                const divId = disposableId()
                const btnLabel = `Sitemap`
                const links = sitemapBody.match(/<loc>(.*?)<\/loc>/g) ?? []
                const linksToSitemaps =
                    sitemapBody.match(
                        /<sitemap>\s*<loc>(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9\-]+\.[^(\s|<|>)]{2,})<\/loc>/gim
                    ) ?? []
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

                const card = 
                    new Card()
                        .open(`Sitemap`, fileName, getSitemapToolbarLinks(url, divId), 'icon-sitemap')
                        .addParagraph(`Found a <code>sitemap.xml</code> file at the url:`)
                        .addCodeBlock(url, Mode.txt)
                        .addParagraph(sitemapXmlDescription)
                        .addTable('Sitemap Analysis', table)
                        .addExpandableBlock(btnLabel, codeBlock(sitemapBody, Mode.xml, divId))
                        .tag('card-ok')

                report.addCard(card)

                if (sitemapBody.length > Suggestions.sitemapRecommendedMaxSize) {
                    Tips.uncompressedLargeSitemap(card, url, sitemapBody.length)
                } 
                if (!fileName.includes('.xml')) {
                    Tips.sitemapWithoutXmlExtension(card, url)
                }

                const subSitemaps = getSitemapUrlsFromSitemap(sitemapBody)
                subSitemaps.forEach(subSitemap => {

                urlsSuccessful.push(url)
                urlsProcessed.push(url)
                urlsToProcess = urlsToProcess.filter(u => u !== url)
                return Promise.resolve()
            })
        })
        .catch(_ => {
            urlsProcessed.push(url)
            urlsToProcess = urlsToProcess.filter(u => u !== url)
            return Promise.reject()
        })
    )

export const getRobotsTxtBody = (url: string, report: Report) => {
    if (url.startsWith(`chrome://`)) {
        const card = Errors.unableToAnalyzeChromeTabs()
        report.addCard(card)
        Tips.noRobotsTxtInChromeBrowserPages(card)
        return Promise.reject()
    }

    return fetch(url)
        .then(res => {
            if (res.status !== 200) {
                const card = Errors.robotsTxtUnableToOpen(url, res.status, res.statusText)
                report.addCard(card)
                Tips.missingRobotsTxt(card)
                return Promise.reject()
            }
            return res.text()
        })
        .then(robotsTxtBody => {
            if (robotsTxtBody.match(/page not found/gim) !== null || robotsTxtBody.match(/error 404/gim) !== null) {
                const card = Errors.robotsTxtNotFound(url)
                report.addCard(card)
                Tips.missingRobotsTxt(card)
                return Promise.reject()
            }
            return robotsTxtBody
        })
        .catch(err => {
            return Promise.reject()
        })
}

const sanitizeUrls = (urls: string[]) => {
    return urls.map(url => (url.includes(`http://`) ? url.replace(`http://`, `https://`) : url))
}

export const sitemapsFromPromise = (robotBody: Promise<string>, defaultUrl: string, report: Report) => {
    let sitemapCardsCreated: string[] = []
    let sitemapCardsToSkip: string[] = []
    let sitemapsUrlsToIgnore: string[] = []
    let sitemapUrlsToProcess:string[] = []

    robotBody
        .then(robotsTxtBody => {
            sitemapUrlsToProcess = getSitemapUrlsFromRobotsTxt(robotsTxtBody)
            sitemapUrlsToProcess = [defaultUrl, ...sanitizeUrls(sitemapUrlsToProcess)]
            sitemapUrlsToProcess = [...new Set(sitemapUrlsToProcess)]
            sitemapCardsToSkip = sitemapCardsToSkip   = sitemapUrlsToProcess.slice(maxNumberOfSitemapsToLoad)
            sitemapUrlsToProcess = sitemapUrlsToProcess.slice(0, maxNumberOfSitemapsToLoad)
            return Promise.allSettled(createSiteMapCards(sitemapUrlsToProcess, sitemapsUrlsToIgnore, sitemapCardsCreated, report))
        })
        .then(() => {
            if(sitemapUrlsToProcess.length === 0) {
                return
            }
            const newUrls: string[] = []
            const urlsPromises = sitemapUrlsToProcess.map(url => {
                sitemapUrlsToProcess.push(...getSitemapUrlsFromSitemap(url))
                sitemapUrlsToProcess = [...new Set(sitemapUrlsToProcess)]
                sitemapCardsToSkip.push(...sitemapUrlsToProcess.slice(maxNumberOfSitemapsToLoad))
                sitemapsUrlsToIgnore.push(...sitemapUrlsToProcess.slice(maxNumberOfSitemapsToLoad))
                sitemapsUrlsToIgnore = [...new Set(sitemapsUrlsToIgnore)]
                sitemapUrlsToProcess = sitemapUrlsToProcess.filter(u => !sitemapCardsCreated.includes(u) && !sitemapsUrlsToIgnore.includes(u))
            })
            const spaceLeft = maxNumberOfSitemapsToLoad - sitemapCardsCreated.length
            return Promise.allSettled(createSiteMapCards(sitemapUrlsToProcess, sitemapsUrlsToIgnore, sitemapCardsCreated, report))
        })
        .finally(() => {
            sitemapCardsToSkip = [...new Set(sitemapCardsToSkip)]
            if (sitemapCardsToSkip.length > 0) {
                report.addCard(Warnings.notAllSitemapsLoaded(maxNumberOfSitemapsToLoad, sitemapsUrlsToIgnore))
            }
        })
}

export const robotsTxtFromPromise = (bodyPromise: Promise<string>, url: string, report: Report) => {
    return bodyPromise
        .then(robotsTxtBody => {
            let issues = 0

            if (robotsTxtBody.includes(`<head>`) || robotsTxtBody.includes(`<meta`)) {
                const card = Errors.robotsTxtIsHTMLPage(url, robotsTxtBody)
                report.addCard(card)
                Tips.malformedRobotsTxt(card)
                return Promise.reject()
            }

            if (robotsTxtBody.replace(/[\s\n]/g, '').length === 0) {
                const card = Errors.robotsTxtIsEmpty(url)
                report.addCard(card)
                Tips.emptyRobotsTxt(card)
                return Promise.reject()
            }

            if (
                robotsTxtBody.split('\n').filter(line => !line.startsWith('#') && line.trim().length > 0).length === 0
            ) {
                const card = Errors.robotsTxtIsOnlyComments(url, robotsTxtBody)
                report.addCard(card)
                Tips.emptyRobotsTxt(card)
                return Promise.reject()
            }

            const card = robotsTxtCard(url, robotsTxtBody, issues)
            report.addCard(card)

            const siteMaps = robotsTxtBody.match(/^sitemap:\shttp/gim) || []
            if (siteMaps.length === 0) {
                Tips.addSitemapLinkToRobotsTxt(card)
            }

            let sitemapUrls = getSitemapUrlsFromRobotsTxt(robotsTxtBody)
            const unsafeUrls = sitemapUrls.filter(url => url.includes(`http://`))
            if(unsafeUrls.length > 0) {
                Tips.unsafeSitemapLinkInRobots(card as Card, unsafeUrls)
            }

            sitemapUrls = sanitizeUrls(sitemapUrls)
            const duplicateUrls = sitemapUrls.filter(uUrl => sitemapUrls.filter(url => url === uUrl).length > 1)
            if (duplicateUrls.length > 0) {                
                Tips.duplicateSitemapsInRobots(card, duplicateUrls)
            }        

            return Promise.resolve()
        })
        .catch(err => {
            // if (err && typeof err.getDiv === 'function') {
            //     const card = err
            //     report.addCard(card)
            //     Tips.missingRobotsTxt(card)
            // } else {
            //     const card = Errors.errorFromError(err)
            //     report.addCard(card)
            //     Tips.missingRobotsTxt(card)
            // }
            return Promise.reject()
        })
}

const robotsTxtCard = (url: string, robotsTxtBody: string, issues = 0): Card => {
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

    if (linksToSitemap.length === 0) {
        issues++
    }

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
        .open('Robot.Txt', `Robots.txt file`, getRobotsToolbarLinks(url, divId), 'icon-rep')
        .addParagraph(`Found a <code>Robots.txt</code> file at the url:`)
        .addCodeBlock(url, Mode.txt)
        .addParagraph(robotsTxtDescription)
        .addTable('Robots.txt Analysis', table)
        .addExpandableBlock(btnLabel, codeBlock(robotsTxtBody, Mode.txt, divId))
        .tag(issues === 0 ? 'card-ok' : 'card-fix')

    linksToSitemap.forEach(url => fileExists(url).catch(() => card.tag('card-fix')))

    return card
}

export const getSitemapUrlsFromRobotsTxt = (robotsTxtBody: string) => {
    const urls: string[] = robotsTxtBody
        .split('\n')
        .filter(line => line.startsWith('Sitemap: '))
        .map(line => line.split(': ')[1].trim())
        .filter(line => line.length > 0)

    return urls
}

export const getSitemapUrlsFromSitemap = (sitemapBody: string) => {
    let subSitemaps = (sitemapBody.match(
        /<sitemap>\s*<loc>(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9\-]+\.[^(\s|<|>)]{2,})<\/loc>/gim
    ) ?? []) as string[]
    subSitemaps = subSitemaps.map(link => link.replace(/(<\/?sitemap>|<\/?loc>)/gm, '').trim())
    subSitemaps = subSitemaps.map(link => htmlDecode(link))
    return sanitizeUrls(subSitemaps)
}

export const getRobotsToolbarLinks = (robotsUrl: string, divId: string) => [
    {
        label: 'Copy Code',
        onclick: () => copyToClipboard(divId),
    },
    {
        label: `Validate`,
        url: `https://en.ryte.com/free-tools/robots-txt/?refresh=1&useragent=Googlebot&submit=Evaluate&url=${encodeURI(
            robotsUrl
        )}`,
    },
    {
        label: 'Open',
        url: robotsUrl,
    },
]

export const getSitemapToolbarLinks = (sitemapUrl: string, divId: string): iLink[] => [
    {
        label: 'Copy Code',
        onclick: () => copyToClipboard(divId),
    },
    {
        url: `https://www.xml-sitemaps.com/validate-xml-sitemap.html?op=validate-xml-sitemap&go=1&sitemapurl=${encodeURI(
            sitemapUrl
        )}`,
        label: `Validate`,
    },
    {
        url: sitemapUrl,
        label: 'Open',
    },
]
