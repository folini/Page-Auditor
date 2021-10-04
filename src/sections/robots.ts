// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card} from '../card'
import {sectionActions, NoArgsNoReturnFunc, ReportGeneratorFunc, DisplayCardFunc, worker} from '../main'
import {
    getSiteMapCards,
    getRobotsTxtFileBody,
    getRobotsTxtCard as robotsTxtCard,
    getSiteMapUrls as getSiteMapUrlsFromRobotsTxt,
} from './robots-functions'

const codeInjector: NoArgsNoReturnFunc = () => undefined

const reportGenerator: ReportGeneratorFunc = (tabUrl: string, _: any, renderCard: DisplayCardFunc): void => {
    const result: Promise<Card>[] = []

    if (tabUrl === '') {
        renderCard(new Card().error('Browser tab is undefined. Unable to analyze robots.txt and sitemap.xml'))
        return
    }

    var sitemapUrls = [new URL(tabUrl).origin + '/sitemap.xml']
    var robotsUrl = new URL(tabUrl).origin + '/robots.txt'

    const robotsTxtPromise = getRobotsTxtFileBody(robotsUrl)

    robotsTxtPromise
        .then(robotsTxtBody => {
            renderCard(robotsTxtCard(robotsUrl, robotsTxtBody))
        })
        .catch(errMsg => renderCard(new Card().error(errMsg as string, 'Robots.Txt Error')))

    robotsTxtPromise.then(robotsTxtBody => {
        sitemapUrls = getSiteMapUrlsFromRobotsTxt(robotsTxtBody, sitemapUrls[0])
        const unsafeUrls = sitemapUrls.filter(url => url.includes(`http://`))
        if (unsafeUrls.length > 0) {
            sitemapUrls = sitemapUrls.map(url => (url.includes(`http://`) ? url.replace(`http://`, `https://`) : url))
            renderCard(
                new Card().suggestion(
                    `The following url of a <code>sitemap.xml</code> was listed in your <code>robots.txt</code>. Sitemap.xml files should be always listed 
                    using the <code>https</code> protocol instead of the <code>http</code> protocol.
                    <ul>
                    ${unsafeUrls.map(url => `<li>${url}</li>`)}
                    </ul>
                    It's important you update ASAP your <code>robots.txt</code> and <code>sitemap.xml</code> adopting the <code>http</code> protocol.`
                )
            )
        }

        getSiteMapCards(sitemapUrls).forEach(async cardPromise => renderCard(await cardPromise))
    })
}

export const actions: sectionActions = {
    codeInjector: codeInjector,
    reportGenerator: reportGenerator,
}
