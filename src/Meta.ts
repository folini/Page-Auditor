// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
// ----------------------------------------------------------------------------
import {Card as Card} from "./Card"

interface iMeta {
  property: string
  content: string
  class: string
}

interface iMetaCategory {
  title: string
  description: string
  url: string
  cssClass: string
}

const twitterLinkIcon = `<svg viewBox="0 0 24 24" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"><g><path d="M11.96 14.945c-.067 0-.136-.01-.203-.027-1.13-.318-2.097-.986-2.795-1.932-.832-1.125-1.176-2.508-.968-3.893s.942-2.605 2.068-3.438l3.53-2.608c2.322-1.716 5.61-1.224 7.33 1.1.83 1.127 1.175 2.51.967 3.895s-.943 2.605-2.07 3.438l-1.48 1.094c-.333.246-.804.175-1.05-.158-.246-.334-.176-.804.158-1.05l1.48-1.095c.803-.592 1.327-1.463 1.476-2.45.148-.988-.098-1.975-.69-2.778-1.225-1.656-3.572-2.01-5.23-.784l-3.53 2.608c-.802.593-1.326 1.464-1.475 2.45-.15.99.097 1.975.69 2.778.498.675 1.187 1.15 1.992 1.377.4.114.633.528.52.928-.092.33-.394.547-.722.547z"></path><path d="M7.27 22.054c-1.61 0-3.197-.735-4.225-2.125-.832-1.127-1.176-2.51-.968-3.894s.943-2.605 2.07-3.438l1.478-1.094c.334-.245.805-.175 1.05.158s.177.804-.157 1.05l-1.48 1.095c-.803.593-1.326 1.464-1.475 2.45-.148.99.097 1.975.69 2.778 1.225 1.657 3.57 2.01 5.23.785l3.528-2.608c1.658-1.225 2.01-3.57.785-5.23-.498-.674-1.187-1.15-1.992-1.376-.4-.113-.633-.527-.52-.927.112-.4.528-.63.926-.522 1.13.318 2.096.986 2.794 1.932 1.717 2.324 1.224 5.612-1.1 7.33l-3.53 2.608c-.933.693-2.023 1.026-3.105 1.026z"></path></g></svg>`

const twitterMetaCat: iMetaCategory = {
  title: `Twitter Tags`,
  description:
    `With Twitter Cards, you can attach rich photos, videos and media experiences to Tweets, helping to drive traffic to your website. ` +
    `Simply add a few lines of markup to your webpage, and users who Tweet links to your content will have a "Card" added to the Tweet that's visible to their followers.`,
  url: "https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started",
  cssClass: `icon-twitter`,
}

const openGraphMetaCat: iMetaCategory = {
  title: `OpenGraph Tags (Facebook)`,
  description:
    `Open Graph meta tags are snippets of code that control how URLs are displayed when shared on social media. They're part of Facebook's Open Graph protocol and are also used by other social media sites, including LinkedIn and Twitter (if Twitter Cards are absent). ` +
    `Open Graph meta tags are in the &lt;head&gt; section of a webpage.`,
  url: "https://ogp.me/",
  cssClass: "icon-open-graph",
}

const appLinksMetaCat: iMetaCategory = {
  title: `AppLinks Tags (Facebook)`,
  description:
    `Deprecated since February 2, 2020. Publishing App Link metadata is as simple as adding a few lines to the <head> tag in the HTML for your content. Apps that link to your content can then use this metadata to deep-link into your app, take users to an app store to download the app, or take them directly to the web to view the content. This allows developers to provide the best possible experience for their users when linking to their content.`,
  url: "https://developers.facebook.com/docs/applinks/metadata-reference/",
  cssClass: "icon-open-graph",
}

const swiftypeMetaCat: iMetaCategory = {
  title: `Swiftype Tags`,
  description: `Swiftype Site Search is a powerful, customizable, cloud-based site search platform. Create and manage a tailored search experience for your public facing website with best-in-class relevance, intuitive customization, and rich analytics.`,
  url: "https://swiftype.com/documentation/site-search/crawler-configuration/meta-tags",
  cssClass: "icon-swiftype",
}

const googleMetaCat: iMetaCategory = {
  title: `Google Tags`,
  description: `Google supports both page-level meta-tags and inline directives to help control how your site's pages will appear in Google Search.`,
  url: "https://developers.google.com/search/docs/advanced/crawling/special-tags",
  cssClass: "icon-google",
}

