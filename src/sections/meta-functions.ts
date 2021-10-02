// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {iMetaTag, iDefaultTagValues} from './meta'
import {Card, iLink} from '../card'

interface iTagCategoryPreviewer {
    (m: iMetaTag[], t: iDefaultTagValues): string
}

interface iTagCategoryFilter {
    (m: iMetaTag): boolean
}

export interface iTagCategory {
    title: string
    description: string
    url: string
    cssClass: string
    filter: iTagCategoryFilter
    preview: iTagCategoryPreviewer
}

export const noPreview: iTagCategoryPreviewer = (m: iMetaTag[], t: iDefaultTagValues) => ''

export const twitterPreview = (tags: iMetaTag[], defaults: iDefaultTagValues): string => {
    const linkIcon =
        `<svg viewBox="0 0 24 24" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr">` +
        `<g>` +
        `<path d="M11.96 14.945c-.067 0-.136-.01-.203-.027-1.13-.318-2.097-.986-2.795-1.932-.832-1.125-1.176-2.508-.968-3.893s.942-2.605 2.068-3.438l3.53-2.608c2.322-1.716 5.61-1.224 7.33 1.1.83 1.127 1.175 2.51.967 3.895s-.943 2.605-2.07 3.438l-1.48 1.094c-.333.246-.804.175-1.05-.158-.246-.334-.176-.804.158-1.05l1.48-1.095c.803-.592 1.327-1.463 1.476-2.45.148-.988-.098-1.975-.69-2.778-1.225-1.656-3.572-2.01-5.23-.784l-3.53 2.608c-.802.593-1.326 1.464-1.475 2.45-.15.99.097 1.975.69 2.778.498.675 1.187 1.15 1.992 1.377.4.114.633.528.52.928-.092.33-.394.547-.722.547z"></path><path d="M7.27 22.054c-1.61 0-3.197-.735-4.225-2.125-.832-1.127-1.176-2.51-.968-3.894s.943-2.605 2.07-3.438l1.478-1.094c.334-.245.805-.175 1.05.158s.177.804-.157 1.05l-1.48 1.095c-.803.593-1.326 1.464-1.475 2.45-.148.99.097 1.975.69 2.778 1.225 1.657 3.57 2.01 5.23.785l3.528-2.608c1.658-1.225 2.01-3.57.785-5.23-.498-.674-1.187-1.15-1.992-1.376-.4-.113-.633-.527-.52-.927.112-.4.528-.63.926-.522 1.13.318 2.096.986 2.794 1.932 1.717 2.324 1.224 5.612-1.1 7.33l-3.53 2.608c-.933.693-2.023 1.026-3.105 1.026z"></path>` +
        `</g>` +
        `</svg>`
    const title = tags.find(m => m.property === 'twitter:title')?.content || defaults.title
    const img =
        tags.find(m => m.property === 'twitter:image' || m.property === 'twitter:image:src')?.content || defaults.img
    var description = tags.find(m => m.property === 'twitter:description')?.content || defaults.description
    description = description.length < 128 ? description : description.substr(0, 128) + '&mldr;'
    var domain =
        tags.find(m => m.property === 'twitter:domain' || m.property === 'twitter:url')?.content || defaults.domain
    if (domain.startsWith('http')) {
        domain = domain.replace(/https?:\/\/(www.)?((\w+\.)?\w+\.\w+).*/i, `$2`)
    }

    return `
      <div class='card-options'>
        <div id='id-twitter-card'>
        ${img.length > 0 && img.startsWith('http') ? `<img src='${img}'>` : ``}
        <div class='twitter-card-legend'>
            <div class='twitter-card-title'>${title}</div>
            <div class='twitter-card-description'>${description}</div>
            ${domain.length > 0 ? `<div class='twitter-card-domain'>${linkIcon} ${domain}</div>` : ''}
          </div>
        </div>
      </div>`
}

export const openGraphPreview = (tags: iMetaTag[], defaults: iDefaultTagValues) => {
    const title = tags.find(m => m.property === 'og:title')?.content || ''
    const img = tags.find(m => m.property === 'og:image')?.content || ''
    var description = tags.find(m => m.property === 'og:description')?.content || ''
    description = description.length < 215 ? description : description.substr(0, 214) + '&mldr;'
    var domain = tags.find(m => m.property === 'og:url')?.content || ''
    if (domain.startsWith('http')) {
        domain = domain.replace(/https?:\/\/(www.)?((\w+\.)?\w+\.\w+).*/i, `$2`)
    }
    domain = domain.toUpperCase()

    return `
      <div class='card-options'>
          <div id='id-facebook-card'>        
            ${img.length > 0 && img.startsWith('http') ? `<img src='${img}'>` : ``}
            <div class='open-graph-card-legend'>
              ${domain.length > 0 ? `<div class='open-graph-card-domain'>${domain}</div>` : ''}
              <h2>${title}</h2>
              <div class='og-description'>${description}</div>
            </div>
          </div>
      </div>`
}

