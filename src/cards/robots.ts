// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Report} from '../report'
import {sectionActions, ReportGeneratorFunc} from '../main'
import {createSiteMapCards, readFile, processRobotsTxt, sitemapUrlsFromRobotsTxt} from './robots-functions'
import {Errors} from './errors'
import {Info} from './info'
import {SitemapList} from '../sitemapList'
import {Tips} from './tips'

const reportGenerator: ReportGeneratorFunc = (tabUrl: string, _: any, report: Report): void => {
    if (tabUrl === '') {
        const card = Errors.chrome_TabUrlUndefined()
        report.addCard(card)
        Tips.noRobotsTxtInChromeBrowserPages(card)
        return
    }

    if (tabUrl.startsWith(`chrome://`)) {
        const card = Errors.chrome_UnableToAnalyzeTab()
        report.addCard(card)
        Tips.noRobotsTxtInChromeBrowserPages(card)
        return
    }

    var defaultSitemapUrl = new URL(tabUrl).origin + '/sitemap.xml'
    var defaultRobotsUrl = new URL(tabUrl).origin + '/robots.txt'

    const sitemaps = new SitemapList()
    sitemaps.addToReady([defaultSitemapUrl])

    readFile(defaultRobotsUrl)
        .then(robotsTxtBody => {
            processRobotsTxt(robotsTxtBody, defaultRobotsUrl, report)
            const newUrls = sitemapUrlsFromRobotsTxt(robotsTxtBody)
            sitemaps.addToReady(newUrls)
        })
        .catch(() => {
            const card = Errors.robotsTxt_NotFound(defaultRobotsUrl)
            report.addCard(card)
            Tips.missingRobotsTxt(card) 
        })
        .then(()=> createSiteMapCards(sitemaps, report))
        .finally(() => {
            if (sitemaps.doneList.length === 0) {
                const card = Errors.sitemap_NotFound(sitemaps.failedList)
                Tips.missingSitemap(card)
                report.addCard(card)
            }
            if (sitemaps.skippedList.length > 0) {
                report.addCard(Info.notAllSitemapsLoaded(SitemapList.maxSitemapsToLoad(), sitemaps.skippedList))
            }
        })
}

export const actions: sectionActions = {
    reportGenerator: reportGenerator,
}
