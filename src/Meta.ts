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

const twitterMetaCat: iMetaCategory = {
  title: `Twitter Meta Tags`,
  description:
    `With Twitter Cards, you can attach rich photos, videos and media experiences to Tweets, helping to drive traffic to your website. ` +
    `Simply add a few lines of markup to your webpage, and users who Tweet links to your content will have a "Card" added to the Tweet that's visible to their followers.`,
  url: "https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started",
  cssClass: `icon-twitter`,
}

const openGraphMetaCat: iMetaCategory = {
  title: `OpenGraph Meta Tags`,
  description:
    `Open Graph meta tags are snippets of code that control how URLs are displayed when shared on social media. They're part of Facebook's Open Graph protocol and are also used by other social media sites, including LinkedIn and Twitter (if Twitter Cards are absent). ` +
    `Open Graph meta tags are in the &lt;head&gt; section of a webpage.`,
  url: "https://ogp.me/",
  cssClass: "icon-open-graph",
}

const swiftypeMetaCat: iMetaCategory = {
  title: `Swiftype Meta Tags`,
  description: `Swiftype Site Search is a powerful, customizable, cloud-based site search platform. Create and manage a tailored search experience for your public facing website with best-in-class relevance, intuitive customization, and rich analytics.`,
  url: "https://swiftype.com/documentation/site-search/crawler-configuration/meta-tags",
  cssClass: "icon-swiftype",
}

const repMetaCat: iMetaCategory = {
  title: `REP Meta Tags`,
  description: `REP (Robots Exclusion Protocol) are directive to control the way pages are indexed by Search Engines. In addition to root-level robots.txt files, robots exclusion directives can be applied at a more granular level through the use of Robots meta tags and X-Robots-Tag HTTP headers. The robots meta tag cannot be used for non-HTML files such as images, text files, or PDF documents.`,
  url: "https://www.metatags.org/all-meta-tags-overview/the-important-meta-tags/meta-name-robots-tag/",
  cssClass: "icon-rep",
}

const authorizationMetaCat: iMetaCategory = {
  title: `Authorization Meta Tags`,
  description: `Authorization Meta Tags are used to certify the ownership of a website or page. If you have access to the source code of the &lt;head&gt; section of a page you are trusted as owner or authorized manager of that page.`,
  url: "https://support.google.com/webmasters/answer/9008080?hl=en#zippy=%2Chtml-tag",
  cssClass: "icon-lock",
}

const seoMetaCat: iMetaCategory = {
  title: `Standard Meta Tags`,
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
  title: `Microsoft Docs Meta Tags`,
  description: `Microsoft uses metadata on Docs for reporting, discoverability of the content via search, and to drive aspects of the site experience. Metadata can be applied in the article (in the YAML front matter) or globally in the docfx.json file for the repo.`,
  url: "https://docs.microsoft.com/en-us/contribute/metadata",
  cssClass: "icon-ms",
}

const originTrialsMetaCat: iMetaCategory = {
  title: `Chromium Origin Trials Meta Tags`,
  description: `Origin trials are an approach to enable safe experimentation with web platform features.
  Briefly, the web needs new features, and iteration yields the best designs and implementations for those features. However, previous efforts have seen experiments prematurely become de-facto standards, with browser vendors scrambling to implement the features, and web developers coming to rely on these features. These experimental features became burned-in, and resistant to change (or removal), even though better implementations were identified/available.`,
  url: "http://googlechrome.github.io/OriginTrials/",
  cssClass: "icon-chromium",
}

const cxenseMetaCat: iMetaCategory = {
  title: `Cxense Meta Tags`,
  description: `Cxense proprietary meta tags. Cxense was a Norwegian technology company, acquired by Piano.`,
  url: "https://www.cxense.com/",
  cssClass: "icon-cxense",
}

const outbrainMetaCat: iMetaCategory = {
  title: `OutBrain Meta Tags`,
  description: `OutBrain proprietary meta tags. Outbrain is a marketing company.`,
  url: "https://www.outbrain.com/",
  cssClass: "icon-outbrain",
}

const appleMetaCat: iMetaCategory = {
  title: `Apple Meta Tags`,
  description: `Apple proprietary meta tags.`,
  url: "https://www.apple.com/",
  cssClass: "icon-apple",
}

const shopifyMetaCat: iMetaCategory = {
  title: `Shopify Meta Tags`,
  description: `Shopify proprietary meta tags.`,
  url: "https://www.shopify.com/",
  cssClass: "icon-shopify",
}

