// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {iTag} from './mt'
import * as Previewer from "./mt-previewer"
import * as Validator from "./mt-validator"

interface iTagCategoryFilter {
    (m: iTag): boolean
}

export interface iTagCategory {
    title: string
    description: string
    url: string
    cssClass: string
    filter: iTagCategoryFilter
    previewer: Previewer.iTagPreviewer
    validator?: Validator.iTagValidator
}

export const tagCategories: iTagCategory[] = [
    {
        title: `Twitter Tags`,
        description:
            `With Twitter Cards meta tags, you can attach rich photos, videos and media experiences to Tweets, helping to drive traffic to your website. ` +
            `Simply add a few lines of markup to your webpage, and users who Tweet links to your content will have a "Card" added to the Tweet that's visible to their followers.`,
        url: 'https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started',
        cssClass: `icon-twitter`,
        filter: m => m.label.startsWith('twitter:'),
        previewer: Previewer.twitterTags,
    },
    {
        title: `OpenGraph Tags`,
        description:
            `Open Graph (Facebook) meta tags are snippets of code that control how URLs are displayed when shared on social media. ` +
            `They're part of Facebook's <i>Open Graph</i> protocol and are also used by other social media sites, including LinkedIn and Twitter (when Twitter specific meta-tags are absent). ` +
            `Open Graph (Facebook) meta tags are usually included in the <code>&lt;head&gt;</code> section of the webpage.`,
        url: 'https://ogp.me/',
        cssClass: 'icon-open-graph',
        filter: m =>
            m.label.startsWith('og:') ||
            m.label.startsWith('fb:') ||
            m.label.startsWith('ia:') ||
            m.label.startsWith('product:') ||
            m.label.startsWith('article:') ||
            m.label.startsWith('music:') ||
            m.label.startsWith('book:') ||
            m.label.startsWith('video:') ||
            m.label.startsWith('profile:'),
        previewer: Previewer.openGraphTags,
    },
    {
        title: `AppLinks Tags (Facebook)`,
        description: `Deprecated since February 2, 2020. Publishing App Link metadata is as simple as adding a few lines to the <head> tag in the HTML for your content. Apps that link to your content can then use this metadata to deep-link into your app, take users to an app store to download the app, or take them directly to the web to view the content. This allows developers to provide the best possible experience for their users when linking to their content.`,
        url: 'https://developers.facebook.com/docs/applinks/metadata-reference/',
        cssClass: 'icon-facebook',
        filter: m => m.label.startsWith('al:'),
        previewer: Previewer.noPreview,
    },
    {
        title: `Swiftype Tags`,
        description: `Swiftype Site Search is a powerful, customizable, cloud-based site search platform. Create and manage a tailored search experience for your public facing website with best-in-class relevance, intuitive customization, and rich analytics.`,
        url: 'https://swiftype.com/documentation/site-search/crawler-configuration/meta-tags',
        cssClass: 'icon-swiftype',
        filter: m => m.class === 'swiftype',
        previewer: Previewer.noPreview,
    },
    {
        title: `Google Tags`,
        description: `Google supports both page-level meta-tags and inline directives to help control how your site's pages will appear in Google Search.`,
        url: 'https://developers.google.com/search/docs/advanced/crawling/special-tags',
        cssClass: 'icon-google',
        filter: m => m.label === 'google',
        previewer: Previewer.noPreview,
    },
    {
        title: `REP Tags`,
        description: `REP (Robots Exclusion Protocol) are directive to control the way pages are indexed by Search Engines. In addition to root-level robots.txt files, robots exclusion directives can be applied at a more granular level through the use of Robots meta tags and X-Robots-Tag HTTP headers. The robots meta tag cannot be used for non-HTML files such as images, text files, or PDF documents.`,
        url: 'https://www.metatags.org/all-meta-tags-overview/the-important-meta-tags/meta-name-robots-tag/',
        cssClass: 'icon-rep',
        filter: m => m.label === 'robots' || m.label === 'googlebot',
        previewer: Previewer.noPreview,
        validator: Validator.repTags,
    },
    {
        title: `Authorization Tags`,
        description: `Authorization Meta Tags are used to certify the ownership of a website or page. If you have access to the source code of the &lt;head&gt; section of a page you are trusted as owner or authorized manager of that page.`,
        url: 'https://support.google.com/webmasters/answer/9008080?hl=en#zippy=%2Chtml-tag',
        cssClass: 'icon-lock',
        filter: m => m.label.includes('verification') || m.label.includes(`validate`) || m.label.includes(`verify`),
        previewer: Previewer.noPreview,
    },
    {
        title: `Standard Tags`,
        description: `Standard Meta tags are used by Search Engines to gather additional information about ta web page or website. The meta tag "<i>keywords</i>" is currently ignored (because it was abused in the past).`,
        url: 'https://moz.com/blog/the-ultimate-guide-to-seo-meta-tags',
        cssClass: 'icon-seo',
        filter: m =>
            [
                `title`,
                `author`,
                `description`,
                `language`,
                `keywords`,
                `viewport`,
                `generator`,
                `abstract`,
                `content-type`,
                `expires`,
                `refresh`,
                `theme-color`,
                `format-detection`,
                `referrer`,
                `Content-Security-Policy`,
            ].includes(m.label),
        previewer: Previewer.stdTags,
        validator: Validator.stdTags,
    },
    {
        title: `Windows Meta Tags`,
        description: `Optional Meta Tags are used to help Microsoft Windows to customize the default behavior and appearance of the pinned site shortcut.`,
        url: 'https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/platform-apis/ff976295(v=vs.85)',
        cssClass: 'icon-windows',
        filter: m => m.label.includes('msapplication-'),
        previewer: Previewer.noPreview,
    },
    {
        title: `Microsoft Docs Tags`,
        description: `Microsoft uses metadata on Docs for reporting, discoverability of the content via search, and to drive aspects of the site experience. Metadata can be applied in the article (in the YAML front matter) or globally in the docfx.json file for the repo.`,
        url: 'https://docs.microsoft.com/en-us/contribute/metadata',
        cssClass: 'icon-ms',
        filter: m => m.label.startsWith(`ms.`),
        previewer: Previewer.noPreview,
    },
    {
        title: `Chromium Origin Trials Tags`,
        description: `Origin trials are an approach to enable safe experimentation with web platform features.
    Briefly, the web needs new features, and iteration yields the best designs and implementations for those features. However, previous efforts have seen experiments prematurely become de-facto standards, with browser vendors scrambling to implement the features, and web developers coming to rely on these features. These experimental features became burned-in, and resistant to change (or removal), even though better implementations were identified/available.`,
        url: 'https://googlechrome.github.io/OriginTrials/',
        cssClass: 'icon-chromium',
        filter: m => m.label === 'origin-trial',
        previewer: Previewer.noPreview,
    },
    {
        title: `Cxense Tags`,
        description: `Cxense proprietary meta tags. Cxense was a Norwegian technology company, acquired by Piano.`,
        url: 'https://www.cxense.com/',
        cssClass: 'icon-cxense',
        filter: m => m.label.startsWith('cxense:') || m.label.startsWith('cxenseparse:'),
        previewer: Previewer.noPreview,
    },
    {
        title: `OutBrain Tags`,
        description: `OutBrain proprietary meta tags. Outbrain is a marketing company.`,
        url: 'https://www.outbrain.com/',
        cssClass: 'icon-outbrain',
        filter: m => m.label.startsWith('vr:'),
        previewer: Previewer.noPreview,
    },
    {
        title: `Apple Tags`,
        description: `Apple proprietary meta tags.`,
        url: 'https://www.apple.com/',
        cssClass: 'icon-apple',
        filter: m => m.label.startsWith('apple-'),
        previewer: Previewer.noPreview,
    },
    {
        title: `Shopify Tags`,
        description: `Shopify proprietary meta tags.`,
        url: 'https://www.shopify.com/',
        cssClass: 'icon-shopify',
        filter: m => m.label.startsWith('shopify-'),
        previewer: Previewer.noPreview,
    },
    {
        title: `Branch Tags`,
        description: `Branch proprietary meta tags. Branch isa a mobile measurement and deep linking platform, trusted by the most top ranking apps to increase efficiency and revenue.`,
        url: 'https://www.branch.com/',
        cssClass: 'icon-branch',
        filter: m => m.label.startsWith('branch:'),
        previewer: Previewer.noPreview,
    },
    {
        title: `Internet Explorer Tags`,
        description: `<code>X-UA-Compatible</code> is a document-mode Meta Tag that allows web authors to choose what version of Internet Explorer the page should be rendered as. It is used by Internet Explorer 8 to specify whether a page should be rendered as IE 7 (compatibility view) or IE 8 (standards view).`,
        url: 'https://docs.microsoft.com/en-us/openspecs/ie_standards/ms-iedoco/380e2488-f5eb-4457-a07a-0cb1b6e4b4b5',
        cssClass: 'icon-ie',
        filter: m => m.label === `x-ua-compatible` || m.label == 'cleartype',
        previewer: Previewer.noPreview,
    },
    {
        title: `CSRF Tags`,
        description: `CSRF (Cross-Site Request Forgery) meta tags are indications for ajax requests to use these as one of the form parameters to make a request to the server. Rails expects the csrf as part of your form body (params) to process your requests. Using these meta tags you can construct the form body or the csrf header to suit your needs.`,
        url: 'https://cwe.mitre.org/data/definitions/352.html',
        cssClass: 'icon-lock',
        filter: m => m.label.startsWith(`csrf-`),
        previewer: Previewer.noPreview,
    },
    {
        title: `Google Programmable Search Engine Tags`,
        description: `Google Programmable Search Engine meta tags are used by GoogThe meta tag "keywords"le Programmable Search Engine to render the result of a search local to a website.`,
        url: 'https://cse.google.com/',
        cssClass: 'icon-google',
        filter: m => m.label.startsWith(`thumbnail`),
        previewer: Previewer.noPreview,
    },
    {
        title: `Other Tags`,
        description: `Many development, optimization, and tracking tools are leveraging the <code>&lt;meta&gt;</code> tags to inject information in a web page minimizing the impact on the loading and rendering time.`,
        url: '',
        cssClass: 'icon-tag',
        filter: m => true,
        previewer: Previewer.noPreview,
    },
]