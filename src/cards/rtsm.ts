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
import * as Tips from '../tips/tips'
import {Card, CardKind} from '../card'
import {processRobotsTxt} from './rtsm-robotstxt'

const reportGenerator: ReportGeneratorFunc = (tabUrl: string, _: any, report: Report): void => {
    if (tabUrl === '') {
        const card = Errors.browser_TabUrlUndefined()
        report.addCard(card)
        Tips.Internal.unableToAnalyzeBrowserPages(card)
        report.completed()
        return
    }

    if (tabUrl.startsWith(`chrome://`) || tabUrl.startsWith(`edge://`)) {
        const card = Errors.browser_UnableToAnalyzeTabs()
        report.addCard(card)
        Tips.Internal.unableToAnalyzeBrowserPages(card)
        report.completed()
        return
    }

    var defaultSitemap: iSmCandidate = {url: new URL(tabUrl).origin + '/sitemap.xml', source: SmSource.Default}
    var defaultRobotsUrl = new URL(tabUrl).origin + '/robots.txt'

    const sitemaps = new SmList()
    sitemaps.addToDo([defaultSitemap])

    var sitemapsAnalysisCardPlaceholder: Card | undefined = undefined

    File.read(defaultRobotsUrl, File.textContentType)
        .then(robotsTxtBody => {
            processRobotsTxt(robotsTxtBody, defaultRobotsUrl, report)
            const newSm = sitemapUrlsFromRobotsTxt(robotsTxtBody)
            sitemaps.addToDo(newSm)
        })
        .catch(() => {
            const card = Errors.robotsTxt_NotFound(defaultRobotsUrl)
            report.addCard(card)
            Tips.RobotsTxt.missingRobotsTxt(card)
        })
        .then(() => {
            sitemapsAnalysisCardPlaceholder = new Card(CardKind.info)
            report.addCard(sitemapsAnalysisCardPlaceholder)
            return SiteMaps.createSiteMapCards(sitemaps, report)
        })
        .then(p => {
            Promise.allSettled(p).then(() => {
                if (sitemaps.doneList.length === 0) {
                    const card = Errors.sitemap_NotFound(sitemaps.failedList)
                    Tips.Sitemap.missingSitemap(card)
                    report.addCard(card)
                }
                const card = Info.sitemapsOverallAnalysis(sitemaps, sitemapsAnalysisCardPlaceholder)
                if (sitemaps.withoutXmlExtension().length > 0) {
                    Tips.Sitemap.missingXmlExtension(card, sitemaps.withoutXmlExtension())
                }
                report.completed()
            })
        })
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