const branchMetaCat: iMetaCategory = {
  title: `Branch Meta Tags`,
  description: `Branch proprietary meta tags. Branch isa a mobile measurement and deep linking platform, trusted by the most top ranking apps to increase efficiency and revenue.`,
  url: "https://www.branch.com/",
  cssClass: "icon-branch",
}

const ieMetaCat: iMetaCategory = {
  title: `Internet Explorer Meta Tags`,
  description: `X-UA-Compatible is a document mode meta tag that allows web authors to choose what version of Internet Explorer the page should be rendered as. It is used by Internet Explorer 8 to specify whether a page should be rendered as IE 7 (compatibility view) or IE 8 (standards view).`,
  url: "https://docs.microsoft.com/en-us/openspecs/ie_standards/ms-iedoco/380e2488-f5eb-4457-a07a-0cb1b6e4b4b5",
  cssClass: "icon-ie",
}

const csrfMetaCat: iMetaCategory = {
  title: `CSRF Meta Tags`,
  description: `CSRF (Cross-Site Request Forgery) meta tags are indications for ajax requests to use these as one of the form parameters to make a request to the server. Rails expects the csrf as part of your form body (params) to process your requests. Using these meta tags you can construct the form body or the csrf header to suit your needs..`,
  url: "http://cwe.mitre.org/data/definitions/352.html",
  cssClass: "icon-lock",
}

const otherMetaCat: iMetaCategory = {
  title: `Other Meta Tags`,
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
        "n/a"
      ).toLowerCase(),
      content: m.content || "n/a",
      class: m.getAttribute("class"),
    }))
    .filter(m => m.content !== "n/a" && m.property !== "n/a")
}

