// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card} from '../card'
import {htmlEncode} from 'js-htmlencode'
import {html_beautify} from 'js-beautify'
import {colorCode, Mode} from '../colorCode'

export const getSiteMapFileBody = async (url: string): Promise<string> => {
    var response = undefined
    try {
        response = await fetch(url)
        if (response.status !== 200) {
            throw new Error(`${response.status}: ${response.statusText}`)
        }
    } catch (err) {
        return Promise.reject(
            `Sitemap.xml file at <a target="_new" href="${url}">${url}</a> not found.<br/>
            Error message: ${(err as Error).message}`
        )
    }

    try {
        const sitemapBody = await response.text()
        const sitemapBodyLowerCase = sitemapBody.toLowerCase()
        if (sitemapBodyLowerCase.includes(`not found`) || sitemapBodyLowerCase.includes(`error 404`)) {
            return Promise.reject(`Robots.txt file at <a target="_new" href="${url}">${url}</a> not found.`)
        }
        if (sitemapBody.includes(`<head>`) || sitemapBody.includes(`<link`)) {
            return Promise.reject(
                `File at <a target="_new" href="${url}">${url}</a> is not a syntactically valid <code>Sitemap.xml</code>.
                <div class='code x-scrollable'>${html_beautify(sitemapBody)
                    .split('\n')
                    .map(line => htmlEncode(line))
                    .join('</br>')
                    .replace(/\s/g, '&nbsp;')}</div>`
            )
        }

        return Promise.resolve(sitemapBody)
    } catch (err) {
        return Promise.reject(
            `Sitemap.xml file at <a target="_new" href="${url}">${url}</a> not found.<br/>
            Error message: ${(err as Error).message}`
        )
    }
}

export const getSiteMapCards = (urls: string[]): Promise<Card>[] =>
    urls.map(
        url =>
            new Promise(resolve =>
                getSiteMapFileBody(url)
                    .then(sitemapBody => {
                        const formattedBody = htmlEncode(html_beautify(sitemapBody))
                        resolve(
                            new Card()
                                .open(``, `Sitemap.xml`, getSitemapLinks(url), 'icon-sitemap')
                                .add(`<div class='code x-scrollable'>${colorCode(formattedBody, Mode.html)}</div>`)
                                .close()
                        )
                    })
                    .catch(errMsg => resolve(new Card().error(errMsg as string, 'Sitemap.xml Error')))
            )
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
        if (robotsTxtBody.includes(`<head>`) || robotsTxtBody.includes(`<meta`)) {
            return Promise.reject(
                `File at location <a target="_new" href="${url}">${url}</a> is an HTML page or a redirect to an HTML page and not a 
                syntactically valid <code>robots.txt</code>.
                <div class='code x-scrollable'>${html_beautify(robotsTxtBody)
                    .split('\n')
                    .map(line => htmlEncode(line))
                    .join('</br>')
                    .replace(/\s/g, '&nbsp;')}</div>`
            )
        }

        return Promise.resolve(robotsTxtBody)
    } catch (err) {
        return Promise.reject((err as Error).message)
    }
}

export const getRobotsTxtCard = (robotsTxtUrl: string, robotsTxtBody: string): Card =>
    new Card()
        .open(``, `Robots.txt`, getRobotsLinks(robotsTxtUrl), 'icon-rep')
        .add(`<div class='code x-scrollable'>${robotsTxtBody.replace(/\n/gm, '<br/>')}</div>`)
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
