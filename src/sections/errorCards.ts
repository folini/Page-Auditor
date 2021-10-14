// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card} from '../card'
import {Mode} from '../colorCode'
import {codeBlock} from '../codeBlock'

export const unableToAnalyzeChromeTabs = () => {
    const msg1 = `<b>Page Auditor</b> can not run on empty or internal Chrome tabs.`
    const msg2 = `Please launch <b>Page Auditor for Technical SEO</b> on a regular web page.`
    return new Card().error().addParagraph(msg1).addParagraph(msg2).setTitle('Unable To Analyze Chrome Tab')
}

export const chromeTabIsUndefined = () => {
    const msg1 = `The current Chrome tab is undefined.`
    const msg2 = `Please re-launch <b>Page Auditor for Technical SEO</b> on a regular web page.`
    return new Card().error().addParagraph(msg1).addParagraph(msg2).setTitle('Chrome Tab Undefined')
}

export const unableToAnalyzePage = (url: string) => {
    const msg1 = `<b>Page Auditor</b> can not run on page at the url <a href='${url}' target='_new'>${url}</a>.`
    const msg2 = `Please launch <b>Page Auditor for Technical SEO</b> on a regular web page.`
    return new Card().error().addParagraph(msg1).addParagraph(msg2).setTitle('Unable To Analyze Page')
}

export const noMetaTagsInThisCategory = (categoryName: string) => {
    const msg1 = `The list of Meta tags for category '${categoryName}' is empty.`
    const msg2 = `This is an internal error.`
    return new Card().error().addParagraph(msg1).addParagraph(msg2).setTitle('Internal Error')
}

export const sitemapIsHTMLPage = (url: string, code: string) => {
    const msg1 =
        `<code>Sitemap.xml</code> file at location <a target="_new" href="${url}">${url}</a> is an HTML page or a redirect. ` +
        `Its' not a syntactically valid <code>sitemap.xml</code>.`
    const btnLabel = `Wrong Sitemap`
    return new Card()
        .error()
        .addParagraph(msg1)
        .addExpandableBlock(btnLabel, codeBlock(code, Mode.html))
        .setTitle('Wrong Sitemap.xml Syntax')
}

export const sitemapReturns404 = (url: string) => {
    const msg1 = `<code>Sitemap.xml</code> file at location <a target="_new" href="${url}">${url}</a> not found, returns 404 error code.`
    return new Card().error().addParagraph(msg1).setTitle('Sitemap.xml Not Found')
}

export const sitemapNotFound = (url: string) => {
    const msg1 = `<code>Sitemap.xml</code> file at location <a target="_new" href="${url}">${url}</a> not found.`
    return new Card().error().addParagraph(msg1).setTitle('Sitemap.xml Not Found')
}

export const sitemapUnableToOpen = (url: string, errorCode: number, errorMessage: string) => {
    const msg1 = `Unable to load <code>Sitemap.xml</code> file at location <a target="_new" href="${url}">${url}</a>.`
    const msg2 = `Error code: ${errorCode.toFixed()}, Error Message: "${errorMessage}"`
    return new Card().error().addParagraph(msg1).addParagraph(msg2).setTitle('Sitemap.xml Not Found')
}

export const robotsTxtIsHTMLPage = (url: string, code: string) => {
    const msg1 = `<code>Robots.Txt</code> file at location <a target="_new" href="${url}">${url}</a> is an HTML page or a redirect.`
    const msg2 = `Its' not a syntactically valid <code>robots.txt</code>.`
    const btnLabel = `Wrong Robots.Txt`
    return new Card()
        .error()
        .addParagraph(msg1)
        .addParagraph(msg2)
        .addExpandableBlock(btnLabel, codeBlock(code, Mode.html))
        .setTitle('Wrong Robots.Txt Syntax')
}

export const robotsTxtIsEmpty = (url: string) => {
    const msg1 = `<code>Robots.Txt</code> file at location <a target="_new" href="${url}">${url}</a> is empty.`
    const msg2 = `<code>Robots.Txt</code> should contain at least a directive or a comment.`
    return new Card().error().addParagraph(msg1).addParagraph(msg2).setTitle('Robots.Txt Is Empty')
}

export const robotsTxtIsOnlyComments = (url: string, code: string) => {
    const msg1 = `<code>Robots.Txt</code> file at location <a target="_new" href="${url}">${url}</a> only contains comments, no robots directives.`
    const msg2 = `<code>Robots.Txt</code> should contain at least a directive or a comment.`
    const btnLabel = `Wrong Robots.Txt`
    return new Card()
        .error()
        .addParagraph(msg1)
        .addParagraph(msg2)
        .addExpandableBlock(btnLabel, codeBlock(code, Mode.html))
        .setTitle('Robots.Txt Contains Only Comments')
}

export const robotsTxtNotFound = (url: string) => {
    const msg1 = `<code>Robots.Txt</code> file at location <a target="_new" href="${url}">${url}</a> not found.`
    return new Card().error().addParagraph(msg1).setTitle('Robots.Txt Not Found')
}

export const robotsTxtUnableToOpen = (url: string, errorCode: number, errorMessage: string) => {
    const msg1 = `Unable to load <code>Robots.Txt</code> file at location <a target="_new" href="${url}">${url}</a>.`
    const msg2 = `Error code: ${errorCode.toFixed()}, Error Message: "${errorMessage}"`
    return new Card().error().addParagraph(msg1).addParagraph(msg2).setTitle('Robots.Txt Not Found')
}

export const scriptNotFound = () => {
    const msg1 = `No JavaScript code script found.`
    return new Card().error().addParagraph(msg1).setTitle('No Script Found')
}

export const structuredDataNotFound = (url: string) => {
    const msg1 = `No <i>Structured Data</i> was found at location <a target="_new" href="${url}">${url}</a>.`
    return new Card().error().addParagraph(msg1).setTitle('Missing Structured Data')
}

export const unableToAddCardToReport = () => {
    const msg1 = `Unable to add a card to current report.`
    const msg2 = 'Internal Error'
    return new Card().error().addParagraph(msg1).setTitle('Internal Error')
}
