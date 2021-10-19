// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {codeBlock} from '../codeBlock'
import {Card, iLink} from '../card'
import {formatNumber} from '../main'
import {sitemapRecommendedMaxSize} from './suggestionCards'
import {Mode} from '../colorCode'

export class Tips {
    public static duplicateSitemapsInRobots(card: Card, urls: string[]) {
        urls = [...new Set(urls)]
        const plural = urls.length > 1 ? 's' : ''
        const msg1 = `The <code>robots.txt</code> file links multiple times the same sitemap's url.`
        const msg2 =
            `It's important to correct and update <code>robots.txt</code> to make sure each sitemap.xml is mentioned only one time. ` +
            `Sitemap files should be always linked using the safe <code>https</code> protocol.<br>` +
            `This is a list of the duplicate Urls:`
        const msg3 = codeBlock(urls.join('<br>'), Mode.txt)
        const cta: iLink = {
            label: 'Read a Sitemap.xml Reference',
            url: 'https://www.woorank.com/en/blog/how-to-locate-a-sitemap-in-a-robots-txt-file',
        }
        card.addTip('Tip: Remove Duplicate Sitemap Links', [msg1, msg2, msg3], cta)
    }

    public static considerCompressingSitemap(card: Card, url: string, size: number) {
        const msg1 =
            `This sitemaps file size is ${formatNumber(
                size
            )} bytes. The recommended maximum size for uncompressed files is ${formatNumber(
                sitemapRecommendedMaxSize
            )} bytes. ` +
            `Compressing your sitemap.xml with <i>gzip</i> will reduce the load on your server and speedup upload and download of the file. ` +
            `However, there are no SEO direct benefits in compressing a sitemap. `
        const cta: iLink = {
            label: 'Learn about Compressing Sitemaps',
            url: 'https://www.sitemaps.org/faq.html#faq_sitemap_size',
        }
        card.addTip('Tip: Compress Sitemap', [msg1], cta)
    }

    public static lackingSitemapExtension = (card: Card, url: string) => {
        const msg1 =
            `This sitemap's url is lacking the standard extension for XML files: <code>.xml</code>. ` +
            `Consider to adopt the best practices for sitemaps by adding the <code>.xml</code> extension. ` +
            `However, Google bot should be able to process your sitemaps even if they don't have the correct extension.`
        const cta: iLink = {
            label: 'Learn about Compressing Sitemaps',
            url: 'https://www.sitemaps.org/faq.html#faq_sitemap_size',
        }
        card.addTip('Tip: Add the XML Extension', [msg1], cta)
    }

    public static unsafeSitemapLinkInRobots(card: Card, urls: string[]) {
        let msg1 =
            `The <code>robots.txt</code> file refers a sitemap url using the unsafe and obsolete <code>http</code> protocol ` +
            `instead of the safest and recommended <code>https</code> protocol.`
        let msg2 =
            `It's important to correct and update the sitemap links in the  <code>robots.txt</code> by switching to the <code>https</code> protocol. ` +
            `Sitemap files should be always linked using the safe <code>https</code> protocol.`
        const cta: iLink = {
            label: 'Read a Sitemap.xml Reference',
            url: 'https://www.woorank.com/en/blog/how-to-locate-a-sitemap-in-a-robots-txt-file',
        }
        card.addTip('Tip: Update Unsafe Sitemap Link', [msg1, msg2], cta)
    }

    public static lackingOpenGraphImageMetaTag(card: Card) {
        const msg1 =
            `The page is lacking a meta tag specifying the image for Facebook to use when rendering a post sharing this page.<br>` +
            `This is an example of the Facebook (Open Graph) Meta-Tag that should be added:`
        const msg2 = codeBlock(`<meta property="og:image" content="https://www.example.com/my_image.jpg">`, Mode.html)
        const cta: iLink = {label: 'Learn about Facebook Meta Tags', url: 'https://ogp.me/'}
        card.addTip('Tip: Add a Meta-Tag for Facebook Image', [msg1, msg2], cta)
    }

    public static lackingTwitterImageMetaTag(card: Card) {
        const msg1 =
            `This page is lacking a meta tag specifying the image for Twitter to use when rendering a post sharing this page.<br>` +
            `This is an example of the Twitter Meta-Tag that should be added:`
        const msg2 = codeBlock(
            `<meta property="twitter:image" content="https://www.example.com/my_image.jpg">`,
            Mode.html
        )
        const cta: iLink = {
            label: 'Learn about Twitter Meta Tags',
            url: 'https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started',
        }
        card.addTip('Tip: Add a Meta-Tag for Twitter Image', [msg1, msg2], cta)
    }

    public static lackingSpecificTwitterImageMetaTag(card: Card) {
        const msg1 =
            `This page is lacking a specific meta tag specifying the image for Twitter to use when rendering a post sharing this page.<br>` +
            `When a specific meta tag for Twitter is missing, Twitter bot will look for the OpenGraph equivalent meta tags <code>og:image</code>.`
        const msg2 = `This is an example of the Twitter Meta-Tag that should be added:`
        const msg3 = codeBlock(
            `<meta property="twitter:image" content="https://www.example.com/my_image.jpg">`,
            Mode.html
        )
        const cta: iLink = {
            label: 'Learn about Twitter Meta Tags',
            url: 'https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started',
        }
        card.addTip('Tip: Add Specific Meta-Tag for Twitter Image', [msg1, msg2, msg3], cta)
    }

