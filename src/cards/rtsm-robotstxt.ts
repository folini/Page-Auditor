// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import * as Tips from '../tips/tips'
import * as File from '../file'
import {Report} from '../report'
import {Card, CardKind} from '../card'
import {codeBlock} from '../codeBlock'
import {Errors} from './errors'
import {Mode} from '../colorCode'
import {disposableId, formatNumber} from '../main'

export const processRobotsTxt = (robotsTxtBody: string, url: string, report: Report) => {
    if (robotsTxtBody.match(/page not found/gim) !== null || robotsTxtBody.match(/error 404/gim) !== null) {
        const card = Errors.robotsTxt_NotFound(url)
        report.addCard(card)
        Tips.RobotsTxt.missingRobotsTxt(card)
        return
    }

    if (robotsTxtBody.includes(`<head>`) || robotsTxtBody.includes(`<meta`)) {
        const card = Errors.robotsTxt_IsARedirect(url, robotsTxtBody)
        report.addCard(card)
        Tips.RobotsTxt.missingRobotsTxt(card)
        return
    }

    if (robotsTxtBody.replace(/[\s\n]/g, '').length === 0) {
        const card = Errors.robotsTxt_IsEmpty(url)
        report.addCard(card)
        Tips.RobotsTxt.emptyRobotsTxt(card)
        return
    }

    if (extractDirectives(robotsTxtBody).length === 0) {
        const card = Errors.robotsTxt_OnlyComments(url, robotsTxtBody)
        report.addCard(card)
        Tips.RobotsTxt.emptyRobotsTxt(card)
        return
    }

    const card = robotsTxtCard(url, robotsTxtBody)
    report.addCard(card)
}

const robotsTxtCard = (url: string, robotsTxtBody: string): Card => {
    const divId = disposableId()
    const btnLabel = `Robots.Txt`
    const robotsTxtDescription =
        `A <code>robots.txt</code> file tells search engine crawlers which URLs the crawler can access on your site. ` +
        `This is used mainly to avoid overloading your site with requests. ` +
        `It is not a mechanism for keeping a web page out of Google.`

    const directives = robotsTxtBody
        .split('\n')
        .filter(line => line.trim().length > 0)
        .filter(line => !line.startsWith('#'))

    let userAgent = robotsTxtBody.match(/^User-agent:\s+(.*)$/gim) ?? []
    userAgent = userAgent.map(ua => ua.replace(/^User-agent:\s+/gi, '')).sort()
    userAgent = [...new Set(userAgent)]

    let linksToSitemap = robotsTxtBody.match(/^Sitemap:\s+(.*)$/gim) ?? []
    linksToSitemap = linksToSitemap.map(sm => sm.replace(/^Sitemap:\s+/gi, '').trim()).sort()

    let allowDirectives = directives.filter(line => line.startsWith('Allow:'))
    let disallowDirectives = directives.filter(line => line.startsWith('Disallow:'))
    let crawlDelayDirectives = directives.filter(line => line.startsWith('Crawl-delay:'))
    let hostDirectives = directives.filter(line => line.startsWith('Host:'))

    const validationLink = `https://en.ryte.com/free-tools/robots-txt/?refresh=1&useragent=Googlebot&submit=Evaluate&url=${encodeURI(
        url
    )}`
    const table = [
        [
            `Validate robots.txt`,
            `<a class='small-btn' href='${validationLink}' target='_blank'>Validate Robots.txt</a>`,
        ],
        ['File Name', 'robots.txt'],
        ['File Size', formatNumber(robotsTxtBody.length) + ' bytes'],
    ]
    const directiveDescriptions: string[] = []
    if (userAgent.length > 0) {
        directiveDescriptions.push(formatNumber(userAgent.length) + ' "User-agent" statements')
    }
    if (linksToSitemap.length > 0) {
        directiveDescriptions.push(formatNumber(linksToSitemap.length) + ' "Sitemap" statements')
    }
    if (allowDirectives.length > 0) {
        directiveDescriptions.push(formatNumber(allowDirectives.length) + ' "Allow" statements')
    }
    if (disallowDirectives.length > 0) {
        directiveDescriptions.push(formatNumber(disallowDirectives.length) + ' "Disallow" statements')
    }
    if (crawlDelayDirectives.length > 0) {
        directiveDescriptions.push(formatNumber(crawlDelayDirectives.length) + ' "Crawl-delay" statements')
    }
    if (hostDirectives.length > 0) {
        directiveDescriptions.push(formatNumber(hostDirectives.length) + ' "Host" statements')
    }

    table.push(['Robot Directives', directiveDescriptions.join('<br>')])
    if (userAgent.length > 0) {
        table.push([`User Agent${userAgent.length > 1 ? 's' : ''} List`, userAgent.join('<br>')])
    }
    if (linksToSitemap.length > 0) {
        table.push([
            `Sitemap${linksToSitemap.length > 1 ? 's' : ''} List`,
            linksToSitemap.map(sm => `<a href='${sm}' target='_new'>${sm}</a>`).join('<br>'),
        ])
    }

    const card = new Card(CardKind.report)
        .open('Detected Robot.Txt', `Robots.txt file`, 'icon-rep')
        .addParagraph(`Found a <code>Robots.txt</code> file at the url:`)
        .addCodeBlock(url, Mode.txt)
        .addParagraph(robotsTxtDescription)
        .addHtmlElement(Card.tableBlock('Robots.txt Analysis', table))
        .addExpandableBlock(btnLabel, codeBlock(robotsTxtBody, Mode.txt, divId))
        .tag(`card-ok`)

    if (linksToSitemap.length === 0) {
        Tips.RobotsTxt.addSitemapLink(card, new URL(url).origin)
    }

    const unsafeUrls = linksToSitemap.filter(url => url.includes(`http://`))
    if (unsafeUrls.length > 0) {
        Tips.RobotsTxt.unsafeSitemapLink(card as Card, unsafeUrls)
    }

    linksToSitemap = linksToSitemap.map(url => url.replace('http://', 'https://'))
    const duplicateUrls = linksToSitemap.filter(uUrl => linksToSitemap.filter(url => url === uUrl).length > 1)
    if (duplicateUrls.length > 0) {
        Tips.RobotsTxt.duplicateSitemapsLink(card, duplicateUrls)
    }

    const doubleDashUrls = linksToSitemap.filter(url => url.match(/[^:]\/\//))
    if (doubleDashUrls.length > 0) {
        Tips.RobotsTxt.doubleDashSitemapLink(card as Card, doubleDashUrls)
    }

    linksToSitemap = linksToSitemap.map(sm => {
        if (sm.startsWith('/')) {
            Tips.RobotsTxt.sitemapLinkWithRelativePath(card, sm, new URL(url).origin + sm)
            return new URL(url).origin + sm
        }
        return sm
    })
    ;[...new Set(linksToSitemap)].forEach(url =>
        File.exists(url, File.xmlContentType).catch(() => {
            Tips.RobotsTxt.sitemapLinkedNotFound(card, url)
        })
    )

    return card
}

const extractDirectives = (robotsTxtBody: string) =>
    robotsTxtBody.split('\n').filter(line => !line.startsWith('#') && line.trim().length > 0)
