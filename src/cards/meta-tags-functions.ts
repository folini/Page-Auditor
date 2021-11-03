// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {iTag} from './meta-tags'
import {Report} from '../report'
import {Card, iLink, CardKind} from '../card'
import {disposableId, fileExists} from '../main'
import {Errors} from './errors'
import {Mode} from '../colorCode'
import {htmlEncode} from 'js-htmlencode'
import {Tips} from './tips'
import {codeBlock} from '../codeBlock'

interface iTagPreviewer {
    (card: Card, selectedTags: iTag[], allTags: iTag[], canonical: string): void
}

interface iTagValidator {
    (url: string): void
}

interface iTagCategoryFilter {
    (m: iTag): boolean
}

export interface iTagCategory {
    title: string
    description: string
    url: string
    cssClass: string
    filter: iTagCategoryFilter
    preview: iTagPreviewer
    validate?: iTagValidator
}

export const noPreview: iTagPreviewer = (card: Card, selectedTag: iTag[], allTags: iTag[], canonical: string) => void 0

const twitterLinkIcon =
    `<svg viewBox="0 0 24 24" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr">` +
    `<g>` +
    `<path d="M11.96 14.945c-.067 0-.136-.01-.203-.027-1.13-.318-2.097-.986-2.795-1.932-.832-1.125-1.176-2.508-.968-3.893s.942-2.605 2.068-3.438l3.53-2.608c2.322-1.716 5.61-1.224 7.33 1.1.83 1.127 1.175 2.51.967 3.895s-.943 2.605-2.07 3.438l-1.48 1.094c-.333.246-.804.175-1.05-.158-.246-.334-.176-.804.158-1.05l1.48-1.095c.803-.592 1.327-1.463 1.476-2.45.148-.988-.098-1.975-.69-2.778-1.225-1.656-3.572-2.01-5.23-.784l-3.53 2.608c-.802.593-1.326 1.464-1.475 2.45-.15.99.097 1.975.69 2.778.498.675 1.187 1.15 1.992 1.377.4.114.633.528.52.928-.092.33-.394.547-.722.547z"></path><path d="M7.27 22.054c-1.61 0-3.197-.735-4.225-2.125-.832-1.127-1.176-2.51-.968-3.894s.943-2.605 2.07-3.438l1.478-1.094c.334-.245.805-.175 1.05.158s.177.804-.157 1.05l-1.48 1.095c-.803.593-1.326 1.464-1.475 2.45-.148.99.097 1.975.69 2.778 1.225 1.657 3.57 2.01 5.23.785l3.528-2.608c1.658-1.225 2.01-3.57.785-5.23-.498-.674-1.187-1.15-1.992-1.376-.4-.113-.633-.527-.52-.927.112-.4.528-.63.926-.522 1.13.318 2.096.986 2.794 1.932 1.717 2.324 1.224 5.612-1.1 7.33l-3.53 2.608c-.933.693-2.023 1.026-3.105 1.026z"></path>` +
    `</g>` +
    `</svg>`

