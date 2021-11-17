// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card} from '../card'
import {codeBlock} from '../codeBlock'
import {Mode} from '../colorCode'
import {specs} from '../cards/specs'
import {tipWhat, tipWhy, tipHow} from './tips'

// ----------------------------------------------------------------------------
// Robots TXT TIPS
export const duplicateSitemapsLink = (card: Card, urls: string[]) => {
    urls = [...new Set(urls)]
    const what = tipWhat(`The <code>robots.txt</code> file links multiple times the same sitemap's url.`)
    const why = tipWhy(
        `Sitemaps files should always be linked from the <code>robots.txt</code> file, but only once.`,
        `Multiple links can confuse the search-engine crawlers and can waste your crawling budget on the same pages.`
    )
    const how = tipHow(
        `Update <code>robots.txt</code> making sure each <code>sitemap.xml</code> file is mentioned only one time.`,
        `This is a list of the duplicate Urls:`,
        codeBlock(urls.join('<br>'), Mode.txt)
    )
    card.addTip(`Remove Duplicate <code>Sitemap.xml</code> Links`, [what, why, how], specs.robotsTxt.reference, 25)
}

export const unsafeSitemapLink = (card: Card, urls: string[]) => {
    const what = tipWhat(
        `The <code>robots.txt</code> file refers a sitemap url using the unsafe and obsolete <code>http:</code> protocol instead of the safest and recommended <code>https:</code> protocol.`
    )
    const why = tipWhy(
        `It's important to correct and update the sitemap links in the  <code>robots.txt</code> by switching to the <code>https:</code> protocol.`,
        `Using the right protocol will ensure that Google crawler as well other search-engine crawler will not skip your <code>sitemap.xml</code> file.`,
        `Sitemap files must be always linked using the safe <code>https</code> protocol.`
    )
    const how = tipHow(
        `Update <code>robots.txt</code> replacing in all links <code>http:</code> with <code>https:</code> protocol.`,
        `This is a list of the unsafe Urls:`,
        codeBlock(urls.join('<br>'), Mode.txt),
        `And this how it should be:`,
        codeBlock(urls.map(url => url.replace('http:', 'https:')).join('<br>'), Mode.txt)
    )
    card.addTip(`Update The Unsafe <code>Sitemap.xml</code> Link`, [what, why, how], specs.robotsTxt.reference, 35)
}

export const addSitemapLink = (card: Card, domain: string) => {
    const what = tipWhat(`The <code>robots.txt</code> doesn't list any <code>sitemap.xml</code> file.`)
    const why = tipWhy(
        `Linking a Sitemap from <code>robots.txt</code> is a way to ensure Google bot doesn't miss it. It's an optional directive, but strongly recommended.`,
        `While Google crawler can leverage the information provided in the GSC (Google Search Console), other search-engines will greatly benefit from finding a list of sitemaps in the <code>robots.txt</code> file.`
    )
    const how = tipHow(
        `If you have a Sitemap-Index file, you can include the location of just that file, and you don't need to list each individual Sitemap listed in the index file.`,
        `Add the link to your <code>sitemap.xml</code> to the <code>robots.txt</code> file with a line similar to the following:`,
        codeBlock(`Sitemap: ${domain}/sitemap.xml`, Mode.txt),
        `This directive is independent of the user-agent line, so it doesn't matter where you place it in your file.`
    )
    card.addTip(
        `Link Your <code>Sitemap.xml</code> From <code>Robots.txt</code>`,
        [what, why, how],
        specs.robotsTxt.reference,
        50
    )
}

export const malformedRobotsTxt = (card: Card) => {
    const what = tipWhat(
        `The syntax of the <code>robots.txt</code> file doesn't seems to be aligned with the expected syntax.`
    )
    const why = tipWhy(
        `The <code>robots.txt</code> file, when present, is extensively used by all Search Engines bots a it's a very important factor in SEO ranking of the site.`,
        `But, it's important for the <code>robots.txt</code> file to be consistent with the standard syntax.`
    )
    const how = tipHow(`Double check the syntax of the <code>robots.txt</code> and update it ASAP.`)
    card.addTip(`Fix Your <code>Robots.txt</code> File Syntax`, [what, why, how], specs.robotsTxt.reference, 75)
}

