// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card} from '../card'
import {Mode} from '../colorCode'
import {Specs} from '../specs'
import * as Tips from './tips'
import * as CardBlocks from '../card-blocks'

// ----------------------------------------------------------------------------
// Robots TXT TIPS
export const duplicateSitemapsLink = (card: Card, urls: string[]) => {
    urls = [...new Set(urls)]
    const what = Tips.what(`The <code>robots.txt</code> file links multiple times the same sitemap's url.`)
    const table = CardBlocks.table(
        `List of the duplicate Urls`,
        urls.map(url => [url]),
        'list-style'
    )
    const why = Tips.why(
        `Sitemaps files should always be linked from the <code>robots.txt</code> file, but only once.`,
        `Multiple links can confuse the search-engine crawlers and can waste your crawling budget on the same pages.`
    )
    const how = Tips.how(
        `Update <code>robots.txt</code> making sure each <code>sitemap.xml</code> file is mentioned only one time.`
    )
    card.add(
        CardBlocks.tip(
            `Remove Duplicate <code>Sitemap.xml</code> Links`,
            [what, table, why, how],
            Specs.robotsTxt.reference,
            25
        )
    )
}

export const unsafeSitemapLink = (card: Card, urls: string[]) => {
    const what = Tips.what(
        `The <code>robots.txt</code> file refers a sitemap url using the unsafe and obsolete <code>http:</code> protocol instead of the safest and recommended <code>https:</code> protocol.`
    )
    const why = Tips.why(
        `It's important to correct and update the sitemap links in the  <code>robots.txt</code> by switching to the <code>https:</code> protocol.`,
        `Using the right protocol will ensure that Google crawler as well other search-engine crawler will not skip your <code>sitemap.xml</code> file.`,
        `Sitemap files must be always linked using the safe <code>https</code> protocol.`
    )
    const how = Tips.how(
        `Update <code>robots.txt</code> replacing in all links <code>http:</code> with <code>https:</code> protocol.`
    )
    const tableWrongUrls = CardBlocks.table(
        `List of Unsafe Urls`,
        urls.map(url => [url]),
        'list-style'
    )
    const tableFixedUrls = CardBlocks.table(
        `Lis of How Urls Should Be`,
        urls.map(url => url.replace('http:', 'https:')).map(url => [url]),
        'list-style'
    )
    card.add(
        CardBlocks.tip(
            `Update The Unsafe <code>Sitemap.xml</code> Link`,
            [what, why, how, tableWrongUrls, tableFixedUrls],
            Specs.robotsTxt.reference,
            35
        )
    )
}

export const doubleDashSitemapLink = (card: Card, urls: string[]) => {
    const plural = urls.length > 1 ? 's' : ''
    const what = Tips.what(
        `The <code>robots.txt</code> file links to ${urls.length} sitemap url${plural} using a pathname with double dashes <code>//</code>.`
    )
    const why = Tips.why(
        `It's important to correct and update the sitemap links in the  <code>robots.txt</code> by removing the unnecessary <code>/</code> from the url.`,
        `Using syntactically correct will ensure that Google crawler as well other search-engine crawler will not skip your <code>sitemap.xml</code> file.`
    )
    const how = Tips.how(
        `Update <code>robots.txt</code> replacing in all links <code>http:</code> with <code>https:</code> protocol.`
    )
    const tableWrongUrls = CardBlocks.table(
        `List of ${urls.length} Url${plural} To Fix`,
        urls.map(url => [url]),
        'list-style'
    )
    const tableFixedUrls = CardBlocks.table(
        `How Your Url${plural} Should Be Changed`,
        urls.map(url => url.replace(/(https?:.*)(\/\/)(.*)/i, '$1/$3')).map(url => [url]),
        'list-style'
    )
    card.add(
        CardBlocks.tip(
            `Update The Syntactically Incorrect <code>Sitemap.xml</code> Links`,
            [what, why, how, tableWrongUrls, tableFixedUrls],
            Specs.robotsTxt.reference,
            35
        )
    )
}