export const twitterPreview = (card: Card, selectedTags: iTag[], allTag: iTag[], canonical: string) => {
    console.log(`1. MetaTag Twitter Preview!`)
    const obsoleteTwitterCardValues: string[] = ['photo', 'gallery', 'product']
    const validTwitterCardValues: string[] = ['summary', 'summary_large_image', 'app', 'player']

    const imgPreviewId = disposableId()
    const imgTag = selectedTags.find(m => m.label === 'twitter:image' || m.label === 'twitter:image:src')
    const urlTag = selectedTags.find(m => m.label === 'twitter:url')
    const obsoleteTag = selectedTags.find(m => m.label === 'twitter:domain')
    const titleTag = selectedTags.find(m => m.label === 'twitter:title')
    const descriptionTag = selectedTags.find(m => m.label === 'twitter:description')
    const cardTag = selectedTags.find(m => m.label === 'twitter:card')
    const siteTag = selectedTags.find(m => m.label === 'twitter:site')

    const imgFallbackTag = allTag.find(m => m.label === 'og:image' || m.label === 'image')
    const titleFallbackTag = allTag.find(m => m.label === 'og:title' || m.label === 'title')
    const descriptionFallbackTag = allTag.find(m => m.label === 'og:description' || m.label === 'description')
    const urlFallbackTag = allTag.find(m => m.label === 'og:url' || m.label === 'url')

    let title = titleTag?.value || titleFallbackTag?.value || ''
    let img = imgTag?.value || imgFallbackTag?.value || ''
    let description = descriptionTag?.value || descriptionFallbackTag?.value || ''
    description = description.length < 128 ? description : description.substr(0, 128) + '&mldr;'
    var domain = urlTag?.value || urlFallbackTag?.value || ''

    console.log(`2. MetaTag Twitter Preview!`)
    if (domain.startsWith('http')) {
        domain = domain.replace(/https?:\/\/(www.)?((\w+\.)?\w+\.\w+).*/i, `$2`)
    }

    if (img.startsWith('http://')) {
        img = img.replace('http://', 'https://')
    }

    if (obsoleteTag) {
        Tips.tag_Obsolete(card, 'Twitter', obsoleteTag.label, obsoleteTag.code)
    }

    if (!siteTag) {
        Tips.tag_Missing(card, 'Twitter', 'twitter:site')
    }

    if (!cardTag) {
        Tips.tag_Missing(card, 'Twitter', 'twitter:card')
    } else {
        if (obsoleteTwitterCardValues.includes(cardTag.value)) {
            Tips.tag_ObsoleteValue(card, 'Twitter', cardTag, validTwitterCardValues)
        } else if (!validTwitterCardValues.includes(cardTag.value)) {
            Tips.tag_InvalidValue(card, 'Twitter', cardTag, validTwitterCardValues)
        }
    }

    if (urlTag) {
        if (urlTag.value.length === 0) {
            Tips.tag_NoValue(card, 'Twitter', urlTag)
        } else {
            if (!urlTag.value.startsWith('https://')) {
                Tips.tagUrl_RelativePath(card, 'Twitter', urlTag)
            } else if (urlTag.value.startsWith('http://')) {
                Tips.tagUrl_ObsoleteProtocol(card, 'Twitter', urlTag)
            } else if (canonical.length > 0 && urlTag.value.toLowerCase() !== canonical.toLowerCase()) {
                Tips.tagUrl_NonCanonical(card, 'Twitter', urlTag, canonical)
            }
        }
    } else {
        if (domain.length > 0) {
            Tips.tag_NonSpecific(card, 'Twitter', 'twitter:url', urlFallbackTag)
        } else {
            Tips.tag_Missing(card, 'Twitter', 'twitter:url')
        }
    }

    if (titleTag) {
        if (titleTag.value.length === 0) {
            Tips.tag_NoValue(card, 'Twitter', titleTag)
        } else if (titleTag.value.length <= 4) {
            Tips.tag_Placeholder(card, 'Twitter', titleTag)
        } else if (titleTag.value.length > 70) {
            Tips.tag_OverMaxLength(card, 'Twitter', titleTag, '70')
        } else if (titleTag.value.length > 60) {
            Tips.tag_OverRecommendedLength(card, 'Twitter', titleTag, '70', '60')
        }
    } else {
        if (title.length > 0) {
            Tips.tag_NonSpecific(card, 'Twitter', 'twitter:title', titleFallbackTag)
        } else {
            Tips.tag_Missing(card, 'Twitter', 'twitter:title')
        }
    }

    if (descriptionTag) {
        if (descriptionTag.value.length === 0) {
            Tips.tag_NoValue(card, 'Twitter', descriptionTag)
        } else if (descriptionTag.value.length <= 4) {
            Tips.tag_Placeholder(card, 'Twitter', descriptionTag)
        } else if (descriptionTag.value.length > 280) {
            Tips.tag_OverMaxLength(card, 'Twitter', descriptionTag, '280')
        } else if (descriptionTag.value.length > 200) {
            Tips.tag_OverRecommendedLength(card, 'Twitter', descriptionTag, '280', '200')
        }
    } else {
        if (description.length > 0) {
            Tips.tag_NonSpecific(card, 'Twitter', 'twitter:description', descriptionFallbackTag)
        } else {
            Tips.tag_Missing(card, 'Twitter', 'twitter:description')
        }
    }

    if (imgTag) {
        if (imgTag.value.length === 0) {
            Tips.tag_NoValue(card, 'Twitter', imgTag)
        } else {
            if (imgTag.value.includes('/assets/no-image-')) {
                Tips.tagImage_Placeholder(card, 'Twitter', imgTag)
            }
            if (!imgTag.value.startsWith('http')) {
                Tips.tagUrl_RelativePath(card, 'Twitter', imgTag)
                if (canonical.length > 0 && canonical.startsWith('http')) {
                    img = new URL(canonical).origin + imgTag.value
                }
            } else if (imgTag.value.startsWith('http://')) {
                Tips.tagUrl_ObsoleteProtocol(card, 'Twitter', imgTag)
            }
            if (imgTag.value.startsWith('https://')) {
                fileExists(img).catch(() => {
                    Tips.tagImage_NoImage(card, 'Twitter', imgTag)
                    hideCardElement(card, imgPreviewId)
                })
            }
        }
    } else {
        if (img.length > 0) {
            Tips.tag_NonSpecific(card, 'Twitter', 'twitter:image', imgFallbackTag)
        } else {
            Tips.tag_Missing(card, 'Twitter', 'twitter:image')
        }
    }

    console.log(`3. MetaTag Twitter Preview!`)
    card.addPreview(
        `<div class='box-label label-close'>Twitter Preview</div>` +
            `<div class='box-body body-close'>` +
            (img.length > 0 && img.startsWith('http')
                ? `<img class='preview-img' id='${imgPreviewId}' src='${img}'>`
                : ``) +
            `<div class='preview-legend'>` +
            (domain.length > 0 ? `<div class='twitter-card-domain'>${domain}</div>` : '') +
            `<div class='twitter-card-title'>${htmlEncode(title)}</div>` +
            `<div class='twitter-card-description'>${htmlEncode(description)}</div>` +
            `</div>` +
            `</div>` +
            `</div>`,
        'twitter-card'
    )

    console.log(`4. MetaTag Twitter Preview!`)
    if (!img.startsWith('http')) {
        hideCardElement(card, imgPreviewId)
    }
    console.log(`MetaTag End of Twitter Preview!`)
}

