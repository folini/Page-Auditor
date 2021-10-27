// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card} from '../card'
import {Mode} from '../colorCode'
import {codeBlock} from '../codeBlock'

export class Errors {
    // ------------------------------------------------------------------------
    // Google Chrome Errors
    public static chrome_UnableToAnalyzeTab() {
        const msg1 = `<i>Page Auditor</i> can not run on empty tabs or Chrome internal tabs.`
        const msg2 = `Please launch <i>Page Auditor for Technical SEO</i> on a regular web page.`
        return new Card().error().addParagraph(msg1).addParagraph(msg2).setTitle('Unable To Analyze Chrome Tab')
    }

    public static chrome_TabUrlUndefined() {
        const msg1 = `The current Chrome tab is undefined.`
        const msg2 = `Please re-launch <b>Page Auditor for Technical SEO</b> on a regular web page.`
        return new Card().error().addParagraph(msg1).addParagraph(msg2).setTitle('Chrome Tab Undefined')
    }

    public static chrome_UnableToAnalyzePage(url: string) {
        const msg1 = `<b>Page Auditor</b> can not run on page at the url:`
        const msg2 = `Please launch <b>Page Auditor for Technical SEO</b> on a regular web page.`
        return new Card()
            .error()
            .addParagraph(msg1)
            .addCodeBlock(url, Mode.txt)
            .addParagraph(msg2)
            .setTitle('Unable To Analyze Page')
    }

    // ------------------------------------------------------------------------
    // Sitemap Errors
    public static sitemap_IsHTMLFormat(url: string, code: string) {
        const msg1 = `Found a syntactically invalid <code>Sitemap.xml</code> file at the url:`
        const msg2 = `It's an HTML page or a redirect to an HTML page.`
        const btnLabel = `Invalid Sitemap`
        return new Card()
            .error()
            .addParagraph(msg1)
            .addCodeBlock(url, Mode.txt)
            .addParagraph(msg2)
            .addExpandableBlock(btnLabel, codeBlock(code, Mode.html))
            .setTitle('Invalid Sitemap.xml Syntax')
    }

    public static sitemap_404(url: string) {
        const msg1 = `No <code>Sitemap.xml</code> file at location`
        const msg2 = `Server returns 404 error code.`
        return new Card()
            .error()
            .addParagraph(msg1)
            .addCodeBlock(url, Mode.txt)
            .addParagraph(msg2)
            .setTitle('Sitemap.xml Not Found')
    }

    public static sitemap_NotFound(urls: string[]) {
        const msg1 = `No <code>Sitemap.xml</code> file at location:`
        const msg2 = `File not found.`
        return new Card()
            .error()
            .addParagraph(msg1)
            .addCodeBlock(urls.join('<br/>'), Mode.txt)
            .addParagraph(msg2)
            .setTitle('Sitemap.xml Not Found')
    }

    // ------------------------------------------------------------------------
    // Robots.txt Errors
    public static robotsTxt_HTMLFormat(url: string, code: string) {
        const msg1 = `Found a syntactically invalid <code>Robots.Txt</code> file at the url:`
        const msg2 = `It's an HTML page or a redirect to an HTML page.`
        const btnLabel = `Robots.Txt`
        return new Card()
            .error()
            .addParagraph(msg1)
            .addCodeBlock(url, Mode.txt)
            .addParagraph(msg2)
            .addExpandableBlock(btnLabel, codeBlock(code, Mode.html))
            .setTitle('Invalid Robots.Txt Syntax')
    }

    public static robotsTxt_IsEmpty(url: string) {
        const msg1 = `<code>Robots.Txt</code> file at location <a target="_new" href="${url}">${url}</a> is empty.`
        const msg2 = `<code>Robots.Txt</code> should contain at least a directive or a comment.`
        return new Card().error().addParagraph(msg1).addParagraph(msg2).setTitle('Robots.Txt Is Empty')
    }

    public static robotsTxt_OnlyComments(url: string, code: string) {
        const msg1 = `<code>Robots.Txt</code> file at location <a target="_new" href="${url}">${url}</a> only contains comments, no robots directives.`
        const msg2 = `<code>Robots.Txt</code> should contain at least a directive or a comment.`
        const btnLabel = `Robots.Txt`
        return new Card()
            .error()
            .addParagraph(msg1)
            .addParagraph(msg2)
            .addExpandableBlock(btnLabel, codeBlock(code, Mode.html))
            .setTitle('Robots.Txt Contains Only Comments')
    }

    public static robotsTxt_NotFound(url: string) {
        const msg1 = `<code>Robots.Txt</code> file at location <a target="_new" href="${url}">${url}</a> not found.`
        return new Card().error().addParagraph(msg1).setTitle('Robots.Txt Not Found')
    }

    // ------------------------------------------------------------------------
    // Script Errors
    public static script_NotFound() {
        const msg1 = `No JavaScript code script found.`
        return new Card().error().addParagraph(msg1).setTitle('No Script Found')
    }

    // ------------------------------------------------------------------------
    // Meta Tags Errors
    public static metaTags_NotFound() {
        const msg1 = `No Meta Tags found on page.`
        return new Card().error().addParagraph(msg1).setTitle('Missing Meta Tags')
    }

    // ------------------------------------------------------------------------
    // Structured Data Errors
    public static structuredData_NotFound(url: string) {
        const msg1 = `No <i>Structured Data</i> was found at location:`
        return new Card().error().addParagraph(msg1).addCodeBlock(url, Mode.txt).setTitle('Missing Structured Data')
    }

    public static structuredData_InvalidJSON(json: string) {
        const msg1 = `A Structured data JSON script contains the following invalid JSON code.`
        return new Card()
            .error()
            .addParagraph(msg1)
            .addExpandableBlock('Invalid JSON Code', codeBlock(json, Mode.txt))
            .setTitle('Invalid JSON Code')
    }

    // ------------------------------------------------------------------------
    // Internal Errors (they should't happen)
    public static internal_NoMetaTagsInThisCategory(categoryName: string) {
        const msg1 = `The list of Meta tags for category '${categoryName}' is empty.`
        const msg2 = `This is an internal error.`
        return new Card().error().addParagraph(msg1).addParagraph(msg2).setTitle('Internal Error')
    }

    public static internal_fromError(err: Error, optMsg: string = '') {
        const msg1 = `Unexpected Error.`
        const msg2 = typeof err === 'undefined' ? `Error Name: no name` : `Error Name: ${err.name ?? 'no name'}.`
        const msg3 =
            typeof err === 'undefined' ? `Error Message: no message` : `Error Message: ${err.message ?? 'no message'}.`
        const msg4 = typeof err === 'undefined' ? `Error Stack: no stack` : `Error Stack: ${err.stack ?? 'no stack'}.`
        const msg5 = optMsg !== '' ? `<div>${optMsg}</div>` : ''
        return new Card()
            .error()
            .addParagraph(msg1)
            .addParagraph(msg2)
            .addParagraph(msg3)
            .addParagraph(msg4)
            .addParagraph(msg5)
            .setTitle('Generic Error')
    }
}
