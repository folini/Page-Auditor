// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------

import {inflate} from 'pako'
import {Card, iLink} from '../card'
import {Mode} from '../colorCode'
import {disposableId, copyTxtToClipboard, DisplayCardFunc, formatNumber} from '../main'
import * as Suggestions from './suggestionCards'

export const getSiteMapBody = async (url: string): Promise<string> => {
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

export const getSiteMapCards = (urls: string[], renderCard: DisplayCardFunc) =>
    urls.map(url =>
        getSiteMapBody(url)
            .then(sitemapBody => {
                if (sitemapBody.includes(`<head>`) || sitemapBody.includes(`<link`)) {
                    renderCard(
                        new Card()
                            .error(`Sitemap.xml file is not syntactically correct. It appears to be an HTML file.`)
                            .addCodeBlock(sitemapBody, Mode.html, disposableId())
                            .setTitle('Error: Wrong Sitemap.xml')
                    )
                    renderCard(Suggestions.malformedSitemapXml())
                    return
                }

                if (sitemapBody.match(/not found/gim) !== null || sitemapBody.match(/error 404/gim) !== null) {
                    renderCard(
                        new Card()
                            .error(`Sitemap.xml not found. Website returns 404 error code.`)
                            .setTitle('Error: Sitemap.xml not found')
                    )
                    renderCard(Suggestions.malformedSitemapXml())
                    return
                }

                if (url.endsWith('.gz')) {
                    renderCard(
                        new Card()
                            .open(
                                `Compressed Sitemap`,
                                url.replace(/(.*)\/([a-z0-9\-_]+.xml)(.*)/i, '$2'),
                                getSitemapLinks(url, ''),
                                'icon-sitemap'
                            )
                            .addParagraph(
                                `Found a compressed Sitemap.xml file: <a href='${url}' target='new'>${url}</a>.`
                            )
                            .addParagraph(`Unable to display the content of compressed files.`)
                    )
                    return
                }
                const divId = disposableId()
                const links = sitemapBody.match(/<loc>(.*?)<\/loc>/g) ?? []
                const linksToSitemaps =
                    sitemapBody.match(
                        /<sitemap>\s*<loc>(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9\-]+\.[^(\s|<|>)]{2,}.xml\?[a-z0-9-=#_]*)<\/loc>/gim
                    ) ?? []
                const linksToPages = links.length - linksToSitemaps.length
                const sitemapXmlDescription =
                    `A good XML sitemap acts as a roadmap of your website that leads Google to all your important pages. ` +
                    `XML sitemaps can be good for SEO, as they allow Google to find your essential website pages quickly, even if your internal linking isn't perfect.`
                renderCard(
                    new Card()
                        .open(
                            `Sitemap`,
                            url.replace(/(.*)\/([a-z0-9\-_]+.xml)(.*)/i, '$2'),
                            getSitemapLinks(url, divId),
                            'icon-sitemap'
                        )
                        .addParagraph(`Found a Sitemap.xml file: <a href='${url}' target='new'>${url}</a>`)
                        .addParagraph(sitemapXmlDescription)
                        .addTable([
                            ['File Size', formatNumber(sitemapBody.length) + ' characters'],
                            ['Pages Links', `${formatNumber(linksToPages)} links`],
                            ['Sub Sitemap Links', `${formatNumber(linksToSitemaps.length)} links`],
                        ])
                        .addCodeBlock(sitemapBody, Mode.xml, divId)
                )
            })
            .catch(errMsg => {
                renderCard(
                    new Card()
                        .error(errMsg as string)
                        .setPreTitle(url)
                        .setTitle(`Error: No Sitemap.xml`)
                )
                renderCard(Suggestions.missingSitemapXml())
            })
    )

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
        .addCodeBlock(robotsTxtBody, Mode.txt, divId)
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