export const addSitemapLink = (card: Card, domain: string) => {
    const what = Tips.what(`The <code>robots.txt</code> doesn't list any <code>sitemap.xml</code> file.`)
    const why = Tips.why(
        `Linking a Sitemap from <code>robots.txt</code> is a way to ensure Google bot doesn't miss it. It's an optional directive, but strongly recommended.`,
        `While Google crawler can leverage the information provided in the GSC (Google Search Console), other search-engines will greatly benefit from finding a list of sitemaps in the <code>robots.txt</code> file.`
    )
    const how = Tips.how(
        `If you have a Sitemap-Index file, you can include the location of just that file, and you don't need to list each individual Sitemap listed in the index file.`,
        `Add the link to your <code>sitemap.xml</code> to the <code>robots.txt</code> file with a line similar to the following:`,
        CardBlocks.code(`Sitemap: ${domain}/sitemap.xml`, Mode.txt),
        `This directive is independent of the user-agent line, so it doesn't matter where you place it in your file.`
    )
    card.add(
        CardBlocks.tip(
            `Link Your <code>Sitemap.xml</code> From <code>Robots.txt</code>`,
            [what, why, how],
            Specs.robotsTxt.reference,
            50
        )
    )
}
export const emptyRobotsTxt = (card: Card) => {
    const what = Tips.what(`A <code>robots.txt</code> file was detected, but it's empty with no content.`)
    const why = Tips.why(
        `It's critical to add the missing content to the <code>robots.txt</code> file.`,
        `Complete <code>robots.txt</code> are a very important factor in SEO ranking.`,
        `Unless this is a trivial website, there are pages that should not be indexed and therefore should be listed in the <code>robots.txt</code> with the directive <code>Disallow:</code>.`
    )
    const how = Tips.how(
        `Add a few lines to the empty <code>robots.txt</code> blocking the pages you don't want to be indexed by the search-engines crawlers.`,
        `Typical examples of pages you don't want to be indexed are login pages, account pages, cart pages, order confirmation pages.`,
        `Also any temporary page you might have in your website should be disallowed in the <code>robots.txt</code> file.`
    )
    card.add(
        CardBlocks.tip(
            `Add Content to the Empty <code>Robots.txt</code>`,
            [what, why, how],
            Specs.robotsTxt.reference,
            40
        )
    )
}

export const missingRobotsTxt = (card: Card) => {
    const what = Tips.what(`No <code>robots.txt</code> file was detected on this website.`)
    const why = Tips.why(
        `It's critical to add a <code>robots.txt</code> file to this website.`,
        `<code>robots.txt</code> are a very important factor in SEO ranking.`,
        `They provide a list of pages the crawlers are allowed to index, and a lis of pages to avoid (like temporary, login, and cart pages)`
    )
    const how = Tips.how(
        `Add a simple <code>robots.txt</code> file.`,
        `To begin, you can write as a simple text file and upload it to your website.`,
        `Many website platform provide tools or option to automatically create a <code>robots.txt</code> file for you.`
    )
    card.add(CardBlocks.tip(`Add a <code>Robots.txt</code> file`, [what, why, how], Specs.robotsTxt.reference, 80))
}

export const sitemapLinkWithRelativePath = (card: Card, relUrl: string, absUrl: string) => {
    const what = Tips.what(
        `The <code>robots.txt</code> file lists <code>sitemap.xml</code> url with a relative path.`,
        `This is the incorrect line:`,
        CardBlocks.code(`Sitemap: ${relUrl}`, Mode.txt)
    )
    const why = Tips.why(
        `All links to a sitemap from the <code>robots.txt</code> must be absolute!`,
        `Linking your <code>sitemap.xml</code> from <code>robots.txt</code> makes the sitemap discoverable for all search-engines.`,
        `If the link is relative, search engines, like Google, will not be able to access the information in your sitemap.`
    )
    const how = Tips.how(
        `Update the link to your <code>sitemap.xml</code> from the <code>robots.txt</code> with an absolute path. Absolute paths starts with <code>https:</code>.`,
        `The correct line with the link should look like this:`,
        CardBlocks.code(`Sitemap: ${absUrl}`, Mode.txt)
    )
    card.add(
        CardBlocks.tip(
            `Change links in your <code>Robots.txt</code> file to absolute`,
            [what, why, how],
            Specs.robotsTxt.reference,
            60
        )
    )
}

export const sitemapLinkedNotFound = (card: Card, url: string) => {
    const what = Tips.what(
        `The <code>robots.txt</code> file lists <code>sitemap.xml</code> url pointing to a file that doesn't exist.`,
        `This is the broken link:`,
        CardBlocks.code(url, Mode.txt)
    )
    const why = Tips.why(
        `Linking your <code>sitemap.xml</code> from <code>robots.txt</code> makes the sitemap discoverable for all search-engines.`,
        `If the link is broken or wrong, search engines, like Google, will not be able to access the information in your sitemap.`
    )
    const how = Tips.how(
        `Move your sitemap to the location specified in the <code>robots.txt</code> or, keep the sitemap where it is and update the link.`
    )
    card.add(
        CardBlocks.tip(
            `Update the Broken Link in Your <code>Robots.txt</code> File`,
            [what, why, how],
            Specs.robotsTxt.reference,
            50
        )
    )
}
