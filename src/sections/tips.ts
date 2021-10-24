// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {iTag} from './meta'
import {codeBlock} from '../codeBlock'
import {Card, iLink} from '../card'
import {sitemapMaxSize} from './suggestionCards'
import {Mode} from '../colorCode'
import { formatNumber } from '../main'

export type Platform = 'Twitter' | 'Facebook' | 'Instagram' | 'LinkedIn' | 'YouTube' | 'Reddit'

const twitterMetaTagsReference: iLink = {
    label: 'Learn about Twitter Meta Tags',
    url: 'https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started',
}

const openGraphMetaTagsReference: iLink = {
    label: 'Learn about Facebook Meta Tags',
    url: 'https://ogp.me/',
}

const sitemapReference: iLink = {
    label: 'Read a Sitemap.xml Reference',
    url: 'https://www.woorank.com/en/blog/how-to-locate-a-sitemap-in-a-robots-txt-file',
}

const sitemapSyntaxReference: iLink = {
    label: 'Learn about Sitemap.xml Syntax', 
    url: 'https://www.sitemaps.org/protocol.html'
}

const robotsTxtReference = {
    label: 'Read a Robots.txt Reference',
    url: 'https://developers.google.com/search/docs/advanced/robots/robots_txt',
}

const tweeterImageSpecs =
    'Images must be less than 5MB in size. JPG, PNG, WEBP and GIF formats are supported. Only the first frame of an animated GIF will be used. SVG is not supported.'

const facebookImageSpecs = `The most frequently recommended resolution for an OG image is 1200 pixels x 627 pixels (1.91/1 ratio). At this size, your thumbnail will be big and stand out from the crowd. Just don't exceed the 5MB size limit.`

export class Tips {

    // ----------------------------------------------------------------------------
    // INTERNAL ERROR TIPS
    public static internalError(card: Card) {
        const msg1 = `Something went wrong.`
        const msg2 =
            `Consider updating the "Page Auditor" Chrome Extension to teh latest version.`
        const cta: iLink = robotsTxtReference
        card.addTip('Tip:Update Page Auditor to teh latest version', [msg1, msg2], cta)
    }

    public static unableToAnalyzeChromeBrowserPages(card: Card) {
        const msg1 = `The internal pages of Google Chrome browser as well the empty tabs can not be analyzed by <i>Page Auditor</i> Chrome Extension.`
        const msg2 =
            `Consider opening any website before opening the "Page Auditor" Chrome Extension`
        const cta: iLink = robotsTxtReference
        card.addTip('Tip: Open a Regular WebSite or Web Page', [msg1, msg2], cta)
    }

    // ----------------------------------------------------------------------------
    // Robots TXT TIPS
    public static noRobotsTxtInChromeBrowserPages(card: Card) {
        const msg1 = `The internal pages of Google Chrome browser as well the empty tabs don't have a <code>robots.txt</code> associated.`
        const msg2 =
            `Consider opening any website before opening the "Page Auditor" Chrome Extension`
        const cta: iLink = robotsTxtReference
        card.addTip('Tip: Open a Regular WebSite or Web Page', [msg1, msg2], cta)
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
        const cta: iLink = robotsTxtReference
        card.addTip('Tip: Remove Duplicate Sitemap Links', [msg1, msg2, msg3], cta)
    }

    public static unsafeSitemapLinkInRobots(card: Card, urls: string[]) {
        let msg1 =
            `The <code>robots.txt</code> file refers a sitemap url using the unsafe and obsolete <code>http</code> protocol ` +
            `instead of the safest and recommended <code>https</code> protocol.`
        let msg2 =
            `It's important to correct and update the sitemap links in the  <code>robots.txt</code> by switching to the <code>https</code> protocol. ` +
            `Sitemap files should be always linked using the safe <code>https</code> protocol.`
        const cta: iLink = robotsTxtReference
        card.addTip('Tip: Update Unsafe Sitemap Link', [msg1, msg2], cta)
    }

    public static addSitemapLinkToRobotsTxt = (card: Card) => {
        const msg1 = `Linking a Sitemap from <code>Robots.txt</code> is a way to ensure Google bot doesn't miss it. It's an optional directive, but strongly recommended.`
        const msg2 =
            `This directive is independent of the user-agent line, so it doesn't matter where you place it in your file. ` +
            `If you have a Sitemap index file, you can include the location of just that file. ` +
            `You don't need to list each individual Sitemap listed in the index file.`
        const msg3 = `A link to a <code>sitemap.xml</code> should be added to the <code>robots.txt</code> file with a line similar to the following:`
        const msg4 = codeBlock(`Sitemap: https://www.example.com/sitemap.xml`, Mode.txt)
        const cta: iLink = robotsTxtReference
        card.addTip('Tip: Link Your Sitemap.xml From Robots.txt', [msg1, msg2, msg3, msg4], cta)
    }