export const openGraphPreview = (card: Card, selectedTags: iTag[], allMeta: iTag[], canonical: string) => {
    console.log(`MetaTag begin of Facebook Preview!`)
    const imgPreviewId = disposableId()
    const imgTag = selectedTags.find(m => m.label === 'og:image')
    const urlTag = selectedTags.find(m => m.label === 'og:url' || m.label === 'og:image:secure_url')
    const titleTag = selectedTags.find(m => m.label === 'og:title')
    const descriptionTag = selectedTags.find(m => m.label === 'og:description')
    const typeTag = selectedTags.find(m => m.label === 'og:type')

    const imgFallbackTag = allMeta.find(m => m.label === 'image')
    const descriptionFallbackTag = allMeta.find(m => m.label === 'description')
    const urlFallbackTag = allMeta.find(m => m.label === 'url')
    const titleFallbackTag = allMeta.find(m => m.label === 'title')

    let url = urlTag?.value || urlFallbackTag?.value || ''
    if (url && url.startsWith('http')) {
        url = url.replace(/https?:\/\/(www.)?((\w+\.)?\w+\.\w+).*/i, `$2`)
    }

    let img = imgTag?.value || imgFallbackTag?.value || ''
    img = img.replace('http://', 'https://')

    let title = titleTag?.value || titleFallbackTag?.value || ''

    let description = descriptionTag?.value || descriptionFallbackTag?.value || ''
    description = description.length < 215 ? description : description.substr(0, 214) + '&mldr;'

    if (urlTag) {
        if (urlTag.value.length === 0) {
            Tips.tag_NoValue(card, 'Facebook', urlTag)
        } else {
            if (!urlTag.value.startsWith('http')) {
                Tips.tagUrl_RelativePath(card, 'Facebook', urlTag)
            } else if (urlTag.value.startsWith('http://')) {
                Tips.tagUrl_ObsoleteProtocol(card, 'Facebook', urlTag)
            } else if (canonical.length > 0 && urlTag.value.toLowerCase() !== canonical.toLowerCase()) {
                Tips.tagUrl_NonCanonical(card, 'Facebook', urlTag, canonical)
            }
        }
    } else {
        if (img.length > 0) {
            Tips.tag_NonSpecific(card, 'Facebook', 'og:image', imgFallbackTag)
        } else {
            Tips.tag_Missing(card, 'Facebook', 'og:url')
        }
    }

    if (titleTag) {
        if (titleTag.value.length === 0) {
            Tips.tag_NoValue(card, 'Facebook', titleTag)
        } else if (titleTag.value.length <= 4) {
            Tips.tag_Placeholder(card, 'Facebook', titleTag)
        } else if (titleTag.value.length > 95) {
            Tips.tag_OverMaxLength(card, 'Facebook', titleTag, '95')
        } else if (titleTag.value.length > 55) {
            Tips.tag_OverRecommendedLength(card, 'Facebook', titleTag, '95', '55')
        }
    } else {
        if (title.length > 0) {
            Tips.tag_NonSpecific(card, 'Facebook', 'og:title', titleFallbackTag)
        } else {
            Tips.tag_Missing(card, 'Facebook', 'og:title')
        }
    }

    const validCardValues: string[] = [
        'music.song',
        'music.album',
        'music.playlist',
        'music.radio_station',
        'video.movie',
        'video.episode',
        'video.tv_show',
        'video.other',
        'article',
        'book',
        'profile',
        'website',
        'og:product',
    ]
    if (typeTag) {
        if (typeTag.value.length === 0) {
            Tips.tag_NoValue(card, 'Facebook', typeTag)
        } else if (!validCardValues.includes(typeTag.value) && !typeTag.value.includes(':')) {
            Tips.tag_InvalidValue(card, 'Facebook', typeTag, validCardValues)
        }
    } else {
        Tips.tag_Missing(card, 'Facebook', 'og:type')
    }

    if (descriptionTag) {
        if (descriptionTag.value.length === 0) {
            Tips.tag_NoValue(card, 'Facebook', descriptionTag)
        } else if (descriptionTag.value.length <= 4) {
            Tips.tag_Placeholder(card, 'Facebook', descriptionTag)
        } else if (descriptionTag.value.length > 110) {
            Tips.tag_OverMaxLength(card, 'Facebook', descriptionTag, '110 (200 when the url is missing)')
        } else if (descriptionTag.value.length > 55) {
            Tips.tag_OverRecommendedLength(card, 'Facebook', descriptionTag, '110 (200 when the url is missing)', '55')
        }
    } else {
        if (description.length > 0) {
            Tips.tag_NonSpecific(card, 'Facebook', 'og:description', descriptionFallbackTag)
        } else {
            Tips.tag_Missing(card, 'Facebook', 'og:description')
        }
    }

    if (imgTag) {
        if (imgTag.value.length === 0) {
            Tips.tag_NoValue(card, 'Facebook', imgTag)
        } else {
            if (imgTag.value.includes('/assets/no-image-')) {
                Tips.tagImage_Placeholder(card, 'Facebook', imgTag)
            }
            if (imgTag.value.length === 0) {
                Tips.tagImage_NoTag(card, 'Facebook', imgTag.label)
            }
            if (imgTag.value.startsWith('https://')) {
                fileExists(imgTag.value).catch(() => {
                    Tips.tagImage_NoImage(card, 'Facebook', imgTag)
                    hideCardElement(card, imgPreviewId)
                })
            }
            if (!imgTag.value.startsWith('http')) {
                Tips.tagUrl_RelativePath(card, 'Facebook', imgTag)
                if (canonical.length > 0 && canonical.startsWith('http')) {
                    img = new URL(canonical).origin + imgTag.value
                }
            }
            if (imgTag.value.startsWith('http://')) {
                Tips.tagUrl_ObsoleteProtocol(card, 'Facebook', imgTag)
            }
        }
    } else {
        if (img.length > 0) {
            Tips.tag_NonSpecific(card, 'Facebook', 'og:image', imgFallbackTag)
        } else {
            Tips.tag_Missing(card, 'Facebook', 'og:image')
        }
    }

    card.addPreview(
        `<div class="box-label label-close">Facebook Preview</div>` +
            `<div class='box-body body-close'>` +
            (img.length > 0 ? `<img class='preview-img' id='${imgPreviewId}' src='${img}'>` : ``) +
            `<div class='preview-legend'>` +
            (url.length > 0 ? `<div class='open-graph-card-domain'>${url.toUpperCase()}</div>` : '') +
            `<h2>${htmlEncode(title)}</h2>` +
            `<div class='og-description'>${htmlEncode(description)}</div>` +
            `</div>` +
            `</div>` +
            `</div>`,
        'facebook-card'
    )

    if (!img.startsWith('https://')) {
        hideCardElement(card, imgPreviewId)
    }
    console.log(`MetaTag End of Facebook Preview!`)
}

