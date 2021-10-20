// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {iMetaTag, iDefaultTagValues} from './meta'
import {Report} from '../report'
import {Card, iLink} from '../card'
import {disposableId, copyToClipboard, fileExists} from '../main'
import * as Suggestions from './suggestionCards'
import * as Errors from './errorCards'
import {Mode} from '../colorCode'
import {htmlEncode} from 'js-htmlencode'
import {Tips, Platform} from './tips'

interface iTagCategoryPreviewer {
    (c: Card, u: string, m: iMetaTag[], t: iDefaultTagValues, report: Report): void
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

export const noPreview: iTagCategoryPreviewer = (c: Card, u: string, m: iMetaTag[], t: iDefaultTagValues, r: Report) =>
    void 0

export const twitterPreview = (
    card: Card,
    url: string,
    tags: iMetaTag[],
    defaults: iDefaultTagValues,
    report: Report
) => {
    const linkIcon =
        `<svg viewBox="0 0 24 24" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr">` +
        `<g>` +
        `<path d="M11.96 14.945c-.067 0-.136-.01-.203-.027-1.13-.318-2.097-.986-2.795-1.932-.832-1.125-1.176-2.508-.968-3.893s.942-2.605 2.068-3.438l3.53-2.608c2.322-1.716 5.61-1.224 7.33 1.1.83 1.127 1.175 2.51.967 3.895s-.943 2.605-2.07 3.438l-1.48 1.094c-.333.246-.804.175-1.05-.158-.246-.334-.176-.804.158-1.05l1.48-1.095c.803-.592 1.327-1.463 1.476-2.45.148-.988-.098-1.975-.69-2.778-1.225-1.656-3.572-2.01-5.23-.784l-3.53 2.608c-.802.593-1.326 1.464-1.475 2.45-.15.99.097 1.975.69 2.778.498.675 1.187 1.15 1.992 1.377.4.114.633.528.52.928-.092.33-.394.547-.722.547z"></path><path d="M7.27 22.054c-1.61 0-3.197-.735-4.225-2.125-.832-1.127-1.176-2.51-.968-3.894s.943-2.605 2.07-3.438l1.478-1.094c.334-.245.805-.175 1.05.158s.177.804-.157 1.05l-1.48 1.095c-.803.593-1.326 1.464-1.475 2.45-.148.99.097 1.975.69 2.778 1.225 1.657 3.57 2.01 5.23.785l3.528-2.608c1.658-1.225 2.01-3.57.785-5.23-.498-.674-1.187-1.15-1.992-1.376-.4-.113-.633-.527-.52-.927.112-.4.528-.63.926-.522 1.13.318 2.096.986 2.794 1.932 1.717 2.324 1.224 5.612-1.1 7.33l-3.53 2.608c-.933.693-2.023 1.026-3.105 1.026z"></path>` +
        `</g>` +
        `</svg>`

    const imgId = disposableId()
    const urlTag = tags.find(m => m.tagLabel === 'twitter:url')
    const obsoleteTag = tags.find(m => m.tagLabel === 'twitter:domain')
    const titleTag = tags.find(m => m.tagLabel === 'twitter:title')
    const imgTag = tags.find(m => m.tagLabel === 'twitter:image' || m.tagLabel === 'twitter:image:src')
    const descriptionTag = tags.find(m => m.tagLabel === 'twitter:description')

    const title = urlTag?.tagValue || defaults.title
    let img = imgTag?.tagValue || defaults.img
    var description = descriptionTag?.tagValue || defaults.description
    description = description.length < 128 ? description : description.substr(0, 128) + '&mldr;'
    var domain = urlTag?.tagValue || defaults.domain

    if (domain.startsWith('http')) {
        domain = domain.replace(/https?:\/\/(www.)?((\w+\.)?\w+\.\w+).*/i, `$2`)
    }

    if (img.startsWith('http://')) {
        img = img.replace('http://', 'https://')
    }

    if (obsoleteTag) {
        Tips.tag_Obsolete(card, 'Twitter', obsoleteTag.tagLabel, obsoleteTag.originalCode)
    }

    if (urlTag) {
        if (urlTag.tagValue.length === 0) {
            Tips.tag_AddValue(card, 'Twitter', urlTag.tagLabel)
        } else {
            if (!urlTag.tagValue.startsWith('https://')) {
                Tips.tag_UpdateRelativePath(card, 'Twitter', urlTag.tagLabel, urlTag.originalCode)
            } else if (urlTag.tagValue.startsWith('http://')) {
                Tips.tag_UpdateUnsafeUrl(card, 'Twitter', urlTag.tagLabel, urlTag.originalCode)
            }
        }
    } else {
        if (domain.length > 0) {
            Tips.tag_BeSpecific(card, 'Twitter', 'twitter:url')
        } else {
            Tips.tag_Missing(card, 'Twitter', 'twitter:url')
        }
    }

    if (titleTag) {
        if (titleTag.tagValue.length === 0) {
            Tips.tag_AddValue(card, 'Twitter', titleTag.tagLabel)
        } else if (titleTag.tagValue.length <= 4) {
            Tips.tag_ReplacePlaceholder(card, 'Twitter', titleTag.tagLabel, titleTag.tagValue)
        }
    } else {
        if (title.length > 0) {
            Tips.tag_BeSpecific(card, 'Twitter', 'twitter:title')
        } else {
            Tips.tag_Missing(card, 'Twitter', 'twitter:title')
        }
    }

    if (descriptionTag) {
        if (descriptionTag.tagValue.length === 0) {
            Tips.tag_AddValue(card, 'Twitter', descriptionTag.tagLabel)
        } else if (descriptionTag.tagValue.length <= 4) {
            Tips.tag_ReplacePlaceholder(card, 'Twitter', descriptionTag.tagLabel, descriptionTag.tagValue)
        }
    } else {
        if (description.length > 0) {
            Tips.tag_BeSpecific(card, 'Twitter', 'twitter:description')
        } else {
            Tips.tag_Missing(card, 'Twitter', 'twitter:description')
        }
    }

    if (imgTag) {
        if (imgTag.tagValue.length === 0) {
            Tips.tag_AddValue(card, 'Twitter', imgTag.tagLabel)
        } else {
            if (imgTag.tagValue.includes('/assets/no-image-')) {
                Tips.tagImage_ReplacePlaceholder(card, 'Twitter', imgTag.tagLabel, img)
            }
            if (!imgTag.tagValue.startsWith('http')) {
                Tips.tag_UpdateRelativePath(card, 'Twitter', imgTag.tagLabel, imgTag.originalCode)
            } else if (imgTag.tagValue.startsWith('http://')) {
                Tips.tag_UpdateUnsafeUrl(card, 'Twitter', imgTag.tagLabel, imgTag.originalCode)
            }
            if (imgTag.tagValue.startsWith('https://')) {
                fileExists(img).catch(() => {
                    Tips.tagImage_UploadImage(card, 'Twitter', imgTag.tagLabel, img)
                    hideCardElement(card, imgId)
                })
            }
        }
    } else {
        if (img.length > 0) {
            Tips.tagImage_AddTag(card, 'Twitter', 'twitter:image')
        } else {
            Tips.tag_Missing(card, 'Twitter', 'twitter:image')
        }
    }

    card.add(`<div id='id-twitter-card'>
        ${img.length > 0 && img.startsWith('http') ? `<img id='${imgId}' src='${img}'>` : ``}
        <div class='twitter-card-legend'>
            <div class='twitter-card-title'>${htmlEncode(title)}</div>
            <div class='twitter-card-description'>${htmlEncode(description)}</div>
            ${domain.length > 0 ? `<div class='twitter-card-domain'>${linkIcon} ${domain}</div>` : ''}
          </div>
        </div>`)

    if (!img.startsWith('http')) {
        hideCardElement(card, imgId)
    }
}

export const openGraphPreview = (
    card: Card,
    url: string,
    tags: iMetaTag[],
    defaults: iDefaultTagValues,
    report: Report
) => {
    const imgTag = tags.find(m => m.tagLabel === 'og:image')
    const urlTag = tags.find(m => m.tagLabel === 'og:url' || m.tagLabel === 'og:image:secure_url')
    const titleTag = tags.find(m => m.tagLabel === 'og:title')
    const descriptionTag = tags.find(m => m.tagLabel === 'og:description')
    const imgId = disposableId()

    if (urlTag) {
        if (urlTag.tagValue.length === 0) {
            Tips.tag_AddValue(card, 'Facebook', urlTag.tagLabel)
        } else {
            if (!urlTag.tagValue.startsWith('http')) {
                Tips.tag_UpdateRelativePath(card, 'Facebook', urlTag.tagLabel, urlTag.originalCode)
            }
            if (urlTag.tagValue.startsWith('http://')) {
                Tips.tag_UpdateUnsafeUrl(card, 'Facebook', urlTag.tagLabel, urlTag.originalCode)
            }
        }
    } else {
        Tips.tag_Missing(card, 'Facebook', 'og:url')
    }

    if (titleTag) {
        if (titleTag.tagValue.length === 0) {
            Tips.tag_AddValue(card, 'Facebook', titleTag.tagLabel)
        } else if (titleTag.tagValue.length <= 4) {
            Tips.tag_ReplacePlaceholder(card, 'Facebook', titleTag.tagLabel, titleTag.tagValue)
        }
    } else {
        Tips.tag_Missing(card, 'Facebook', 'og:title')
    }

    if (descriptionTag) {
        if (descriptionTag.tagValue.length === 0) {
            Tips.tag_AddValue(card, 'Facebook', descriptionTag.tagLabel)
        } else if (descriptionTag.tagValue.length <= 4) {
            Tips.tag_ReplacePlaceholder(card, 'Facebook', descriptionTag.tagLabel, descriptionTag.tagValue)
        }
    } else {
        Tips.tag_Missing(card, 'Facebook', 'og:description')
    }

    if (imgTag) {
        if (imgTag.tagValue.length === 0) {
            Tips.tag_AddValue(card, 'Facebook', imgTag.tagLabel)
        } else {
            if (imgTag.tagValue.includes('/assets/no-image-')) {
                Tips.tagImage_ReplacePlaceholder(card, 'Facebook', imgTag.tagLabel, imgTag.tagValue)
            }
            if (imgTag.tagValue.length === 0) {
                Tips.tagImage_AddTag(card, 'Facebook', imgTag.tagLabel)
            }
            if (imgTag.tagValue.startsWith('https://')) {
                fileExists(imgTag.tagValue).catch(() => {
                    Tips.tagImage_UploadImage(card, 'Facebook', imgTag.tagValue, imgTag.originalCode)
                    hideCardElement(card, imgId)
                })
            }
            if (!imgTag.tagValue.startsWith('http')) {
                Tips.tag_UpdateRelativePath(card, 'Facebook', imgTag.tagLabel, imgTag.originalCode)
            }
            if (imgTag.tagValue.startsWith('http://')) {
                Tips.tag_UpdateUnsafeUrl(card, 'Facebook', imgTag.tagLabel, imgTag.originalCode)
            }
        }
    } else {
        Tips.tag_Missing(card, 'Facebook', 'og:image')
    }

    let img = imgTag?.tagValue || ''
    img = img.replace('http://', 'https://')

    let domain = urlTag?.tagValue || ''
    if (domain && domain.startsWith('http')) {
        domain = domain.replace(/https?:\/\/(www.)?((\w+\.)?\w+\.\w+).*/i, `$2`)
    }

    let title = titleTag?.tagValue || ''

    let description = descriptionTag?.tagValue || ''
    description = description.length < 215 ? description : description.substr(0, 214) + '&mldr;'

    card.add(`<div id='id-facebook-card'>        
            ${img.length > 0 ? `<img id='${imgId}' src='${img}'>` : ``}
            <div class='open-graph-card-legend'>
              ${domain.length > 0 ? `<div class='open-graph-card-domain'>${domain.toUpperCase()}</div>` : ''}
              <h2>${htmlEncode(title)}</h2>
              <div class='og-description'>${htmlEncode(description)}</div>
            </div>
          </div>`)

    if (!img.startsWith('https://')) {
        hideCardElement(card, imgId)
    }
}

const hideCardElement = (card: Card, id: string) => {
    const img = card.getDiv().querySelector(`#${id}`) as HTMLImageElement
    if(img) {
        img.style.display = 'none'
    }
}

export const tagCategories: iTagCategory[] = [
    {
        title: `Twitter Tags`,
        description:
            `With Twitter Cards, you can attach rich photos, videos and media experiences to Tweets, helping to drive traffic to your website. ` +
            `Simply add a few lines of markup to your webpage, and users who Tweet links to your content will have a "Card" added to the Tweet that's visible to their followers.`,
        url: 'https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started',
        cssClass: `icon-twitter`,
        filter: m => m.tagLabel.startsWith('twitter:'),
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
            m.tagLabel.startsWith('og:') ||
            m.tagLabel.startsWith('fb:') ||
            m.tagLabel.startsWith('ia:') ||
            m.tagLabel.startsWith('product:') ||
            m.tagLabel.startsWith('article:') ||
            m.tagLabel.startsWith('music') ||
            m.tagLabel.startsWith('video') ||
            m.tagLabel.startsWith('profile'),
        preview: openGraphPreview,
    },
    {
        title: `AppLinks Tags (Facebook)`,
        description: `Deprecated since February 2, 2020. Publishing App Link metadata is as simple as adding a few lines to the <head> tag in the HTML for your content. Apps that link to your content can then use this metadata to deep-link into your app, take users to an app store to download the app, or take them directly to the web to view the content. This allows developers to provide the best possible experience for their users when linking to their content.`,
        url: 'https://developers.facebook.com/docs/applinks/metadata-reference/',
        cssClass: 'icon-open-graph',
        filter: m => m.tagLabel.startsWith('al:'),
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
        filter: m => m.tagLabel === 'google',
        preview: noPreview,
    },
    {
        title: `REP Tags`,
        description: `REP (Robots Exclusion Protocol) are directive to control the way pages are indexed by Search Engines. In addition to root-level robots.txt files, robots exclusion directives can be applied at a more granular level through the use of Robots meta tags and X-Robots-Tag HTTP headers. The robots meta tag cannot be used for non-HTML files such as images, text files, or PDF documents.`,
        url: 'https://www.metatags.org/all-meta-tags-overview/the-important-meta-tags/meta-name-robots-tag/',
        cssClass: 'icon-rep',
        filter: m => m.tagLabel === 'robots' || m.tagLabel === 'googlebot',
        preview: noPreview,
    },
    {
        title: `Authorization Tags`,
        description: `Authorization Meta Tags are used to certify the ownership of a website or page. If you have access to the source code of the &lt;head&gt; section of a page you are trusted as owner or authorized manager of that page.`,
        url: 'https://support.google.com/webmasters/answer/9008080?hl=en#zippy=%2Chtml-tag',
        cssClass: 'icon-lock',
        filter: m =>
            m.tagLabel.includes('verification') || m.tagLabel.includes(`validate`) || m.tagLabel.includes(`verify`),
        preview: noPreview,
    },
    {
        title: `Standard Tags`,
        description: `Standard Meta tags are used by Search Engines to gather additional information about ta web page or website. The meta tag "keywords" is currently ignored (because it was abused in the past).`,
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
            ].includes(m.tagLabel),
        preview: noPreview,
    },
    {
        title: `Windows Meta Tags`,
        description: `Optional meta &lt;meta&gt; elements can be used to help Microsoft Windows to customize the default behavior of the pinned site shortcut.`,
        url: 'https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/platform-apis/ff976295(v=vs.85)',
        cssClass: 'icon-windows',
        filter: m => m.tagLabel.includes('msapplication-'),
        preview: noPreview,
    },
    {
        title: `Microsoft Docs Tags`,
        description: `Microsoft uses metadata on Docs for reporting, discoverability of the content via search, and to drive aspects of the site experience. Metadata can be applied in the article (in the YAML front matter) or globally in the docfx.json file for the repo.`,
        url: 'https://docs.microsoft.com/en-us/contribute/metadata',
        cssClass: 'icon-ms',
        filter: m => m.tagLabel.startsWith(`ms.`),
        preview: noPreview,
    },
    {
        title: `Chromium Origin Trials Tags`,
        description: `Origin trials are an approach to enable safe experimentation with web platform features.
    Briefly, the web needs new features, and iteration yields the best designs and implementations for those features. However, previous efforts have seen experiments prematurely become de-facto standards, with browser vendors scrambling to implement the features, and web developers coming to rely on these features. These experimental features became burned-in, and resistant to change (or removal), even though better implementations were identified/available.`,
        url: 'https://googlechrome.github.io/OriginTrials/',
        cssClass: 'icon-chromium',
        filter: m => m.tagLabel === 'origin-trial',
        preview: noPreview,
    },
    {
        title: `Cxense Tags`,
        description: `Cxense proprietary meta tags. Cxense was a Norwegian technology company, acquired by Piano.`,
        url: 'https://www.cxense.com/',
        cssClass: 'icon-cxense',
        filter: m => m.tagLabel.startsWith('cxense:') || m.tagLabel.startsWith('cxenseparse:'),
        preview: noPreview,
    },
    {
        title: `OutBrain Tags`,
        description: `OutBrain proprietary meta tags. Outbrain is a marketing company.`,
        url: 'https://www.outbrain.com/',
        cssClass: 'icon-outbrain',
        filter: m => m.tagLabel.startsWith('vr:'),
        preview: noPreview,
    },
    {
        title: `Apple Tags`,
        description: `Apple proprietary meta tags.`,
        url: 'https://www.apple.com/',
        cssClass: 'icon-apple',
        filter: m => m.tagLabel.startsWith('apple-'),
        preview: noPreview,
    },
    {
        title: `Shopify Tags`,
        description: `Shopify proprietary meta tags.`,
        url: 'https://www.shopify.com/',
        cssClass: 'icon-shopify',
        filter: m => m.tagLabel.startsWith('shopify-'),
        preview: noPreview,
    },
    {
        title: `Branch Tags`,
        description: `Branch proprietary meta tags. Branch isa a mobile measurement and deep linking platform, trusted by the most top ranking apps to increase efficiency and revenue.`,
        url: 'https://www.branch.com/',
        cssClass: 'icon-branch',
        filter: m => m.tagLabel.startsWith('branch:'),
        preview: noPreview,
    },
    {
        title: `Internet Explorer Tags`,
        description: `X-UA-Compatible is a document mode meta tag that allows web authors to choose what version of Internet Explorer the page should be rendered as. It is used by Internet Explorer 8 to specify whether a page should be rendered as IE 7 (compatibility view) or IE 8 (standards view).`,
        url: 'https://docs.microsoft.com/en-us/openspecs/ie_standards/ms-iedoco/380e2488-f5eb-4457-a07a-0cb1b6e4b4b5',
        cssClass: 'icon-ie',
        filter: m => m.tagLabel === `x-ua-compatible` || m.tagLabel == 'cleartype',
        preview: noPreview,
    },
    {
        title: `CSRF Tags`,
        description: `CSRF (Cross-Site Request Forgery) meta tags are indications for ajax requests to use these as one of the form parameters to make a request to the server. Rails expects the csrf as part of your form body (params) to process your requests. Using these meta tags you can construct the form body or the csrf header to suit your needs.`,
        url: 'https://cwe.mitre.org/data/definitions/352.html',
        cssClass: 'icon-lock',
        filter: m => m.tagLabel.startsWith(`csrf-`),
        preview: noPreview,
    },
    {
        title: `Google Programmable Search Engine Tags`,
        description: `Google Programmable Search Engine meta tags are used by Google Programmable Search Engine to render the result of a search local to a website.`,
        url: 'https://cse.google.com/',
        cssClass: 'icon-google',
        filter: m => m.tagLabel.startsWith(`thumbnail`),
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

export const metaTagsCard = (
    metaCat: iTagCategory,
    metaList: iMetaTag[],
    url: string,
    defaults: iDefaultTagValues,
    report: Report
) => {
    if (metaList.length === 0) {
        report.addCard(Errors.noMetaTagsInThisCategory(metaCat.title))
        return
    }

    const listOfMeta = metaList.map(m => m.originalCode.trim()).join('\n')
    const divId = disposableId()

    const links: iLink[] = [
        {
            label: 'Copy Code',
            onclick: () => copyToClipboard(divId),
        },
    ]
    if (metaCat.url.length > 0) {
        links.push({url: metaCat.url, label: 'Reference'})
    }

    const card = new Card()
        .open(`Meta Tags`, metaCat.title, links, metaCat.cssClass)
        .addParagraph(metaCat.description)
        .addCodeBlock(listOfMeta, Mode.html, divId)
        .tag('card-ok')

    metaCat.preview(card, url, metaList, defaults, report)
    report.addCard(card)
}
