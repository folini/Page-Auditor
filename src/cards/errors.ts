// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card, CardKind} from '../card'
import {Mode} from '../colorCode'
import {codeBlock} from '../codeBlock'
import {SmSource, iSmCandidate} from '../sitemapList'

export class Errors {
    // ------------------------------------------------------------------------
    // Google Chrome Errors
    public static chrome_UnableToAnalyzeTabs() {
        const msg1 = `<i>Page Auditor</i> can not run on empty tabs or Chrome internal tabs.`
        const msg2 = `Please launch <i>Page Auditor for Technical SEO</i> on a regular web page.`
        return new Card(CardKind.error)
            .setLogo('icon-chromium')
            .addParagraph(msg1)
            .addParagraph(msg2)
            .setTitle('Unable To Analyze Chrome Tabs')
            .tag('card-error')
    }

    public static chrome_TabUrlUndefined() {
        const msg1 = `The current Chrome tab is undefined.`
        const msg2 = `Please re-launch <b>Page Auditor for Technical SEO</b> on a regular web page.`
        return new Card(CardKind.error)
            .setLogo('icon-chromium')
            .addParagraph(msg1)
            .addParagraph(msg2)
            .setTitle('Chrome Tab Undefined')
            .tag('card-error')
    }

    public static chrome_UnableToAnalyzePage(url: string) {
        const msg1 = `<b>Page Auditor</b> can not run on page at the url:`
        const msg2 = `Please launch <b>Page Auditor for Technical SEO</b> on a regular web page.`
        return new Card(CardKind.error)
            .setLogo('icon-chromium')
            .addParagraph(msg1)
            .addCodeBlock(url, Mode.txt)
            .addParagraph(msg2)
            .setTitle('Unable To Analyze Page')
            .tag('card-error')
    }

    // ------------------------------------------------------------------------
    // Sitemap Errors
    public static sitemap_IsARedirect(sm: iSmCandidate, code: string) {
        const preMsg =
            sm.source === SmSource.Default
                ? `While checking for a sitemap at the default location and with the default name`
                : sm.source === SmSource.RobotsTxt
                ? `While checking for a sitemap listed in your <code>robots.txt</code> file`
                : `While checking for a sitemap listed in a sitemap-index in your website`
        const msg1 = `${preMsg} we found a syntactically invalid <code>Sitemap.xml</code> file. The url is:`
        const msg2 = `It's an HTML page, likely a standard redirect for non-existent pages.`
        const btnLabel = `Invalid Sitemap.xml`
        return new Card(CardKind.error)
            .setLogo('icon-sitemap')
            .addParagraph(msg1)
            .addCodeBlock(sm.url, Mode.txt)
            .addParagraph(msg2)
            .addExpandableBlock(btnLabel, codeBlock(code, Mode.html))
            .setTitle('Invalid Sitemap.xml Syntax')
            .tag('card-error')
    }

    public static sitemap_404(sm: iSmCandidate) {
        const msg1 = `No <code>Sitemap.xml</code> file was detected at location:`
        const msg2 = `Server returns 404 error code.`
        return new Card(CardKind.error)
            .setLogo('icon-sitemap')
            .addParagraph(msg1)
            .addCodeBlock(sm.url, Mode.txt)
            .addParagraph(msg2)
            .setTitle('Sitemap.xml Not Found, Code 404')
            .tag('card-error')
    }

    public static sitemap_NotFound(sms: iSmCandidate[]) {
        const plural = sms.length > 1 ? 's' : ''
        const msg1 = `No <code>Sitemap.xml</code> file${plural} detected at at location${plural}:`
        const msg2 = `File${plural} not found.`
        return new Card(CardKind.error)
            .setLogo('icon-sitemap')
            .addParagraph(msg1)
            .addCodeBlock(sms.map(sm => sm.url).join('<br/>'), Mode.txt)
            .addParagraph(msg2)
            .setTitle('Sitemap.xml Not Found')
            .tag('card-error')
    }

    // ------------------------------------------------------------------------
    // Robots.txt Errors
    public static robotsTxt_IsARedirect(url: string, code: string) {
        const msg1 = `Found a syntactically invalid <code>Robots.Txt</code> file at the url:`
        const msg2 = `It's an HTML page, likely a standard redirect for non-existent pages.`
        const btnLabel = `Invalid Robots.Txt`
        return new Card(CardKind.error)
            .setLogo('icon-rep')
            .addParagraph(msg1)
            .addCodeBlock(url, Mode.txt)
            .addParagraph(msg2)
            .addExpandableBlock(btnLabel, codeBlock(code, Mode.html))
            .setTitle('Invalid Robots.Txt Syntax')
            .tag('card-error')
    }

    public static robotsTxt_IsEmpty(url: string) {
        const msg1 = `<code>Robots.Txt</code> file at location <a target="_new" href="${url}">${url}</a> is empty.`
        const msg2 = `<code>Robots.Txt</code> should contain at least a directive or a comment.`
        return new Card(CardKind.error)
            .setLogo('icon-rep')
            .addParagraph(msg1)
            .addParagraph(msg2)
            .setTitle('Robots.Txt Is Empty')
            .tag('card-error')
    }

