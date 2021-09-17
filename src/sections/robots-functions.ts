// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card} from '../card'
import {htmlEncode} from 'js-htmlencode'

export const getSiteMapFileBody = async (url: string): Promise<string> => {
    try {
        var response = await fetch(url)
        if (response.status !== 200) {
            throw new Error(`Sitemap.xml file at '${url}' not found.`)
        }
        const sitemapBody = await response.text()
        if (sitemapBody.includes(`page not found`)) {
            throw new Error(
                `File <code>Sitemap.xml</code> doesn't exist at the following location: <a target="_new" href="${url}">${url}</a>.`
            )
        }
        if (sitemapBody.includes(`<html`) || sitemapBody.includes(`<body`)) {
            throw new Error(
                `File at location <a target="_new" href="${url}">${url}</a> is not a syntactically valid <code>Sitemap.xml</code>.`
            )
        }
        return htmlEncode(sitemapBody)
    } catch (err) {
        throw err as Error
    }
}

export const getSiteMapCards = async (urls: string[]): Promise<string> => {
    var report = ''
    for (const url of urls) {
        try {
            report += new Card()
                .open(``, `Sitemap.xml`, getSitemapLinks(url), 'icon-sitemap')
                .add(
                    `<pre class='x-scrollable'>${await getSiteMapFileBody(
                        url
                    )}</pre>`
                )
                .close()
        } catch (err) {
            report += new Card().error((err as Error).message)
        }
    }
    return report
}

export const getRobotsTxtFileBody = async (url: string): Promise<string> => {
    try {
        var response = await fetch(url)
        if (response.status !== 200) {
            throw new Error(
                `Unable to load <code>robots.txt</code> file from <a target="_new" href="${url}">${url}</a>.`
            )
        }
        const robotsTxtBody = await response.text()
        if (robotsTxtBody.includes(`page not found`)) {
            throw new Error(
                `File <code>robots.txt</code> doesn't exist at the following location: <a target="_new" href="${url}">${url}</a>.`
            )
        }
        if (
            robotsTxtBody.includes(`<html`) ||
            robotsTxtBody.includes(`<body`)
        ) {
            throw new Error(
                `File at location <a target="_new" href="${url}">${url}</a> is an HTML document and not a syntactically valid <code>robots.txt</code>.`
            )
        }
        return robotsTxtBody
    } catch (err) {
        throw err as Error
    }
}

export const getRobotsTxtCard = (
    robotsTxtUrl: string,
    robotsTxtBody: string
): string =>
    new Card()
        .open(``, `Robots.txt`, getRobotsLinks(robotsTxtUrl), 'icon-rep')
        .add(`<pre class='x-scrollable'>${robotsTxtBody}</pre>`)
        .close()

export const getSiteMapUrls = (robotsTxtBody: string, defaultUrl: string) => {
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

export const getRobotsLinks = (robotsUrl: string) => [
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

export const getSitemapLinks = (sitemapUrl: string) => [
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
