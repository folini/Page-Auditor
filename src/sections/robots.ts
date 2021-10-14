// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Report} from '../report'
import {sectionActions, ReportGeneratorFunc} from '../main'
import {
    getSiteMapCards,
    getRobotsTxtFileBody,
    robotsTxtCard,
    getSiteMapUrlsFromRobotsTxt,
    getSiteMapUrlsFromSitemapXml as getSiteMapUrlsFromSitemap,
} from './robots-functions'
import * as Suggestions from './suggestionCards'
import * as Errors from './errorCards'
import * as Warnings from './warningCards'

const reportGenerator: ReportGeneratorFunc = (tabUrl: string, _: any, report: Report): void => {
    if (tabUrl === '') {
        report.addCard(Errors.chromeTabIsUndefined())
        return
    }

    var sitemapUrls = [new URL(tabUrl).origin + '/sitemap.xml']
    var robotsUrl = new URL(tabUrl).origin + '/robots.txt'

    const robotsBodyPromise = getRobotsTxtFileBody(robotsUrl)

    robotsBodyPromise
        .then(robotsTxtBody => {
            if (robotsTxtBody.includes(`<head>`) || robotsTxtBody.includes(`<meta`)) {
                report.addCard(Errors.robotsTxtIsHTMLPage(robotsUrl, robotsTxtBody))
                report.addCard(Suggestions.malformedRobotsTxt())
            } else if (robotsTxtBody.replace(/[\s\n]/g, '').length === 0) {
                report.addCard(Errors.robotsTxtIsEmpty(robotsUrl))
                report.addCard(Suggestions.emptyRobotsTxt())
            } else if (
                robotsTxtBody.split('\n').filter(line => !line.startsWith('#') && line.trim().length > 0).length === 0
            ) {
                const btnLabel = `Wrong Robots.Txt`
                report.addCard(Errors.robotsTxtIsOnlyComments(robotsUrl, robotsTxtBody))
                report.addCard(Suggestions.emptyRobotsTxt())
            } else {
                report.addCard(robotsTxtCard(robotsUrl, robotsTxtBody))
                const siteMaps = robotsTxtBody.match(/^sitemap:\shttp/gim) || []
                if (siteMaps.length === 0) {
                    report.addCard(Suggestions.linkSitemapFromRobotsTxt())
                }
            }
        })
        .catch(errCard => {
            report.addCard(errCard)
            report.addCard(Suggestions.missingRobotsTxt())
        })

    robotsBodyPromise
        .then(robotsTxtBody => {
            sitemapUrls = getSiteMapUrlsFromRobotsTxt(robotsTxtBody, sitemapUrls[0])
            const unsafeUrls = sitemapUrls.filter(url => url.includes(`http://`))
            if (unsafeUrls.length > 0) {
                sitemapUrls = sitemapUrls.map(url =>
                    url.includes(`http://`) ? url.replace(`http://`, `https://`) : url
                )
                report.addCard(Suggestions.unsafeSitemapLinkInRobots(unsafeUrls))
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
                report.addCard(Suggestions.repeatedSitemapLinkInRobots(repetitionArray))
            }
            return uniqueUrls
        })
        .then(async topSiteMapUrls => {
            const maxNumberOfSitemapsToLoad = 15
            let siteMapsToAdd: string[] = topSiteMapUrls
            let siteMapsToIgnore: string[] = []
            for (const topSmUrl of sitemapUrls) {
                const spaceLeft = Math.max(maxNumberOfSitemapsToLoad - siteMapsToAdd.length, 0)
                if (spaceLeft > 0) {
                    const newSiteMaps = await getSiteMapUrlsFromSitemap(topSmUrl)
                    siteMapsToAdd.push(...newSiteMaps.slice(0, spaceLeft))
                    siteMapsToIgnore.push(...newSiteMaps.slice(spaceLeft))
                }
            }
            if (siteMapsToIgnore.length > 0) {
                report.addCard(Warnings.notAllSitemapsLoaded(maxNumberOfSitemapsToLoad, [...new Set(siteMapsToIgnore)]))
            }
            return [...new Set(siteMapsToAdd)]
        })
        .then(siteMapUrls => {
            getSiteMapCards(siteMapUrls, report)
        })
}

export const actions: sectionActions = {
    reportGenerator: reportGenerator,
}