export const emptyRobotsTxt = (card: Card) => {
    const what = tipWhat(`A <code>robots.txt</code> file was detected, but it's empty with no content.`)
    const why = tipWhy(
        `It's critical to add the missing content to the <code>robots.txt</code> file.`,
        `Complete <code>robots.txt</code> are a very important factor in SEO ranking.`,
        `Unless this is a trivial website, there are pages that should not be indexed and therefore should be listed in the <code>robots.txt</code> with the directive <code>Disallow:</code>.`
    )
    const how = tipHow(
        `Add a few lines to the empty <code>robots.txt</code> blocking the pages you don't want to be indexed by the search-engines crawlers.`,
        `Typical examples of pages you don't want to be indexed are login pages, account pages, cart pages, order confirmation pages.`,
        `Also any temporary page you might have in your website should be disallowed in the <code>robots.txt</code> file.`
    )
    card.addTip(`Add Content to <code>Robots.txt</code>`, [what, why, how], specs.robotsTxt.reference, 40)
}

export const missingRobotsTxt = (card: Card) => {
    const what = tipWhat(`No <code>robots.txt</code> file was detected on this website.`)
    const why = tipWhy(
        `It's critical to add a <code>robots.txt</code> file to this website.`,
        `<code>robots.txt</code> are a very important factor in SEO ranking.`,
        `They provide a list of pages the crawlers are allowed to index, and a lis of pages to avoid (like temporary, login, and cart pages)`
    )
    const how = tipHow(
        `Add a simple <code>robots.txt</code> file.`,
        `To begin, you can write as a simple text file and upload it to your website.`,
        `Many website platform provide tools or option to automatically create a <code>robots.txt</code> file for you.`
    )
    card.addTip(`Add a <code>Robots.txt</code> file`, [what, why, how], specs.robotsTxt.reference, 80)
}

export const sitemapLinkWithRelativePath = (card: Card, relUrl: string, absUrl: string) => {
    const what = tipWhat(
        `The <code>robots.txt</code> file lists <code>sitemap.xml</code> url with a relative path.`,
        `This is the incorrect line:`,
        codeBlock(`Sitemap: ${relUrl}`, Mode.txt)
    )
    const why = tipWhy(
        `All links to a sitemap from the <code>robots.txt</code> must be absolute!`,
        `Linking your <code>sitemap.xml</code> from <code>robots.txt</code> makes the sitemap discoverable for all search-engines.`,
        `If the link is relative, search engines, like Google, will not be able to access the information in your sitemap.`
    )
    const how = tipHow(
        `Update the link to your <code>sitemap.xml</code> from the <code>robots.txt</code> with an absolute path. Absolute paths starts with <code>https:</code>.`,
        `The correct line with the link should look like this:`,
        codeBlock(`Sitemap: ${absUrl}`, Mode.txt)
    )
    card.addTip(
        `Change links in your <code>Robots.txt</code> file to absolute`,
        [what, why, how],
        specs.robotsTxt.reference,
        60
    )
}

export const sitemapLinkedNotFound = (card: Card, url: string) => {
    const what = tipWhat(
        `The <code>robots.txt</code> file lists <code>sitemap.xml</code> url pointing to a file that doesn't exist.`,
        `This is the broken link:`,
        codeBlock(url, Mode.txt)
    )
    const why = tipWhy(
        `Linking your <code>sitemap.xml</code> from <code>robots.txt</code> makes the sitemap discoverable for all search-engines.`,
        `If the link is broken or wrong, search engines, like Google, will not be able to access the information in your sitemap.`
    )
    const how = tipHow(
        `Move your sitemap to the location specified in the <code>robots.txt</code> or, keep the sitemap where it is and update the link.`
    )
    card.addTip(
        `Update the Broken Link in Your <code>Robots.txt</code> File`,
        [what, why, how],
        specs.robotsTxt.reference,
        50
    )
}
