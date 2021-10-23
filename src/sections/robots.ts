// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Report} from '../report'
import {sectionActions, ReportGeneratorFunc} from '../main'
import {sitemapsFromPromise, getFile, robotsTxtFromPromise} from './robots-functions'
import * as Errors from './errorCards'
import * as Info from './infoCards'
import {SitemapList} from '../sitemapList'
import {Tips} from './tips'

const reportGenerator: ReportGeneratorFunc = (tabUrl: string, _: any, report: Report): void => {
    if (tabUrl === '') {
        const card =Errors.tabUrlUndefined()
        report.addCard(card)
        Tips.noRobotsTxtInChromeBrowserPages(card)
        return
    }

    if (tabUrl.startsWith(`chrome://`)) {
        const card = Errors.unableToAnalyzeChromeTabs()
        report.addCard(card)
        Tips.noRobotsTxtInChromeBrowserPages(card)
        return
    }
    
    var defaultSitemapUrl = new URL(tabUrl).origin + '/sitemap.xml'
    var defaultRobotsUrl = new URL(tabUrl).origin + '/robots.txt'

    const sitemaps = new SitemapList()
    sitemaps.addToReady([defaultSitemapUrl])

    const robotsTxtBody = getFile(defaultRobotsUrl)

    robotsTxtFromPromise(robotsTxtBody, defaultRobotsUrl, report)
        .then(() => sitemapsFromPromise(robotsTxtBody, sitemaps, report))
        .finally(() => {
            if (sitemaps.doneList.length === 0) {
                const card = Errors.sitemapNotFound(sitemaps.failedList)
                Tips.missingSitemapXml(card)
                report.addCard(card)
            }
            if (sitemaps.skippedList.length > 0) {
                report.addCard(
                    Info.notAllSitemapsLoaded(SitemapList.maxNumberOfSitemapsToLoad(), sitemaps.skippedList)
                )
            }
        })
}

export const actions: sectionActions = {
    reportGenerator: reportGenerator,
}