const repMetaCat: iMetaCategory = {
  title: `REP Tags`,
  description: `REP (Robots Exclusion Protocol) are directive to control the way pages are indexed by Search Engines. In addition to root-level robots.txt files, robots exclusion directives can be applied at a more granular level through the use of Robots meta tags and X-Robots-Tag HTTP headers. The robots meta tag cannot be used for non-HTML files such as images, text files, or PDF documents.`,
  url: "https://www.metatags.org/all-meta-tags-overview/the-important-meta-tags/meta-name-robots-tag/",
  cssClass: "icon-rep",
}

const authorizationMetaCat: iMetaCategory = {
  title: `Authorization Tags`,
  description: `Authorization Meta Tags are used to certify the ownership of a website or page. If you have access to the source code of the &lt;head&gt; section of a page you are trusted as owner or authorized manager of that page.`,
  url: "https://support.google.com/webmasters/answer/9008080?hl=en#zippy=%2Chtml-tag",
  cssClass: "icon-lock",
}

const standardMetaCat: iMetaCategory = {
  title: `Standard Tags`,
  description: `Standard Meta tags are used by Search Engines to gather additional information about ta web page or website. The meta tag "keywords" is currently ignored (because it was abused in the past).`,
  url: "https://moz.com/blog/the-ultimate-guide-to-seo-meta-tags",
  cssClass: "icon-seo",
}

const windowsMetaCat: iMetaCategory = {
  title: `Windows Meta Tags`,
  description: `Optional meta &lt;meta&gt; elements can be used to help Microsoft Windows to customize the default behavior of the pinned site shortcut.`,
  url: "https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/platform-apis/ff976295(v=vs.85)",
  cssClass: "icon-windows",
}

const msMetaCat: iMetaCategory = {
  title: `Microsoft Docs Tags`,
  description: `Microsoft uses metadata on Docs for reporting, discoverability of the content via search, and to drive aspects of the site experience. Metadata can be applied in the article (in the YAML front matter) or globally in the docfx.json file for the repo.`,
  url: "https://docs.microsoft.com/en-us/contribute/metadata",
  cssClass: "icon-ms",
}

const originTrialsMetaCat: iMetaCategory = {
  title: `Chromium Origin Trials Tags`,
  description: `Origin trials are an approach to enable safe experimentation with web platform features.
  Briefly, the web needs new features, and iteration yields the best designs and implementations for those features. However, previous efforts have seen experiments prematurely become de-facto standards, with browser vendors scrambling to implement the features, and web developers coming to rely on these features. These experimental features became burned-in, and resistant to change (or removal), even though better implementations were identified/available.`,
  url: "http://googlechrome.github.io/OriginTrials/",
  cssClass: "icon-chromium",
}

const cxenseMetaCat: iMetaCategory = {
  title: `Cxense Tags`,
  description: `Cxense proprietary meta tags. Cxense was a Norwegian technology company, acquired by Piano.`,
  url: "https://www.cxense.com/",
  cssClass: "icon-cxense",
}

const outbrainMetaCat: iMetaCategory = {
  title: `OutBrain Tags`,
  description: `OutBrain proprietary meta tags. Outbrain is a marketing company.`,
  url: "https://www.outbrain.com/",
  cssClass: "icon-outbrain",
}

const appleMetaCat: iMetaCategory = {
  title: `Apple Tags`,
  description: `Apple proprietary meta tags.`,
  url: "https://www.apple.com/",
  cssClass: "icon-apple",
}

const shopifyMetaCat: iMetaCategory = {
  title: `Shopify Tags`,
  description: `Shopify proprietary meta tags.`,
  url: "https://www.shopify.com/",
  cssClass: "icon-shopify",
}

const branchMetaCat: iMetaCategory = {
  title: `Branch Tags`,
  description: `Branch proprietary meta tags. Branch isa a mobile measurement and deep linking platform, trusted by the most top ranking apps to increase efficiency and revenue.`,
  url: "https://www.branch.com/",
  cssClass: "icon-branch",
}

const ieMetaCat: iMetaCategory = {
  title: `Internet Explorer Tags`,
  description: `X-UA-Compatible is a document mode meta tag that allows web authors to choose what version of Internet Explorer the page should be rendered as. It is used by Internet Explorer 8 to specify whether a page should be rendered as IE 7 (compatibility view) or IE 8 (standards view).`,
  url: "https://docs.microsoft.com/en-us/openspecs/ie_standards/ms-iedoco/380e2488-f5eb-4457-a07a-0cb1b6e4b4b5",
  cssClass: "icon-ie",
}