const hideCardElement = (card: Card, id: string) => {
    const img = card.getDiv().querySelector(`#${id}`) as HTMLImageElement
    if (img) {
        img.style.display = 'none'
    }
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
        preview: twitterPreview,
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
        preview: openGraphPreview,
    },
    {
        title: `AppLinks Tags (Facebook)`,
        description: `Deprecated since February 2, 2020. Publishing App Link metadata is as simple as adding a few lines to the <head> tag in the HTML for your content. Apps that link to your content can then use this metadata to deep-link into your app, take users to an app store to download the app, or take them directly to the web to view the content. This allows developers to provide the best possible experience for their users when linking to their content.`,
        url: 'https://developers.facebook.com/docs/applinks/metadata-reference/',
        cssClass: 'icon-facebook',
        filter: m => m.label.startsWith('al:'),
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
        filter: m => m.label === 'google',
        preview: noPreview,
    },
    {
        title: `REP Tags`,
        description: `REP (Robots Exclusion Protocol) are directive to control the way pages are indexed by Search Engines. In addition to root-level robots.txt files, robots exclusion directives can be applied at a more granular level through the use of Robots meta tags and X-Robots-Tag HTTP headers. The robots meta tag cannot be used for non-HTML files such as images, text files, or PDF documents.`,
        url: 'https://www.metatags.org/all-meta-tags-overview/the-important-meta-tags/meta-name-robots-tag/',
        cssClass: 'icon-rep',
        filter: m => m.label === 'robots' || m.label === 'googlebot',
        preview: noPreview,
    },
    {
        title: `Authorization Tags`,
        description: `Authorization Meta Tags are used to certify the ownership of a website or page. If you have access to the source code of the &lt;head&gt; section of a page you are trusted as owner or authorized manager of that page.`,
        url: 'https://support.google.com/webmasters/answer/9008080?hl=en#zippy=%2Chtml-tag',
        cssClass: 'icon-lock',
        filter: m => m.label.includes('verification') || m.label.includes(`validate`) || m.label.includes(`verify`),
        preview: noPreview,
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
        preview: noPreview,
    },
    {
        title: `Windows Meta Tags`,
        description: `Optional Meta Tags are used to help Microsoft Windows to customize the default behavior and appearance of the pinned site shortcut.`,
        url: 'https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/platform-apis/ff976295(v=vs.85)',
        cssClass: 'icon-windows',
        filter: m => m.label.includes('msapplication-'),
        preview: noPreview,
    },
    {
        title: `Microsoft Docs Tags`,
        description: `Microsoft uses metadata on Docs for reporting, discoverability of the content via search, and to drive aspects of the site experience. Metadata can be applied in the article (in the YAML front matter) or globally in the docfx.json file for the repo.`,
        url: 'https://docs.microsoft.com/en-us/contribute/metadata',
        cssClass: 'icon-ms',
        filter: m => m.label.startsWith(`ms.`),
        preview: noPreview,
    },
    {
        title: `Chromium Origin Trials Tags`,
        description: `Origin trials are an approach to enable safe experimentation with web platform features.
    Briefly, the web needs new features, and iteration yields the best designs and implementations for those features. However, previous efforts have seen experiments prematurely become de-facto standards, with browser vendors scrambling to implement the features, and web developers coming to rely on these features. These experimental features became burned-in, and resistant to change (or removal), even though better implementations were identified/available.`,
        url: 'https://googlechrome.github.io/OriginTrials/',
        cssClass: 'icon-chromium',
        filter: m => m.label === 'origin-trial',
        preview: noPreview,
    },
    {
        title: `Cxense Tags`,
        description: `Cxense proprietary meta tags. Cxense was a Norwegian technology company, acquired by Piano.`,
        url: 'https://www.cxense.com/',
        cssClass: 'icon-cxense',
        filter: m => m.label.startsWith('cxense:') || m.label.startsWith('cxenseparse:'),
        preview: noPreview,
    },
    {
        title: `OutBrain Tags`,
        description: `OutBrain proprietary meta tags. Outbrain is a marketing company.`,
        url: 'https://www.outbrain.com/',
        cssClass: 'icon-outbrain',
        filter: m => m.label.startsWith('vr:'),
        preview: noPreview,
    },
    {
        title: `Apple Tags`,
        description: `Apple proprietary meta tags.`,
        url: 'https://www.apple.com/',
        cssClass: 'icon-apple',
        filter: m => m.label.startsWith('apple-'),
        preview: noPreview,
    },
    {
        title: `Shopify Tags`,
        description: `Shopify proprietary meta tags.`,
        url: 'https://www.shopify.com/',
        cssClass: 'icon-shopify',
        filter: m => m.label.startsWith('shopify-'),
        preview: noPreview,
    },
    {
        title: `Branch Tags`,
        description: `Branch proprietary meta tags. Branch isa a mobile measurement and deep linking platform, trusted by the most top ranking apps to increase efficiency and revenue.`,
        url: 'https://www.branch.com/',
        cssClass: 'icon-branch',
        filter: m => m.label.startsWith('branch:'),
        preview: noPreview,
    },
    {
        title: `Internet Explorer Tags`,
        description: `X-UA-Compatible is a document mode meta tag that allows web authors to choose what version of Internet Explorer the page should be rendered as. It is used by Internet Explorer 8 to specify whether a page should be rendered as IE 7 (compatibility view) or IE 8 (standards view).`,
        url: 'https://docs.microsoft.com/en-us/openspecs/ie_standards/ms-iedoco/380e2488-f5eb-4457-a07a-0cb1b6e4b4b5',
        cssClass: 'icon-ie',
        filter: m => m.label === `x-ua-compatible` || m.label == 'cleartype',
        preview: noPreview,
    },
    {
        title: `CSRF Tags`,
        description: `CSRF (Cross-Site Request Forgery) meta tags are indications for ajax requests to use these as one of the form parameters to make a request to the server. Rails expects the csrf as part of your form body (params) to process your requests. Using these meta tags you can construct the form body or the csrf header to suit your needs.`,
        url: 'https://cwe.mitre.org/data/definitions/352.html',
        cssClass: 'icon-lock',
        filter: m => m.label.startsWith(`csrf-`),
        preview: noPreview,
    },
    {
        title: `Google Programmable Search Engine Tags`,
        description: `Google Programmable Search Engine meta tags are used by GoogThe meta tag "keywords"le Programmable Search Engine to render the result of a search local to a website.`,
        url: 'https://cse.google.com/',
        cssClass: 'icon-google',
        filter: m => m.label.startsWith(`thumbnail`),
        preview: noPreview,
    },
    {
        title: `Other Tags`,
        description: `Many development, optimization, and tracking tools are leveraging the <code>&lt;meta&gt;</code> tags to inject information in a web page minimizing the impact on the loading and rendering time.`,
        url: '',
        cssClass: 'icon-tag',
        filter: m => true,
        preview: noPreview,
    },
]

