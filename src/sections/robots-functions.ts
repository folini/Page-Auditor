// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------

import {Card, iLink} from '../card'
import {Report} from '../report'
import {Mode} from '../colorCode'
import {disposableId, copyTxtToClipboard, formatNumber} from '../main'
import * as Suggestions from './suggestionCards'
import * as Warnings from './warningCards'
import * as Errors from './errorCards'
import {codeBlock} from '../codeBlock'

const maxNumberOfSitemapsToLoad = 15

const getSitemapBody = async (url: string) => {
    if (url.startsWith(`chrome://`)) {
        return Promise.reject(Errors.chromePagesCantBeAnalyzed())
    }
    if (url.match(/\.gz($|\?)/) !== null) {
        // Do not load compressed files
        return Promise.resolve('')
    }

    return fetch(url)
        .then(res => {
            if (res.status !== 200) {
                return Promise.reject(Errors.sitemapUnableToOpen(url, res.status, res.statusText))
            }
            return res.text()
        })
        .then(sitemapBody => {
            if (sitemapBody.includes(`page not found`)) {
                return Promise.reject(Errors.sitemapNotFound(url))
            }
            return Promise.resolve(sitemapBody)
        })
        .catch(err => Promise.reject(Errors.sitemapUnableToOpen(url, err.code, err.message)))
}

