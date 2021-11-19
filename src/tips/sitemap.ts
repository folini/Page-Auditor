// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card} from '../card'
import {codeBlock} from '../codeBlock'
import {Mode} from '../colorCode'
import {Specs} from '../specs'
import {formatNumber} from '../main'
import {SmSource} from '../sitemapList'
import {tipWhat, tipWhy, tipHow} from './tips'

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
    card.addTip(`Add a <code>Sitemap.xml</code> File`, [what, why, how], Specs.siteMap.syntax, 85)
}

export const uncompressedLargeSitemap = (card: Card, url: string, size: number) => {
    const what = tipWhat(
        `Detected an uncompressed sitemap file with a size of ${(size / 1024).toFixed(2)} KB.`,
        `The uncompressed sitemap url is:`,
        codeBlock(url, Mode.txt)
    )
    const why = tipWhy(
        `While Google and Bing can easily handle <code>sitemap.xml</code> files up to 50 Mb in uncompressed size,`,
        `the recommended maximum size for uncompressed files is ${formatNumber(
            Specs.siteMap.RecommendedMaxUncompressedSize / 1024 / 1024
        )} MB.`,
        `Compressed sitemap reduce the load on the website server and speedup upload and download of the file. ` +
            `However, there are no SEO direct benefits in compressing a sitemap.`
    )
    const how = tipHow(
        `Use a compressor, like <i>gzip</i>, to compress your sitemap file and upload it again to the webserver.`,
        `Don't forget to update the sitemap link in the <code>robots.txt</code> and in your GSG (Google Search Console).`
    )
    card.addTip(`Compress your <code>Sitemap.xml</code>`, [what, why, how], Specs.siteMap.syntax, 15)
}

export const missingXmlExtension = (card: Card, urls: string[]) => {
    const what = tipWhat(
        `This sitemap's url${urls.length > 1 ? 's' : ''} ${
            urls.length > 1 ? 'are' : 'is'
        } lacking the standard extension for XML files: <code>.xml</code>.`
    )
    const table = Card.createTable(
        `Sitemaps without .xml extension`,
        urls.map(url => [url]),
        'list-style'
    )
    const why = tipWhy(
        `Google crawler can handle even sitemaps without the proper extension.`,
        `However it's important to add the proper XML extension to allow the webserver to associate the correct <code>application/xml</code> MIME type when serving the sitemap to a client.`
    )
    const how = tipHow(
        `Consider to adopt the best practices for sitemaps by adding the <code>.xml</code> extension to all your sitemaps.`
    )
    card.addTip(
        `Add the XML Extension to Your <code>Sitemap.xml</code> File`,
        [what, table, how, why],
        Specs.siteMap.syntax,
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
        `Upload The Missing Compressed <code>Sitemap.xml</code> File`,
        [what, why, how],
        Specs.siteMap.reference,
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
    card.addTip(`Fix Your <code>Sitemap.xml</code> File Syntax`, [what, why, how], Specs.siteMap.syntax, 80)
}