export const tagCategories: iTagCategory[] = [
    {
        title: `Twitter Tags`,
        description:
            `With Twitter Cards, you can attach rich photos, videos and media experiences to Tweets, helping to drive traffic to your website. ` +
            `Simply add a few lines of markup to your webpage, and users who Tweet links to your content will have a "Card" added to the Tweet that's visible to their followers.`,
        url: 'https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started',
        cssClass: `icon-twitter`,
        filter: m => m.property.startsWith('twitter:'),
        preview: twitterPreview,
    },
    {
        title: `Facebook Tags (OpenGraph)`,
        description:
            `Open Graph meta tags are snippets of code that control how URLs are displayed when shared on social media. They're part of Facebook's Open Graph protocol and are also used by other social media sites, including LinkedIn and Twitter (if Twitter Cards are absent). ` +
            `Open Graph meta tags are in the &lt;head&gt; section of a webpage.`,
        url: 'https://ogp.me/',
        cssClass: 'icon-open-graph',
        filter: m =>
            m.property.startsWith('og:') ||
            m.property.startsWith('fb:') ||
            m.property.startsWith('ia:') ||
            m.property.startsWith('product:') ||
            m.property.startsWith('article:') ||
            m.property.startsWith('music') ||
            m.property.startsWith('video') ||
            m.property.startsWith('profile'),
        preview: openGraphPreview,
    },
    {
        title: `AppLinks Tags (Facebook)`,
        description: `Deprecated since February 2, 2020. Publishing App Link metadata is as simple as adding a few lines to the <head> tag in the HTML for your content. Apps that link to your content can then use this metadata to deep-link into your app, take users to an app store to download the app, or take them directly to the web to view the content. This allows developers to provide the best possible experience for their users when linking to their content.`,
        url: 'https://developers.facebook.com/docs/applinks/metadata-reference/',
        cssClass: 'icon-open-graph',
        filter: m => m.property.startsWith('al:'),
        preview: noPreview,
    },
    {
        title: `Swiftype Tags`,
        description: `Swiftype Site Search is a powerful, customizable, cloud-based site search platform. Create and manage a tailored search experience for your public facing website with best-in-class relevance, intuitive customization, and rich analytics.`,
        url: 'https://swiftype.com/documentation/site-search/crawler-configuration/meta-tags',
        cssClass: 'icon-swiftype',
        filter: m => m.class === 'swiftype',
        preview: noPreview,
    },
    {
        title: `Google Tags`,
        description: `Google supports both page-level meta-tags and inline directives to help control how your site's pages will appear in Google Search.`,
        url: 'https://developers.google.com/search/docs/advanced/crawling/special-tags',
        cssClass: 'icon-google',
        filter: m => m.property === 'google',
        preview: noPreview,
    },
    {
        title: `REP Tags`,
        description: `REP (Robots Exclusion Protocol) are directive to control the way pages are indexed by Search Engines. In addition to root-level robots.txt files, robots exclusion directives can be applied at a more granular level through the use of Robots meta tags and X-Robots-Tag HTTP headers. The robots meta tag cannot be used for non-HTML files such as images, text files, or PDF documents.`,
        url: 'https://www.metatags.org/all-meta-tags-overview/the-important-meta-tags/meta-name-robots-tag/',
        cssClass: 'icon-rep',
        filter: m => m.property === 'robots' || m.property === 'googlebot',
        preview: noPreview,
    },
    {
        title: `Authorization Tags`,
        description: `Authorization Meta Tags are used to certify the ownership of a website or page. If you have access to the source code of the &lt;head&gt; section of a page you are trusted as owner or authorized manager of that page.`,
        url: 'https://support.google.com/webmasters/answer/9008080?hl=en#zippy=%2Chtml-tag',
        cssClass: 'icon-lock',
        filter: m =>
            m.property.includes('verification') || m.property.includes(`validate`) || m.property.includes(`verify`),
        preview: noPreview,
    },
    {
        title: `Standard Tags`,
        description: `Standard Meta tags are used by Search Engines to gather additional information about ta web page or website. The meta tag "keywords" is currently ignored (because it was abused in the past).`,
        url: 'https://moz.com/blog/the-ultimate-guide-to-seo-meta-tags',
        cssClass: 'icon-seo',
        filter: m =>
            m.property === 'title' ||
            m.property === `author` ||
            m.property === `description` ||
            m.property === `language` ||
            m.property === `keywords` ||
            m.property === `viewport` ||
            m.property === `generator` ||
            m.property === `abstract` ||
            m.property === `content-type` ||
            m.property === `expires` ||
            m.property === `refresh` ||
            m.property === `theme-color`,
        preview: noPreview,
    },
    {
        title: `Windows Meta Tags`,
        description: `Optional meta &lt;meta&gt; elements can be used to help Microsoft Windows to customize the default behavior of the pinned site shortcut.`,
        url: 'https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/platform-apis/ff976295(v=vs.85)',
        cssClass: 'icon-windows',
        filter: m => m.property.includes('msapplication-'),
        preview: noPreview,
    },
    {
        title: `Microsoft Docs Tags`,
        description: `Microsoft uses metadata on Docs for reporting, discoverability of the content via search, and to drive aspects of the site experience. Metadata can be applied in the article (in the YAML front matter) or globally in the docfx.json file for the repo.`,
        url: 'https://docs.microsoft.com/en-us/contribute/metadata',
        cssClass: 'icon-ms',
        filter: m => m.property.startsWith(`ms.`),
        preview: noPreview,
    },
    {
        title: `Chromium Origin Trials Tags`,
        description: `Origin trials are an approach to enable safe experimentation with web platform features.
    Briefly, the web needs new features, and iteration yields the best designs and implementations for those features. However, previous efforts have seen experiments prematurely become de-facto standards, with browser vendors scrambling to implement the features, and web developers coming to rely on these features. These experimental features became burned-in, and resistant to change (or removal), even though better implementations were identified/available.`,
        url: 'https://googlechrome.github.io/OriginTrials/',
        cssClass: 'icon-chromium',
        filter: m => m.property === 'origin-trial',
        preview: noPreview,
    },
    {
        title: `Cxense Tags`,
        description: `Cxense proprietary meta tags. Cxense was a Norwegian technology company, acquired by Piano.`,
        url: 'https://www.cxense.com/',
        cssClass: 'icon-cxense',
        filter: m => m.property.startsWith('cxense:') || m.property.startsWith('cxenseparse:'),
        preview: noPreview,
    },
    {
        title: `OutBrain Tags`,
        description: `OutBrain proprietary meta tags. Outbrain is a marketing company.`,
        url: 'https://www.outbrain.com/',
        cssClass: 'icon-outbrain',
        filter: m => m.property.startsWith('vr:'),
        preview: noPreview,
    },
    {
        title: `Apple Tags`,
        description: `Apple proprietary meta tags.`,
        url: 'https://www.apple.com/',
        cssClass: 'icon-apple',
        filter: m => m.property.startsWith('apple-'),
        preview: noPreview,
    },
    {
        title: `Shopify Tags`,
        description: `Shopify proprietary meta tags.`,
        url: 'https://www.shopify.com/',
        cssClass: 'icon-shopify',
        filter: m => m.property.startsWith('shopify-'),
        preview: noPreview,
    },
    {
        title: `Branch Tags`,
        description: `Branch proprietary meta tags. Branch isa a mobile measurement and deep linking platform, trusted by the most top ranking apps to increase efficiency and revenue.`,
        url: 'https://www.branch.com/',
        cssClass: 'icon-branch',
        filter: m => m.property.startsWith('branch:'),
        preview: noPreview,
    },
    {
        title: `Internet Explorer Tags`,
        description: `X-UA-Compatible is a document mode meta tag that allows web authors to choose what version of Internet Explorer the page should be rendered as. It is used by Internet Explorer 8 to specify whether a page should be rendered as IE 7 (compatibility view) or IE 8 (standards view).`,
        url: 'https://docs.microsoft.com/en-us/openspecs/ie_standards/ms-iedoco/380e2488-f5eb-4457-a07a-0cb1b6e4b4b5',
        cssClass: 'icon-ie',
        filter: m => m.property === `x-ua-compatible` || m.property == 'cleartype',
        preview: noPreview,
    },
    {
        title: `CSRF Tags`,
        description: `CSRF (Cross-Site Request Forgery) meta tags are indications for ajax requests to use these as one of the form parameters to make a request to the server. Rails expects the csrf as part of your form body (params) to process your requests. Using these meta tags you can construct the form body or the csrf header to suit your needs.`,
        url: 'https://cwe.mitre.org/data/definitions/352.html',
        cssClass: 'icon-lock',
        filter: m => m.property.startsWith(`csrf-`),
        preview: noPreview,
    },
    {
        title: `Google Programmable Search Engine Tags`,
        description: `Google Programmable Search Engine meta tags are used by Google Programmable Search Engine to render the result of a search local to a website.`,
        url: 'https://cse.google.com/',
        cssClass: 'icon-google',
        filter: m => m.property.startsWith(`thumbnail`),
        preview: noPreview,
    },
    {
        title: `Other Tags`,
        description: `Many development, optimization, and tracking tools are leveraging the &lt;meta&gt; tags to inject information in a web page minimizing the impact on the loading and rendering time.`,
        url: '',
        cssClass: 'icon-tag',
        filter: m => true,
        preview: noPreview,
    },
]

export const metaCategoryCard = (metaCat: iTagCategory, metaList: iMetaTag[], preview: string): Card => {
    if (metaList.length === 0) {
        return new Card().error('List of Meta tags is empty')
    }

    const listOfMeta = metaList
        .map(
            m =>
                `<div class='single-line-forced'>
                    <span class='label'>${m.property}:</span> 
                    <span class='value'>${m.content}</span>
                  </div>`
        )
        .join('')

    const links: iLink[] = []
    if (metaCat.url.length > 0) {
        links.push({url: metaCat.url, label: 'Reference'})
    }

    return new Card()
        .open(`Meta Tags`, metaCat.title, links, metaCat.cssClass)
        .add(
            `
        <div class='card-description'>${metaCat.description}</div>
        <div class='meta-items'>${listOfMeta}</div>
        ${preview}
        `
        )
        .close()
}