    public static malformedRobotsTxt(card: Card) {
        const msg1 =
            `Double check the syntax of the <code>robots.txt</code> and update it ASAP. ` +
            `It's important for the <code>robots.txt</code> file to be consistent with the standard syntax. `
        const msg2 = `The <code>Robots.txt</code> of a website, if present, is extensively used by all Search Engines bots a it's a very important factor in SEO ranking of the site.`
        const cta: iLink = robotsTxtReference
        card.addTip('Fix Robots.txt Syntax', [msg1], cta)
    }

    public static emptyRobotsTxt(card: Card) {
        const msg1 =
            `It's critical to add the missing content to the <code>robots.txt</code> file. ` +
            `Robots.txt are a very critical factor in SEO ranking.`
        const cta: iLink = robotsTxtReference
        card.addTip('Add Content to Robots.txt', [msg1], cta)
    }
    
    public static missingRobotsTxt(card: Card) {
        const msg1 =
            `It's critical to add the missing <code>robots.txt</code> file. ` +
            `Robots.txt are a very important factor in SEO ranking.`
        const cta: iLink = robotsTxtReference
        card.addTip('Add Robots.txt file', [msg1], cta)
    }
        
    public static sitemapInRobotsDoesNotExist(card: Card, url:string) {
        const msg1 =
            `The <code>robots.txt</code> file list <code>sitemap.xml</code> url pointing to a file that doesn't exist. ` +
            `This is the broken link:`
        const msg2 = codeBlock(url, Mode.txt)
        const cta: iLink = robotsTxtReference
        card.addTip('Add Robots.txt file', [msg1, msg2], cta)
    }
        
    // ------------------------------------------------------------------------
    // SITEMAP XML TIPS
    public static noSitemapInChromeBrowserPages(card: Card) {
        const msg1 = `The internal pages of Google Chrome browser as well the empty tabs don't have a <code>sitemap.xml</code> associated.`
        const msg2 =
            `Consider opening any website before opening the "Page Auditor" Chrome Extension`
        const cta: iLink = robotsTxtReference
        card.addTip('Tip: Open a Regular WebSite or Web Page', [msg1, msg2], cta)
    }

    public static missingSitemap(card: Card) {
        const msg1 =
            `It's critical to add the missing <code>sitemap.xml</code> file. ` +
            `Sitemaps are a very critical factor in SEO ranking of a page.`
        const msg2 =
            `A good XML sitemap acts as a roadmap of your website that leads Google to all your important pages. ` +
            `XML sitemaps can be good for SEO, as they allow Google to find your essential website pages quickly, even if your internal linking isn't perfect.`
        const cta: iLink = sitemapSyntaxReference
        card.addTip('Add a Sitemap.xml File', [msg1, msg2], cta)
    }
    
    public static uncompressedLargeSitemap(card: Card, url: string, size: number) {
        const msg1 =
            `This sitemap file size is about ${(size/1024).toFixed(2)} KB. ` +
            `The recommended maximum size for uncompressed files is ${formatNumber(sitemapMaxSize/1024/1024)} MB. ` +
            `However, Google and Bing can handle sitemap.xml file files up to 50 Mb in uncompressed size. `
        const msg2 = 
            `Compressing your sitemap.xml with <i>gzip</i> will reduce the load on your server and speedup upload and download of the file. ` +
            `However, there are no SEO direct benefits in compressing a sitemap. `
        const cta: iLink =sitemapSyntaxReference
        card.addTip('Tip: Compress Sitemap', [msg1, msg2], cta)
    }

    public static sitemapWithoutXmlExtension = (card: Card, url: string) => {
        const msg1 =
            `This sitemap's url is lacking the standard extension for XML files: <code>.xml</code>. ` +
            `Consider to adopt the best practices for sitemaps by adding the <code>.xml</code> extension. ` +
            `However, Google bot should be able to process your sitemaps even if they don't have the correct extension.`
        const cta: iLink = sitemapSyntaxReference
        card.addTip('Tip: Add the XML Extension to Your Sitemap', [msg1], cta)
    }

    public static compressedSitemapNotFound(card: Card, url: string) {
        const msg1 =
            `This compressed file at the doesn't exist. ` +
            `Upload the file to the webserver to let Google bot properly index the website.`
        const cta: iLink = sitemapReference
        card.addTip(`Tip: Upload The Missing Compressed Sitemap File`, [msg1], cta)
    }

