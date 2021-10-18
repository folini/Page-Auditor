// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {formatNumber} from '../main'
import {Card, iLink} from '../card'
import {Mode} from '../colorCode'
import { UrlsToCompress } from './robots-functions'

export const sitemapRecommendedMaxSize = 50_000

export const missingStructuredData = () => {
    const message =
        `Structured Data is an important SEO factor. ` +
        `It's very important to add a Structured Data snippet to each page.`
    const links: iLink[] = [
        {
            label: 'How to Use Structured Data',
            url: 'https://folini.medium.com/how-to-boost-your-pages-seo-with-json-ld-structured-data-bfa03ef48d42',
        },
    ]
    return new Card().suggestion().addParagraph(message).addCTA(links).setTitle('Add Structured Data Snippets')
}

export const unsafeSitemapLinkInRobots = (urls: string[]) => {
    const plural = urls.length > 1 ? 's' : ''
    let message1 =
        `The <code>robots.txt</code> file refers the following sitemap url${plural} using the <code>http</code> protocol ` +
        `instead of the safest and recommended <code>https</code> protocol:`
    let message2 =
        `It's important to correct and update the sitemap links in the  <code>robots.txt</code> by switching to the <code>https</code> protocol. ` +
        `Sitemap files should be always linked using the safe <code>https</code> protocol.`
    const links: iLink[] = [
        {
            label: 'Read a Sitemap.xml Reference',
            url: 'https://www.woorank.com/en/blog/how-to-locate-a-sitemap-in-a-robots-txt-file',
        },
    ]
    return new Card()
        .suggestion()
        .addParagraph(message1)
        .addCodeBlock(urls.map(url => `Sitemap: ${url.replace(`http://`, `https://`)}`).join('\n'), Mode.txt)
        .addParagraph(message2)
        .addCTA(links)
        .setTitle(`Fix Sitemap Link${plural} in Robots.txt`)
}

export const duplicateSitemapsInRobots = (urls: string[]) => {
    urls = [...new Set(urls)]
    const plural = urls.length > 1 ? 's' : ''
    let message1 = `The <code>robots.txt</code> file links multiple times the following sitemap${plural}:`
    let message2 =
        `It's important to correct and update <code>robots.txt</code> to make sure each sitemap.xml is mentioned only one time. ` +
        `Sitemap files should be always linked using the safe <code>https</code> protocol.`
    const links: iLink[] = [
        {
            label: 'Read a Sitemap.xml Reference',
            url: 'https://www.woorank.com/en/blog/how-to-locate-a-sitemap-in-a-robots-txt-file',
        },
    ]
    return new Card()
        .suggestion()
        .addParagraph(message1)
        .addCodeBlock(urls.map(url => `Sitemap: ${url}`).join('\n'), Mode.txt)
        .addParagraph(message2)
        .addCTA(links)
        .setTitle(`Remove Duplicate Sitemap Link${plural} in Robots.txt`)
}

export const missingRobotsTxt = () => {
    const message =
        `It's important to add ASAP the missing <code>robots.txt</code> file. ` +
        `Robots.txt are a very important factor in SEO ranking.`
    const links: iLink[] = [
        {
            label: 'Read a Robots.txt Reference',
            url: 'https://developers.google.com/search/docs/advanced/robots/robots_txt',
        },
    ]
    return new Card().suggestion().addParagraph(message).addCTA(links).setTitle('Add Robots.txt file')
}

export const emptyRobotsTxt = () => {
    const message =
        `It's important to add the missing content to the <code>robots.txt</code> file. ` +
        `Robots.txt are a very critical factor in SEO ranking.`
    const links: iLink[] = [
        {
            label: 'Read a Robots.txt Reference',
            url: 'https://developers.google.com/search/docs/advanced/robots/robots_txt',
        },
    ]
    return new Card().suggestion().addParagraph(message).addCTA(links).setTitle('Add Content to Robots.txt')
}

export const missingSitemapXml = () => {
    const msg1 =
        `It's important to add the missing <code>sitemap.xml</code> file. ` +
        `Sitemaps are a very critical factor in SEO ranking of a page.`
    const msg2 =
        `A good XML sitemap acts as a roadmap of your website that leads Google to all your important pages. ` +
        `XML sitemaps can be good for SEO, as they allow Google to find your essential website pages quickly, even if your internal linking isn't perfect.`
    const links: iLink[] = [{label: 'Read a Sitemap.xml Reference', url: 'https://www.sitemaps.org/protocol.html'}]
    return new Card()
        .suggestion()
        .addParagraph(msg1)
        .addParagraph(msg2)
        .addCTA(links)
        .setTitle('Add a Sitemap.xml File')
}

export const malformedSitemapXml = () => {
    const msg1 =
        `Double check the syntax of the <code>sitemap.xml</code> and update it ASAP. ` +
        `It's important for the <code>sitemap.xml</code> file to be consistent with the standard XML syntax. `
    const msg2 = `The <code>sitemap.xml</code> of a website, if present, is extensively used by all Search Engines bots a it's a very important factor in SEO ranking of the site.`
    const links: iLink[] = [{label: 'Learn about Sitemap.xml Syntax', url: 'https://www.sitemaps.org/protocol.html'}]
    return new Card()
        .suggestion()
        .addParagraph(msg1)
        .addParagraph(msg2)
        .addCTA(links)
        .setTitle('Fix Sitemap.xml Syntax')
}

export const considerCompressingSitemap = (urls: UrlsToCompress[]) => {
    const plural = urls.length > 1
    const msg1 =
        `${plural? urls.length.toFixed() : 'One'} of your sitemaps ${plural ? 'are' : 'is'} larger than ${formatNumber(sitemapRecommendedMaxSize)} bytes. ` +
        `Consider compressing your sitemap.xml with <i>gzip</i> to reduce the load on your server and speedup upload and download of the file. ` +
        `However, there are no SEO direct benefits in compressing a sitemap. `
    const msg2 = `This is ${plural ? `a list of` : `the`} <code>sitemaps.xml</code> you should consider compressing:`
    const links: iLink[] = [
        {label: 'Learn about Compressing Sitemaps', url: 'https://www.sitemaps.org/faq.html#faq_sitemap_size'},
    ]
    const table = urls.map(url => [url[1].replace(new URL(url[1]).origin, ''), `${formatNumber(url[0])} bytes`])
    return new Card()
        .suggestion()
        .addParagraph(msg1)
        .addParagraph(msg2)
        .addTable('Sitemaps to Compress', table)
        .addCTA(links)
        .setTitle(`Consider Compressing Your Sitemap${plural ? 's' : ''}`)
}

export const missingSitemapExtension = (urls: string[]) => {
    const plural = urls.length > 1
    const msg1 =
        `${plural ? urls.length.toFixed() : 'One'} of your sitemaps ${plural ? 'are' : 'is'} missing the extension <code>.xml</code>. ` +
        `Consider to follow the best practices recommended for sitemaps by adding the <code>.xml</code> extension to your sitemap files. ` +
        `However, Google should be able to process your sitemaps even if they don't have the <code>.xml</code> extension.`
    const msg2 = `This is ${
        plural ? `a list of` : `the`
    } <code>sitemap.xml</code> you should consider renaming with the proper extension:`
    const links: iLink[] = [
        {label: 'Learn about Compressing Sitemaps', url: 'https://www.sitemaps.org/faq.html#faq_sitemap_size'},
    ]
    return new Card()
        .suggestion()
        .addParagraph(msg1)
        .addParagraph(msg2)
        .addCodeBlock(urls.map(url => url).join('\n'), Mode.txt)
        .addCTA(links)
        .setTitle(`Add the XML Extension To Your Sitemap${plural ? 's' : ''}`)
}

export const malformedRobotsTxt = () => {
    const msg1 =
        `Double check the syntax of the <code>robots.txt</code> and update it ASAP. ` +
        `It's important for the <code>robots.txt</code> file to be consistent with the standard syntax. `
    const msg2 = `The <code>Robots.txt</code> of a website, if present, is extensively used by all Search Engines bots a it's a very important factor in SEO ranking of the site.`
    const links: iLink[] = [
        {
            label: 'Learn about Robots.Txt Syntax',
            url: 'https://developers.google.com/search/docs/advanced/robots/robots_txt',
        },
    ]
    return new Card().suggestion().addParagraph(msg1).addParagraph(msg2).addCTA(links).setTitle('Fix Robots.txt Syntax')
}

export const linkSitemapFromRobotsTxt = () => {
    const msg1 = `Linking your Sitemap(s) from <code>Robots.txt</code> is a way to ensure Google doesn't miss it/them. It's an optional directive, but strongly recommended.`
    const msg2 =
        `This directive is independent of the user-agent line, so it doesn't matter where you place it in your file. ` +
        `If you have a Sitemap index file, you can include the location of just that file. ` +
        `You don't need to list each individual Sitemap listed in the index file.`
    const msg3 = `A link to a <code>sitemap.xml</code> should be added to the <code>robots.txt</code> file with a line similar to the following:`
    const links: iLink[] = [
        {
            label: 'How to Link a Sitemap From Robots.Txt',
            url: 'https://www.woorank.com/en/blog/how-to-locate-a-sitemap-in-a-robots-txt-file',
        },
    ]
    return new Card()
        .suggestion()
        .addParagraph(msg1)
        .addParagraph(msg2)
        .addParagraph(msg3)
        .addCodeBlock(`Sitemap: https://www.example.com/sitemap.xml`, Mode.txt)
        .addCTA(links)
        .setTitle('Link Your Sitemap.xml From Robots.txt')
}

export const openGraphMissingImage = () => {
    const message =
        `The page is missing a meta tag specifying the image for Facebook to use when rendering a post sharing this page.<br>` +
        `This is an example of the Facebook (Open Graph) Meta-Tag that should be added:`
    const links: iLink[] = [{label: 'Learn about Facebook Meta Tags', url: 'https://ogp.me/'}]
    return new Card()
        .suggestion()
        .addParagraph(message)
        .addCodeBlock(`<meta property="og:image" content="https://www.example.com/my_image.jpg">`, Mode.html)
        .addCTA(links)
        .setTitle('Add Image Meta-Tag for Facebook')
}

export const twitterMissingImage = () => {
    const msg1 = `This page is missing a meta tag specifying the image for Twitter to use when rendering a post sharing this page.`
    const msg2 = `This is an example of the Twitter Meta-Tag that should be added:`
    const links: iLink[] = [
        {
            label: 'Learn about Twitter Meta Tags',
            url: 'https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started',
        },
    ]
    return new Card()
        .suggestion()
        .addParagraph(msg1)
        .addParagraph(msg2)
        .addCodeBlock(`<meta name="twitter:image" content="https://www.example.com/my_image.jpg">`, Mode.html)
        .addCTA(links)
        .setTitle('Add Image Meta-Tag for Twitter')
}

export const tagWithRelativeUrl = (tag: string, url :string) => {
    const msg1 = `The following Meta Tag <code>${tag}</code> is using a relative url.`
    const msg2 = `Links in the meta tags should be always absolute, the should start with <code>https://<code>.`
    const links: iLink[] = [
        {
            label: 'Learn about Meta Tags',
            url: 'https://moz.com/blog/the-ultimate-guide-to-seo-meta-tags',
        },
    ]
    return new Card()
        .suggestion()
        .addParagraph(msg1)
        .addCodeBlock(url, Mode.html)
        .addParagraph(msg2)
        .addCTA(links)
        .setTitle('Meta-Tag Urls Should Be Absolute')
}

export const noMetaTags = () => {
    const message =
        `Meta Data should always be include in every web page. Meta tags provide important information to teh browser and to the Search Engine bots about the page. ` +
        `Also Meta tags allow the page to control how it will be shared by users providing recommendation for title, image and descriptions to be use for sharing post on Social Media .`
    const links: iLink[] = [
        {
            label: 'Twitter Meta Tags',
            url: 'https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started',
        },
        {label: 'Facebook Meta tags', url: 'https://ogp.me/'},
        {label: 'Meta Tags Reference', url: 'https://moz.com/blog/the-ultimate-guide-to-seo-meta-tags'},
    ]
    return new Card().suggestion().addParagraph(message).addCTA(links).setTitle('Add Meta Tags')
}

export const noTwitterMetaTags = () => {
    const message =
        `Meta Data specific for Twitter should always be include in every web page. ` +
        `Twitter Meta Tags allow the page to control how it will appear on a post when shared on Twitter by users. ` +
        `Open Graph Meta Tags provide recommendation for title, image and descriptions.`
    const links: iLink[] = [
        {
            label: 'Learn about Twitter Meta Tags',
            url: 'https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started',
        },
    ]
    return new Card().suggestion().addParagraph(message).addCTA(links).setTitle('Add Twitter Meta Tags')
}

export const noOpenGraphMetaTags = () => {
    const message =
        `Meta Data specific for Facebook, called OpenGraph meta tags, should always be include in every web page. ` +
        `Open Graph Meta Tags allow the page to control how it will appear on a post when shared on Facebook by users. ` +
        `Open Graph Meta Tags provide recommendation for title, image and descriptions.`
    const links: iLink[] = [{label: 'Learn about Facebook Meta Tags', url: 'https://ogp.me/'}]
    return new Card().suggestion().addParagraph(message).addCTA(links).setTitle('Add Facebook Meta Tags')
}

export const emptyStructuredData = () => {
    const msg1 =
        `A Structured Data snippet is empty. This can affect your page SEO. You can remove the snippet or populate the snippet with data.`
    const msg2 = `google's structured data validator will mark the lines as erroneous`
    const links: iLink[] = [{label: 'Learn About Structured Data', url: 'https://developers.google.com/search/docs/advanced/structured-data/product'}]
    return new Card().suggestion().addParagraph(msg1).addCTA(links).setTitle('Empty Structured Data Snippet')
}