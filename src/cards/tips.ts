// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {iTag} from './mt'
import {codeBlock} from '../codeBlock'
import {Card, iLink} from '../card'
import {Mode} from '../colorCode'
import {formatNumber} from '../main'
import {SmSource} from '../sitemapList'
import { specs} from "./specs"

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

const tagIsCritical = (tag: string) => specs.openGraphTags.recommendedTags.includes(tag) || specs.openGraphTags.recommendedTags.includes(tag)

const tipWhat = (...msg: string[]) => tipWhatWhyHow(`What's Wrong?`, ...msg)

const tipWhy = (...msg: string[]) => tipWhatWhyHow(`Why To Fix It?`, ...msg)

const tipHow = (...msg: string[]) => tipWhatWhyHow(`How to Fix It?`, ...msg)

const tipWhatWhyHow = (label: string, ...msg: string[]) =>
    `<div class='tip-what-why-how'>` +
    `<b>${label} </b>` +
    msg.map(str => (str.startsWith(`<div class='code'`) ? `<div class='tip-code'>${str}</div>` : str)).join(' ') +
    `</div>`

const tagExample = (tagLabel: string, platform: string) => {
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

// ----------------------------------------------------------------------------
// INTERNAL ERROR TIPS
export const internalError = (card: Card) => {
    const what = tipWhat(`Something went wrong.`)
    const why = tipWhy(`Something unexpected happened that the Extension was not able to properly manage.`)
    const how = tipHow(`Consider updating the "Page Auditor" Chrome Extension to the latest version.`)
    card.addTip(`Update Page Auditor to the latest version`, [what, why, how], robotsTxtReference)
}

export const unableToAnalyzeChromeBrowserPages = (card: Card) => {
    const what = tipWhat(`Unable to analyze Chrome browser pages.`)
    const why = tipWhy(`Google Chrome browser doesn't allow the analysis of internal pages and empty tabs.`)
    const how = tipHow(`Consider opening any website before opening the "Page Auditor" Chrome Extension`)
    card.addTip(`Open a Regular WebSite or Web Page`, [what, why, how], robotsTxtReference)
}

// ----------------------------------------------------------------------------
// Robots TXT TIPS
export const duplicateSitemapsInRobots = (card: Card, urls: string[]) => {
    urls = [...new Set(urls)]
    const what = tipWhat(`The <code>robots.txt</code> file links multiple times the same sitemap's url.`)
    const why = tipWhy(
        `Sitemaps files should always be linked from the <code>robots.txt</code> file, but only once.`,
        `Multiple links can confuse the search-engine crawlers and can waste your crawling budget on the same pages.`
    )
    const how = tipHow(
        `Update <code>robots.txt</code> making sure each <code>sitemap.xml</code> file is mentioned only one time.`,
        `This is a list of the duplicate Urls:`,
        codeBlock(urls.join('<br>'), Mode.txt)
    )
    card.addTip(`Remove Duplicate Sitemap Links`, [what, why, how], robotsTxtReference, 25)
}

export const unsafeSitemapLinkInRobots = (card: Card, urls: string[]) => {
    const what = tipWhat(
        `The <code>robots.txt</code> file refers a sitemap url using the unsafe and obsolete <code>http:</code> protocol instead of the safest and recommended <code>https:</code> protocol.`
    )
    const why = tipWhy(
        `It's important to correct and update the sitemap links in the  <code>robots.txt</code> by switching to the <code>https:</code> protocol.`,
        `Using the right protocol will ensure that Google crawler as well other search-engine crawler will not skip your <code>sitemap.xml</code> file.`,
        `Sitemap files must be always linked using the safe <code>https</code> protocol.`
    )
    const how = tipHow(
        `Update <code>robots.txt</code> replacing in all links <code>http:</code> with <code>https:</code> protocol.`,
        `This is a list of the unsafe Urls:`,
        codeBlock(urls.join('<br>'), Mode.txt),
        `And this how it should be:`,
        codeBlock(urls.map(url => url.replace('http:', 'https:')).join('<br>'), Mode.txt)
    )
    card.addTip(`Update Unsafe Sitemap Link`, [what, why, how], robotsTxtReference, 35)
}

export const addSitemapLinkToRobotsTxt = (card: Card, domain: string) => {
    const what = tipWhat(`The <code>robots.txt</code> doesn't list any <code>sitemap.xml</code> file.`)
    const why = tipWhy(
        `Linking a Sitemap from <code>robots.txt</code> is a way to ensure Google bot doesn't miss it. It's an optional directive, but strongly recommended.`,
        `While Google crawler can leverage the information provided in the GSC (Google Search Console), other search-engines will greatly benefit from finding a list of sitemaps in the <code>robots.txt</code> file.`
    )
    const how = tipHow(
        `If you have a Sitemap-Index file, you can include the location of just that file, and you don't need to list each individual Sitemap listed in the index file.`,
        `Add the link to your <code>sitemap.xml</code> to the <code>robots.txt</code> file with a line similar to the following:`,
        codeBlock(`Sitemap: ${domain}/sitemap.xml`, Mode.txt),
        `This directive is independent of the user-agent line, so it doesn't matter where you place it in your file.`
    )
    card.addTip(`Link Your Sitemap.xml From Robots.txt`, [what, why, how], robotsTxtReference, 50)
}

export const malformedRobotsTxt = (card: Card) => {
    const what = tipWhat(
        `The syntax of the <code>robots.txt</code> file doesn't seems to be aligned with the expected syntax.`
    )
    const why = tipWhy(
        `The <code>robots.txt</code> file, when present, is extensively used by all Search Engines bots a it's a very important factor in SEO ranking of the site.`,
        `But, it's important for the <code>robots.txt</code> file to be consistent with the standard syntax.`
    )
    const how = tipHow(`Double check the syntax of the <code>robots.txt</code> and update it ASAP.`)
    card.addTip(`Fix Robots.txt Syntax`, [what, why, how], robotsTxtReference, 75)
}

export const emptyRobotsTxt = (card: Card) => {
    const what = tipWhat(`A <code>robots.txt</code> file was detected, but it's empty with no content.`)
    const why = tipWhy(
        `It's critical to add the missing content to the <code>robots.txt</code> file.`,
        `Complete <code>robots.txt</code> are a very important factor in SEO ranking.`,
        `Unless this is a trivial website, there are pages that should not be indexed and therefore should be listed in the <code>robots.txt</code> with the directive <code>Disallow:</code>.`
    )
    const how = tipHow(
        `Add a few lines to the empty <code>robots.txt</code> blocking the pages you don't want to be indexed by the search-engines crawlers.`,
        `Typical examples of pages you don't want to be indexed are login pages, account pages, cart pages, order confirmation pages.`,
        `Also any temporary page you might have in your website should be disallowed in the <code>robots.txt</code> file.`
    )
    card.addTip(`Add Content to Robots.txt`, [what, why, how], robotsTxtReference, 40)
}

export const missingRobotsTxt = (card: Card) => {
    const what = tipWhat(`No <code>robots.txt</code> file was detected on this website.`)
    const why = tipWhy(
        `It's critical to add a <code>robots.txt</code> file to this website.`,
        `<code>robots.txt</code> are a very important factor in SEO ranking.`,
        `They provide a list of pages the crawlers are allowed to index, and a lis of pages to avoid (like temporary, login, and cart pages)`
    )
    const how = tipHow(
        `Add a simple <code>robots.txt</code> file.`,
        `To begin, you can write as a simple text file and upload it to your website.`,
        `Many website platform provide tools or option to automatically create a <code>robots.txt</code> file for you.`
    )
    card.addTip(`Add a Robots.txt file`, [what, why, how], robotsTxtReference, 80)
}

export const sitemapInRobotsWithRelativePath = (card: Card, relUrl: string, absUrl: string) => {
    const what = tipWhat(
        `The <code>robots.txt</code> file lists <code>sitemap.xml</code> url with a relative path.`,
        `This is the incorrect line:`,
        codeBlock(`Sitemap: ${relUrl}`, Mode.txt)
    )
    const why = tipWhy(
        `All links to a sitemap from the <code>robots.txt</code> must be absolute!`,
        `Linking your <code>sitemap.xml</code> from <code>robots.txt</code> makes the sitemap discoverable for all search-engines.`,
        `If the link is relative, search engines, like Google, will not be able to access the information in your sitemap.`
    )
    const how = tipHow(
        `Update the link to your <code>sitemap.xml</code> from the <code>robots.txt</code> with an absolute path. Absolute paths starts with <code>https:</code>.`,
        `The correct line with the link should look like this:`,
        codeBlock(`Sitemap: ${absUrl}`, Mode.txt)
    )
    card.addTip(
        `Change links in your Robots.txt file to absolute`,
        [what, why, how],
        robotsTxtReference,
        60
    )
}

export const sitemapInRobotsDoesNotExist = (card: Card, url: string) => {
    const what = tipWhat(
        `The <code>robots.txt</code> file lists <code>sitemap.xml</code> url pointing to a file that doesn't exist.`,
        `This is the broken link:`,
        codeBlock(url, Mode.txt)
    )
    const why = tipWhy(
        `Linking your <code>sitemap.xml</code> from <code>robots.txt</code> makes the sitemap discoverable for all search-engines.`,
        `If the link is broken or wrong, search engines, like Google, will not be able to access the information in your sitemap.`
    )
    const how = tipHow(
        `Move your sitemap to the location specified in the <code>robots.txt</code> or, keep the sitemap where it is and update the link.`
    )
    card.addTip(
        `Update broken link in your Robots.txt file`,
        [what, why, how],
        robotsTxtReference,
        50
    )
}

// ------------------------------------------------------------------------
// SITEMAP XML TIPS
export const missingSitemap = (card: Card) => {
    const what = tipWhat(`No <code>sitemap.xml</code> file was detected on this website.`)
    const why = tipWhy(
        `It's critical to add the missing <code>sitemap.xml</code> file.`,
        `Sitemaps are a very important factor in SEO ranking of a page.`,
        `A good XML sitemap acts as a roadmap of your website that leads Google to all your important pages.`,
        `XML sitemaps can be good for SEO, as they allow Google to find your critical website pages quickly, even if your internal linking isn't perfect.`
    )
    const how = tipHow(
        `Add a simple <code>sitemap.xml</code> file.`,
        `To begin, you can start writing as a simple text file and upload it to your website.`,
        `Many website platform provide tools or option to automatically create the sitemap.`
    )
    card.addTip(`Add a Sitemap.xml File`, [what, why, how], sitemapSyntaxReference, 85)
}

export const uncompressedLargeSitemap = (card: Card, url: string, size: number) => {
    const what = tipWhat(
        `Detected an uncompressed sitemap file with a size of ${(size / 1024).toFixed(2)} KB.`,
        `The uncompressed sitemap url is:`,
        codeBlock(url, Mode.txt)
    )
    const why = tipWhy(
        `While Google and Bing can easily handle <code>sitemap.xml</code> files up to 50 Mb in uncompressed size,`,
        `the recommended maximum size for uncompressed files is ${formatNumber(specs.siteMap.RecommendedMaxUncompressedSize / 1024 / 1024)} MB.`,
        `Compressed sitemap reduce the load on the website server and speedup upload and download of the file. ` +
            `However, there are no SEO direct benefits in compressing a sitemap.`
    )
    const how = tipHow(
        `Use a compressor, like <i>gzip</i>, to compress your sitemap file and upload it again to the webserver.`,
        `Don't forget to update the sitemap link in the <code>robots.txt</code> and in your GSG (Google Search Console).`
    )
    card.addTip(`Compress Sitemap`, [what, why, how], sitemapSyntaxReference, 15)
}

export const sitemapWithoutXmlExtension = (card: Card, url: string) => {
    const what = tipWhat(
        `This sitemap's url is lacking the standard extension for XML files: <code>.xml</code>.`,
        'This is the sitemap without proper extension:',
        codeBlock(url, Mode.txt)
    )
    const why = tipWhy(
        `Google crawler can handle even sitemaps without the proper extension.`,
        `However it's important to add the proper XML extension to allow the webserver to associate the correct <code>application/xml</code> MIME type when serving the sitemap to a client.`
    )
    const how = tipHow(
        `Consider to adopt the best practices for sitemaps by adding the <code>.xml</code> extension to all your sitemaps.`
    )
    card.addTip(
        `Add the XML Extension to Your Sitemap`,
        [what, how, why],
        sitemapSyntaxReference,
        25
    )
}

export const compressedSitemapNotFound = (card: Card, url: string, source: SmSource) => {
    const what = tipWhat(
        `The compressed sitemap ws not detected on this website. The sitemap, listed in your ${
            source == SmSource.RobotsTxt ? '<code>robots.txt</code>' : '<code>sitemap.xml</code>'
        } should be available at the url:`,
        codeBlock(url, Mode.txt)
    )
    const why = tipWhy(
        `It's critical to add the missing <code>sitemap.xml</code> file.`,
        `Sitemaps are a very important factor in SEO ranking of a page.`,
        `A good XML sitemap acts as a roadmap of your website that leads Google to all your important pages.`,
        `XML sitemaps can be good for SEO, as they allow Google to find your critical website pages quickly, even if your internal linking isn't perfect.`
    )
    const how = tipHow(
        `Upload the missing compress <code>sitemap.xml</code> file to the webserver to help Google bot properly index your website.`
    )
    card.addTip(
        `Upload The Missing Compressed Sitemap File`,
        [what, why, how],
        sitemapReference,
        80
    )
}

export const malformedSitemapXml = (card: Card) => {
    const what = tipWhat(
        `The sitemap file is syntactically valid. Sitemaps are expected to comply with the XML format syntax and rules.`
    )
    const why = tipWhy(
        `It's critical to add the missing <code>sitemap.xml</code> file.`,
        `Sitemaps are a very important factor in SEO ranking of a page.`,
        `A good XML sitemap acts as a roadmap of your website that leads Google to all your important pages.`,
        `XML sitemaps can be good for SEO, as they allow Google to find your critical website pages quickly, even if your internal linking isn't perfect.`
    )
    const how = tipHow(
        `Upload a correct <code>sitemap.xml</code> to the webserver to let Google bot properly index the website.`
    )
    card.addTip(`Fix Sitemap.xml Syntax`, [what, why, how], sitemapSyntaxReference, 80)
}

// ------------------------------------------------------------------------
// META TAGS TIPS
export const tag_AllMissing = (card: Card) => {
    const what = tipWhat(`The page is doesn't have any meta at all.`)
    const why = tipWhy(
        `Meta Data should always be include in every web page.`,
        `They provide important information to the browser and to the Search Engine bots about the page.`,
        `Also Meta tags allow the page to control how it will be shared by users providing recommendation for title, image and descriptions to be use for sharing post on Social-Media.`
    )
    const how = tipHow(`Add Meta Tags to Your Page in the <code>&lt;head&gt;</code> section of the HTML code.`)
    card.addTip(`Add Meta Tags to the Page`, [what, why, how], metaTagsReference, 85)
}

export const tag_NoValue = (card: Card, platform: Platform, tag: iTag) => {
    const what = tipWhat(`The <code>${tag.label}</code> tag doesn't contain any value.`)
    const why = tipWhy(`A missing value can block crawlers form properly read and process your page meta tags.`)
    const how = tipHow(`Add the missing value to maximize the impact of every on ${platform} post about this page.`)
    card.addTip(
        `Update The Invalid Meta Tag <code>${tag.label}</code>`,
        [what, why, how],
        platform === 'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
        70
    )
}

export const tag_ObsoleteValue = (card: Card, platform: Platform, tag: iTag, acceptedValues: string[]) => {
    const what = tipWhat(
        `The <code>${tag.label}</code> tag has an obsolete value that is not anymore valid:`,
        codeBlock(`<meta property="${tag.label}" content="${tag.value}">`, Mode.html)
    )
    const why = tipWhy(
        `While for now ${platform} might honoring obsolete values, it's important to update the tag with a proper value.`
    )
    const how = tipHow(
        `Update the obsolete meta tag value on your page by selecting an item from the following list of valid values:`,
        codeBlock(acceptedValues.join('<br>'), Mode.txt)
    )
    card.addTip(
        `Fix The Obsolete Value for Meta Tag <code>${tag.label}</code>`,
        [what, why, how],
        platform === 'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
        40
    )
}

export const tag_InvalidValue = (card: Card, platform: Platform, tag: iTag, acceptedValues: string[]) => {
    const what = tipWhat(
        `The <code>${tag.label}</code> is currently set to <code>${tag.value}</code>, not a valid value for this tag.`
    )
    const why = tipWhy(
        `An invalid value can confuse crawlers blocking them form properly read and process your page meta tags.`
    )
    const how = tipHow(
        `Please select a value from the following list of valid values:`,
        codeBlock(acceptedValues.join('<br>'), Mode.txt)
    )
    card.addTip(
        `Select a Valid Value For <code>${tag.label}</code>`,
        [what, why, how],
        platform === 'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
        80
    )
}

export const tag_REP_redundant = (card: Card, tags: iTag[], redundantValues: string[]) => {
    const what = tipWhat(
        `The <code>${tags[0].label}</code> is currently set to some redundant values that are not required or making any difference.`,
        `These are the redundant values listed for the tag:`,
        codeBlock(redundantValues.join('<br>'), Mode.txt)
    )
    const why = tipWhy(
        `There is no need to specify the default values for the REP (Robots Exclusion Protocol).`,
        `According to Google documentation, the values <i>${redundantValues.join(
            ', '
        )}</i> are already set by default, no need to specify them explicitly`
    )
    const how = tipHow(`Remove the listed values, and if nothing else is left, remove the entire meta tag.`)
    card.addTip(
        `The Value For the <code>${tags[0].label}</code> Meta Tag Is Redundant`,
        [what, why, how],
        {
            label: `Google Reference`,
            url: 'https://developers.google.com/search/blog/2007/03/using-robots-meta-tag',
        },
        10
    )
}

export const tag_Std_KeywordsIsObsolete = (card: Card, keywordsTag: iTag) => {
    const what = tipWhat(
        `This page includes a <code>${keywordsTag.label}</code> Meta tag. This tag is not required anymore and is obsolete.`
    )
    const why = tipWhy(
        `The <code>${keywordsTag.label}</code> Meta tag was abused in the past and stuffed with all sort of unrelated keywords.`,
        `Because of that all major search engines are now ignoring this tag and the tag itself is considered obsolete.`
    )
    const how = tipHow(
        `Remove the <code>${keywordsTag.label}</code> from the HTML of your page. There will be no direct SEO benefit, but your page will be simpler and smaller.`
    )
    card.addTip(
        `The <code>${keywordsTag.label}</code> Meta Tag Is Useless and Obsolete.`,
        [what, why, how],
        {
            label: `Google Reference`,
            url: 'https://developers.google.com/search/blog/2007/03/using-robots-meta-tag',
        },
        10
    )
}

export const tag_Std_TitleIsTooLong = (card: Card, titleTag: iTag) => {
    const what = tipWhat(
        `This page includes a <code>${titleTag.label}</code> Meta tag that is longer than the recommended max of <b>${specs.stdTags.Title.MaxLen}<b> characters.`
    )
    const why = tipWhy(
        `The <code>${titleTag.label}</code> might be used by Google when returning your page as a result of a search.`,
        `According to Moz, if the title is longer than ${specs.stdTags.Title.MaxLen} characters, Google will truncate it or will use a sentence arbitrarily selected from the page content.`
    )
    const how = tipHow(
        `Rewrite the title using less than ${specs.stdTags.Title.MaxLen} characters and update the <code>${titleTag.label}</code> Meta tag accordingly.`
    )
    card.addTip(
        `The <code>${titleTag.label}</code> Meta Tag Is Too Long.`,
        [what, why, how],
        {
            label: `Google Reference`,
            url: 'https://developers.google.com/search/blog/2007/03/using-robots-meta-tag',
        },
        25
    )
}

export const tag_Std_DescriptionIsTooLong = (card: Card, descriptionTag: iTag) => {
    const what = tipWhat(
        `This page includes a <code>${descriptionTag.label}</code> Meta tag that is longer than the recommended max of <b>${specs.stdTags.Desc.MaxLen}<b> characters.`
    )
    const why = tipWhy(
        `The <code>${descriptionTag.label}</code> might be used by Google when returning your page as a result of a search.`,
        `If the description is longer than ${specs.stdTags.Desc.MaxLen} characters, Google will truncate it or will use a sentence arbitrarily selected from the page content.`
    )
    const how = tipHow(
        `Rewrite teh description using less than ${specs.stdTags.Desc.MaxLen} characters and update the <code>${descriptionTag.label}</code> Meta tag accordingly.`
    )
    card.addTip(
        `The <code>${descriptionTag.label}<c/ode> Meta Tag Is Too Long.`,
        [what, why, how],
        {
            label: `Google Reference`,
            url: 'https://developers.google.com/search/blog/2007/03/using-robots-meta-tag',
        },
        35
    )
}

export const tag_Std_DescriptionIsTooShort = (card: Card, descriptionTag: iTag) => {
    const what = tipWhat(
        `This page includes a <code>${descriptionTag.label}</code> Meta tag that is shorter than the recommended minimum of <b>${specs.stdTags.Desc.MinLen}<b> characters.`
    )
    const why = tipWhy(
        `The <code>${descriptionTag.label}</code> might be used by Google when returning your page as a result of a search.`,
        `If the description is shorter than ${specs.stdTags.Desc.MinLen} characters, Google might use a sentence arbitrarily selected from the page content.`
    )
    const how = tipHow(
        `Rewrite teh description using more than ${specs.stdTags.Desc.MinLen} characters and update the <code>${descriptionTag.label}</code> Meta tag accordingly.`
    )
    card.addTip(
        `The <code>${descriptionTag.label}</code> Meta Tag Is Too Short.`,
        [what, why, how],
        {
            label: `Google Reference`,
            url: 'https://developers.google.com/search/blog/2007/03/using-robots-meta-tag',
        },
        40
    )
}

export const tagImage_NoTag = (card: Card, platform: Platform, tag: string) => {
    const what = tipWhat(
        `This page is lacking the <code>${tag}</code> meta tag to use with ${platform} when posting about this page.`
    )
    const why = tipWhy(
        `If the <code>${tag}</code> meta tag is missing, ${platform} will not able to associate an image to any post or link about this page, compromising its visibility across social-media.`
    )
    const how = tipHow(
        `Add the missing tag.`,
        `This is an example of the ${platform} Meta Tag that should be added:`,
        codeBlock(`<meta property="${tag}" content="https://www.example.com/my_image.jpg">`, Mode.html),
        platform === 'Twitter' ? specs.twitterTags.imageSpecsTextual : specs.openGraphTags.imageSpecsTextual
    )
    card.addTip(
        `Add the Meta Tag <code>${tag}</code> for Image Preview`,
        [what, why, how],
        'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
        70
    )
}

export const tagImage_NoImage = (card: Card, platform: Platform, tag: iTag) => {
    const what = tipWhat(
        `The image at following url specified in the <code>${tag.label}</code> meta tags for ${platform} doesn't exist.`,
        codeBlock(tag.value, Mode.txt)
    )
    const why = tipWhy(
        `If the image linked by the <code>${tag}</code> meta tag is missing, ${platform} will not able to associate an image to any post or link about this page, compromising its visibility across social-media.`
    )
    const how = tipHow(
        `Upload the missing image or fix the url to maximize the visual impact on ${platform} of every posts about this page.`,
        platform === 'Twitter' ? specs.twitterTags.imageSpecsTextual : specs.openGraphTags.imageSpecsTextual
    )
    card.addTip(
        `Upload The Image Preview Meta Tag for ${platform}`,
        [what, why, how],
        'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
        65
    )
}

export const tagImage_Placeholder = (card: Card, platform: Platform, tag: iTag) => {
    const what = tipWhat(
        `The image linked in the <code>${tag.label}</code> meta tags for ${platform} is only a placeholder.`,
        `This is the current value of the tag:`,
        codeBlock(tag.value, Mode.txt)
    )
    const why = tipWhy(
        `When this page is shared on ${platform} the image is the most prominent and visible part of the post.`,
        `It's critical to select an image that is relevant to the content of the page and has a high visual impact.`
    )
    const how = tipHow(
        `Upload an image to maximize the visual impact of posts on ${platform} sharing this page.`,
        platform === 'Twitter' ? specs.twitterTags.imageSpecsTextual : specs.openGraphTags.imageSpecsTextual
    )
    card.addTip(
        `Replace the Image Preview Placeholder in <code>${tag.label}</code>`,
        [what, why, how],
        'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
        60
    )
}

export const tagUrl_NonCanonical = (card: Card, platform: Platform, tag: iTag, canonical: string) => {
    const what = tipWhat(
        `The Meta Tag <code>${tag.label}</code> for ${platform} must be consistent with the canonical URL specified in the <code>&lt;head&gt;</code> section of the HTML page (the must be identical).`
    )
    const why = tipWhy(
        `Sharing a page on social-media with a non-canonical url can dilute the reputation (page-ranking) of the page across multiple urls.`
    )
    const how = tipHow(
        `Replace the current value of the <code>${tag.label}</code> Meta Tag:`,
        codeBlock(`<meta property="${tag.label}" content="${tag.value}">`, Mode.html),
        `With the following <code>${tag.label}</code> code:`,
        codeBlock(`<meta property="${tag.label}" content="${canonical}">`, Mode.html)
    )
    card.addTip(
        `Use the Canonical Url for the Meta Tag <code>${tag.label}</code>`,
        [what, why, how],
        platform === 'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
        60
    )
}

export const tagUrl_RelativePath = (card: Card, platform: Platform, tag: iTag) => {
    const what = tipWhat(`The Meta Tag <code>${tag.label}</code> for ${platform} is using a relative url path.`)
    const why = tipWhy(
        `Links in the Meta Tags must always use absolute paths, starting with <code>https://</code>.`,
        `Relative paths will be completely ignored by all search-engine crawler and they will compromise the value of the entire Structured Data section.`
    )
    const how = tipHow(`This is the current meta tag you should fix:`, codeBlock(tag.code, Mode.html))
    card.addTip(
        `Change the Url to Absolute in <code>${tag.label}</code>`,
        [what, why, how],
        platform === 'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
        75
    )
}

export const tagUrl_ObsoleteProtocol = (card: Card, platform: Platform, tag: iTag) => {
    const what = tipWhat(
        `The url in the Meta Tag <code>${tag.label}</code> for ${platform} is using the unsafe and now obsolete <code>http:</code> protocol.`
    )
    const why = tipWhy(
        `According to the Structured Data specs, all links in the Meta Tags should always use the safest <code>https:</code> protocol.`
    )
    const how = tipHow(`This is the meta tag you should fix:`, codeBlock(tag.code, Mode.html))
    card.addTip(
        `Change <code>${tag.label}</code> Url Protocol To HTTPS`,
        [what, why, how],
        platform === 'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
        35
    )
}

export const tag_Placeholder = (card: Card, platform: Platform, tag: iTag) => {
    const what = tipWhat(
        `The <code>${tag.label}</code> tag appears to contain only a short placeholder for the tag value:`,
        codeBlock(`<meta property="${tag.label}" content="${tag.value}">`, Mode.html)
    )
    const why = tipWhy(
        `In order for this page to be successfully shared on ${platform} all critical meta tags must be present.`
    )
    const how = tipHow(
        `Replace the placeholder with something more meaningful to maximize the impact of posts on ${platform} sharing this page.`
    )
    card.addTip(
        `Replace the Placeholder in the <code>${tag.label}</code>`,
        [what, why, how],
        'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
        50
    )
}

export const tag_OverRecommendedLength = (
    card: Card,
    platform: Platform,
    tag: iTag,
    maxLength: number,
    recommendedLength: number
) => {
    const what = tipWhat(
        `On this page, the <code>${tag.label}</code> tag is <b>${tag.value.length}</b> characters long.`
    )
    const why = tipWhy(
        `While this tag value is below the the maximum length for <code>${tag.label}</code>, set at ${maxLength.toFixed()} by the specs, best practices recommend to keep the field even shorter, below <b>${recommendedLength}</b>.`,
        `Keeping the tag at that length will ensure that the value will not be trimmed when a post on ${platform} sharing this page is displayed an small devices.`,
        `Automatic trim can disrupt the content you carefully crafted for this page with unpredictable results.`
    )
    const how = tipHow(`Reduce the length of the tag value to ${recommendedLength.toFixed()}.`)
    card.addTip(
        `Consider shortening the Meta Tag <code>${tag.label}</code>`,
        [what, why, how],
        'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
        15
    )
}

export const tag_OverMaxLength = (card: Card, platform: Platform, tag: iTag, maxLength: number) => {
    const what = tipWhat(`The <code>${tag.label}</code> tag value is <b>${tag.value.length}</b> characters long.`)
    const why = tipWhy(
        `The length is over the maximum of <b>${maxLength.toFixed()}</b>, specified by ${platform} for this tag.`,
        `Longer values could be trimmed on some device when ${platform} will display a post linking to this page.`,
        `Automatic trim of the content can affect visibility and popularity of post sharing your page on ${platform}.`
    )
    const how = tipHow(
        `Reduce the length of the tag value to make sure your <code>${tag.label}</code> will not be trimmed by ${platform} on posts sharing this page.`
    )
    card.addTip(
        `Shorten the Meta Tag <code>${tag.label}</code>`,
        [what, why, how],
        'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
        40
    )
}

export const tag_NonSpecific = (card: Card, platform: Platform, tagLabel: string, fallbackTag: iTag | undefined) => {
    if (fallbackTag === undefined) {
        tag_Missing(card, platform, tagLabel)
        return
    }
    const what = tipWhat(
        `The page doesn't include the specific ${
            tagIsCritical(tagLabel) ? `and critical ` : ``
        } ${platform} meta <code>${tagLabel}</code>, only the generic <code>${
            fallbackTag.label
        }</code> tag is present.`,
        `Crawlers and bots looking for ${platform} tags will fall back to the generic tag.`
    )
    const why = tipWhy(
        `While this issue doesn't have any direct impact on the page SEO, best practices recommend to use the specific meta tags for the ${platform} platform to maximize the performance and visibility of all posts sharing this page on social media.`
    )
    const how = tipHow(`Add the following meta tag to your page:`, tagExample(tagLabel, platform))
    card.addTip(
        `Use the ${
            tagIsCritical(tagLabel) ? `Critical ` : platform
        } Meta Tag <code>${tagLabel}</code>`,
        [what, why, how],
        platform === 'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
        tagIsCritical(tagLabel) ? 20 : 10
    )
}

export const tag_Missing = (card: Card, platform: Platform, tagLabel: string) => {
    const what = tipWhat(
        `The page doesn't include the ${
            tagIsCritical(tagLabel) ? `critical ` : ``
        } ${platform} meta <code>${tagLabel}</code> tag.`
    )
    const why = tipWhy(
        tagIsCritical(tagLabel) ? `Critical ` : ``,
        `Meta tags like <code>${tagLabel}</code> are giving you full control on how a link to your page will be rendered on social-media when someone shares or links your page.`,
        `A well defined and complete set of meta tags maximizes your page visibility and visual impact.`
    )
    const how = tipHow(`Add a meta tag similar to the following:`, tagExample(tagLabel, platform))
    card.addTip(
        `Add the ${
            tagIsCritical(tagLabel) ? `Critical ` : platform
        } Meta Tag <code>${tagLabel}</code>`,
        [what, why, how],
        platform === 'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
        tagIsCritical(tagLabel) ? 65 : 45
    )
}

export const tag_Obsolete = (card: Card, platform: Platform, tagName: string, htmlTag: string) => {
    const what = tipWhat(`The Meta Tag <code>${tagName}</code> for ${platform} is considered obsolete.`)
    const why = tipWhy(
        `Obsolete tags will not hurd the SEO of the page.`,
        `They will be ignored by the search-engine crawlers, but they will make the content of the page less clear, and the maintenance more laborsome.`
    )
    const how = tipHow(
        `Remove the following Meta Tag to comply with the best practices recommended by ${platform}:`,
        codeBlock(htmlTag, Mode.html)
    )
    card.addTip(
        `Remove the Obsolete ${platform} Meta Tag <code>${tagName}</code>`,
        [what, why, how],
        platform === 'Twitter' ? twitterMetaTagsReference : openGraphMetaTagsReference,
        15
    )
}

export const tag_noOpenGraphTags = (card: Card) => {
    const what = tipWhat(`The page doesn't include any Open Graph meta tag.`)
    const why = tipWhy(
        `Meta Tags specific for Facebook, called Open Graph meta tags, should always be include in every web page.`,
        `While they don't have a direct impact on SEO, they control how the page will appear when shared on Facebook and other social-media, like LinkedIn, that are levering the Open Graph standards.` +
            `They provide recommendation to Twitter for title, image, and descriptions.`
    )
    const how = tipHow(
        `Add at least the following most critical Open Graph meta tags to the page.`,
        codeBlock(specs.openGraphTags.recommendedTags.join('\n'), Mode.txt)
    )
    card.addTip(
        `Add Facebook (Open Graph) Meta Tags to the Page`,
        [what, why, how],
        openGraphMetaTagsReference,
        75
    )
}

export const tag_noTwitterTags = (card: Card) => {
    const what = tipWhat(`The page doesn't include any Twitter meta tag.`)
    const why = tipWhy(
        `Meta Tags specific for Twitter should always be include in every web page.`,
        `While they don't have a direct impact on SEO, they control how the page will appear when shared on Twitter.` +
            `They provide recommendation to Twitter for title, image, and descriptions.`
    )
    const how = tipHow(
        `Add at least the following most critical Twitter meta tags to the page.`,
        codeBlock(specs.twitterTags.recommendedTags.join('\n'), Mode.txt)
    )
    card.addTip(
        `Add Twitter Meta Tags to the Page`,
        [what, why, how],
        twitterMetaTagsReference,
        75
    )
}

// ---------------------------------------------------------------------------------------------
// Structure Data TIPS
export const sd_relativeUrl = (cardPromise: Promise<Card>, objectName: string, urls: string[], pageUrl: string) => {
    const what = tipWhat(
        `Detected ${urls.length.toFixed()} urls with local/relative path listed in the "${objectName}" Structured Data snippet of the page:`,
        codeBlock(urls.join('\n'), Mode.txt)
    )
    const why = tipWhy(`Search engines crawlers might ignore relative urls when used in a structured data snippet.`)
    const how = tipHow(
        `Update your page Structured Data using only absolute path names and removing the listed relative paths.`,
        `This is the list of absolute urls to use when replacing the relative urls:`,
        codeBlock(urls.map(u => `${new URL(pageUrl).origin}${u}`).join('\n'), Mode.txt)
    )
    cardPromise.then(card =>
        card.addTip(
            `Rewrite URLs in "${objectName}" with Absolute Path`,
            [what, why, how],
            structuredDataReference,
            50
        )
    )
}

export const sd_imageUrlMissingProtocol = (cardPromise: Promise<Card>, objectName: string, urls: string[]) => {
    const what = tipWhat(
        `The image(s) urls with in the "${objectName}" Structured Data snippet of the page are missing the protocol.`,
        `A valid protocol is <code>https:</code>. These are the urls with the issue:`,
        codeBlock(urls.join('\n'), Mode.txt)
    )
    const why = tipWhy(
        `Search engines crawlers might ignore urls without protocol when used in a structured data snippet.`
    )
    const how = tipHow(
        `Update your page Structured Data using only complete urls.`,
        `This is the list of complete urls to use when replacing the relative urls:`,
        codeBlock(urls.map(u => `https:${u}`).join('\n'), Mode.txt)
    )
    cardPromise.then(card =>
        card.addTip(
            `Rewrite URLs in "${objectName}" adding the <code>https</code> protocol`,
            [what, why, how],
            structuredDataReference,
            25
        )
    )
}

export const sd_imageEmptyUrl = (cardPromise: Promise<Card>, objectName: string) => {
    const what = tipWhat(`The image(s) urls with in the "${objectName}" Structured Data snippet of the page is empty.`)
    const why = tipWhy(`Search engines crawlers might ca nbe confused by empty urls.`)
    const how = tipHow(
        `Update your page Structured Data by adding the missing url.`,
        `If you don't intend to provide this url, just remove the property <code>${objectName}</code> from the page <code>JSON-LD</code>.`
    )
    cardPromise.then(card =>
        card.addTip(
            `Replace the empty URL in "${objectName}".`,
            [what, why, how],
            structuredDataReference,
            25
        )
    )
}

export const sd_repeatedSchemas = (card: Card, objectName: string, occurrences: number) => {
    const what = tipWhat(
        `Detected ${occurrences.toFixed()} copies of the "${objectName}" Structured Data snippet of the page.`
    )
    const why = tipWhy(
        `The consistency af Structured Data is very important in order to let the search-engine properly learn about the content and structure of your pages.`,
        `Even marginal errors or duplicated structures can confuse the parser and nullify the contribution and impact of your Structured Data.`
    )
    const how = tipHow(
        `Consider removing the duplicates and merging the information about the ${objectName} into one single snippet.`
    )
    card.addTip(
        `Merge the "${objectName}" Data Structures`,
        [what, why, how],
        structuredDataReference,
        25
    )
}

export const sd_noStructuredData = (card: Card) => {
    const what = tipWhat(
        `This page is missing a Structured Data section describing the content and semantic of the page.`
    )
    const why = tipWhy(
        `Structured Data is an important SEO factor.`,
        `It's critical to add a Structured Data snippet to each page of a website.`,
        `It helps search engines find and understand your content and website.`,
        `It's also an important way to prepare for the future of search, as Google and other engines continue to personalize the user experience and answer questions directly on their SERPs.`
    )
    const how = tipHow(
        `Add Structured Data to each page of your website. There are 3 available formats: JSON-LD, MicroData and RDFa. Google recommends to use <code>JSON-LD</code>.`,
        `<code>JSON-LD</code> is also the easiest format to create and to maintain.`
    )
    card.addTip(`Add Structured Data To the Page`, [what, why, how], structuredDataHowToUse, 85)
}

export const sd_invalidSyntax = (card: Card) => {
    const what = tipWhat(`A Structured Data snippet contains invalid JSON code.`)
    const why = tipWhy(
        `Invalid Structured Data can block the Search Engine spiders/bots from efficiently indexing the page.`
    )
    const how = tipHow(`Fix the LD-JSON code to benefit from the inclusion of Structured Data in the page.`)
    card.addTip(`Fix the Invalid Structured Data`, [what, why, how], structuredDataReference, 75)
}

export const sd_ImageNotFound = (cardPromise: Promise<Card>, url: string, label: string, typeName: string) => {
    const what = tipWhat(
        `An image listed in the Structured Data under the <code>${typeName}</code> section as a value for <code>${label}</code> was not found.`,
        `This is the url of the missing image:`,
        codeBlock(url, Mode.txt)
    )
    const why = tipWhy(
        `A broken link to a non-existent image can break the validity of the Structured Data and can invalidate the entire <code>JSON-LS</code>.`
    )
    const how = tipHow(
        `If the issue is a misspell in the image url, edit the <code>JSON-LD</code> adding the correct url.`,
        `If the issue is the missing image upload the image at the specified url ASAP.`
    )
    cardPromise.then(card =>
        card.addTip(
            `Add Image Listed in Structured Data That Is Missing`,
            [what, why, how],
            structuredDataReference,
            75
        )
    )
}