    public static malformedSitemapXml(card: Card) {
        const msg1 =
            `Double check the syntax of the <code>sitemap.xml</code> and update it ASAP. ` +
            `It's important for the <code>sitemap.xml</code> file to be consistent with the standard XML syntax. `
        const msg2 = `The <code>sitemap.xml</code> of a website, if present, is extensively used by all Search Engines bots a it's a very important factor in SEO ranking of the site.`
        const cta: iLink = sitemapSyntaxReference
        card.addTip('Fix Sitemap.xml Syntax', [msg1, msg2], cta)
    }
        
    // ------------------------------------------------------------------------
    // META TAGS TIPS

    public static addMetaTags(card: Card) {
        const msg1 =
            `Meta Data should always be include in every web page. Meta tags provide important information to teh browser and to the Search Engine bots about the page. ` +
            `Also Meta tags allow the page to control how it will be shared by users providing recommendation for title, image and descriptions to be use for sharing post on Social Media .`
        const cta: iLink ={
            label: 'Meta Tags Reference', 
            url: 'https://moz.com/blog/the-ultimate-guide-to-seo-meta-tags'
        }
        card.addTip('Tip: Add Meta Tags', [msg1], cta)
    }
        
    public static tagImage_AddTag(card: Card, platform: Platform, tag: string) {
        const msg1 =
            `This page is lacking the <code>${tag}</code> meta tag to use with ${platform} when posting about this page.<br>` +
            `This is an example of the ${platform} Meta-Tag that should be added:`
        const msg2 = codeBlock(`<meta property="${tag}" content="https://www.example.com/my_image.jpg">`, Mode.html)
        const msg3 = platform === 'Twitter' ? tweeterImageSpecs : facebookImageSpecs
        const cta: iLink = platform === 'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference
        card.addTip(`Tip: Add the <code>${tag}</code> Image Meta-Tag`, [msg1, msg2, msg3], cta)
    }

    public static tagImage_UploadImage(card: Card, platform: Platform, tag: string, url: string) {
        const msg1 = `The image at following url specified in the <code>${tag}</code> meta tags for ${platform} doesn't exist.`
        const msg2 = codeBlock(url, Mode.txt)
        const msg3 = `Upload the missing image or fix the url to maximize the visual impact on ${platform} of every posts about this page.`
        const msg4 = platform === 'Twitter' ? tweeterImageSpecs : facebookImageSpecs
        const cta: iLink = platform === 'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference
        card.addTip(`Tip: Upload The ${platform} Meta Tag Image`, [msg1, msg2, msg3, msg4], cta)
    }

    public static tag_AddValue(card: Card, platform: Platform, tag: string) {
        const msg1 = `The <code>${tag}</code> tag doesn't contain any value.`
        const msg2 = `Add the missing value to maximize the impact of every on ${platform} post about this page.`
        const cta: iLink = platform === 'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference
        card.addTip(`Tip: Update The <code>${tag}</code> Meta Tag`, [msg1, msg2], cta)
    }

    public static tagImage_ReplacePlaceholder(card: Card, platform: Platform, tag: string, url: string) {
        const msg1 = `The image at following url in the <code>${tag}</code> meta tags for ${platform} is only a placeholder.`
        const msg2 = codeBlock(url, Mode.txt)
        const msg3 = `Upload an image to maximize the visual impact of posts on ${platform} sharing this page.`
        const msg4 = platform === 'Twitter' ? tweeterImageSpecs : facebookImageSpecs
        const cta: iLink = platform === 'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference
        card.addTip(`Tip: Replace the Image Placeholder in <code>${tag}</code>`, [msg1, msg2, msg3, msg4], cta)
    }

    public static tag_ReplacePlaceholder(card: Card, platform: Platform, tag: string, placeholder: string) {
        const msg1 = `The <code>${tag}</code> tag appears to contain only a short placeholder, the string "<i>${placeholder}</i>", for the tag value.`
        const msg2 = `Replace the title placeholder to maximize the impact of posts on ${platform} sharing this page.`
        const cta: iLink = platform === 'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference
        card.addTip(`Tip: Replace The Placeholder in the <code>${tag}</code> Meta Tag`, [msg1, msg2], cta)
    }

    public static tag_BeSpecific(card: Card, platform: Platform, tag: string, fallbackTag: iTag | undefined) {
        if (fallbackTag === undefined) {
            this.tag_Missing(card, platform, tag)
            return
        }
        let exampleTagValue = ''
        if(tag.includes('url')) {
            exampleTagValue = `https://mydomain.com/my_page.htm`
        } else if(tag.includes('image')) {
            exampleTagValue = `https://mydomain.com/my_image.png`
        } else if(tag.includes('title')) {
            exampleTagValue = `My click capturing title for ${platform}`
        }else if(tag.includes('description')) {
            exampleTagValue = `My short description of the page for ${platform}`
        }
        const msg1 =
            `${platform} is currently using the <code>${fallbackTag.tagLabel}</code> meta tag instead of the more specific <code>${tag}</code> tag to generate a preview of this page. ` +
            `Best practices recommend to use the specific meta tags for the ${platform} platform to maximize the performance of all posts sharing this page.`
        const msg2 = `This is an example of the ${platform} Meta-Tag that should be added:`
        const msg3 = codeBlock(`<meta property="${tag}" content="${exampleTagValue}">`, Mode.html)
        const cta: iLink = platform === 'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference
        card.addTip(`Tip: Add the <code>${tag}</code> Meta-Tag`, [msg1, msg2, msg3], cta)
    }

