// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {iTag} from './meta-tags'
import {codeBlock} from '../codeBlock'
import {Card, iLink} from '../card'
import {sitemapMaxSize} from '../main'
import {Mode} from '../colorCode'
import {formatNumber} from '../main'

export type Platform = 'Twitter' | 'Facebook' | 'Instagram' | 'LinkedIn' | 'YouTube' | 'Reddit'

type iTagExample = {
    msg: string
    code: string
}

const twitterMetaTagsReference: iLink = {
    label: 'Learn about Twitter Meta Tags',
    url: 'https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started',
}

const openGraphMetaTagsReference: iLink = {
    label: 'Learn about Facebook Meta Tags',
    url: 'https://ogp.me/',
}

const sitemapReference: iLink = {
    label: 'Sitemap.xml Reference',
    url: 'https://www.woorank.com/en/blog/how-to-locate-a-sitemap-in-a-robots-txt-file',
}

const sitemapSyntaxReference: iLink = {
    label: 'Sitemap.xml Syntax',
    url: 'https://www.sitemaps.org/protocol.html',
}

const robotsTxtReference: iLink = {
    label: 'Robots.txt Reference',
    url: 'https://developers.google.com/search/docs/advanced/robots/robots_txt',
}

const structuredDataReference: iLink = {
    label: 'Learn About Structured Data',
    url: 'https://developers.google.com/search/docs/advanced/structured-data/product',
}

const structuredDataHowToUse: iLink = {
    label: 'How to Use Structured Data',
    url: 'https://folini.medium.com/how-to-boost-your-pages-seo-with-json-ld-structured-data-bfa03ef48d42',
}

const metaTagsReference: iLink = {
    label: 'Meta Tags Reference',
    url: 'https://moz.com/blog/the-ultimate-guide-to-seo-meta-tags',
}

const tweeterImageSpecs =
    'Images must be less than 5MB in size. JPG, PNG, WEBP and GIF formats are supported. Only the first frame of an animated GIF will be used. SVG is not supported.'

const facebookImageSpecs = `The most frequently recommended resolution for an OG image is 1200 pixels x 627 pixels (1.91/1 ratio). At this size, your thumbnail will be big and stand out from the crowd. Just don't exceed the 5MB size limit.`

export class Tips {
    static #tipNumber = 1

    static essentialOpenGraphTags = ['og:title', 'og:description', 'og:image', 'og:url']

    static essentialTwitterTags = ['twitter:title', 'twitter:description', 'twitter:image']

    static tagIsEssential(tag: string) {
        return Tips.essentialOpenGraphTags.includes(tag) || Tips.essentialTwitterTags.includes(tag)
    }

    public static resetTipCounter() {
        this.#tipNumber = 1
    }