export const createSiteMapCards = (
    urls: string[],
    sitemapsToCompress: string[],
    sitemapsMissingExtension: string[],
    report: Report
): Promise<number> => {
    let sitemapFound = 0
    const promises = urls.map(url =>
        getSitemapBody(url)
            .then(sitemapBody => {
                if (sitemapBody.match(/not found/gim) !== null || sitemapBody.match(/error 404/gim) !== null) {
                    report.addCard(Errors.sitemapReturns404(url))
                    report.addCard(Suggestions.malformedSitemapXml())
                    return
                }

                if (sitemapBody.includes(`<head>`) || sitemapBody.includes(`<meta`)) {
                    report.addCard(Errors.sitemapIsHTMLPage(url, sitemapBody))
                    report.addCard(Suggestions.malformedSitemapXml())
                    sitemapFound++
                    return
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
                    report.addCard(
                        new Card()
                            .open(`Compressed Sitemap`, fileName, getSitemapToolbarLinks(url, ''), 'icon-sitemap')
                            .addParagraph(`Found a compressed <code>sitemap.xml</code> file at the url:`)
                            .addCodeBlock(url, Mode.txt)
                            .addTable('Sitemap Analysis', table)
                            .addParagraph(`Unable to display the content of compressed files.`)
                    )
                    sitemapFound++
                    return
                }

                if (sitemapBody.length > Suggestions.sitemapRecommendedMaxSize) {
                    sitemapsToCompress.push(url)
                }

                const fileName = url.replace(/(.*)\/([a-z0-9\-_\.]+(\.xml)?)(\?.*)?/i, '$2')

                if (!fileName.includes('.xml')) {
                    sitemapsMissingExtension.push(url)
                }

                const divId = disposableId()
                const btnLabel = `Sitemap`
                const links = sitemapBody.match(/<loc>(.*?)<\/loc>/g) ?? []
                const linksToSitemaps =
                    sitemapBody.match(
                        /<sitemap>\s*<loc>(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9\-]+\.[^(\s|<|>)]{2,}.xml\?[a-z0-9-=#_]*)<\/loc>/gim
                    ) ?? []
                const linksToPages = links.length - linksToSitemaps.length
                const sitemapXmlDescription =
                    `A good XML sitemap acts as a roadmap of your website that leads Google to all your important pages. ` +
                    `XML sitemaps can be good for SEO, as they allow Google to find your essential website pages quickly, even if your internal linking isn't perfect.`
                const table = [
                    ['File Name', fileName],
                    ['File Size', formatNumber(sitemapBody.length) + ' bytes'],
                    ['Sitemap Type', linksToSitemaps.length > 0 ? 'Sitemap Index' : 'Sitemap'],
                    ['Pages', `${linksToPages === 0 ? 'No' : formatNumber(linksToPages)} links to pages`],
                    [
                        'Sub Sitemap',
                        linksToSitemaps.length == 0
                            ? 'No links to other sitemaps'
                            : `${formatNumber(linksToSitemaps.length)} links to sitemaps`,
                    ],
                    ['Compressed', 'No'],
                ]
                report.addCard(
                    new Card()
                        .open(`Sitemap`, fileName, getSitemapToolbarLinks(url, divId), 'icon-sitemap')
                        .addParagraph(`Found a <code>sitemap.xml</code> file at the url:`)
                        .addCodeBlock(url, Mode.txt)
                        .addParagraph(sitemapXmlDescription)
                        .addTable('Sitemap Analysis', table)
                        .addExpandableBlock(btnLabel, codeBlock(sitemapBody, Mode.xml, divId))
                )
                sitemapFound++
                return Promise.resolve()
            })
            .catch(errCard => {
                if (errCard && typeof errCard.getDiv === 'function') {
                    report.addCard(errCard)
                }
                return Promise.reject()
            })
    )

    return Promise.allSettled(promises).then(() => sitemapFound)
}

export const getRobotsTxtBody = (url: string) => {
    if (url.startsWith(`chrome://`)) {
        return Promise.reject(Errors.chromePagesCantBeAnalyzed())
    }
    const promise = fetch(url)
        .then(res => {
            if (res.status !== 200) {
                return Promise.reject(Errors.robotsTxtUnableToOpen(url, res.status, res.statusText))
            }
            return res.text()
        })
        .then(robotsTxtBody => {
            if (robotsTxtBody.match(/page not found/gim) !== null || robotsTxtBody.match(/error 404/gim) !== null) {
                return Promise.reject(Errors.robotsTxtNotFound(url))
            }
            return robotsTxtBody
        })
        .catch(err => Promise.reject(Errors.robotsTxtUnableToOpen(url, err.code, err.message)))
    return promise
}

const sanitizeUrls = (urls: string[], report: Report) => {
    const unsafeUrls = urls.filter(url => url.includes(`http://`))
    if (unsafeUrls.length > 0) {
        report.addCard(Suggestions.unsafeSitemapLinkInRobots(unsafeUrls))
    }
    return urls.map(url => (url.includes(`http://`) ? url.replace(`http://`, `https://`) : url))
}

const removeDuplicateUrls = (urls: string[], report: Report) => {
    const uniqueUrls = [...new Set(urls)]
    if (urls.length !== uniqueUrls.length) {
        const duplicateUrls = urls.filter(uniqueUrl => urls.filter(url => url === uniqueUrl).length > 1)
        report.addCard(Suggestions.duplicateSitemapsInRobots(duplicateUrls))
    }
    return uniqueUrls
}

export const processSitemapFromPromise = (robotBody: Promise<string>, url: string, report: Report) => {
    let sitemapUrls = [url]
    let sitemapCardsCreated = 0
    let sitemapsTopCompress: string[] = []
    let sitemapsMissingExtension: string[] = []
    let sitemapsToIgnore: string[] = []

    robotBody
        .then(robotsTxtBody => {
            sitemapUrls = getUrlsFromRobotsTxt(robotsTxtBody, sitemapUrls[0])
            sitemapUrls = sanitizeUrls(sitemapUrls, report)
            sitemapUrls = removeDuplicateUrls(sitemapUrls, report)
            return createSiteMapCards(sitemapUrls, sitemapsTopCompress, sitemapsMissingExtension, report)
        })
        .then(nSitemapCards => {
            sitemapCardsCreated = nSitemapCards
            const newUrls: string[] = []
            const urlsPromises = sitemapUrls.map(url => getUrlsFromSitemap(url).then(urls => newUrls.push(...urls)))
            return Promise.allSettled(urlsPromises).then(() => [...new Set(newUrls)])
        })
        .then(newUrls => {
            const spaceLeft = maxNumberOfSitemapsToLoad - sitemapCardsCreated
            sitemapsToIgnore = newUrls.slice(spaceLeft)
            const sitemapsToAdd = newUrls.slice(0, spaceLeft)
            return createSiteMapCards(sitemapsToAdd, sitemapsTopCompress, sitemapsMissingExtension, report)
        })
        .then(nNewSitemaps => {
            sitemapCardsCreated += nNewSitemaps
        })
        .catch(errCard => {
            if (errCard && typeof errCard.getDiv === 'function') {
                report.addCard(errCard)
            }
        })
        .finally(() => {
            if (sitemapsToIgnore.length > 0) {
                report.addCard(Warnings.notAllSitemapsLoaded(maxNumberOfSitemapsToLoad, sitemapsToIgnore))
            }
            if (sitemapsTopCompress.length > 0) {
                report.addCard(Suggestions.considerCompressingSitemap(sitemapsTopCompress))
            }
            if (sitemapCardsCreated === 0) {
                report.addCard(Suggestions.missingSitemapXml())
            }
            if (sitemapsMissingExtension.length > 0) {
                report.addCard(Suggestions.missingSitemapExtension(sitemapsMissingExtension))
            }
        })
}

export const processRobotsTxtPromise = (bodyPromise: Promise<string>, url: string, report: Report) => {
    bodyPromise
        .then(robotsTxtBody => {
            if (robotsTxtBody.includes(`<head>`) || robotsTxtBody.includes(`<meta`)) {
                report.addCard(Errors.robotsTxtIsHTMLPage(url, robotsTxtBody))
                report.addCard(Suggestions.malformedRobotsTxt())
            } else if (robotsTxtBody.replace(/[\s\n]/g, '').length === 0) {
                report.addCard(Errors.robotsTxtIsEmpty(url))
                report.addCard(Suggestions.emptyRobotsTxt())
            } else if (
                robotsTxtBody.split('\n').filter(line => !line.startsWith('#') && line.trim().length > 0).length === 0
            ) {
                const btnLabel = `Wrong Robots.Txt`
                report.addCard(Errors.robotsTxtIsOnlyComments(url, robotsTxtBody))
                report.addCard(Suggestions.emptyRobotsTxt())
            } else {
                report.addCard(robotsTxtCard(url, robotsTxtBody))
                const siteMaps = robotsTxtBody.match(/^sitemap:\shttp/gim) || []
                if (siteMaps.length === 0) {
                    report.addCard(Suggestions.linkSitemapFromRobotsTxt())
                }
            }
        })
        .catch(errCard => {
            if (errCard && typeof errCard.getDiv === 'function') {
                report.addCard(errCard)
            } else {
                report.addCard(Errors.errorFromError(errCard))
            }
            report.addCard(Suggestions.missingRobotsTxt())
        })
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
    linksToSitemap = linksToSitemap
        .map(sm => sm.replace(/^Sitemap:\s+/gi, '').trim())
        .sort()
        .map(sm => `<a href='${sm} target='_new'>${sm}</a>`)

    let allowDirectives = directives.filter(line => line.startsWith('Allow:'))
    let disallowDirectives = directives.filter(line => line.startsWith('Disallow:'))
    let crawlDelayDirectives = directives.filter(line => line.startsWith('Crawl-delay:'))
    let hostDirectives = directives.filter(line => line.startsWith('Host:'))

    const table = [
        ['File Name', 'robots.txt'],
        ['File Size', formatNumber(robotsTxtBody.length) + ' bytes'],
        ['Robot Directives', formatNumber(directives.length)],
    ]
    if (userAgent.length > 0) {
        table.push(['User-agent:', formatNumber(userAgent.length) + ' statements'])
        table.push([`User Agent${userAgent.length > 1 ? 's' : ''} List`, userAgent.join('<br>')])
    }
    if (allowDirectives.length > 0) {
        table.push(['Allow:', formatNumber(allowDirectives.length) + ' statements'])
    }
    if (disallowDirectives.length > 0) {
        table.push(['Disallow:', formatNumber(disallowDirectives.length) + ' statements'])
    }
    if (crawlDelayDirectives.length > 0) {
        table.push(['Crawl-delay:', formatNumber(crawlDelayDirectives.length) + ' statements'])
    }
    if (hostDirectives.length > 0) {
        table.push(['Host:', formatNumber(hostDirectives.length) + ' statements'])
    }
    if (linksToSitemap.length > 0) {
        table.push(['Sitemap:', formatNumber(linksToSitemap.length) + ' statements'])
        table.push([`Sitemap${linksToSitemap.length > 1 ? 's' : ''} Linked`, linksToSitemap.join('<br>')])
    }

    return new Card()
        .open('Robot.Txt', `Robots.txt file`, getRobotsToolbarLinks(url, divId), 'icon-rep')
        .addParagraph(`Found a <code>Robots.txt</code> file at the url:`)
        .addCodeBlock(url, Mode.txt)
        .addParagraph(robotsTxtDescription)
        .addTable('Robots.txt Analysis', table)
        .addExpandableBlock(btnLabel, codeBlock(robotsTxtBody, Mode.txt, divId))
}

export const getUrlsFromRobotsTxt = (robotsTxtBody: string, defaultUrl: string) => {
    const urls: string[] = robotsTxtBody
        .split('\n')
        .filter(line => line.startsWith('Sitemap: '))
        .map(line => line.split(': ')[1].trim())
        .filter(line => line.length > 0)

    if (urls.length === 0) {
        urls.push(defaultUrl)
    }

    return urls
}

export const getUrlsFromSitemap = (url: string) => {
    return getSitemapBody(url)
        .then(sitemapBody => {
            let subSitemaps = (sitemapBody.match(
                /<sitemap>\s*<loc>(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9\-]+\.[^(\s|<|>)]{2,})<\/loc>/gim
            ) ?? []) as string[]
            subSitemaps = subSitemaps.map(link => link.replace(/(<(\/)?sitemap>|<(\/)?loc>)/gm, ''))
            return Promise.resolve(subSitemaps)
        })
        .catch(err => {
            if (err && typeof err.getDiv === 'function') {
                return Promise.reject(err as Card)
            } else {
                return Promise.resolve([] as string[])
            }
        })
}

export const getRobotsToolbarLinks = (robotsUrl: string, divId: string) => [
    {
        label: 'Copy Code',
        onclick: () => copyTxtToClipboard(divId),
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
        onclick: () => copyTxtToClipboard(divId),
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