const csrfMetaCat: iMetaCategory = {
  title: `CSRF Tags`,
  description: `CSRF (Cross-Site Request Forgery) meta tags are indications for ajax requests to use these as one of the form parameters to make a request to the server. Rails expects the csrf as part of your form body (params) to process your requests. Using these meta tags you can construct the form body or the csrf header to suit your needs.`,
  url: "http://cwe.mitre.org/data/definitions/352.html",
  cssClass: "icon-lock",
}

const gpseMetaCat: iMetaCategory = {
  title: `Google Programmable Search Engine Tags`,
  description: `Google Programmable Search Engine meta tags are used by Google Programmable Search Engine to render the result of a search local to a website.`,
  url: "https://cse.google.com/",
  cssClass: "icon-google",
}

const otherMetaCat: iMetaCategory = {
  title: `Other Tags`,
  description: `Many development, optimization, and tracking tools are leveraging the &lt;meta&gt; tags to inject information in a web page minimizing the impact on the loading and rendering time.`,
  url: "",
  cssClass: "icon-tag",
}

export const injectableScript = () => {
  return ([...document.querySelectorAll(`head meta`)] as HTMLMetaElement[])
    .map(m => ({
      property: (
        m.getAttribute(`property`) ||
        m.getAttribute("name") ||
        m.getAttribute("http-equiv") ||
        ""
      ).toLowerCase(),
      content: m.content || "",
      class: m.getAttribute("class"),
    }))
    .filter(m => m.content !== "" && m.property !== "")
}

