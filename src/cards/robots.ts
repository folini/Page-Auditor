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
import {iSmCandidate, SmList, SmSource} from '../sitemapList'
import * as Tips from './tips'

const reportGenerator: ReportGeneratorFunc = (tabUrl: string, _: any, report: Report): void => {
    if (tabUrl === '') {
        const card = Errors.chrome_TabUrlUndefined()
        report.addCard(card)
        Tips.unableToAnalyzeChromeBrowserPages(card)
        return
    }

    if (tabUrl.startsWith(`chrome://`)) {
        const card = Errors.chrome_UnableToAnalyzeTabs()
        report.addCard(card)
        Tips.unableToAnalyzeChromeBrowserPages(card)
        return
    }

    var defaultSitemap: iSmCandidate = {url: new URL(tabUrl).origin + '/sitemap.xml', source: SmSource.Default}
    var defaultRobotsUrl = new URL(tabUrl).origin + '/robots.txt'

    const sitemaps = new SmList()
    sitemaps.addToDo([defaultSitemap])

    readFile(defaultRobotsUrl)
        .then(robotsTxtBody => {
            processRobotsTxt(robotsTxtBody, defaultRobotsUrl, report)
            const newSm = sitemapUrlsFromRobotsTxt(robotsTxtBody)
            sitemaps.addToDo(newSm)
        })
        .catch(() => {
            const card = Errors.robotsTxt_NotFound(defaultRobotsUrl)
            report.addCard(card)
            Tips.missingRobotsTxt(card)
        })
        .then(() => createSiteMapCards(sitemaps, report))
        .then(p => {
            Promise.allSettled(p).then(() => {
                if (sitemaps.doneList.length === 0) {
                    const card = Errors.sitemap_NotFound(sitemaps.failedList)
                    Tips.missingSitemap(card)
                    report.addCard(card)
                }
                if (sitemaps.skippedList.length > 0) {
                    report.addCard(
                        Info.notAllSitemapsLoaded(
                            SmList.maxSitemapsToLoad(),
                            sitemaps.skippedList.map(sm => sm.url)
                        )
                    )
                }
            })
        })
}

export const actions: sectionActions = {
    reportGenerator: reportGenerator,
}