export const metaTagsCard = (
    allTags: iTag[],
    tagCategory: iTagCategory,
    selectedTags: iTag[],
    canonical: string,
    report: Report
) => {
    if (selectedTags.length === 0) {
        console.log(`MetaTag card [selectedTags.length === 0]`)
        const card = Errors.internal_NoMetaTagsInThisCategory(tagCategory.title)
        report.addCard(card)
        Tips.sd_noSdInChromeBrowserPages(card)
        return
    }

    const listOfMeta = selectedTags.map(m => m.code.trim()).join('\n')
    const divId = disposableId()

    const links: iLink[] = []
    if (tagCategory.url.length > 0) {
        links.push({url: tagCategory.url, label: 'Reference'})
    }
    const linksHtml = links
        .map(link => `<a class='small-btn' href='${link.url}' target='_blank'>${link.label}</a>`)
        .join(' ')

    const table = selectedTags.map(tag => [tag.label, tag.value])

    console.log(`MetaTag card almost ready!`)
    const card = new Card(CardKind.report)
        .open(`Detected Meta Tags`, tagCategory.title, tagCategory.cssClass)
        .addParagraph(tagCategory.description)
        .addTable(`Tags Analysis`, table)
        .addExpandableBlock('HTML Code' + linksHtml, codeBlock(listOfMeta, Mode.html))
        .tag('card-ok')
    console.log(`MetaTag card Done!`)

    console.log(`MetaTag before Preview!`)
    tagCategory.preview(card, selectedTags, allTags, canonical)
    console.log(`MetaTag after Preview!`)
    report.addCard(card)
}
