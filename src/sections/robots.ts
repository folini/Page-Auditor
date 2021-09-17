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
    getSiteMapUrls as getSiteMapUrlsFromRobotsTxt,
} from './robots-functions'

const injector = () => undefined

const eventManager = () => undefined

const reporter = async (tabUrl: string, _: any): Promise<string> => {
    if (tabUrl === '') {
        return ''
    }

    var sitemapUrls = [new URL(tabUrl).origin + '/sitemap.xml']
    let report = ''
    try {
        var robotsUrl = new URL(tabUrl).origin + '/robots.txt'
        const robotsTxtBody: string = await getRobotsTxtFileBody(robotsUrl)
        sitemapUrls = getSiteMapUrlsFromRobotsTxt(robotsTxtBody, sitemapUrls[0])
        report += getRobotsTxtCard(robotsUrl, robotsTxtBody)
    } catch (err) {
        report += new Card().error((err as Error).message)
    }

    try {
        const unsafeUrls = sitemapUrls.filter(url => url.includes(`http://`))
        if (unsafeUrls.length > 0) {
            sitemapUrls = sitemapUrls.map(url =>
                url.includes(`http://`)
                    ? url.replace(`http://`, `https://`)
                    : url
            )
            report += new Card()
                .suggestion(`The following <code>sitemap.xml</code> listed in your <code>robots.txt</code> file should be listed 
                using the <code>https</code> protocol instead of the <code>http</code> protocol.
                <ul>
                ${unsafeUrls.map(url => `<li>${url}</li>`)}
                </ul>
                It's important you update ASAP your <code>robots.txt</code> and <code>sitemap.xml</code> adopting the <code>http</code> protocol.`)
        }
        report += await getSiteMapCards(sitemapUrls)
    } catch (err) {
        report += new Card().error((err as Error).message)
    }

    return report
}

export const actions: sectionActions = {
    injector: injector,
    reporter: reporter,
    eventManager: eventManager,
}
