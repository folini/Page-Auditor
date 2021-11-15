// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Report} from '../report'
import {sectionActions, ReportGeneratorFunc} from '../main'
import * as File from '../file'
import * as SiteMaps from './rtsm-sitemapxml'
import {Errors} from './errors'
import {Info} from './info'
import {iSmCandidate, SmList, SmSource} from '../sitemapList'
import * as Tips from './tips'
import {processRobotsTxt} from './rtsm-robotstxt'

const reportGenerator: ReportGeneratorFunc = (tabUrl: string, _: any, report: Report): void => {
    if (tabUrl === '') {
        const card = Errors.chrome_TabUrlUndefined()
        report.addCard(card)
        Tips.unableToAnalyzeChromeBrowserPages(card)
        report.completed()
        return
    }

    if (tabUrl.startsWith(`chrome://`)) {
        const card = Errors.chrome_UnableToAnalyzeTabs()
        report.addCard(card)
        Tips.unableToAnalyzeChromeBrowserPages(card)
        report.completed()
        return
    }

    var defaultSitemap: iSmCandidate = {url: new URL(tabUrl).origin + '/sitemap.xml', source: SmSource.Default}
    var defaultRobotsUrl = new URL(tabUrl).origin + '/robots.txt'

    const sitemaps = new SmList()
    sitemaps.addToDo([defaultSitemap])

    File.read(defaultRobotsUrl, File.textContentType)
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
        .then(() => SiteMaps.createSiteMapCards(sitemaps, report))
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
        .finally(() => report.completed())
}

export const actions: sectionActions = {
    reportGenerator: reportGenerator,
}

export const sitemapUrlsFromRobotsTxt = (robotsTxtBody: string): iSmCandidate[] =>
    robotsTxtBody
        .split('\n')
        .filter(line => line.startsWith('Sitemap: '))
        .map(line => line.split(': ')[1].trim())
        .filter(line => line.length > 0)
        .map(url => ({url: url, source: SmSource.RobotsTxt}))
