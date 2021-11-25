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
import {iImageElement} from '../schema'
import {tipWhat, tipWhy, tipHow} from './tips'

// ---------------------------------------------------------------------------------------------
// Structure Data TIPS
export const avoidRelativeUrls = (cardPromise: Promise<Card>, objectName: string, urls: string[], pageUrl: string) => {
    const what = tipWhat(
        `Detected ${urls.length.toFixed()} urls with local/relative path listed in the "${objectName}" Structured Data snippet of the page.`
    )
    const why = tipWhy(`Search engines crawlers might ignore relative urls when used in a structured data snippet.`)
    const how = tipHow(
        `Update your page Structured Data using only absolute path names and removing the listed relative paths.`
    )
    const tableRelativeUrls = Card.tableBlock(
        `List of Relative Urls`,
        urls.map(url => [url]),
        'list-style'
    )
    const tableAbsoluteUrls = Card.tableBlock(
        `List of Fixed Urls`,
        urls.map(url => [`${new URL(pageUrl).origin}${url}`]),
        'list-style'
    )
    cardPromise.then(card =>
        card.addTip(
            `Rewrite URLs in "${objectName}" with Absolute Path`,
            [what, why, how, tableRelativeUrls, tableAbsoluteUrls],
            Specs.structuredData.reference,
            50
        )
    )
}

export const imageUrlMissingProtocol = (cardPromise: Promise<Card>, objectName: string, urls: string[]) => {
    const what = tipWhat(
        `The image(s) urls with in the "${objectName}" Structured Data snippet of the page are missing the protocol.`,
        `A valid protocol is <code>https:</code>.`
    )
    const why = tipWhy(
        `Search engines crawlers might ignore urls without protocol when used in a structured data snippet.`
    )
    const how = tipHow(
        `Update your page Structured Data using only complete urls.`,
        `This is the list of complete urls to use when replacing the relative urls:`
    )
    const tableImgWithoutProtocol = Card.tableBlock(
        'Images Urls without protocol',
        urls.map(url => [url]),
        'list-style'
    )
    const tableImgWithProtocol = Card.tableBlock(
        'Images Urls without protocol',
        urls.map(url => [`https:${url}`]),
        'list-style'
    )
    cardPromise.then(card =>
        card.addTip(
            `Rewrite URLs in "${objectName}" adding the <code>https</code> protocol`,
            [what, why, how],
            Specs.structuredData.reference,
            25
        )
    )
}

export const imageUrlIsEmpty = (cardPromise: Promise<Card>, objectName: string) => {
    const what = tipWhat(`The image(s) urls with in the "${objectName}" Structured Data snippet of the page is empty.`)
    const why = tipWhy(`Search engines crawlers might ca nbe confused by empty urls.`)
    const how = tipHow(
        `Update your page Structured Data by adding the missing url.`,
        `If you don't intend to provide this url, just remove the property <code>${objectName}</code> from the page <code>JSON-LD</code>.`
    )
    cardPromise.then(card =>
        card.addTip(`Replace the empty URL in "${objectName}".`, [what, why, how], Specs.structuredData.reference, 25)
    )
}

export const repeatedSchemas = (card: Card, objectName: string, occurrences: number) => {
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
    card.addTip(`Merge the "${objectName}" Data Structures`, [what, why, how], Specs.structuredData.reference, 25)
}

export const noStructuredData = (card: Card) => {
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
    card.addTip(`Add Structured Data To the Page`, [what, why, how], Specs.structuredData.howToUseIt, 85)
}

export const invalidSyntax = (card: Card) => {
    const what = tipWhat(`A Structured Data snippet contains invalid JSON code.`)
    const why = tipWhy(
        `Invalid Structured Data can block the Search Engine spiders/bots from efficiently indexing the page.`
    )
    const how = tipHow(`Fix the LD-JSON code to benefit from the inclusion of Structured Data in the page.`)
    card.addTip(`Fix the Invalid Structured Data`, [what, why, how], Specs.structuredData.reference, 75)
}

export const imagesNotFound = (cardPromise: Promise<Card>, images: iImageElement[]) => {
    const plural = images.length > 1
    const what = tipWhat(
        `Unable to locate ${
            plural ? `a set of ${images.length.toFixed()} images` : `An image`
        } listed in the Structured Data.`
    )
    const table = Card.tableBlock(
        `List of Missing Images`,
        images.map(img => [img.src]),
        'list-style'
    )
    const why = tipWhy(
        `A broken link to a non-existent image can break the validity of the Structured Data and can invalidate the entire <code>JSON-LS</code>.`
    )
    const how = tipHow(
        `If the issue is a misspell in the image url, edit the <code>JSON-LD</code> adding the correct url.`,
        `If the image is missing, then upload the image at the specified url ASAP.`
    )
    cardPromise.then(card =>
        card.addTip(`Add Missing Image To Structured Data`, [what, table, why, how], Specs.structuredData.reference, 75)
    )
}
