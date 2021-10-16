// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Report} from '../report'
import {sectionActions, ReportGeneratorFunc} from '../main'
import {processSitemapFromPromise, getRobotsTxtBody, processRobotsTxtPromise} from './robots-functions'
import * as Errors from './errorCards'

const reportGenerator: ReportGeneratorFunc = (tabUrl: string, _: any, report: Report): void => {
    if (tabUrl === '') {
        report.addCard(Errors.chromeTabIsUndefined())
        return
    }

    var sitemapUrl = new URL(tabUrl).origin + '/sitemap.xml'
    var robotsUrl = new URL(tabUrl).origin + '/robots.txt'

    const robotsBodyPromise = getRobotsTxtBody(robotsUrl)
    processRobotsTxtPromise(robotsBodyPromise, robotsUrl, report)
    processSitemapFromPromise(robotsBodyPromise, sitemapUrl, report)
}

export const actions: sectionActions = {
    reportGenerator: reportGenerator,
}
