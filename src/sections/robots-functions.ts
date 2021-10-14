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
import * as Errors from './errorCards'
import {codeBlock} from '../codeBlock'

export const getSiteMapBody = async (url: string): Promise<string> => {
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
        .catch(err => Promise.reject(Errors.sitemapUnableToOpen(url, err.code, err.message)))
        .then(sitemapBody => {
            if (sitemapBody.includes(`page not found`)) {
                return Promise.reject(Errors.sitemapNotFound(url))
            }
            return sitemapBody
        })
}

export const getSiteMapCards = (urls: string[], report: Report) => {
    let siteMapsFound = 0
    let compressRecommendations = 0
    urls.map((url, index) => {
        getSiteMapBody(url)
            .then(sitemapBody => {
                if (sitemapBody.includes(`<head>`) || sitemapBody.includes(`<meta`)) {
                    report.addCard(Errors.sitemapIsHTMLPage(url, sitemapBody))
                    report.addCard(Suggestions.malformedSitemapXml())
                    return
                }

                if (sitemapBody.match(/not found/gim) !== null || sitemapBody.match(/error 404/gim) !== null) {
                    report.addCard(Errors.sitemapReturns404(url))
                    report.addCard(Suggestions.malformedSitemapXml())
                    return
                }

                siteMapsFound++

                if (url.endsWith('.gz')) {
                    const fileName = url.replace(/(.*)\/([a-z0-9\-_\.]+(\.xml)?(\.gz)?)(.*)/i, '$2')
                    report.addCard(
                        new Card()
                            .open(`Compressed Sitemap`, fileName, getSitemapLinks(url, ''), 'icon-sitemap')
                            .addParagraph(
                                `Found a compressed Sitemap.xml file at <a href='${url}' target='new'>${url}</a>.`
                            )
                            .addTable([
                                ['File Size', `n/a`],
                                ['Pages', `n/a`],
                                ['Sub Sitemap', `n/a`],
                                ['Compressed', 'Yes'],
                                ['Compression type', 'Gzip'],
                            ])
                            .addParagraph(`Unable to display the content of compressed files.`)
                    )
                    return
                }
                if (sitemapBody.length > Suggestions.sitemapRecommendedMaxSize && compressRecommendations === 0) {
                    report.addCard(Suggestions.considerCompressingSitemap(url))
                    compressRecommendations++
                }

                const divId = disposableId()
                const btnLabel = `Sitemap`
                const links = sitemapBody.match(/<loc>(.*?)<\/loc>/g) ?? []
                const linksToSitemaps =
                    sitemapBody.match(
                        /<sitemap>\s*<loc>(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9\-]+\.[^(\s|<|>)]{2,}.xml\?[a-z0-9-=#_]*)<\/loc>/gim
                    ) ?? []
                const linksToPages = links.length - linksToSitemaps.length
                const fileName = url.replace(/(.*)\/([a-z0-9\-_\.]+(\.xml)?)(\?.*)?/i, '$2')
                const sitemapXmlDescription =
                    `A good XML sitemap acts as a roadmap of your website that leads Google to all your important pages. ` +
                    `XML sitemaps can be good for SEO, as they allow Google to find your essential website pages quickly, even if your internal linking isn't perfect.`
                report.addCard(
                    new Card()
                        .open(
                            `Sitemap (${(index + 1).toFixed()})`,
                            fileName,
                            getSitemapLinks(url, divId),
                            'icon-sitemap'
                        )
                        .addParagraph(`Found a Sitemap.xml file: <a href='${url}' target='new'>${url}</a>`)
                        .addParagraph(sitemapXmlDescription)
                        .addTable([
                            ['File Size', formatNumber(sitemapBody.length) + ' characters'],
                            ['Pages', `${linksToPages === 0 ? 'No' : formatNumber(linksToPages)} links to pages`],
                            [
                                'Sub Sitemap',
                                `${
                                    linksToSitemaps.length == 0 ? 'No' : formatNumber(linksToSitemaps.length)
                                } links to sitemaps`,
                            ],
                            ['Compressed', 'No'],
                        ])
                        .addExpandableBlock(btnLabel, codeBlock(sitemapBody, Mode.xml, divId))
                )
            })
            .catch(errCard => {
                report.addCard(errCard)
            })
    })
    if (siteMapsFound === 0) {
        report.addCard(Suggestions.missingSitemapXml())
    }
}

export const getRobotsTxtFileBody = (url: string) => {
    return fetch(url)
        .then(res => {
            if (res.status !== 200) {
                return Promise.reject(Errors.robotsTxtUnableToOpen(url, res.status, res.statusText))
            }
            return res.text()
        })
        .catch(err => Promise.reject(Errors.robotsTxtUnableToOpen(url, err.code, err.message)))
        .then(robotsTxtBody => {
            if (robotsTxtBody.includes(`page not found`)) {
                return Promise.reject(Errors.robotsTxtNotFound(url))
            }
            return robotsTxtBody
        })
}

export const robotsTxtCard = (url: string, robotsTxtBody: string): Card => {
    const divId = disposableId()
    const btnLabel = `Robots.Txt`
    const robotsTxtDescription =
        `A robots.txt file tells search engine crawlers which URLs the crawler can access on your site. ` +
        `This is used mainly to avoid overloading your site with requests. ` +
        `It is not a mechanism for keeping a web page out of Google.`
    const nDirectives = robotsTxtBody
        .split('\n')
        .filter(line => line.trim().length > 0)
        .filter(line => !line.startsWith('#')).length
    let userAgent = robotsTxtBody.match(/^User-agent:\s+(.*)$/gim) ?? []
    userAgent = userAgent.map(ua => ua.replace(/^user-agent:\s+/gi, '')).sort()
    userAgent = [...new Set(userAgent)]
    const siteMaps = robotsTxtBody.match(/^sitemap:\shttp/gim) || []
    return new Card()
        .open('Robot.Txt', `Robots.txt file`, getRobotsLinks(url, divId), 'icon-rep')
        .addParagraph(`Found a Robots.txt file: <a href='${url}' target='new'>${url}</a>`)
        .addParagraph(robotsTxtDescription)
        .addTable([
            ['File Size', formatNumber(robotsTxtBody.length) + ' characters'],
            ['Robot Directives', formatNumber(nDirectives)],
            ['Sitemap Links', formatNumber(siteMaps.length) + ' found'],
            [`User Agent${userAgent.length > 1 ? 's' : ''}`, userAgent.join('<br>')],
        ])
        .addExpandableBlock(btnLabel, codeBlock(robotsTxtBody, Mode.txt, divId))
}

export const getSiteMapUrlsFromRobotsTxt = (robotsTxtBody: string, defaultUrl: string) => {
    const urls: string[] = robotsTxtBody
        .split('\n')
        .filter(line => line.startsWith('Sitemap: '))
        .map(line => line.split(': ')[1].trim())
        .map(url => url.trim())
        .filter(line => line.length > 0)

    if (urls.length === 0) {
        urls.push(defaultUrl)
    }

    return urls
}

export const getSiteMapUrlsFromSitemapXml = (sitemapUrl: string): Promise<string[]> => {
    const urls: string[] = []
    return getSiteMapBody(sitemapUrl)
        .then(sitemapBody => {
            let subSitemaps = (sitemapBody.match(
                /<sitemap>\s*<loc>(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9\-]+\.[^(\s|<|>)]{2,})<\/loc>/gim
            ) ?? []) as string[]
            subSitemaps = subSitemaps.map(link => link.replace(/(<(\/)?sitemap>|<(\/)?loc>)/gm, ''))
            return subSitemaps
        })
        .catch(_ => [] as string[])
}

export const getRobotsLinks = (robotsUrl: string, divId: string) => [
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

export const getSitemapLinks = (sitemapUrl: string, divId: string): iLink[] => [
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
