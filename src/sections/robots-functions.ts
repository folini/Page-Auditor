// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------

import {Card, iLink} from '../card'
import {Mode} from '../colorCode'
import {disposableId, copyTxtToClipboard, DisplayCardFunc, formatNumber} from '../main'
import * as Suggestions from './suggestionCards'
import {codeBlock} from '../codeBlock'

export const getSiteMapBody = async (url: string): Promise<string> => {
    if (url.match(/\.gz($|\?)/) !== null) {
        // Do not load compressed files
        return Promise.resolve('')
    }

    var response = undefined
    try {
        response = await fetch(url)
        if (response.status !== 200) {
            throw new Error(`${response.status}: ${response.statusText}`)
        }
    } catch (err: any) {
        return Promise.reject(
            `Sitemap.xml file at <a target="_new" href="${url}">${url}</a> not found.<br/>
            Error message: ${err.message}`
        )
    }

    try {
        const sitemapBody = await response.text()
        const sitemapBodyLowerCase = sitemapBody.toLowerCase()
        if (sitemapBodyLowerCase.includes(`not found`) || sitemapBodyLowerCase.includes(`error 404`)) {
            return Promise.reject(`Robots.txt file at <a target="_new" href="${url}">${url}</a> not found.`)
        }
        return Promise.resolve(sitemapBody)
    } catch (err: any) {
        return Promise.reject(
            `Sitemap.xml file not found.<br/>
            Error message: ${err.message}`
        )
    }
}

export const getSiteMapCards = (urls: string[], renderSitemapCard: DisplayCardFunc) => {
    let siteMapsFound = 0
    let compressRecommendations = 0
    urls.map(url =>
        getSiteMapBody(url)
            .then(sitemapBody => {
                if (sitemapBody.includes(`<head>`) || sitemapBody.includes(`<meta`)) {
                    const btnLabel = `Wrong Sitemap`
                    renderSitemapCard(
                        new Card()
                            .error(
                                `File at location <a target="_new" href="${url}">${url}</a> is an HTML page ` +
                                    `or a redirect to an HTML page. Its' not a syntactically valid <code>sitemap.xml</code>.`
                            )
                            .addExpandableBlock(btnLabel, codeBlock(sitemapBody, Mode.html))
                            .setTitle('Wrong Sitemap.xml')
                    )
                    renderSitemapCard(Suggestions.malformedSitemapXml())
                    return
                }

                if (sitemapBody.match(/not found/gim) !== null || sitemapBody.match(/error 404/gim) !== null) {
                    renderSitemapCard(
                        new Card()
                            .error(`<code>Sitemap.xml</code> not found. Website server returns 404 error code.`)
                            .setTitle('Sitemap.xml Not Found')
                    )
                    renderSitemapCard(Suggestions.malformedSitemapXml())
                    return
                }

                if (url.endsWith('.gz')) {
                    renderSitemapCard(
                        new Card()
                            .open(
                                `Compressed Sitemap`,
                                url.replace(/(.*)\/([a-z0-9\-_]+(\.xml)?(\.gz)?)(.*)/i, '$2'),
                                getSitemapLinks(url, ''),
                                'icon-sitemap'
                            )
                            .addParagraph(
                                `Found a compressed Sitemap.xml file: <a href='${url}' target='new'>${url}</a>.`
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
                    renderSitemapCard(Suggestions.considerCompressingSitemap(url))
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
                const sitemapXmlDescription =
                    `A good XML sitemap acts as a roadmap of your website that leads Google to all your important pages. ` +
                    `XML sitemaps can be good for SEO, as they allow Google to find your essential website pages quickly, even if your internal linking isn't perfect.`
                renderSitemapCard(
                    new Card()
                        .open(
                            `Sitemap`,
                            url.replace(/(.*)\/([a-z0-9\-_\.]+(\.xml)?)(\?.*)?/i, '$2'),
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
                siteMapsFound++
            })
            .catch(errMsg => {
                renderSitemapCard(
                    new Card()
                        .error(errMsg as string)
                        .addParagraph(
                            `Unable to load the <code>sitemap.xml</code> at the url <a href='${url}' target='_new'>${url}</a>`
                        )
                        .setTitle(`Sitemap Not Found`)
                )
                if (siteMapsFound === 0) {
                    renderSitemapCard(Suggestions.missingSitemapXml())
                }
            })
    )
}

export const getRobotsTxtFileBody = async (url: string): Promise<string> => {
    var response = undefined
    try {
        response = await fetch(url)
        if (response.status !== 200) {
            throw new Error(`${response.status}: ${response.statusText}`)
        }
    } catch (err) {
        return Promise.reject(
            `Unable to load <code>robots.txt</code> file from <a target="_new" href="${url}">${url}</a><br/>
            Error message: ${(err as Error).message}.`
        )
    }

    try {
        const robotsTxtBody = await response.text()
        if (robotsTxtBody.includes(`page not found`)) {
            return Promise.reject(
                `File <code>robots.txt</code> doesn't exist at the following location: <a target="_new" href="${url}">${url}</a>.`
            )
        }
        return Promise.resolve(robotsTxtBody)
    } catch (err) {
        return Promise.reject((err as Error).message)
    }
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

export const getSiteMapUrlsFromSitemapXml = (sitemapUrl: string) => {
    const urls: string[] = []
    return getSiteMapBody(sitemapUrl)
        .then(sitemapBody => {
            let subSitemaps = (sitemapBody.match(
                /<sitemap>\s*<loc>(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9\-]+\.[^(\s|<|>)]{2,})<\/loc>/gim
            ) ?? []) as string[]
            subSitemaps = subSitemaps.map(link => link.replace(/(<(\/)?sitemap>|<(\/)?loc>)/gm, ''))
            return Promise.resolve(subSitemaps)
        })
        .catch(_ => Promise.resolve([] as string[]))
}

export const getRobotsLinks = (robotsUrl: string, divId: string) => [
    {
        label: 'Copy Code',
        onclick: () => copyTxtToClipboard(divId),
    },
    {
        url: `https://en.ryte.com/free-tools/robots-txt/?refresh=1&useragent=Googlebot&submit=Evaluate&url=${encodeURI(
            robotsUrl
        )}`,
        label: `Validate`,
    },
    {
        url: robotsUrl,
        label: 'Open',
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