export const report = (data: any): string => {
  var meta = data as iMeta[]
  var report: string = ""

  var defaultTitle = meta.find(m => m.property === "og:title" || m.property === "title")?.content || ""
  var defaultDescription =
    meta.find(m => m.property === "description")?.content || ""
  var defaultImg = meta.find(m => m.property === "og:image")?.content || ""
  var defaultUrl = meta.find(m => m.property === "og:url")?.content || ""

  {
    // ---------- STANDARD
    const standardMeta = meta.filter(
      m =>
        m.property === "title" ||
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
        m.property === `theme-color`
    )
    meta = meta.filter(m => !standardMeta.includes(m))
    report += showMetaCat(standardMetaCat, standardMeta, "")
  }

  {
    // ---------- TWITTER
    const twitterMeta = meta.filter(m => m.property.startsWith("twitter:"))

    const title =
      twitterMeta.find(m => m.property === "twitter:title")?.content || defaultTitle
    const img =
      twitterMeta.find(
        m =>
          m.property === "twitter:image" || m.property === "twitter:image:src"
      )?.content || defaultImg
    var description =
      twitterMeta.find(m => m.property === "twitter:description")?.content ||
      defaultDescription
    description =
      description.length < 128
        ? description
        : description.substr(0, 128) + "&mldr;"
    var domain =
      twitterMeta.find(
        m => m.property === "twitter:domain" || m.property === "twitter:url"
      )?.content || defaultUrl
    if (domain.startsWith("http")) {
      domain = domain.replace(/https?:\/\/(www.)?((\w+\.)?\w+\.\w+).*/i, `$2`)
    }

    meta = meta.filter(m => !twitterMeta.includes(m))
    report += showMetaCat(
      twitterMetaCat,
      twitterMeta,
      twitterPreview(title, img, description, domain)
    )
  }

  {
    // ---------- OPEN GRAPH
    const openGraphMeta = meta.filter(
      m =>
        m.property.startsWith("og:") ||
        m.property.startsWith("fb:") ||
        m.property.startsWith("ia:") ||
        m.property.startsWith("product:") ||
        m.property.startsWith("article:") ||
        m.property.startsWith("music") ||
        m.property.startsWith("video") ||
        m.property.startsWith("profile")
    )
    const title =
      openGraphMeta.find(m => m.property === "og:title")?.content || ""
    const img =
      openGraphMeta.find(m => m.property === "og:image")?.content || ""
    var description =
      openGraphMeta.find(m => m.property === "og:description")?.content || ""
    description =
      description.length < 215
        ? description
        : description.substr(0, 214) + "&mldr;"
    var domain =
      openGraphMeta.find(
        m => m.property === "og:url"
      )?.content || ""
    if (domain.startsWith("http")) {
      domain = domain.replace(/https?:\/\/(www.)?((\w+\.)?\w+\.\w+).*/i, `$2`)
    }
    domain = domain.toUpperCase()

    meta = meta.filter(m => !openGraphMeta.includes(m))
    report += showMetaCat(
      openGraphMetaCat,
      openGraphMeta,
      openGraphPreview(title, img, description, domain)
    )
  }

  {
    // ---------- APP-LINKS
    const appLinksMeta = meta.filter(m => m.property.startsWith("al:"))
    meta = meta.filter(m => !appLinksMeta.includes(m))
    report += showMetaCat(appLinksMetaCat, appLinksMeta, "")
  }

  {
    // ---------- SWIFTYPE
    const swiftTypeMeta = meta.filter(m => m.class === "swiftype")
    meta = meta.filter(m => !swiftTypeMeta.includes(m))
    report += showMetaCat(swiftypeMetaCat, swiftTypeMeta, "")
  }

  {
    // ---------- GOOGLE
    const googleMeta = meta.filter(m => m.property === "google")
    meta = meta.filter(m => !googleMeta.includes(m))
    report += showMetaCat(googleMetaCat, googleMeta, "")
  }

  {
    // ---------- REP
    const repMeta = meta.filter(
      m => m.property === "robots" || m.property === "googlebot"
    )
    meta = meta.filter(m => !repMeta.includes(m))
    report += showMetaCat(repMetaCat, repMeta, "")
  }

  {
    // ---------- AUTHORIZATION
    const authorizationMeta = meta.filter(
      m =>
        m.property.includes("verification") ||
        m.property.includes(`validate`) ||
        m.property.includes(`verify`)
    )
    meta = meta.filter(m => !authorizationMeta.includes(m))
    report += showMetaCat(authorizationMetaCat, authorizationMeta, "")
  }

  {
    // ---------- WINDOWS
    const windowsMeta = meta.filter(m => m.property.includes("msapplication-"))
    meta = meta.filter(m => !windowsMeta.includes(m))
    report += showMetaCat(windowsMetaCat, windowsMeta, "")
  }

  {
    // ---------- ORIGIN TRIALS
    const originTrialsMeta = meta.filter(m => m.property === "origin-trial")
    meta = meta.filter(m => !originTrialsMeta.includes(m))
    report += showMetaCat(originTrialsMetaCat, originTrialsMeta, "")
  }

  {
    // ---------- CXENSE
    const cxenseMeta = meta.filter(
      m =>
        m.property.startsWith("cxense:") ||
        m.property.startsWith("cxenseparse:")
    )
    meta = meta.filter(m => !cxenseMeta.includes(m))
    report += showMetaCat(cxenseMetaCat, cxenseMeta, "")
  }

  {
    // ---------- OUTBRAIN
    const outbrainMeta = meta.filter(m => m.property.startsWith("vr:"))
    meta = meta.filter(m => !outbrainMeta.includes(m))
    report += showMetaCat(outbrainMetaCat, outbrainMeta, "")
  }

  {
    // ---------- APPLE
    const appleMeta = meta.filter(m => m.property.startsWith("apple-"))
    meta = meta.filter(m => !appleMeta.includes(m))
    report += showMetaCat(appleMetaCat, appleMeta, "")
  }

  {
    // ---------- SHOPIFY
    const shopifyMeta = meta.filter(m => m.property.startsWith("shopify-"))
    meta = meta.filter(m => !shopifyMeta.includes(m))
    report += showMetaCat(shopifyMetaCat, shopifyMeta, "")
  }

  {
    // ---------- BRANCH
    const branchMeta = meta.filter(m => m.property.startsWith("branch:"))
    meta = meta.filter(m => !branchMeta.includes(m))
    report += showMetaCat(branchMetaCat, branchMeta, "")
  }

  {
    // ---------- IE
    const ieMeta = meta.filter(m => m.property === `x-ua-compatible` || m.property == 'cleartype')
    meta = meta.filter(m => !ieMeta.includes(m))
    report += showMetaCat(ieMetaCat, ieMeta, "")
  }

  {
    // ---------- MS
    const msMeta = meta.filter(m => m.property.startsWith(`ms.`))
    meta = meta.filter(m => !msMeta.includes(m))
    report += showMetaCat(msMetaCat, msMeta, "")
  }

  {
    // ---------- CSRF
    const csrfMeta = meta.filter(m => m.property.startsWith(`csrf-`))
    meta = meta.filter(m => !csrfMeta.includes(m))
    report += showMetaCat(csrfMetaCat, csrfMeta, "")
  }

  {
    // ---------- Google Programmable Search Engine
    const gpseMeta = meta.filter(m => m.property.startsWith(`thumbnail`))
    meta = meta.filter(m => !gpseMeta.includes(m))
    report += showMetaCat(gpseMetaCat, gpseMeta, "")
  }

  {
    // ---------- OTHERS
    const othersMeta = meta
    report += showMetaCat(otherMetaCat, othersMeta, "")
  }

  if (report.length == 0) {
    report = new Card().warning(`No Meta Tags found on this page.`).render()
  }

  return report
}

