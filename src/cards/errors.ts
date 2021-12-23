// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card, CardKind} from '../card'
import {Mode} from '../colorCode'
import {SmSource, iSmCandidate} from '../sitemapList'
import * as CardBlocks from '../card-blocks'
import * as Icons from '../icons'

let Platform = require('../../package.json');

// ------------------------------------------------------------------------
// Google Chrome Errors
export function browser_UnableToAnalyzeTabs() {
  const msg1 = `<i>Page Auditor</i> can not run on empty tabs or browser internal tabs.`
  const msg2 = `Please launch <i>Page Auditor for Technical SEO</i> on a regular web page.`
  return new Card(CardKind.error)
    .setLogo( Platform.target  === 'Chrome' ? 'icon-chromium' : 'icon-edge')
    .add(CardBlocks.paragraph(msg1))
    .add(CardBlocks.paragraph(msg2))
    .setTitle(`Unable To Analyze <code>${Platform.target === 'Chrome' ? 'chrome:' : 'edge:'}</code> Tabs`)
    .setTag('card-error')
}

export function browser_TabUrlUndefined() {
    const msg1 = `The current browser's tab is undefined.`
    const msg2 = `Please re-launch <b>Page Auditor for Technical SEO</b> on a regular web page.`
    return new Card(CardKind.error)
        .setLogo( Platform.target === 'Chrome' ? 'icon-chromium' : 'icon-edge')
        .add(CardBlocks.paragraph(msg1))
        .add(CardBlocks.paragraph(msg2))
        .setTitle(`${ Platform.target } Tab Undefined`)
        .setTag('card-error')
}

export function browser_UnableToAnalyzePage(url: string) {
    const msg1 = `<b>Page Auditor</b> can not run on page at the url:`
    const msg2 = `Please launch <b>Page Auditor for Technical SEO</b> on a regular web page.`
    return new Card(CardKind.error)
        .setLogo( Platform.target === 'Chrome' ? 'icon-chromium' : 'icon-edge')
        .add(CardBlocks.paragraph(msg1))
        .add(CardBlocks.paragraph(url, Mode.txt))
        .add(CardBlocks.paragraph(msg2))
        .setTitle(`Unable To Analyze ${Platform} Pages`)
        .setTag('card-error')
}

// ------------------------------------------------------------------------
// Sitemap Errors
export function sitemap_IsARedirect(sm: iSmCandidate, code: string) {
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
        .add(CardBlocks.paragraph(msg1))
        .add(CardBlocks.code(sm.url, Mode.txt))
        .add(CardBlocks.paragraph(msg2))
        .add(CardBlocks.expandable(btnLabel, CardBlocks.code(code, Mode.html), Icons.code, `box-code`))
        .setTitle('Sitemap.xml Redirects to an HTML File')
        .setTag('card-error')
}

export function sitemap_404(sm: iSmCandidate) {
    const msg1 = `No <code>Sitemap.xml</code> file was detected at location:`
    const msg2 = `Server returns 404 error code.`
    return new Card(CardKind.error)
        .setLogo('icon-sitemap')
        .add(CardBlocks.paragraph(msg1))
        .add(CardBlocks.code(sm.url, Mode.txt))
        .add(CardBlocks.paragraph(msg2))
        .setTitle('Sitemap.xml Not Found, Code 404')
        .setTag('card-error')
}

export function sitemap_ListedButNotFound(sms: iSmCandidate[]) {
    const plural = sms.length > 1 ? 's' : ''
    const msg1 = `No <code>Sitemap.xml</code> file${plural} detected at at location${plural}:`
    const msg2 = `File${plural} not found.`
    return new Card(CardKind.error)
        .setLogo('icon-sitemap')
        .add(CardBlocks.paragraph(msg1))
        .add(CardBlocks.code(sms.map(sm => sm.url).join('<br/>'), Mode.txt))
        .add(CardBlocks.paragraph(msg2))
        .setTitle('Sitemap.xml Listed But Not Found')
        .setTag('card-error')
}

export function sitemap_NotFound() {
    const msg1 = `No <code>Sitemap.xml</code> file detected for this website.`
    return new Card(CardKind.error)
        .setLogo('icon-sitemap')
        .add(CardBlocks.paragraph(msg1))
        .setTitle('Sitemap.xml Not Found')
        .setTag('card-error')
}

// ------------------------------------------------------------------------
// Robots.txt Errors
export function robotsTxt_IsARedirect(url: string, code: string) {
    const msg1 = `Found a syntactically invalid <code>Robots.Txt</code> file at the url:`
    const msg2 = `It's an HTML page, very likely a standard redirect for non-existent pages.`
    const btnLabel = `Invalid Robots.Txt`
    return new Card(CardKind.error)
        .setLogo('icon-rep')
        .add(CardBlocks.paragraph(msg1))
        .add(CardBlocks.code(url, Mode.txt))
        .add(CardBlocks.paragraph(msg2))
        .add(CardBlocks.expandable(btnLabel, CardBlocks.code(code, Mode.html), Icons.code, `box-code`))
        .setTitle('Robots.Txt Redirects to an HTML File')
        .setTag('card-error')
}

export function robotsTxt_IsEmpty(url: string) {
    const msg1 = `<code>Robots.Txt</code> file at location <a target="_new" href="${url}">${url}</a> is empty.`
    const msg2 = `<code>Robots.Txt</code> should contain at least a directive or a comment.`
    return new Card(CardKind.error)
        .setLogo('icon-rep')
        .add(CardBlocks.paragraph(msg1))
        .add(CardBlocks.paragraph(msg2))
        .setTitle('The Robots.Txt File Is Empty')
        .setTag('card-error')
}

