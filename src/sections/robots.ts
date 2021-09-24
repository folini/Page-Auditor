// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
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

const codeInjector = () => undefined

const eventManager = () => undefined

const reportGenerator = async (tabUrl: string, _: any): Promise<Promise<Card>[]> => {
    const result: Promise<Card>[] = []

    if (tabUrl === '') {
        return [
            Promise.resolve(new Card().error('Browser tab is undefined. Unable to analyze robots.txt and sitemap.xml')),
        ]
    }

    var sitemapUrls = [new URL(tabUrl).origin + '/sitemap.xml']
    var robotsUrl = new URL(tabUrl).origin + '/robots.txt'

    var robotsTxtBody = ''

    try {
        robotsTxtBody = await getRobotsTxtFileBody(robotsUrl)
        sitemapUrls = getSiteMapUrlsFromRobotsTxt(robotsTxtBody, sitemapUrls[0])
        result.push(Promise.resolve(getRobotsTxtCard(robotsUrl, robotsTxtBody)))
    } catch (errMsg) {
        result.push(Promise.resolve(new Card().error(errMsg as string, 'Robots.Txt Error')))
    }

    const unsafeUrls = sitemapUrls.filter(url => url.includes(`http://`))
    if (unsafeUrls.length > 0) {
        sitemapUrls = sitemapUrls.map(url => (url.includes(`http://`) ? url.replace(`http://`, `https://`) : url))
        result.push(
            Promise.resolve(
                new Card().suggestion(
                    `The following url of a <code>sitemap.xml</code> was listed in your <code>robots.txt</code>. Sitemap.xml files should be always listed 
                    using the <code>https</code> protocol instead of the <code>http</code> protocol.
                    <ul>
                    ${unsafeUrls.map(url => `<li>${url}</li>`)}
                    </ul>
                    It's important you update ASAP your <code>robots.txt</code> and <code>sitemap.xml</code> adopting the <code>http</code> protocol.`
                )
            )
        )
    }

    result.push(...getSiteMapCards(sitemapUrls))

    return result
}

export const actions: sectionActions = {
    codeInjector: codeInjector,
    reportGenerator: reportGenerator,
    eventManager: eventManager,
}
