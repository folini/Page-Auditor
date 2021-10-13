// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card} from '../card'
import {sectionActions, ReportGeneratorFunc, DisplayCardFunc, disposableId} from '../main'
import {
    getSiteMapCards,
    getRobotsTxtFileBody,
    robotsTxtCard,
    getSiteMapUrlsFromRobotsTxt,
    getSiteMapUrlsFromSitemapXml,
} from './robots-functions'
import * as Suggestions from './suggestionCards'
import {Mode} from '../colorCode'
import {codeBlock} from '../codeBlock'

const reportGenerator: ReportGeneratorFunc = (tabUrl: string, _: any, renderCard: DisplayCardFunc): void => {
    const result: Promise<Card>[] = []

    if (tabUrl === '') {
        renderCard(
            new Card()
                .error('Browser tab is undefined. Unable to analyze robots.txt and sitemap.xml')
                .setTitle(`Undefined Current Browser Tab`)
        )
        return
    }

    var sitemapUrls = [new URL(tabUrl).origin + '/sitemap.xml']
    var robotsUrl = new URL(tabUrl).origin + '/robots.txt'

    const robotsBodyPromise = getRobotsTxtFileBody(robotsUrl)

    robotsBodyPromise
        .then(robotsTxtBody => {
            if (robotsTxtBody.includes(`<head>`) || robotsTxtBody.includes(`<meta`)) {
                const divId = disposableId()
                const btnLabel = `Wrong Robots.Txt`
                const card = new Card()
                    .error(
                        `File at location <a target="_new" href="${robotsUrl}">${robotsUrl}</a> is an HTML page ` +
                            `or a redirect to an HTML page. Its' not a syntactically valid <code>robots.txt</code>.`
                    )
                    .addExpandableBlock(btnLabel, codeBlock(robotsTxtBody, Mode.html, divId))
                    .setTitle('Wrong Robots.txt Syntax')
                renderCard(card)

                renderCard(Suggestions.malformedRobotsTxt())
            } else if (robotsTxtBody.replace(/[\s\n]/g, '').length === 0) {
                renderCard(
                    new Card()
                        .error("Found a Robots.txt file, but it's empty.")
                        .addParagraph(
                            `The <code>robots.txt</code> file at the url <a href='${robotsUrl}' target='_new'>${robotsUrl}</a> is empty.`
                        )
                        .setTitle('Robots.Txt Is Empty')
                )
                renderCard(Suggestions.emptyRobotsTxt())
            } else if (
                robotsTxtBody
                    .split('\n')
                    .filter(line => !line.startsWith('#'))
                    .join('')
                    .replace(/[\s\n]/g, '').length === 0
            ) {
                const btnLabel = `sWrong Robots.Txt`
                const card = new Card()
                    .warning('Found a Robots.txt file, but it only contains comments, no robots directives.')
                    .addParagraph(
                        `The <code>robots.txt</code> file at the url <a href='${robotsUrl}' target='_new'>${robotsUrl}</a> contains only comments.`
                    )
                    .addExpandableBlock(btnLabel, codeBlock(robotsTxtBody, Mode.txt))
                    .setTitle('Robots.Txt Contains Only Comments')
                renderCard(card)
                renderCard(Suggestions.emptyRobotsTxt())
            } else {
                renderCard(robotsTxtCard(robotsUrl, robotsTxtBody))
                const siteMaps = robotsTxtBody.match(/^sitemap:\shttp/gim) || []
                if (siteMaps.length === 0) {
                    renderCard(Suggestions.linkSitemapFromRobotsTxt())
                }
            }
        })
        .catch(errMsg => {
            renderCard(
                new Card()
                    .error(errMsg as string)
                    .addParagraph(
                        `No <code>robots.txt</code> file at the url <a href='${robotsUrl}' target='_new'>${robotsUrl}</a>.`
                    )
                    .setTitle('Robots.Txt Not Found')
            )
            renderCard(Suggestions.missingRobotsTxt())
        })

    robotsBodyPromise
        .then(robotsTxtBody => {
            sitemapUrls = getSiteMapUrlsFromRobotsTxt(robotsTxtBody, sitemapUrls[0])
            const unsafeUrls = sitemapUrls.filter(url => url.includes(`http://`))
            if (unsafeUrls.length > 0) {
                sitemapUrls = sitemapUrls.map(url =>
                    url.includes(`http://`) ? url.replace(`http://`, `https://`) : url
                )
                renderCard(Suggestions.unsafeSitemapLinkInRobots(unsafeUrls))
            }
            const uniqueUrls = [...new Set(sitemapUrls)]
            if (uniqueUrls.length < sitemapUrls.length) {
                const repetitionsObj = sitemapUrls.reduce((acc, curr) => {
                    acc[curr] = (acc[curr] || 0) + 1
                    return acc
                }, {} as {[key: string]: number})
                const repetitionArray = Object.entries(repetitionsObj)
                    .filter(([key, value]) => value > 1)
                    .map(([key, value]) => key)
                renderCard(Suggestions.repeatedSitemapLinkInRobots(repetitionArray))
            }
            console.log(`1. THEN ${uniqueUrls.length} = uniques [${uniqueUrls.join('|')}]`)
            return uniqueUrls
        })
        .then(async siteMapUrls => {
            let subSiteMaps: string[] = siteMapUrls
            for (const sm of sitemapUrls) {
                const smLinks = await getSiteMapUrlsFromSitemapXml(sm)
                if (smLinks.length > 0) {
                    subSiteMaps.push(...smLinks)
                }
            }
            const uniqueUrls = [...new Set(subSiteMaps)]
            return uniqueUrls
        })
        .then(siteMapUrls => {
            console.log(`3. THEN ${siteMapUrls.length}`)
            getSiteMapCards(siteMapUrls, renderCard)
        })
}

export const actions: sectionActions = {
    reportGenerator: reportGenerator,
}
