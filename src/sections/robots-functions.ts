// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card, iLink} from '../card'
import {htmlEncode} from 'js-htmlencode'
import {html_beautify} from 'js-beautify'
import {Mode} from '../colorCode'
import {disposableId, sendTaskToWorker, copyTxtToClipboard, DisplayCardFunc} from '../main'
import * as Suggestions from './suggestionCards'

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
        return Promise.resolve(sitemapBody)
    } catch (err) {
        return Promise.reject(
            `Sitemap.xml file not found.<br/>
            Error message: ${(err as Error).message}`
        )
    }
}

export const getSiteMapCards = (urls: string[], renderCard: DisplayCardFunc) =>
    urls.map(url =>
        getSiteMapFileBody(url)
            .then(sitemapBody => {
                const divId = disposableId()
                const formattedBody = html_beautify(htmlEncode(sitemapBody))
                if (sitemapBody.includes(`<head>`) || sitemapBody.includes(`<link`)) {
                    renderCard(
                        new Card()
                            .error(
                                `Sitemap.xml file is not syntactically correct. Ita appears to be an HTML file.
                                <div class='code x-scrollable meta-tags' id='${divId}'>${formattedBody
                                    .split('\n')
                                    .join('</br>')
                                    .replace(/\s/g, '&nbsp;')}</div>`
                            )
                            .setPreTitle('Malformed sitemap.xml')
                    )
                    renderCard(Suggestions.malformedSitemapXml())
                    sendTaskToWorker(divId, Mode.html, formattedBody, false)
                    return
                }
                sendTaskToWorker(divId, Mode.xml, formattedBody, false)
                renderCard(
                    new Card()
                        .open(
                            url,
                            `Sitemap.xml file (${formattedBody.split('\n').length} lines)`,
                            getSitemapLinks(url, divId),
                            'icon-sitemap'
                        )
                        .add(`<div class='code x-scrollable' id='${divId}'>${formattedBody}</div>`)
                )
            })
            .catch(errMsg => {
                renderCard(new Card().error(errMsg as string, 'Sitemap.xml Error').setPreTitle(url))
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

export const getRobotsTxtCard = (url: string, robotsTxtBody: string): Card => {
    const divId = disposableId()
    sendTaskToWorker(divId, Mode.txt, robotsTxtBody)
    return new Card()
        .open(
            url,
            `Robots.txt file (${robotsTxtBody.split('\n').length} lines)`,
            getRobotsLinks(url, divId),
            'icon-rep'
        )
        .add(`<div class='code x-scrollable' id='${divId}'>${robotsTxtBody}</div>`)
}

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

export const getRobotsLinks = (robotsUrl: string, divId: string) => [
    {
        label: 'Copy',
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
        label: 'Copy',
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
