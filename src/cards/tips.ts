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

    public static resetTipCounter() {
        this.#tipNumber = 1
    }

    // ----------------------------------------------------------------------------
    // INTERNAL ERROR TIPS
    public static internalError(card: Card) {
        const msg1 = `Something went wrong.`
        const msg2 = `Consider updating the "Page Auditor" Chrome Extension to teh latest version.`
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
        const plural = urls.length > 1 ? 's' : ''
        const msg1 = `The <code>robots.txt</code> file links multiple times the same sitemap's url.`
        const msg2 =
            `It's important to correct and update <code>robots.txt</code> to make sure each sitemap.xml is mentioned only one time. ` +
            `Sitemap files should be always linked using the safe <code>https</code> protocol.<br>` +
            `This is a list of the duplicate Urls:`
        const msg3 = codeBlock(urls.join('<br>'), Mode.txt)
        card.addTip(`Tip #${this.#tipNumber++}: Remove Duplicate Sitemap Links`, [msg1, msg2, msg3], robotsTxtReference, 25)
    }

    public static unsafeSitemapLinkInRobots(card: Card, urls: string[]) {
        let msg1 =
            `The <code>robots.txt</code> file refers a sitemap url using the unsafe and obsolete <code>http</code> protocol ` +
            `instead of the safest and recommended <code>https</code> protocol.`
        let msg2 =
            `It's important to correct and update the sitemap links in the  <code>robots.txt</code> by switching to the <code>https</code> protocol. ` +
            `Sitemap files should be always linked using the safe <code>https</code> protocol.`
        card.addTip(`Tip #${this.#tipNumber++}: Update Unsafe Sitemap Link`, [msg1, msg2], robotsTxtReference, 35)
    }

    public static addSitemapLinkToRobotsTxt = (card: Card, domain: string) => {
        const msg1 = `Linking a Sitemap from <code>Robots.txt</code> is a way to ensure Google bot doesn't miss it. It's an optional directive, but strongly recommended.`
        const msg2 =
            `This directive is independent of the user-agent line, so it doesn't matter where you place it in your file. ` +
            `If you have a Sitemap index file, you can include the location of just that file. ` +
            `You don't need to list each individual Sitemap listed in the index file.`
        const msg3 = `A link to a <code>sitemap.xml</code> should be added to the <code>robots.txt</code> file with a line similar to the following:`
        const msg4 = codeBlock(`Sitemap: ${domain}/sitemap.xml`, Mode.txt)
        card.addTip(
            `Tip #${this.#tipNumber++}: Link Your Sitemap.xml From Robots.txt`,
            [msg1, msg2, msg3, msg4],
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
        const msg1 =
            `It's critical to add the missing content to the <code>robots.txt</code> file. ` +
            `Robots.txt are a very important factor in SEO ranking.`
        card.addTip(`Tip #${this.#tipNumber++}: Add Content to Robots.txt`, [msg1], robotsTxtReference, 40)
    }

    public static missingRobotsTxt(card: Card) {
        const msg1 =
            `It's critical to add the missing <code>robots.txt</code> file. ` +
            `Robots.txt are a very important factor in SEO ranking.`
        card.addTip(`Tip  #${this.#tipNumber++}: Add Robots.txt file`, [msg1], robotsTxtReference, 80)
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
        const msg1 =
            `It's critical to add the missing <code>sitemap.xml</code> file. ` +
            `Sitemaps are a very critical factor in SEO ranking of a page.`
        const msg2 =
            `A good XML sitemap acts as a roadmap of your website that leads Google to all your important pages. ` +
            `XML sitemaps can be good for SEO, as they allow Google to find your essential website pages quickly, even if your internal linking isn't perfect.`
        card.addTip(`Tip #${this.#tipNumber++}: Add a Sitemap.xml File`, [msg1, msg2], sitemapSyntaxReference, 80)
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
        card.addTip(`Tip #${this.#tipNumber++}: Add the XML Extension to Your Sitemap`, [msg1], sitemapSyntaxReference, 25)
    }

    public static compressedSitemapNotFound(card: Card, url: string) {
        const msg1 =
            `This compressed file at the doesn't exist. ` +
            `Upload the file to the webserver to let Google bot properly index the website.`
        card.addTip(`Tip #${this.#tipNumber++}: Upload The Missing Compressed Sitemap File`, [msg1], sitemapReference, 80)
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

    static #tagExample(tagLabel: string, platform: string, card: Card): iTagExample {
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
            return {
                msg: '',
                code: '',
            }
        }
        return {
            msg: `This is an example of the ${platform} Meta Tag that should be added:`,
            code: codeBlock(`<meta property="${tagLabel}" content="${exampleTagValue}">`, Mode.html),
        }
    }

    public static tag_AllMissing(card: Card) {
        const msg1 =
            `Meta Data should always be include in every web page. Meta tags provide important information to teh browser and to the Search Engine bots about the page. ` +
            `Also Meta tags allow the page to control how it will be shared by users providing recommendation for title, image and descriptions to be use for sharing post on Social Media .`
        card.addTip(`Tip #${this.#tipNumber++}: Add Meta Tags`, [msg1], metaTagsReference, 85)
    }

    public static tag_NoValue(card: Card, platform: Platform, tag: iTag) {
        const msg1 = `The <code>${tag.label}</code> tag doesn't contain any value.`
        const msg2 = `Add the missing value to maximize the impact of every on ${platform} post about this page.`
        card.addTip(
            `Tip #${this.#tipNumber++}: Update The Invalid <code>${tag.label}</code> Meta Tag`,
            [msg1, msg2],
            platform === 'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
            70
        )
    }

    public static tag_ObsoleteValue(card: Card, platform: Platform, tag: iTag, acceptedValues: string[]) {
        const msg1 = `The <code>${tag.label}</code> tag has an obsolete value that is not anymore valid:`
        const msg2 = codeBlock(`<meta property="${tag.label}" content="${tag.value}">`, Mode.html)
        const msg3 = `While for now ${platform} might honoring obsolete values, it's important to update teh tag by selecting an item from the following list of valid values:`
        const msg4 = codeBlock(acceptedValues.join('<br>'), Mode.txt)
        card.addTip(
            `Tip #${this.#tipNumber++}: Fix The Obsolete Value for <code>${tag.label}</code> Meta Tag`,
            [msg1, msg2, msg3, msg4],
            platform === 'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
            40
        )
    }

    public static tag_InvalidValue(card: Card, platform: Platform, tag: iTag, acceptedValues: string[]) {
        const msg1 = `The <code>${tag.label}</code> tag has an invalid value (misspelling?):`
        const msg2 = codeBlock(`<meta property="${tag.label}" content="${tag.value}">`, Mode.html)
        const msg3 = `Please select an item from the following list of valid values:`
        const msg4 = codeBlock(acceptedValues.join('<br>'), Mode.txt)
        card.addTip(
            `Tip #${this.#tipNumber++}: Fix The Invalid Value For <code>${tag.label}</code> Meta Tag`,
            [msg1, msg2, msg3, msg4],
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
            `Tip #${this.#tipNumber++}: Add the <code>${tag}</code> Image Meta Tag`,
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
            `Tip #${this.#tipNumber++}: Upload The ${platform} Meta Tag Image`,
            [msg1, msg2, msg3, msg4],
            'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
            65
        )
    }

    public static tagImage_Placeholder(card: Card, platform: Platform, tag: iTag) {
        const msg1 = `The image at following url in the <code>${tag.label}</code> meta tags for ${platform} is only a placeholder.`
        const msg2 = codeBlock(tag.value, Mode.txt)
        const msg3 = `Upload an image to maximize the visual impact of posts on ${platform} sharing this page.`
        const msg4 = platform === 'Twitter' ? tweeterImageSpecs : facebookImageSpecs
        card.addTip(
            `Tip #${this.#tipNumber++}: Replace the Image Placeholder in <code>${tag.label}</code>`,
            [msg1, msg2, msg3, msg4],
            'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
            60
        )
    }

    public static tagUrl_NonCanonical(card: Card, platform: Platform, tag: iTag, canonical: string) {
        const msg1 = `The Meta Tag <code>${tag.label}</code> for ${platform} must be consistent with the canonical URL specified in the HTML of the page.`
        const msg2 = `Replace your current <code>${tag.label}</code> code:`
        const msg3 = codeBlock(`<meta property="${tag.label}" content="${tag.value}">`, Mode.html)
        const msg4 = `With the following <code>${tag.label}</code> code:`
        const msg5 = codeBlock(`<meta property="${tag.label}" content="${canonical}">`, Mode.html)
        card.addTip(
            `Tip #${this.#tipNumber++}: Update the <code>${tag.label}</code> Meta Tag with Canonical Url`,
            [msg1, msg2, msg3, msg4, msg5],
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
            `Tip #${this.#tipNumber++}: Change the <code>${tag.label}</code> Url to Absolute`,
            [msg1, msg2, msg3],
            platform === 'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
            65
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
            `Tip #${this.#tipNumber++}: Replace The Placeholder in the <code>${tag.label}</code> Meta Tag`,
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
        const msg1 = `On this page, the <code>${tag.label}</code> tag is <b>${tag.value.length}</b> characters long.`
        const msg2 = `While it's under the the maximum length for this tag, defined at ${maxLength}, best practices recommend to keep the field length length under <b>${recommendedLength}</b>.`
        const msg3 = `Reduce the length of the tag value to make sure your <code>${tag.label}</code> will not be trimmed by ${platform} on posts sharing this page on all devices.`
        card.addTip(
            `Tip #${this.#tipNumber++}: Consider shortening the <code>${tag.label}</code> Meta Tag`,
            [msg1, msg2, msg3],
            'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
            15
        )
    }

    public static tag_OverMaxLength(
        card: Card,
        platform: Platform,
        tag: iTag,
        maxLength: string
    ) {
        const msg1 = `On this page, the <code>${tag.label}</code> tag is <b>${tag.value.length}</b> characters long, over the maximum length of <b>${maxLength}</b>, specified for this tag.`
        const msg2 = `Reduce the length of the tag value to make sure your <code>${tag.label}</code> will not be trimmed by ${platform} on posts sharing this page on all devices.`
        card.addTip(
            `Tip #${this.#tipNumber++}: Shorten the <code>${tag.label}</code> Meta Tag`,
            [msg1, msg2],
            'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
            40
        )
    }

    public static tag_NonSpecific(card: Card, platform: Platform, tagLabel: string, fallbackTag: iTag | undefined) {
        if (fallbackTag === undefined) {
            this.tag_Missing(card, platform, tagLabel)
            return
        }
        const msg1 = `When parsing this page, the ${platform} bot will fall back to the <code>${fallbackTag.label}</code> meta tag because the page is missing the more specific <code>${tagLabel}</code> tag.`
        const msg2 = `Best practices recommend to use the specific meta tags for the ${platform} platform to maximize the performance of all posts sharing this page.`
        const example = Tips.#tagExample(tagLabel, platform, card)
        card.addTip(
            `Tip #${this.#tipNumber++}: Use the More Specific <code>${tagLabel}</code> Meta Tag`,
            [msg1, msg2, example.msg, example.code],
            platform === 'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
            10
        )
    }

    public static tag_Missing(card: Card, platform: Platform, tagLabel: string) {
        const msg1 =
            `The Meta Tag <code>${tagLabel}</code> for ${platform} is missing. ` +
            `Add it to maximize your visibility on ${platform} when people are sharing this page.`
        const example = Tips.#tagExample(tagLabel, platform, card)
        card.addTip(
            `Tip #${this.#tipNumber++}: Add the Missing <code>${tagLabel}</code> Meta Tag`,
            [msg1, example.msg, example.code],
            platform === 'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
            55
        )
    }

    public static tag_Obsolete(card: Card, platform: Platform, tagName: string, htmlTag: string) {
        const msg1 =
            `The Meta Tag <code>${tagName}</code> for ${platform} is considered obsolete. ` +
            `Remove the following Meta Tag to comply with the best practices recommended by ${platform}.`
        const msg2 = codeBlock(htmlTag, Mode.html)
        card.addTip(
            `Tip #${this.#tipNumber++}: Remove the Obsolete <code>${tagName}</code> Meta Tag`,
            [msg1, msg2],
            platform === 'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
            15
        )
    }

    public static tag_noOpenGraphTags(card: Card) {
        const msg1 =
            `Meta Tags specific for Facebook, called Open Graph meta tags, should always be include in every web page.`
        const msg2 = `While they don't have a direct impact on SEO, Open Graph Meta Tags control how the page will appear when shared on Facebook. ` +
            `They provide recommendation to Facebook for title, image, and descriptions.`
        card.addTip(
            `Tip #${this.#tipNumber++}: Add Facebook (Open Graph) Meta Tags`,
            [msg1, msg2],
            openGraphMetaTagsReference,
            75
        )
     }

     public static tag_noTwitterTags(card: Card) {
        const msg1 = `Meta Tags specific for Twitter should always be include in every web page.`
        const msg2 = `While they don't have a direct impact on SEO, Twitter Meta Tags control how the page will appear when shared on Twitter. ` +
        `They provide recommendation to Twitter for title, image, and descriptions.`
        card.addTip(
            `Tip #${this.#tipNumber++}: Add Twitter Meta Tags`,
            [msg1, msg2],
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
        const msg1 = `Detected ${occurrences.toFixed()} copies of the "${objectName}" Structured Data snippet of the page.`
        const msg2 = `Consider removing the duplicates and merging the information about the ${objectName} into one single snippet.`
        card.addTip(
            `Tip #${this.#tipNumber++}: Merge the "${objectName}" Data Structures`,
            [msg1, msg2],
            structuredDataReference,
            25
        )
    }

    public static sd_noStructuredData(card: Card) {
        const msg1 = `Structured Data is an important SEO factor. It's very important to add a Structured Data snippet to each page.`
        const msg2 =
            `Structured data is important for SEO because it helps search engines find and understand your content and website. ` +
            `It's also an important way to prepare for the future of search, as Google and other engines continue to personalize the user experience and answer questions directly on their SERPs.`
        card.addTip(`Tip #${this.#tipNumber++}: Add Structured Data Snippets`, [msg1, msg2], structuredDataHowToUse, 75)
    }

    public static sd_invalidSyntax(card: Card) {
        const msg1 = `A Structured Data snippet contains invalid JSON code blocking the Search Engine spiders/bots from efficiently indexing the page.`
        const msg2 = `Fix the LD-JSON code to benefit from the inclusion of Structured Data in the page.`
        card.addTip(
            `Tip #${this.#tipNumber++}: Fix the Invalid Structured Data Snippet`,
            [msg1],
            structuredDataReference,
            75
        )
    }
}



