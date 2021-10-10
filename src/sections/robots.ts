// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {htmlEncode} from 'js-htmlencode'
import {html_beautify} from 'js-beautify'
import {Card} from '../card'
import {sectionActions, codeBlock, ReportGeneratorFunc, DisplayCardFunc, disposableId} from '../main'
import {getSiteMapCards, getRobotsTxtFileBody, robotsTxtCard, getSiteMapUrls} from './robots-functions'
import * as Suggestions from './suggestionCards'
import {Mode} from '../colorCode'

const reportGenerator: ReportGeneratorFunc = (tabUrl: string, _: any, renderCard: DisplayCardFunc): void => {
    const result: Promise<Card>[] = []

    if (tabUrl === '') {
        renderCard(new Card().error('Browser tab is undefined. Unable to analyze robots.txt and sitemap.xml'))
        return
    }

    var sitemapUrls = [new URL(tabUrl).origin + '/sitemap.xml']
    var robotsUrl = new URL(tabUrl).origin + '/robots.txt'

    const robotsTxtPromise = getRobotsTxtFileBody(robotsUrl)

    robotsTxtPromise
        .then(robotsTxtBody => {
            if (robotsTxtBody.includes(`<head>`) || robotsTxtBody.includes(`<meta`)) {
                const divId = disposableId()
                const formattedBody = html_beautify(htmlEncode(robotsTxtBody))
                renderCard(
                    new Card()
                        .error(
                            `File at location <a target="_new" href="${robotsUrl}">${robotsUrl}</a> is an HTML page ` +
                                `or a redirect to an HTML page and not a syntactically valid <code>robots.txt</code>.` +
                                codeBlock(formattedBody, Mode.html, divId)
                        )
                        .setPreTitle(robotsUrl)
                )
                renderCard(Suggestions.malformedRobotsTxt())
            } else if (robotsTxtBody.replace(/[\s\n]/g, '').length === 0) {
                renderCard(
                    new Card()
                        .error("Found a Robots.txt file, but it's empty.", 'Robots.Txt Error')
                        .setPreTitle(robotsUrl)
                )
                renderCard(Suggestions.emptyRobotsTxt())
            } else {
                renderCard(robotsTxtCard(robotsUrl, robotsTxtBody))
            }
        })
        .catch(errMsg => {
            renderCard(new Card().error(errMsg as string, 'Robots.Txt Error').setPreTitle(robotsUrl))
            renderCard(Suggestions.missingRobotsTxt())
        })

    robotsTxtPromise.then(robotsTxtBody => {
        sitemapUrls = getSiteMapUrls(robotsTxtBody, sitemapUrls[0])
        const unsafeUrls = sitemapUrls.filter(url => url.includes(`http://`))
        if (unsafeUrls.length > 0) {
            sitemapUrls = sitemapUrls.map(url => (url.includes(`http://`) ? url.replace(`http://`, `https://`) : url))
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
        getSiteMapCards(uniqueUrls, renderCard)
    })
}

export const actions: sectionActions = {
    reportGenerator: reportGenerator,
}