    public static missingTwitterImage(card: Card, url: string) {
        const msg1 = `The image at following url specified in the meta tags for Twitter doesn't exist.`
        const msg2 = codeBlock(url, Mode.txt)
        const msg3 = `Upload the missing image or fix the url to maximize the visual impact of posts on Twitter sharing this page.`
        const cta: iLink = {
            label: 'Learn about Twitter Meta Tags',
            url: 'https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started',
        }
        card.addTip('Tip: Upload The Twitter Meta Tag Image', [msg1, msg2, msg3], cta)
    }

    public static missingOpenGraphImage(card: Card, url: string) {
        const msg1 = `The image at following url specified in the meta tags for Open Graph (Facebook) doesn't exist.`
        const msg2 = codeBlock(url, Mode.txt)
        const msg3 = `Upload the missing image or fix the url to maximize the visual impact of posts on Facebook sharing this page.`
        const cta: iLink = {label: 'Learn about Facebook Meta Tags', url: 'https://ogp.me/'}
        card.addTip('Tip: Upload The Open Graph Meta Tag Image', [msg1, msg2, msg3], cta)
    }

    public static emptyTwitterImage(card: Card, url: string) {
        const msg1 = `The image at following url specified in the meta tags for Twitter is empty.`
        const msg2 = codeBlock(url, Mode.txt)
        const msg3 = `Upload a new image to maximize the visual impact of posts on Twitter sharing this page.`
        const cta: iLink = {
            label: 'Learn about Twitter Meta Tags',
            url: 'https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started',
        }
        card.addTip('Tip: Upload a New Twitter Meta Tag Image', [msg1, msg2, msg3], cta)
    }

    public static emptyOpenGraphImage(card: Card, url: string) {
        const msg1 = `The image at following url specified in the meta tags for Open Graph (Facebook) is empty.`
        const msg2 = codeBlock(url, Mode.txt)
        const msg3 = `Upload a new image to maximize the visual impact of posts on Facebook sharing this page.`
        const cta: iLink = {label: 'Learn about Facebook Meta Tags', url: 'https://ogp.me/'}
        card.addTip('Tip: Upload a New Open Graph Meta Tag Image', [msg1, msg2, msg3], cta)
    }

    public static addSitemapLinkToRobotsTxt = (card: Card) => {
        const msg1 = `Linking your Sitemap(s) from <code>Robots.txt</code> is a way to ensure Google doesn't miss it/them. It's an optional directive, but strongly recommended.`
        const msg2 =
            `This directive is independent of the user-agent line, so it doesn't matter where you place it in your file. ` +
            `If you have a Sitemap index file, you can include the location of just that file. ` +
            `You don't need to list each individual Sitemap listed in the index file.`
        const msg3 = `A link to a <code>sitemap.xml</code> should be added to the <code>robots.txt</code> file with a line similar to the following:`
        const msg4 = codeBlock(`Sitemap: https://www.example.com/sitemap.xml`, Mode.txt)
        const cta: iLink = {
            label: 'How to Link a Sitemap From Robots.Txt',
            url: 'https://www.woorank.com/en/blog/how-to-locate-a-sitemap-in-a-robots-txt-file',
        }
        card.addTip('Tip: Link Your Sitemap.xml From Robots.txt', [msg1, msg2, msg3, msg4], cta)
    }

    public static tagWithRelativeUrlPath(card: Card, tagName: string, htmlTag: string) {
        const msg1 = `The page Meta Tag <code>${tagName}</code> is using a relative url path.`
        const msg2 = `Links in the Meta Tags should be always absolute paths, starting with <code>https://</code>.`
        const msg3 = `This is the meta tag you should fix:`
        const msg4 = codeBlock(htmlTag, Mode.html)
        const cta: iLink = {
            label: 'Learn about Meta Tags',
            url: 'https://moz.com/blog/the-ultimate-guide-to-seo-meta-tags',
        }
        card.addTip(`Tip: Change "${tagName}" Url Paths to Absolute`, [msg1, msg2, msg3, msg4], cta)
    }
    public static tagWithUnsafeUrl(card: Card, tagName: string, htmlTag: string) {
        const msg1 =
            `The url in the Meta Tag <code>${tagName}</code> is using the unsafe and now obsolete <code>http</code> protocol. ` +
            `Links in the Meta Tags should be always use the safest <code>https</code> protocol.`
        const msg2 = `This is the meta tag you should fix:`
        const msg3 = codeBlock(htmlTag, Mode.html)
        const cta: iLink = {
            label: 'Learn about Meta Tags',
            url: 'https://moz.com/blog/the-ultimate-guide-to-seo-meta-tags',
        }
        card.addTip(`Tip: Change "${tagName}" Url Protocol To HTTPS`, [msg1, msg2, msg3], cta)
    }
}
