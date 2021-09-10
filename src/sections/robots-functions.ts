// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card} from '../card'

export const getSiteMapFileBody = async (url: string): Promise<string> => {
    try {
        var response = await fetch(url)
        if (response.status !== 200) {
            throw new Error(`Sitemap.xml file at '${url}' not found.`)
        }
        return await (await response.text())
            .replace(/\</g, '&lt;')
            .replace(/\>/g, '&gt;')
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
            report += new Card().error(
                `Unable to load <code>sitemap.xml</code> file from <a target="_new" href="${url}">${url}</a>.`
            )
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
        return await response.text()
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
