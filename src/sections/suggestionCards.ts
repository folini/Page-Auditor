// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {formatNumber} from '../main'
import {Card, iLink} from '../card'
import {Mode} from '../colorCode'
import {SdType} from './sd-functions'

export const sitemapRecommendedMaxSize = 1_000_000

export const missingStructuredData = () => {
    const msg1 =
        `Structured Data is an important SEO factor. It's very important to add a Structured Data snippet to each page.`
    const msg2 = `Structured data is important for SEO because it helps search engines find and understand your content and website. ` +
        `It's also an important way to prepare for the future of search, as Google and other engines continue to personalize the user experience and answer questions directly on their SERPs.`
    const links: iLink[] = [
        {
            label: 'How to Use Structured Data',
            url: 'https://folini.medium.com/how-to-boost-your-pages-seo-with-json-ld-structured-data-bfa03ef48d42',
        },
    ]
    return new Card().suggestion().addParagraph(msg1).addParagraph(msg2).addCTA(links).setTitle('Add Structured Data Snippets')
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

export const noOpenGraphMetaTags = () => {
    const msg1 =
        `Meta Data specific for Facebook, called OpenGraph meta tags, should always be include in every web page. ` +
        `Open Graph Meta Tags allow the page to control how it will appear on a post when shared on Facebook by users. ` +
        `Open Graph Meta Tags provide recommendation for title, image and descriptions.`
    const links: iLink[] = [{label: 'Learn about Facebook Meta Tags', url: 'https://ogp.me/'}]
    return new Card().suggestion().addParagraph(msg1).addCTA(links).setTitle('Add Facebook Meta Tags')
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

export const emptyStructuredData = () => {
    const msg1 =
        `A Structured Data snippet is empty. This can affect your page SEO. You can remove the snippet or populate the snippet with data.`
    const msg2 = `Google's structured data validator will mark the lines as erroneous.`
    const links: iLink[] = [{label: 'Learn About Structured Data', url: 'https://developers.google.com/search/docs/advanced/structured-data/product'}]
    return new Card().suggestion().addParagraph(msg1).addCTA(links).setTitle('Fix the Empty Structured Data Snippet')
}

export const invalidStructuredData = () => {
    const msg1 =
        `A Structured Data snippet contains invalid JSON code blocking the Search Engine spiders/bots from efficiently indexing the page.`
    const msg2 = `Fix the LD-JSON code to benefit from the inclusion of Structured Data in the page.`
    const links: iLink[] = [{label: 'Learn About Structured Data', url: 'https://developers.google.com/search/docs/advanced/structured-data/product'}]
    return new Card().suggestion().addParagraph(msg1).addCTA(links).setTitle('Fix the Invalid Structured Data Snippet')
}

export const multipleStructuredData = (occurrences: number, objectName: string ) => {
    const msg1 =
        `Detected ${occurrences.toFixed()} copies of the "${objectName}" Structured Data snippet.`
    const msg2 = `Consider removing the duplicates and merging the information about the ${objectName} into one single snippet.`
    const links: iLink[] = [{label: 'Learn About Structured Data', url: 'https://developers.google.com/search/docs/advanced/structured-data/product'}]
    return new Card().suggestion().addParagraph(msg1).addParagraph(msg2).addCTA(links).setTitle(`Fix the Duplicate <i>${objectName}</i> Structured Data`)
}