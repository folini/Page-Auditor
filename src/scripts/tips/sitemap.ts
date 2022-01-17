// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card} from '../card'
import {Mode} from '../colorCode'
import {Specs} from '../specs'
import {formatNumber} from '../../main'
import {SmSource} from '../sitemapList'
import * as Tips from './tips'
import * as CardBlocks from '../card-blocks'
import * as Icons from '../icons'

// ------------------------------------------------------------------------
// SITEMAP XML TIPS
export const missingSitemap = (card: Card) => {
    const what = Tips.what(`No <code>sitemap.xml</code> file was detected on this website.`)
    const why = Tips.why(
        `It's critical to add the missing <code>sitemap.xml</code> file.`,
        `Sitemaps are a very important factor in SEO ranking of a page.`,
        `A good XML sitemap acts as a roadmap of your website that leads Google to all your important pages.`,
        `XML sitemaps can be good for SEO, as they allow Google to find your critical website pages quickly, even if your internal linking isn't perfect.`
    )
    const how = Tips.how(
        `Add a simple <code>sitemap.xml</code> file.`,
        `To begin, you can start writing as a simple text file and upload it to your website.`,
        `Many website platform provide tools or option to automatically create the sitemap.`
    )
    card.add(CardBlocks.tip(`Add a <code>Sitemap.xml</code> File`, [what, why, how], Specs.siteMap.syntax, 85))
}

export const uncompressedLargeSitemap = (card: Card, url: string, size: number) => {
    const what = Tips.what(
        `Detected an uncompressed sitemap file with a size of ${(size / 1024).toFixed(2)} KB.`,
        `The uncompressed sitemap url is:`,
        CardBlocks.code(url, Mode.txt)
    )
    const why = Tips.why(
        `While Google and Bing can easily handle <code>sitemap.xml</code> files up to 50 Mb in uncompressed size,`,
        `the recommended maximum size for uncompressed files is ${formatNumber(
            Specs.siteMap.RecommendedMaxUncompressedSize / 1024 / 1024
        )} MB.`,
        `Compressed sitemap reduce the load on the website server and speedup upload and download of the file. ` +
            `However, there are no SEO direct benefits in compressing a sitemap.`
    )
    const how = Tips.how(
        `Use a compressor, like <i>gzip</i>, to compress your sitemap file and upload it again to the webserver.`,
        `Don't forget to update the sitemap link in the <code>robots.txt</code> and in your GSG (Google Search Console).`
    )
    card.add(CardBlocks.tip(`Compress your <code>Sitemap.xml</code>`, [what, why, how], Specs.siteMap.syntax, 15))
}

export const missingXmlExtension = (card: Card, urls: string[]) => {
    const what = Tips.what(
        `This sitemap's url${urls.length > 1 ? 's' : ''} ${
            urls.length > 1 ? 'are' : 'is'
        } lacking the standard extension for XML files: <code>.xml</code>.`
    )
    const table = CardBlocks.table(
        `Sitemaps without .xml extension`,
        urls.map(url => [url]),
        Icons.list
    )
    const why = Tips.why(
        `Google crawler can handle even sitemaps without the proper extension.`,
        `However it's important to add the proper XML extension to allow the webserver to associate the correct <code>application/xml</code> MIME type when serving the sitemap to a client.`
    )
    const how = Tips.how(
        `Consider to adopt the best practices for sitemaps by adding the <code>.xml</code> extension to all your sitemaps.`
    )
    card.add(
        CardBlocks.tip(
            `Add the XML Extension to Your <code>Sitemap.xml</code> File`,
            [what, table, how, why],
            Specs.siteMap.syntax,
            25
        )
    )
}

export const compressedSitemapNotFound = (card: Card, url: string, source: SmSource) => {
    const what = Tips.what(
        `The compressed sitemap ws not detected on this website. The sitemap, listed in your ${
            source == SmSource.RobotsTxt ? '<code>robots.txt</code>' : '<code>sitemap.xml</code>'
        } should be available at the url:`,
        CardBlocks.code(url, Mode.txt)
    )
    const why = Tips.why(
        `It's critical to add the missing <code>sitemap.xml</code> file.`,
        `Sitemaps are a very important factor in SEO ranking of a page.`,
        `A good XML sitemap acts as a roadmap of your website that leads Google to all your important pages.`,
        `XML sitemaps can be good for SEO, as they allow Google to find your critical website pages quickly, even if your internal linking isn't perfect.`
    )
    const how = Tips.how(
        `Upload the missing compress <code>sitemap.xml</code> file to the webserver to help Google bot properly index your website.`
    )
    card.add(
        CardBlocks.tip(
            `Upload The Missing Compressed <code>Sitemap.xml</code> File`,
            [what, why, how],
            Specs.siteMap.reference,
            80
        )
    )
}