export const report = (data: any): string => {
  var meta = data as iMeta[]
  var report: string = ""

  // ---------- TWITTER
  const twitterMeta = meta.filter(m => m.property.startsWith("twitter:"))
  meta = meta.filter(m => !twitterMeta.includes(m))

  if (twitterMeta.length > 0) {
    const listOfMeta = twitterMeta
      .map(
        m =>
          `<div class='single-line-forced'>
            <span class='label'>${m.property}:</span> 
            <span class='value'>${m.content}</span>
          </div>`
      )
      .join("")

    const title =
      twitterMeta.find(m => m.property === "twitter:title")?.content || "n/a"
    const img =
      twitterMeta.find(m => m.property === "twitter:image")?.content || "n/a"
    var description =
      twitterMeta.find(m => m.property === "twitter:description")?.content ||
      "n/a"
    description =
      description.length < 215
        ? description
        : description.substr(0, 214) + "&mldr;"
    const link =
      twitterMetaCat.url.length > 0
        ? `<a target='_new' class='link-in-card' href='${twitterMetaCat.url}'>website</a>`
        : ``

    report += new Card()
      .open(``, twitterMetaCat.title + link, twitterMetaCat.cssClass)
      .add(
        `
      <div class='card-description'>${twitterMetaCat.description}</div>
      <div class='meta-items'>${listOfMeta}</div>
      <div class='card-options'>
          <a class='link-in-card left-option' id='id-twitter-card-preview'>Preview Twitter Post</a>
          <div class='hide' id='id-twitter-card'>
          <h2>${title}</h2>
          <img src='${img}'>
          <div>${description}</div>
          </div>
      </div>`
      )
      .close()
      .render()
  }

  // ---------- OPEN GRAPH
  const openGraphMeta = meta.filter(
    m =>
      m.property.startsWith("og:") ||
      m.property.startsWith("fb:") ||
      m.property.startsWith("product:") ||
      m.property.startsWith("article:") ||
      m.property.startsWith("music") ||
      m.property.startsWith("video") ||
      m.property.startsWith("profile")
  )
  meta = meta.filter(m => !openGraphMeta.includes(m))

  if (openGraphMeta.length > 0) {
    const listOfMeta = openGraphMeta
      .map(
        m =>
          `<div class='single-line-forced'>
            <span class='label'>${m.property}:</span> 
            <span class='value'>${m.content}</span>
          </div>`
      )
      .join("")

    const title =
      openGraphMeta.find(m => m.property === "og:title")?.content || "n/a"
    const img =
      openGraphMeta.find(m => m.property === "og:image")?.content || "n/a"
    var description =
      openGraphMeta.find(m => m.property === "og:description")?.content || "n/a"
    description =
      description.length < 215
        ? description
        : description.substr(0, 214) + "&mldr;"
    const link =
      openGraphMetaCat.url.length > 0
        ? `<a target='_new' class='link-in-card' href='${openGraphMetaCat.url}'>website</a>`
        : ``

    report += new Card()
      .open(``, openGraphMetaCat.title + link, openGraphMetaCat.cssClass)
      .add(
        `
      <div class='card-description'>${openGraphMetaCat.description}</div>
      <div class='meta-items'>${listOfMeta}</div>
      <div class='card-options'>
          <a class='link-in-card left-option' id='id-open-graph-card-preview'>Preview Facebook Post</a>
          <div class='hide' id='id-facebook-card'>        
          <img src='${img}'>
          <div>
            <h2>${title}</h2>
            ${description}</div>
          </div>
      </div>`
      )
      .close()
      .render()
  }

  // ---------- SWIFTYPE
  const swiftTypeMeta = meta.filter(m => m.class === "swiftype")
  meta = meta.filter(m => !swiftTypeMeta.includes(m))
  report += showMetaCat(swiftypeMetaCat, swiftTypeMeta)

  // ---------- REP
  const repMeta = meta.filter(
    m => m.property === "robots" || m.property === "googlebot"
  )
  meta = meta.filter(m => !repMeta.includes(m))
  report += showMetaCat(repMetaCat, repMeta)

  // ---------- AUTHORIZATION
  const authorizationMeta = meta.filter(
    m =>
      m.property.includes("verification") ||
      m.property.includes(`validate`) ||
      m.property.includes(`verify`)
  )
  meta = meta.filter(m => !authorizationMeta.includes(m))
  report += showMetaCat(authorizationMetaCat, authorizationMeta)

  // ---------- SEO
  const seoMeta = meta.filter(
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
      m.property === `refresh`
  )
  meta = meta.filter(m => !seoMeta.includes(m))
  report += showMetaCat(seoMetaCat, seoMeta)

  // ---------- WINDOWS
  const windowsMeta = meta.filter(m => m.property.includes("msapplication-"))
  meta = meta.filter(m => !windowsMeta.includes(m))
  report += showMetaCat(windowsMetaCat, windowsMeta)

  // ---------- ORIGIN TRIALS
  const originTrialsMeta = meta.filter(m => m.property === "origin-trial")
  meta = meta.filter(m => !originTrialsMeta.includes(m))
  report += showMetaCat(originTrialsMetaCat, originTrialsMeta)

  // ---------- CXENSE
  const cxenseMeta = meta.filter(m => m.property.startsWith("cxense:") || m.property.startsWith("cxenseparse:"))
  meta = meta.filter(m => !cxenseMeta.includes(m))
  report += showMetaCat(cxenseMetaCat, cxenseMeta)

  // ---------- OUTBRAIN
  const outbrainMeta = meta.filter(m => m.property.startsWith("vr:"))
  meta = meta.filter(m => !outbrainMeta.includes(m))
  report += showMetaCat(outbrainMetaCat, outbrainMeta)

  // ---------- APPLE
  const appleMeta = meta.filter(m => m.property.startsWith("apple-"))
  meta = meta.filter(m => !appleMeta.includes(m))
  report += showMetaCat(appleMetaCat, appleMeta)

  // ---------- SHOPIFY
  const shopifyMeta = meta.filter(m => m.property.startsWith("shopify-"))
  meta = meta.filter(m => !shopifyMeta.includes(m))
  report += showMetaCat(shopifyMetaCat, shopifyMeta)

  // ---------- BRANCH
  const branchMeta = meta.filter(m => m.property.startsWith("branch:"))
  meta = meta.filter(m => !branchMeta.includes(m))
  report += showMetaCat(branchMetaCat, branchMeta)

  // ---------- IE
  const ieMeta = meta.filter(m => m.property === `x-ua-compatible`)
  meta = meta.filter(m => !ieMeta.includes(m))
  report += showMetaCat(ieMetaCat, ieMeta)

  // ---------- MS
  const msMeta = meta.filter(m => m.property.startsWith(`ms.`))
  meta = meta.filter(m => !msMeta.includes(m))
  report += showMetaCat(msMetaCat, msMeta)

  // ---------- CSRF
  const csrfMeta = meta.filter(m => m.property.startsWith(`csrf-`))
  meta = meta.filter(m => !csrfMeta.includes(m))
  report += showMetaCat(csrfMetaCat, csrfMeta)

  // ---------- OTHERS
  const othersMeta = meta
  report += showMetaCat(otherMetaCat, othersMeta)

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

const showMetaCat = (metaCat: iMetaCategory, metaList: iMeta[]): string => {
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
      ? `<a target='_new' class='link-in-card' href='${metaCat.url}'>website</a>`
      : ``

  return new Card()
    .open(``, metaCat.title + link, metaCat.cssClass)
    .add(
      `
        <div class='card-description'>${metaCat.description}</div>
        <div class='meta-items'>${listOfMeta}</div>
      `
    )
    .close()
    .render()
}
