// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card} from '../card'
import {sectionActions} from '../main'
import {
    getSiteMapCards,
    getRobotsTxtFileBody,
    getRobotsTxtCard,
    getSiteMapUrls,
} from './robots-functions'

const injector = () => undefined

const eventManager = () => undefined

const reporter = async (tabUrl: string, _: any): Promise<string> => {
    if (tabUrl === '') {
        return ''
    }

    var robotsUrl = new URL(tabUrl).origin + '/robots.txt'
    var sitemapUrl = new URL(tabUrl).origin + '/sitemap.xml'

    try {
        const robotsTxtBody: string = await getRobotsTxtFileBody(robotsUrl)
        const sitemapUrls: string[] = getSiteMapUrls(robotsTxtBody, sitemapUrl)
        return (
            (await getRobotsTxtCard(robotsUrl, robotsTxtBody)) +
            (await getSiteMapCards(sitemapUrls))
        )
    } catch (err) {
        return new Card().error((err as Error).message)
    }
}

export const actions: sectionActions = {
    injector: injector,
    reporter: reporter,
    eventManager: eventManager,
}