export const eventManager = () => {
  const twitterBtn = document.getElementById(
    "id-twitter-card-preview"
  ) as HTMLAnchorElement
  if (twitterBtn !== null) {
    twitterBtn.addEventListener("click", () => toggle(twitterBtn))
  }

  const openGraphBtn = document.getElementById(
    "id-open-graph-card-preview"
  ) as HTMLAnchorElement
  if (openGraphBtn !== null) {
    openGraphBtn.addEventListener("click", () => toggle(openGraphBtn))
  }

  const swiftypeBtn = document.getElementById(
    "id-swiftype-card-preview"
  ) as HTMLAnchorElement
  if (swiftypeBtn !== null) {
    swiftypeBtn.addEventListener("click", () => toggle(swiftypeBtn))
  }
}

export const toggle = (btn: HTMLAnchorElement) => {
  const div: HTMLDivElement = btn.parentElement?.children[1] as HTMLDivElement
  if (div.classList.contains("hide")) {
    btn.innerHTML = btn.innerHTML.replace("Preview", "Hide")
    div.classList.remove("hide")
    div.classList.add("show")
  } else {
    btn.innerHTML = btn.innerHTML.replace("Hide", "Preview")
    div.classList.remove("show")
    div.classList.add("hide")
  }
}

const showMetaCat = (
  metaCat: iMetaCategory,
  metaList: iMeta[],
  preview: string
): string => {
  if (metaList.length === 0) {
    return ""
  }
  const listOfMeta = metaList
    .map(
      m =>
        `<div class='single-line-forced'>
                    <span class='label'>${m.property}:</span> 
                    <span class='value'>${m.content}</span>
                  </div>`
    )
    .join("")

  const link =
    metaCat.url.length > 0
      ? `<a target='_new' class='link-in-card' href='${metaCat.url}'>reference</a>`
      : ``

  return new Card()
    .open(`Meta Tags`, metaCat.title + link, metaCat.cssClass)
    .add(
      `
        <div class='card-description'>${metaCat.description}</div>
        <div class='meta-items'>${listOfMeta}</div>
        ${preview}
      `
    )
    .close()
    .render()
}

const twitterPreview = (
  title: string,
  img: string,
  description: string,
  domain: string
) => `
<div class='card-options'>
  <a class='link-in-card left-option' id='id-twitter-card-preview'>Preview Twitter Post</a>
  <div class='hide' id='id-twitter-card'>
  ${img.length>0 ? `<img src='${img}'>` : ``}
  <div class='twitter-card-legend'>
      <div class='twitter-card-title'>${title}</div>
      <div class='twitter-card-description'>${description}</div>
      ${
        domain.length > 0
          ? `<div class='twitter-card-domain'>${twitterLinkIcon} ${domain}</div>`
          : ""
      }
    </div>
  </div>
</div>`

const openGraphPreview = (
  title: string,
  img: string,
  description: string,
  domain: string
) => `
<div class='card-options'>
    <a class='link-in-card left-option' id='id-open-graph-card-preview'>Preview Facebook Post</a>
    <div class='hide' id='id-facebook-card'>        
      ${img.length>0 ? `<img src='${img}'>` : ``}
      <div class='open-graph-card-legend'>
        ${
          domain.length > 0
            ? `<div class='open-graph-card-domain'>${domain}</div>`
            : ""
        }
        <h2>${title}</h2>
        <div class='og-description'>${description}</div>
      </div>
    </div>
</div>`