    public static robotsTxt_OnlyComments(url: string, code: string) {
        const msg1 = `<code>Robots.Txt</code> file at location <a target="_new" href="${url}">${url}</a> only contains comments, no robots directives.`
        const msg2 = `<code>Robots.Txt</code> should contain at least a directive or a comment.`
        const btnLabel = `Robots.Txt`
        return new Card(CardKind.error)
            .setLogo('icon-rep')
            .addParagraph(msg1)
            .addParagraph(msg2)
            .addExpandableBlock(btnLabel, codeBlock(code, Mode.html))
            .setTitle('Robots.Txt Contains Only Comments')
            .tag('card-error')
    }

    public static robotsTxt_NotFound(url: string) {
        const msg1 = `<code>Robots.Txt</code> file at location <a target="_new" href="${url}">${url}</a> not found.`
        return new Card(CardKind.error)
            .setLogo('icon-rep')
            .addParagraph(msg1)
            .setTitle('Robots.Txt Not Found')
            .tag('card-error')
    }

    // ------------------------------------------------------------------------
    // Script Errors
    public static script_NotFound() {
        const msg1 = `No JavaScript code script found.`
        return new Card(CardKind.error)
            .setLogo('icon-js')
            .addParagraph(msg1)
            .setTitle('No Script Found')
            .tag('card-error')
    }

    // ------------------------------------------------------------------------
    // Meta Tags Errors
    public static metaTags_NotFound() {
        const msg1 = `No Meta Tags found on page.`
        return new Card(CardKind.error)
            .setLogo('icon-tag')
            .addParagraph(msg1)
            .setTitle('Page Has No Meta Tags')
            .tag('card-error')
    }

    public static metaTags_noOpenGraphTags() {
        const msg1 = `The page is missing Meta Tags for Facebook (Open Graph).`
        return new Card(CardKind.error)
            .setLogo('icon-open-graph')
            .addParagraph(msg1)
            .setTitle('Page Has No Open Graph Meta Tags')
            .tag('card-error')
    }

    public static metaTags_noTwitterTags() {
        const msg1 = `The page is missing Meta Tags for Twitter.`
        return new Card(CardKind.error)
            .setLogo('icon-twitter')
            .addParagraph(msg1)
            .setTitle('Page Has No Twitter Meta Tags')
            .tag('card-error')
    }

    // ------------------------------------------------------------------------
    // Structured Data Errors
    public static sd_NotFound(url: string) {
        const msg1 = `No <i>Structured Data</i> was found at location:`
        return new Card(CardKind.error)
            .setLogo('icon-micro-formats')
            .addParagraph(msg1)
            .addCodeBlock(url, Mode.txt)
            .setTitle('Page Has No Structured Data')
            .tag('card-error')
    }

    public static sd_IsEmpty(url: string) {
        const msg1 = `The <i>Structured Data</i> snippet found at following location appears to be empty:`
        return new Card(CardKind.error)
            .setLogo('icon-micro-formats')
            .addParagraph(msg1)
            .addCodeBlock(url, Mode.txt)
            .setTitle('Structured Data Is Present But Empty')
            .tag('card-error')
    }

    public static sd_InvalidJSON(json: string) {
        const msg1 = `A Structured data JSON script contains the following invalid JSON code.`
        return new Card(CardKind.error)
            .setLogo('icon-micro-formats')
            .addParagraph(msg1)
            .addExpandableBlock('Invalid JSON Code', codeBlock(json, Mode.txt))
            .setTitle('Invalid LD-JSON Code')
            .tag('card-error')
    }

    // ------------------------------------------------------------------------
    // Internal Errors (they should't happen)
    public static internal_NoMetaTagsInThisCategory(categoryName: string) {
        const msg1 = `The list of Meta tags for category '${categoryName}' is empty.`
        const msg2 = `This is an internal error.`
        return new Card(CardKind.error)
            .setLogo('icon-error')
            .addParagraph(msg1)
            .addParagraph(msg2)
            .setTitle('Internal Error')
            .tag('card-error')
    }

    public static internal_fromError(err: Error, optMsg: string = '') {
        const msg1 = `Unexpected Error.`
        const msg2 = typeof err === 'undefined' ? `Error Name: no name` : `Error Name: ${err.name ?? 'no name'}.`
        const msg3 =
            typeof err === 'undefined' ? `Error Message: no message` : `Error Message: ${err.message ?? 'no message'}.`
        const msg4 = typeof err === 'undefined' ? `Error Stack: no stack` : `Error Stack: ${err.stack ?? 'no stack'}.`
        const msg5 = optMsg !== '' ? `<div>${optMsg}</div>` : ''
        return new Card(CardKind.error)
            .setLogo('icon-error')
            .addParagraph(msg1)
            .addParagraph(msg2)
            .addParagraph(msg3)
            .addParagraph(msg4)
            .addParagraph(msg5)
            .setTitle('Generic Error')
            .tag('card-error')
    }
}