    public static tag_UpdateRelativePath(card: Card, platform: Platform, tagName: string, htmlTag: string) {
        const msg1 = `The page Meta Tag <code>${tagName}</code> for ${platform} is using a relative url path.`
        const msg2 =
            `Links in the Meta Tags should be always absolute paths, starting with <code>https://</code>. ` +
            `This is the meta tag you should fix:`
        const msg3 = codeBlock(htmlTag, Mode.html)
        const cta: iLink = platform === 'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference
        card.addTip(`Tip: Change "${tagName}" Url Paths to Absolute`, [msg1, msg2, msg3], cta)
    }

    public static tag_UpdateUnsafeUrl(card: Card, platform: Platform, tagName: string, htmlTag: string) {
        const msg1 =
            `The url in the Meta Tag <code>${tagName}</code> for ${platform} is using the unsafe and now obsolete <code>http</code> protocol. ` +
            `Links in the Meta Tags should be always use the safest <code>https</code> protocol.`
        const msg2 = `This is the meta tag you should fix:`
        const msg3 = codeBlock(htmlTag, Mode.html)
        const cta: iLink = platform === 'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference
        card.addTip(`Tip: Change <code>${tagName}</code> Url Protocol To HTTPS`, [msg1, msg2, msg3], cta)
    }

    public static tag_Missing(card: Card, platform: Platform, tagName: string) {
        const msg1 =
            `The Meta Tag <code>${tagName}</code> for ${platform} is missing. ` +
            `Add the Meta Tag to maximize your visibility om ${platform} when people are sharing this page.`
        const cta: iLink = platform === 'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference
        card.addTip(`Tip: Add the <code>${tagName}</code> Meta Tag`, [msg1], cta)
    }

    public static tag_Obsolete(card: Card, platform: Platform, tagName: string, htmlTag: string) {
        const msg1 =
            `The Meta Tag <code>${tagName}</code> for ${platform} is considered obsolete. ` +
            `Remove the following Meta Tag to comply with the best practices recommended by ${platform}.`
        const msg2 = codeBlock(htmlTag, Mode.html)
        const cta: iLink = platform === 'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference
        card.addTip(`Tip: Remove the <code>${tagName}</code> Meta Tag`, [msg1, msg2], cta)
    }

    // ---------------------------------------------------------------------------------------------
    // Structure Data TIPS
    public static multipleStructuredData(card: Card, objectName: string, occurrences: number) {
        const msg1 = `Detected ${occurrences.toFixed()} copies of the "${objectName}" Structured Data snippet.`
        const msg2 = `Consider removing the duplicates and merging the information about the ${objectName} into one single snippet.`
        const cta: iLink = {
            label: 'Learn About Structured Data',
            url: 'https://developers.google.com/search/docs/advanced/structured-data/product',
        }
        card.addTip(`Tip: Merge the "${objectName}" Data Structures`, [msg1, msg2], cta)
    }

    public static missingStructuredData(card: Card) {
        const msg1 =
            `Structured Data is an important SEO factor. It's very important to add a Structured Data snippet to each page.`
        const msg2 = `Structured data is important for SEO because it helps search engines find and understand your content and website. ` +
            `It's also an important way to prepare for the future of search, as Google and other engines continue to personalize the user experience and answer questions directly on their SERPs.`
        const cta: iLink = 
            {
                label: 'How to Use Structured Data',
                url: 'https://folini.medium.com/how-to-boost-your-pages-seo-with-json-ld-structured-data-bfa03ef48d42',
            }
        card.addTip('Tip: Add Structured Data Snippets', [msg1, msg2], cta)
    }

    public static invalidStructuredData(card: Card) {
        const msg1 =
            `A Structured Data snippet contains invalid JSON code blocking the Search Engine spiders/bots from efficiently indexing the page.`
        const msg2 = `Fix the LD-JSON code to benefit from the inclusion of Structured Data in the page.`
        const cta: iLink = {label: 'Learn About Structured Data', url: 'https://developers.google.com/search/docs/advanced/structured-data/product'}
        card.addTip('Fix the Invalid Structured Data Snippet', [msg1], cta)
    }
    
}