export function robotsTxt_OnlyComments(url: string, code: string) {
    const msg1 = `<code>Robots.Txt</code> file at location <a target="_new" href="${url}">${url}</a> only contains comments, no robots directives.`
    const msg2 = `<code>Robots.Txt</code> should contain at least a directive or a comment.`
    const btnLabel = `Robots.Txt`
    return new Card(CardKind.error)
        .setLogo('icon-rep')
        .add(CardBlocks.paragraph(msg1))
        .add(CardBlocks.paragraph(msg2))
        .add(CardBlocks.expandable(btnLabel, CardBlocks.code(code, Mode.html), Icons.code, `box-code`))
        .setTitle('Robots.Txt Contains Only Comments')
        .setTag('card-error')
}

export function robotsTxt_NotFound(url: string) {
    const msg1 = `<code>Robots.Txt</code> file at location <a target="_new" href="${url}">${url}</a> not found.`
    return new Card(CardKind.error)
        .setLogo('icon-rep')
        .add(CardBlocks.paragraph(msg1))
        .setTitle('Robots.Txt Not Found')
        .setTag('card-error')
}

// ------------------------------------------------------------------------
// Script Errors
export function script_NotFound() {
    const msg1 = `No JavaScript code script found.`
    return new Card(CardKind.error)
        .setLogo('icon-js')
        .add(CardBlocks.paragraph(msg1))
        .setTitle('No Script Found')
        .setTag('card-error')
}

// ------------------------------------------------------------------------
// Meta Tags Errors
export function metaTags_NotFound() {
    const msg1 = `No Meta Tags found on page.`
    return new Card(CardKind.error)
        .setLogo('icon-tag')
        .add(CardBlocks.paragraph(msg1))
        .setTitle('Page Has No Meta Tags')
        .setTag('card-error')
}

export function metaTags_noOpenGraphTags() {
    const msg1 = `The page is missing Meta Tags for Facebook (Open Graph).`
    return new Card(CardKind.error)
        .setLogo('icon-open-graph')
        .add(CardBlocks.paragraph(msg1))
        .setTitle('Page Has No Open Graph Meta Tags')
        .setTag('card-error')
}

export function metaTags_noTwitterTags() {
    const msg1 = `The page is missing Meta Tags for Twitter.`
    return new Card(CardKind.error)
        .setLogo('icon-twitter')
        .add(CardBlocks.paragraph(msg1))
        .setTitle('Page Has No Twitter Meta Tags')
        .setTag('card-error')
}

// ------------------------------------------------------------------------
// Structured Data Errors
export function sd_NotFound(url: string) {
    const msg1 = `No <i>Structured Data</i> was found at location:`
    return new Card(CardKind.error)
        .setLogo('icon-micro-formats')
        .add(CardBlocks.paragraph(msg1))
        .add(CardBlocks.code(url, Mode.txt))
        .setTitle('Page Has No Structured Data')
        .setTag('card-error')
}

export function sd_IsEmpty(url: string) {
    const msg1 = `The <i>Structured Data</i> snippet found at following location appears to be empty:`
    return new Card(CardKind.error)
        .setLogo('icon-micro-formats')
        .add(CardBlocks.paragraph(msg1))
        .add(CardBlocks.code(url, Mode.txt))
        .setTitle('Structured Data Is Present But Empty')
        .setTag('card-error')
}

export function sd_InvalidJSON(json: string) {
    const msg1 = `A Structured data JSON script contains the following invalid JSON code.`
    return new Card(CardKind.error)
        .setLogo('icon-micro-formats')
        .add(CardBlocks.paragraph(msg1))
        .add(CardBlocks.expandable('Invalid JSON Code', CardBlocks.code(json, Mode.txt), Icons.code, `box-code`))
        .setTitle('Invalid LD-JSON Code')
        .setTag('card-error')
}

// ------------------------------------------------------------------------
// Internal Errors (they should't happen)
export function internal_NoMetaTagsInThisCategory(categoryName: string) {
    const msg1 = `The list of Meta tags for category '${categoryName}' is empty.`
    const msg2 = `This is an internal error.`
    return new Card(CardKind.error)
        .setLogo('icon-error')
        .add(CardBlocks.paragraph(msg1))
        .add(CardBlocks.paragraph(msg2))
        .setTitle('Internal Error')
        .setTag('card-error')
}

export function internal_fromError(err: Error, optMsg: string = '') {
    const msg1 = `Unexpected Error.`
    const msg2 = typeof err === 'undefined' ? `Error Name: no name` : `Error Name: ${err.name ?? 'no name'}.`
    const msg3 =
        typeof err === 'undefined' ? `Error Message: no message` : `Error Message: ${err.message ?? 'no message'}.`
    const msg4 = typeof err === 'undefined' ? `Error Stack: no stack` : `Error Stack: ${err.stack ?? 'no stack'}.`
    const msg5 = optMsg !== '' ? `<div>${optMsg}</div>` : ''
    return new Card(CardKind.error)
        .setLogo('icon-error')
        .add(CardBlocks.paragraph(msg1))
        .add(CardBlocks.paragraph(msg2))
        .add(CardBlocks.paragraph(msg3))
        .add(CardBlocks.paragraph(msg4))
        .add(CardBlocks.paragraph(msg5))
        .setTitle('Generic Error')
        .setTag('card-error')
}