    static #what(...msg: string[]) {
        return this.#whatWhyHow(`What's Wrong?`, ...msg)
    }

    static #why(...msg: string[]) {
        return this.#whatWhyHow(`Why To Fix It?`, ...msg)
    }

    static #how(...msg: string[]) {
        return this.#whatWhyHow(`How to Fix It?`, ...msg)
    }

    static #whatWhyHow(label: string, ...msg: string[]) {
        return (
            `<div class='tip-what-why-how'>` +
            `<b>${label} </b>` +
            msg
                .map(str => (str.startsWith(`<div class='code'`) ? `<div class='tip-code'>${str}</div>` : str))
                .join(' ') +
            `</div>`
        )
    }

    // ----------------------------------------------------------------------------
    // INTERNAL ERROR TIPS
    public static internalError(card: Card) {
        const msg1 = `Something went wrong.`
        const msg2 = `Consider updating the "Page Auditor" Chrome Extension to the latest version.`
        card.addTip(
            `Tip #${this.#tipNumber++}: Update Page Auditor to the latest version`,
            [msg1, msg2],
            robotsTxtReference
        )
    }

    public static unableToAnalyzeChromeBrowserPages(card: Card) {
        const msg1 = `The internal pages of Google Chrome browser as well the empty tabs can not be analyzed by <i>Page Auditor</i> Chrome Extension.`
        const msg2 = `Consider opening any website before opening the "Page Auditor" Chrome Extension`
        card.addTip(`Tip #${this.#tipNumber++}: Open a Regular WebSite or Web Page`, [msg1, msg2], robotsTxtReference)
    }

    // ----------------------------------------------------------------------------
    // Robots TXT TIPS
    public static noRobotsTxtInChromeBrowserPages(card: Card) {
        const msg1 = `The internal pages of Google Chrome browser as well the empty tabs don't have a <code>robots.txt</code> associated.`
        const msg2 = `Consider opening any website before opening the "Page Auditor" Chrome Extension.`
        card.addTip(`Tip #${this.#tipNumber++}: Open a Regular WebSite or Web Page`, [msg1, msg2], robotsTxtReference)
    }

    public static duplicateSitemapsInRobots(card: Card, urls: string[]) {
        urls = [...new Set(urls)]
        const what = Tips.#what(`The <code>robots.txt</code> file links multiple times the same sitemap's url.`)
        const why = Tips.#why(
            `Sitemaps files should always be linked from the <code>robots.txt</code> file, but only once.`,
            `Multiple links can confuse the search-engine crawlers and can waste your crawling budget on the same pages.`
        )
        const how = Tips.#how(
            `Update <code>robots.txt</code> making sure each <code>sitemap.xml</code> file is mentioned only one time.`,
            `This is a list of the duplicate Urls:`,
            codeBlock(urls.join('<br>'), Mode.txt)
        )
        card.addTip(
            `Tip #${this.#tipNumber++}: Remove Duplicate Sitemap Links`,
            [what, why, how],
            robotsTxtReference,
            25
        )
    }

    public static unsafeSitemapLinkInRobots(card: Card, urls: string[]) {
        const what = Tips.#what(
            `The <code>robots.txt</code> file refers a sitemap url using the unsafe and obsolete <code>http:</code> protocol instead of the safest and recommended <code>https:</code> protocol.`
        )
        const why = Tips.#why(
            `It's important to correct and update the sitemap links in the  <code>robots.txt</code> by switching to the <code>https:</code> protocol.`,
            `Using the right protocol will ensure that Google crawler as well other search-engine crawler will not skip your <code>sitemap.xml</code> file.`,
            `Sitemap files must be always linked using the safe <code>https</code> protocol.`
        )
        const how = Tips.#how(
            `Update <code>robots.txt</code> replacing in all links <code>http:</code> making with <code>https:</code> protocol.`,
            `This is a list of the unsafe Urls:`,
            codeBlock(urls.join('<br>'), Mode.txt)
        )
        card.addTip(`Tip #${this.#tipNumber++}: Update Unsafe Sitemap Link`, [what, why, how], robotsTxtReference, 35)
    }

    public static addSitemapLinkToRobotsTxt = (card: Card, domain: string) => {
        const what = Tips.#what(`The <code>robots.txt</code> doesn't list any <code>sitemap.xml</code> file.`)
        const why = Tips.#why(
            `Linking a Sitemap from <code>Robots.txt</code> is a way to ensure Google bot doesn't miss it. It's an optional directive, but strongly recommended.`,
            `While Google crawler can leverage the information provided in the GSC (Google Search Console), other search-engines might benefit from finding a list of sitemaps in the <code>robots.txt</code> file.`
        )
        const how = Tips.#how(
            `If you have a Sitemap-Index file, you can include the location of just that file, and you don't need to list each individual Sitemap listed in the index file.`,
            `Add the link to your <code>sitemap.xml</code> to the <code>robots.txt</code> file with a line similar to the following:`,
            codeBlock(`Sitemap: ${domain}/sitemap.xml`, Mode.txt),
            `This directive is independent of the user-agent line, so it doesn't matter where you place it in your file.`
        )
        card.addTip(
            `Tip #${this.#tipNumber++}: Link Your Sitemap.xml From Robots.txt`,
            [what, why, how],
            robotsTxtReference,
            50
        )
    }

    public static malformedRobotsTxt(card: Card) {
        const msg1 =
            `Double check the syntax of the <code>robots.txt</code> and update it ASAP. ` +
            `It's important for the <code>robots.txt</code> file to be consistent with the standard syntax. `
        const msg2 = `The <code>Robots.txt</code> of a website, if present, is extensively used by all Search Engines bots a it's a very important factor in SEO ranking of the site.`
        card.addTip(`Tip  #${this.#tipNumber++}: Fix Robots.txt Syntax`, [msg1], robotsTxtReference, 75)
    }

    public static emptyRobotsTxt(card: Card) {
        const what = Tips.#what(`The <code>robots.txt</code> file is empty.`)
        const why = Tips.#why(
            `It's critical to add the missing content to the <code>robots.txt</code> file.`,
            `Robots.txt are a very important factor in SEO ranking.`,
            `Unless this is a trivial website, there are pages that should not be indexed and therefore should be included in the robots.txt`
        )
        const how = Tips.#how(
            `Add a few lines to the empty robots.txt blocking the pages you don't want to be indexed by the search-engines crawlers.`,
            `Typical examples of pages you don't want to be indexed are login pages, account pages, cart pages, order confirmation pages.`,
            `Also any temporary page you might have in your website should be disallowed in the robots.txt file.`
        )
        card.addTip(`Tip #${this.#tipNumber++}: Add Content to Robots.txt`, [what, why, how], robotsTxtReference, 40)
    }

    public static missingRobotsTxt(card: Card) {
        const what = Tips.#what(`The <code>robots.txt</code> file is missing from this website.`)
        const why = Tips.#why(
            `It's critical to add a <code>robots.txt</code> file to this website.`,
            `Robots.txt are a very important factor in SEO ranking.`,
            `They provide a list of pages the crawlers are allowed to index, and a lis of pages to avoid (like temporary, login, and cart pages)`
        )
        const how = Tips.#how(
            `Add a simple <code>robots.txt</code> file.`,
            `To begin, you can write as a simple text file and upload it to your website.`,
            `Many website platform provide tools or option to automatically create a robots.txt file for you.`
        )
        card.addTip(`Tip  #${this.#tipNumber++}: Add Robots.txt file`, [what, why, how], robotsTxtReference, 80)
    }

    public static sitemapInRobotsDoesNotExist(card: Card, url: string) {
        const msg1 =
            `The <code>robots.txt</code> file list <code>sitemap.xml</code> url pointing to a file that doesn't exist. ` +
            `This is the broken link:`
        const msg2 = codeBlock(url, Mode.txt)
        card.addTip(`Tip #${this.#tipNumber++}: Add Robots.txt file`, [msg1, msg2], robotsTxtReference, 50)
    }

    // ------------------------------------------------------------------------
    // SITEMAP XML TIPS
    public static noSitemapInChromeBrowserPages(card: Card) {
        const msg1 = `The internal pages of Google Chrome browser as well the empty tabs don't have a <code>sitemap.xml</code> associated.`
        const msg2 = `Consider opening any website before opening the "Page Auditor" Chrome Extension`
        card.addTip(`Tip #${this.#tipNumber++}: Open a Regular WebSite or Web Page`, [msg1, msg2], robotsTxtReference)
    }

    public static missingSitemap(card: Card) {
        const what = Tips.#what(`The <code>sitemap.xml</code> file is missing.`)
        const why = Tips.#why(
            `It's critical to add the missing <code>sitemap.xml</code> file.`,
            `Sitemaps are a very important factor in SEO ranking of a page.`,
            `A good XML sitemap acts as a roadmap of your website that leads Google to all your important pages.`,
            `XML sitemaps can be good for SEO, as they allow Google to find your essential website pages quickly, even if your internal linking isn't perfect.`
        )
        const how = Tips.#how(
            `Add a simple <code>sitemap.xml</code> file.`,
            `To begin, you can start writing as a simple text file and upload it to your website.`,
            `Many website platform provide tools or option to automatically create the sitemap.`
        )
        card.addTip(`Tip #${this.#tipNumber++}: Add a Sitemap.xml File`, [what, why, how], sitemapSyntaxReference, 85)
    }

    public static uncompressedLargeSitemap(card: Card, url: string, size: number) {
        const msg1 =
            `This sitemap file size is about ${(size / 1024).toFixed(2)} KB. ` +
            `The recommended maximum size for uncompressed files is ${formatNumber(
                sitemapMaxSize / 1024 / 1024
            )} MB. ` +
            `However, Google and Bing can handle sitemap.xml file files up to 50 Mb in uncompressed size. `
        const msg2 =
            `Compressing your sitemap.xml with <i>gzip</i> will reduce the load on your server and speedup upload and download of the file. ` +
            `However, there are no SEO direct benefits in compressing a sitemap.`
        card.addTip(`Tip #${this.#tipNumber++}: Compress Sitemap`, [msg1, msg2], sitemapSyntaxReference, 15)
    }

    public static sitemapWithoutXmlExtension = (card: Card, url: string) => {
        const msg1 =
            `This sitemap's url is lacking the standard extension for XML files: <code>.xml</code>. ` +
            `Consider to adopt the best practices for sitemaps by adding the <code>.xml</code> extension. ` +
            `However, Google bot should be able to process your sitemaps even if they don't have the correct extension.`
        card.addTip(
            `Tip #${this.#tipNumber++}: Add the XML Extension to Your Sitemap`,
            [msg1],
            sitemapSyntaxReference,
            25
        )
    }

    public static compressedSitemapNotFound(card: Card, url: string) {
        const msg1 =
            `This compressed file at the doesn't exist. ` +
            `Upload the file to the webserver to let Google bot properly index the website.`
        card.addTip(
            `Tip #${this.#tipNumber++}: Upload The Missing Compressed Sitemap File`,
            [msg1],
            sitemapReference,
            80
        )
    }

    public static malformedSitemapXml(card: Card) {
        const msg1 =
            `Double check the syntax of the <code>sitemap.xml</code> and update it ASAP. ` +
            `It's important for the <code>sitemap.xml</code> file to be consistent with the standard XML syntax. `
        const msg2 = `The <code>sitemap.xml</code> of a website, if present, is extensively used by all Search Engines bots a it's a very important factor in SEO ranking of the site.`
        card.addTip(`Tip #${this.#tipNumber++}: Fix Sitemap.xml Syntax`, [msg1, msg2], sitemapSyntaxReference, 80)
    }

    // ------------------------------------------------------------------------
    // META TAGS TIPS

    static #tagExample(tagLabel: string, platform: string) {
        let exampleTagValue = ''
        if (tagLabel.includes('url')) {
            exampleTagValue = `https://mydomain.com/my_page.htm`
        } else if (tagLabel.includes('image')) {
            exampleTagValue = `https://mydomain.com/my_image.png`
        } else if (tagLabel.includes('title')) {
            exampleTagValue = `My click capturing title for ${platform}`
        } else if (tagLabel.includes('description')) {
            exampleTagValue = `My short description of the page for ${platform}`
        } else if (tagLabel === 'twitter:site') {
            exampleTagValue = `@myTwitterId`
        }
        if (exampleTagValue === '') {
            return ''
        }
        return codeBlock(`<meta property="${tagLabel}" content="${exampleTagValue}">`, Mode.html)
    }

    public static tag_AllMissing(card: Card) {
        const what = Tips.#what(`The page is doesn't have any meta at all.`)
        const why = Tips.#why(
            `Meta Data should always be include in every web page.`,
            `They provide important information to the browser and to the Search Engine bots about the page.`,
            `Also Meta tags allow the page to control how it will be shared by users providing recommendation for title, image and descriptions to be use for sharing post on Social-Media.`
        )
        const how = Tips.#how(`Add Meta Tags to Your Page in the <code>&lt;head&gt;</code> section of the HTML code.`)
        card.addTip(`Tip #${this.#tipNumber++}: Add Meta Tags to the Page`, [what, why, how], metaTagsReference, 85)
    }

    public static tag_NoValue(card: Card, platform: Platform, tag: iTag) {
        const msg1 = `The <code>${tag.label}</code> tag doesn't contain any value.`
        const msg2 = `Add the missing value to maximize the impact of every on ${platform} post about this page.`
        card.addTip(
            `Tip #${this.#tipNumber++}: Update The Invalid Meta Tag <code>${tag.label}</code>`,
            [msg1, msg2],
            platform === 'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
            70
        )
    }

    public static tag_ObsoleteValue(card: Card, platform: Platform, tag: iTag, acceptedValues: string[]) {
        const msg1 = `The <code>${tag.label}</code> tag has an obsolete value that is not anymore valid:`
        const msg2 = codeBlock(`<meta property="${tag.label}" content="${tag.value}">`, Mode.html)
        const msg3 = `While for now ${platform} might honoring obsolete values, it's important to update the tag by selecting an item from the following list of valid values:`
        const msg4 = codeBlock(acceptedValues.join('<br>'), Mode.txt)
        card.addTip(
            `Tip #${this.#tipNumber++}: Fix The Obsolete Value for Meta Tag <code>${tag.label}</code>`,
            [msg1, msg2, msg3, msg4],
            platform === 'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
            40
        )
    }

    public static tag_InvalidValue(card: Card, platform: Platform, tag: iTag, acceptedValues: string[]) {
        const msg1 = `The <code>${tag.label}</code> is currently set to <code>${tag.value}</code>. It's not a valid value for this tag.`
        const msg3 = `Please select an item from the following list of valid values:`
        const msg4 = codeBlock(acceptedValues.join('<br>'), Mode.txt)
        card.addTip(
            `Tip #${this.#tipNumber++}: Select a Valid Value For <code>${tag.label}</code>`,
            [msg1, msg3, msg4],
            platform === 'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
            80
        )
    }

    public static tagImage_NoTag(card: Card, platform: Platform, tag: string) {
        const msg1 =
            `This page is lacking the <code>${tag}</code> meta tag to use with ${platform} when posting about this page.<br>` +
            `This is an example of the ${platform} Meta Tag that should be added:`
        const msg2 = codeBlock(`<meta property="${tag}" content="https://www.example.com/my_image.jpg">`, Mode.html)
        const msg3 = platform === 'Twitter' ? tweeterImageSpecs : facebookImageSpecs
        card.addTip(
            `Tip #${this.#tipNumber++}: Add the Meta Tag <code>${tag}</code> for Image Preview`,
            [msg1, msg2, msg3],
            'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
            70
        )
    }

    public static tagImage_NoImage(card: Card, platform: Platform, tag: iTag) {
        const msg1 = `The image at following url specified in the <code>${tag.label}</code> meta tags for ${platform} doesn't exist.`
        const msg2 = codeBlock(tag.value, Mode.txt)
        const msg3 = `Upload the missing image or fix the url to maximize the visual impact on ${platform} of every posts about this page.`
        const msg4 = platform === 'Twitter' ? tweeterImageSpecs : facebookImageSpecs
        card.addTip(
            `Tip #${this.#tipNumber++}: Upload The ${platform} Meta Tag for Image Preview`,
            [msg1, msg2, msg3, msg4],
            'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
            65
        )
    }

    public static tagImage_Placeholder(card: Card, platform: Platform, tag: iTag) {
        const what = Tips.#what(
            `The image linked in the <code>${tag.label}</code> meta tags for ${platform} is only a placeholder.`,
            `This is the current value of the tag:`,
            codeBlock(tag.value, Mode.txt)
        )
        const why = Tips.#why(
            `When this page is shared on ${platform} the image is the most prominent and visible part of the post.`,
            `It's critical to select an image that is relevant to the content of the page and has a high visual impact.`
        )
        const how = Tips.#how(
            `Upload an image to maximize the visual impact of posts on ${platform} sharing this page.`,
            platform === 'Twitter' ? tweeterImageSpecs : facebookImageSpecs
        )
        card.addTip(
            `Tip #${this.#tipNumber++}: Replace the Image Preview Placeholder in <code>${tag.label}</code>`,
            [what, why, how],
            'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
            60
        )
    }

    public static tagUrl_NonCanonical(card: Card, platform: Platform, tag: iTag, canonical: string) {
        const what = Tips.#what(
            `The Meta Tag <code>${tag.label}</code> for ${platform} must be consistent with the canonical URL specified in the <code>&lt;head&gt;</code> section of the HTML page (the must be identical).`
        )
        const why = Tips.#why(
            `Sharing a page on social-media with a non-canonical url can dilute the reputation (page-ranking) of the page across multiple urls.`
        )
        const how = Tips.#how(
            `Replace the current value of the <code>${tag.label}</code> Meta Tag:`,
            codeBlock(`<meta property="${tag.label}" content="${tag.value}">`, Mode.html),
            `With the following <code>${tag.label}</code> code:`,
            codeBlock(`<meta property="${tag.label}" content="${canonical}">`, Mode.html)
        )
        card.addTip(
            `Tip #${this.#tipNumber++}: Use the Canonical Url for the Meta Tag <code>${tag.label}</code>`,
            [what, why, how],
            platform === 'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
            60
        )
    }

    public static tagUrl_RelativePath(card: Card, platform: Platform, tag: iTag) {
        const msg1 = `The page Meta Tag <code>${tag.label}</code> for ${platform} is using a relative url path.`
        const msg2 =
            `Links in the Meta Tags should be always absolute paths, starting with <code>https://</code>. ` +
            `This is the current meta tag you should fix:`
        const msg3 = codeBlock(tag.code, Mode.html)
        card.addTip(
            `Tip #${this.#tipNumber++}: Change the Url to Absolute in <code>${tag.label}</code>`,
            [msg1, msg2, msg3],
            platform === 'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
            75
        )
    }

    public static tagUrl_ObsoleteProtocol(card: Card, platform: Platform, tag: iTag) {
        const msg1 =
            `The url in the Meta Tag <code>${tag.label}</code> for ${platform} is using the unsafe and now obsolete <code>http</code> protocol. ` +
            `Links in the Meta Tags should be always use the safest <code>https</code> protocol.`
        const msg2 = `This is the meta tag you should fix:`
        const msg3 = codeBlock(tag.code, Mode.html)
        card.addTip(
            `Tip #${this.#tipNumber++}: Change <code>${tag.label}</code> Url Protocol To HTTPS`,
            [msg1, msg2, msg3],
            platform === 'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
            35
        )
    }

    public static tag_Placeholder(card: Card, platform: Platform, tag: iTag) {
        const msg1 = `The <code>${tag.label}</code> tag appears to contain only a short placeholder for the tag value:`
        const msg2 = codeBlock(`<meta property="${tag.label}" content="${tag.value}">`, Mode.html)
        const msg3 = `Replace the placeholder with something more meaningful to maximize the impact of posts on ${platform} sharing this page.`
        card.addTip(
            `Tip #${this.#tipNumber++}: Replace the Placeholder in the <code>${tag.label}</code>`,
            [msg1, msg2, msg3],
            'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
            50
        )
    }

    public static tag_OverRecommendedLength(
        card: Card,
        platform: Platform,
        tag: iTag,
        maxLength: string,
        recommendedLength: string
    ) {
        const what = Tips.#what(
            `On this page, the <code>${tag.label}</code> tag is <b>${tag.value.length}</b> characters long.`
        )
        const why = Tips.#why(
            `While this tag value is below the the maximum length for tag, set by the specs at ${maxLength}, best practices recommend to keep the field even shorter, below <b>${recommendedLength}</b>.`,
            `Keeping the tag at that length will ensure that the value will not be trimmed when a post on ${platform} sharing this page is displayed an small devices.`,
            `Automatic trim can disrupt the content you carefully crafted for this page with unpredictable results.`
        )
        const how = Tips.#how(`Reduce the length of the tag value to ${recommendedLength}.`)
        card.addTip(
            `Tip #${this.#tipNumber++}: Consider shortening the Meta Tag <code>${tag.label}</code>`,
            [what, why, how],
            'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
            15
        )
    }

    public static tag_OverMaxLength(card: Card, platform: Platform, tag: iTag, maxLength: string) {
        const what = Tips.#what(
            `The <code>${tag.label}</code> tag value is <b>${tag.value.length}</b> characters long.`
        )
        const why = Tips.#why(
            `The length is over the maximum of <b>${maxLength}</b>, specified by ${platform} for this tag.`,
            `Longer values could be trimmed on some device when ${platform} will display a post linking to this page.`,
            `Automatic trim of the content can affect visibility and popularity of post sharing your page on ${platform}.`
        )
        const how = Tips.#how(
            `Reduce the length of the tag value to make sure your <code>${tag.label}</code> will not be trimmed by ${platform} on posts sharing this page.`
        )
        card.addTip(
            `Tip #${this.#tipNumber++}: Shorten the Meta Tag <code>${tag.label}</code>`,
            [what, why, how],
            'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
            40
        )
    }

    public static tag_NonSpecific(card: Card, platform: Platform, tagLabel: string, fallbackTag: iTag | undefined) {
        if (fallbackTag === undefined) {
            this.tag_Missing(card, platform, tagLabel)
            return
        }
        const what = Tips.#what(
            `The page doesn't include the specific ${platform} meta <code>${tagLabel}</code>, only the generic <code>${fallbackTag.label}</code> tag is present.`,
            `Crawlers and bots looking for ${platform} tags will fall back to the generic tag.`
        )
        const why = Tips.#why(
            `Best practices recommend to use the specific meta tags for the ${platform} platform to maximize the performance and visibility of all posts sharing this page on social media.`
        )
        const how = Tips.#what(`Add the following meta tag to your page:`, Tips.#tagExample(tagLabel, platform))
        card.addTip(
            `Tip #${this.#tipNumber++}: Use the ${platform} Specific Meta Tag <code>${tagLabel}</code>`,
            [what, why, how],
            platform === 'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
            10
        )
    }

    public static tag_Missing(card: Card, platform: Platform, tagLabel: string) {
        const what = Tips.#what(`The page doesn't include the ${Tips.tagIsEssential(tagLabel) ? `essential ` : ``} ${platform} meta <code>${tagLabel}</code> tag.`)
        const why = Tips.#why( Tips.tagIsEssential(tagLabel) ? `Essential ` : ``,
            `Meta tags like <code>${tagLabel}</code> are giving you full control on how a link to your page will be rendered on social-media when someone shares or links your page.`,
            `A well defined and complete set of meta tags maximizes your page visibility and visual impact.`
        )
        const how = Tips.#how(`Add a meta tag similar to the following:`, Tips.#tagExample(tagLabel, platform))
        card.addTip(
            `Tip #${this.#tipNumber++}: Add the Meta Tag <code>${tagLabel}</code>`,
            [what, why, how],
            platform === 'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
            55
        )
    }

    public static tag_Obsolete(card: Card, platform: Platform, tagName: string, htmlTag: string) {
        const what = Tips.#what(`The Meta Tag <code>${tagName}</code> for ${platform} is considered obsolete.`)
        const why = Tips.#why(
            `Obsolete tags will not hurd the SEO of the page.`,
            `They will be ignored by the search-engine crawlers, but they will make the content of the page less clear, and the maintenance more laborsome.`
        )
        const how = Tips.#how(
            `Remove the following Meta Tag to comply with the best practices recommended by ${platform}:`,
            codeBlock(htmlTag, Mode.html)
        )
        card.addTip(
            `Tip #${this.#tipNumber++}: Remove the Obsolete ${platform} Meta Tag <code>${tagName}</code>`,
            [what, why, how],
            platform === 'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
            15
        )
    }

    public static tag_noOpenGraphTags(card: Card) {
        const what = Tips.#what(`The page doesn't include any Open Graph meta tag.`)
        const why = Tips.#why(
            `Meta Tags specific for Facebook, called Open Graph meta tags, should always be include in every web page.`,
            `While they don't have a direct impact on SEO, they control how the page will appear when shared on Facebook and other social-media, like LinkedIn, that are levering the Open Graph standards.` +
                `They provide recommendation to Twitter for title, image, and descriptions.`
        )
        const how = Tips.#how(
            `Add at least the most essential Open Graph meta tags to the page.`,
            codeBlock(Tips.essentialOpenGraphTags.join('\n'), Mode.txt)
        )
        card.addTip(
            `Tip #${this.#tipNumber++}: Add Facebook (Open Graph) Meta Tags to the Page`,
            [what, why, how],
            openGraphMetaTagsReference,
            75
        )
    }

    public static tag_noTwitterTags(card: Card) {
        const what = Tips.#what(`The page doesn't include any Twitter meta tag.`)
        const why = Tips.#why(
            `Meta Tags specific for Twitter should always be include in every web page.`,
            `While they don't have a direct impact on SEO, they control how the page will appear when shared on Twitter.` +
                `They provide recommendation to Twitter for title, image, and descriptions.`
        )
        const how = Tips.#how(
            `Add at least the most essential Twitter meta tags to the page.`,
            codeBlock(Tips.essentialTwitterTags.join('\n'), Mode.txt)
        )
        card.addTip(
            `Tip #${this.#tipNumber++}: Add Twitter Meta Tags to the Page`,
            [what, why, how],
            twitterMetaTagsReference,
            75
        )
    }

    // ---------------------------------------------------------------------------------------------
    // Structure Data TIPS
    public static sd_noSdInChromeBrowserPages(card: Card) {
        const msg1 = `The internal pages of Google Chrome browser as well the empty tabs don't have Structured Data associated.`
        const msg2 = `Consider opening any website before opening the "Page Auditor" Chrome Extension.`
        card.addTip(`Tip #${this.#tipNumber++}: Open a Regular WebSite or Web Page`, [msg1, msg2], robotsTxtReference)
    }

    public static sd_relativeUrl(card: Card, objectName: string, urls: string[]) {
        const msg1 = `Detected ${urls.length.toFixed()} urls with local path listed in the "${objectName}" Structured Data snippet of the page.`
        const msg2 = codeBlock(urls.join('\n'), Mode.txt)
        const msg3 = `With only relative paths all Search Engines will ignore the Structured Data in the page.`
        card.addTip(
            `Tip #${this.#tipNumber++}: Rewrite URLs in "${objectName}" with Absolute Path`,
            [msg1, msg2, msg3],
            structuredDataReference,
            70
        )
    }

    public static sd_repeatedSchemas(card: Card, objectName: string, occurrences: number) {
        const what = Tips.#what(
            `Detected ${occurrences.toFixed()} copies of the "${objectName}" Structured Data snippet of the page.`
        )
        const why = Tips.#why(
            `The consistency af Structured Data is very important in order to let the search-engine properly learn about the content and structure of your pages.`,
            `Even marginal errors or duplicated structures can confuse the parser and nullify the contribution and impact of your Structured Data.`
        )
        const how = Tips.#how(
            `Consider removing the duplicates and merging the information about the ${objectName} into one single snippet.`
        )
        card.addTip(
            `Tip #${this.#tipNumber++}: Merge the "${objectName}" Data Structures`,
            [what, why, how],
            structuredDataReference,
            25
        )
    }

    public static sd_noStructuredData(card: Card) {
        const what = Tips.#what(
            `This page is missing a Structured Data section describing the content ans semantic of the page.`
        )
        const why = Tips.#why(
            `Structured Data is an important SEO factor.`,
            `It's critical to add a Structured Data snippet to each page of a website.`,
            `It helps search engines find and understand your content and website.`,
            `It's also an important way to prepare for the future of search, as Google and other engines continue to personalize the user experience and answer questions directly on their SERPs.`
        )
        const how = Tips.#how(
            `Add Structured Data to each page of your website. There are 3 available formats: JSON-LD, MicroData and RDFa. Google recommends to use <code>JSON-LD</code>, and this is also the easiest format to create and to maintain.`
        )
        card.addTip(
            `Tip #${this.#tipNumber++}: Add Structured Data To the Page`,
            [what, why, how],
            structuredDataHowToUse,
            75
        )
    }

    public static sd_invalidSyntax(card: Card) {
        const msg1 = `A Structured Data snippet contains invalid JSON code blocking the Search Engine spiders/bots from efficiently indexing the page.`
        const msg2 = `Fix the LD-JSON code to benefit from the inclusion of Structured Data in the page.`
        card.addTip(`Tip #${this.#tipNumber++}: Fix the Invalid Structured Data`, [msg1], structuredDataReference, 75)
    }
}
