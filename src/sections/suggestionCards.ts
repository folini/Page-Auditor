// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import { htmlEncode } from 'js-htmlencode'
import {Card, iLink} from '../card'
import { colorCode, Mode } from '../colorCode'

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
    return new Card().suggestion(message, links,'Add Structured Data Snippets')
}

export const wrongRobotsFromSitemap = (urls: string[]) => {
    let message =
        `The <code>robots.txt</code> file refers the following sitemap's url${
            urls.length > 1 ? 's' : ''
        } using the <code>http</code> protocol ` +
        `instead of the safest and now standard <code>https</code> protocol:` +
        `<ul>${urls.map(url => `<li><code>${url}</code></li>`)}</ul>` +
        `It's important to correct and update the way <code>robots.txt</code> is linking the sitemaps by switching to the <code>https</code> protocol. ` +
        `Sitemap files should be always linked using the safe <code>https</code> protocol.`
    const links: iLink[] = [
        {
            label: 'Sitemap.xml Reference',
            url: 'https://www.woorank.com/en/blog/how-to-locate-a-sitemap-in-a-robots-txt-file',
        },
    ]
    return new Card().suggestion(message, links,'Fix Robots.txt Link(s) in Sitemap')
}

export const missingRobotsTxt = () => {
    const message =
        `It's important to add ASAP the missing <code>robots.txt</code> file. ` +
        `Robots.txt are a very important factor in SEO ranking.`
    const links: iLink[] = [
        {label: 'Robots.txt Reference', url: 'https://developers.google.com/search/docs/advanced/robots/robots_txt'},
    ]
    return new Card().suggestion(message, links, 'Add Robots.txt file')
}

export const emptyRobotsTxt = () => {
    const message =
        `It's important to add ASAP the missing content to the <code>robots.txt</code> file. ` +
        `Robots.txt are a very important factor in SEO ranking.`
    const links: iLink[] = [
        {label: 'Robots.txt Reference', url: 'https://developers.google.com/search/docs/advanced/robots/robots_txt'},
    ]
    return new Card().suggestion(message, links, 'Add Content to Robots.txt')
}

export const missingSitemapXml = () => {
    const message =
        `It's important to add ASAP the missing <code>sitemap.xml</code> file. ` +
        `Sitemaps are a very important factor in SEO ranking.`
    const links: iLink[] = [{label: 'Sitemap.xml Reference', url: 'https://www.sitemaps.org/protocol.html'}]
    return new Card().suggestion(message, links, 'Add Sitemap.xml file')
}

export const malformedSitemapXml = () => {
    const message =
        `Double check the syntax of the <code>sitemap.xml</code> and update it ASAP.` +
        `It's important for the <code>sitemap.xml</code> file to be consistent with the standard XML syntax. ` +
        `<br>The <code>sitemap.xml</code> of a website, if present, is extensively used by all Search Engines bots a it's a very important factor in SEO ranking of the site.`
    const links: iLink[] = [{label: 'Sitemap.xml Syntax', url: 'https://www.sitemaps.org/protocol.html'}]
    return new Card().suggestion(message, links, 'Fix Sitemap.xml Syntax')
}

export const malformedRobotsTxt = () => {
    const message =
        `Double check the syntax of the <code>robots.txt</code> and update it ASAP.` +
        `It's important for the <code>robots.txt</code> file to be consistent with the standard syntax. ` +
        `<br>The <code>Robots.txt</code> of a website, if present, is extensively used by all Search Engines bots a it's a very important factor in SEO ranking of the site.`
    const links: iLink[] = [
        {label: 'Robots.Txt Syntax', url: 'https://developers.google.com/search/docs/advanced/robots/robots_txt'},
    ]
    return new Card().suggestion(message, links, 'Fix Robots.txt Syntax')
}

export const openGraphMissingImage = () => {
    const message =
        `The page is missing a meta tag specifying the image for Facebook to use when rendering a post sharing to this page. ` +
        `This is an example of the meta tag that should be added:<br>` +
        `<div class="code x-scrollable meta-tags">` +
            colorCode(htmlEncode(`<meta\n\tproperty="og:image"\n\tcontent="https://mydomain.com/img/image.png"\n>`), Mode.html) +
        `</div>`
    const links: iLink[] = [{label: 'Facebook Meta Tags', url: 'https://ogp.me/'}]
    return new Card().suggestion(message, links, 'Add Facebook Image Meta Tag')
}

export const twitterMissingImage = () => {
    const message =
        `This page is missing a meta tag specifying the image for Twitter to use when rendering a post sharing to this page. ` +
        `This is an example of the meta tag that should be added:<br>` +
        `<div class="code x-scrollable meta-tags">` +
            colorCode(htmlEncode(`<meta\n\tproperty="twitter:image"\n\tcontent="https://mydomain.com/img/image.png"\n>`), Mode.html) +
        `</div>`
    const links: iLink[] = [
        {
            label: 'Twitter Meta Tags',
            url: 'https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started',
        },
    ]
    return new Card().suggestion(message, links, 'Add Twitter Image Meta Tag')
}

export const noMetaTags = () => {
    const message =
        `Meta Data should always be include in every web page. Meta tags provide important information to teh browser and to the Search Engine bots about the page. ` +
        `Also Meta tags allow the page to control how the page will be shared by users providing recommendation for title, image and descriptions to be use for sharing post on Social Media .`
    const links: iLink[] = [
        {
            label: 'Twitter Meta Tags',
            url: 'https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started',
        },
        {label: 'Facebook Meta tags', url: 'https://ogp.me/'},
        {label: 'Meta Tags Reference', url: 'https://moz.com/blog/the-ultimate-guide-to-seo-meta-tags'},
    ]
    return new Card().suggestion(message, links, 'Add Meta Tags')
}

export const noTwitterMetaTags = () => {
    const message =
        `Meta Data specific for Twitter should always be include in every web page. ` +
        `Twitter Meta Tags allow the page to control how it will appear on a post when shared on Twitter by users. ` +
        `Open Graph Meta Tags provide recommendation for title, image and descriptions.`
    const links: iLink[] = [
        {
            label: 'Twitter Meta Tags',
            url: 'https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started',
        },
    ]
    return new Card().suggestion(message, links, 'Add Twitter Meta Tags')
}

export const noOpenGraphMetaTags = () => {
    const message =
        `Meta Data specific for Facebook, called OpenGraph meta tags, should always be include in every web page. ` +
        `Open Graph Meta Tags allow the page to control how it will appear on a post when shared on Facebook by users. ` +
        `Open Graph Meta Tags provide recommendation for title, image and descriptions.`
    const links: iLink[] = [{label: 'Facebook Meta Tags', url: 'https://ogp.me/'}]
    return new Card().suggestion(message, links, 'Add Facebook Meta Tags')
}
