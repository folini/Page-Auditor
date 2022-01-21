// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card} from '../card'
import {Specs} from '../specs'
import {iImageElement} from '../schema'
import * as CardBlocks from '../card-blocks'
import * as Tips from './tips'
import * as Icons from '../icons'

// ---------------------------------------------------------------------------------------------
// Structure Data TIPS
export const avoidRelativeUrls = (cardPromise: Promise<Card>, objectName: string, urls: string[], pageUrl: string) => {
    const what = Tips.what(
        `Detected ${urls.length.toFixed()} urls with local/relative path listed in the "${objectName}" Structured Data snippet of the page.`
    )
    const why = Tips.why(`Search engines crawlers might ignore relative urls when used in a structured data snippet.`)
    const how = Tips.how(
        `Update your page Structured Data using only absolute path names and removing the listed relative paths.`
    )
    const tableRelativeUrls = CardBlocks.table(
        `List of Relative Urls`,
        urls.map(url => [url]),
        Icons.list
    )
    const tableAbsoluteUrls = CardBlocks.table(
        `List of Fixed Urls`,
        urls.map(url => [`${new URL(pageUrl).origin}${url}`]),
        Icons.list
    )
    cardPromise.then(card =>
        card.add(
            CardBlocks.tip(
                `Rewrite URLs in "${objectName}" with Absolute Path`,
                [what, why, how, tableRelativeUrls, tableAbsoluteUrls],
                Specs.structuredData.reference,
                50
            )
        )
    )
}

export const imageUrlMissingProtocol = (cardPromise: Promise<Card>, objectName: string, urls: string[]) => {
    const what = Tips.what(
        `The image(s) urls with in the "${objectName}" Structured Data snippet of the page are missing the protocol.`,
        `A valid protocol is <code>https:</code>.`
    )
    const why = Tips.why(
        `Search engines crawlers might ignore urls without protocol when used in a structured data snippet.`
    )
    const how = Tips.how(
        `Update your page Structured Data using only complete urls.`,
        `This is the list of complete urls to use when replacing the relative urls:`
    )
    const tableImgWithoutProtocol = CardBlocks.table(
        'Images Urls without protocol',
        urls.map(url => [url]),
        Icons.list
    )
    const tableImgWithProtocol = CardBlocks.table(
        'Images Urls without protocol',
        urls.map(url => [`https:${url}`]),
        Icons.list
    )
    cardPromise.then(card =>
        card.add(
            CardBlocks.tip(
                `Rewrite URLs in "${objectName}" adding the <code>https</code> protocol`,
                [what, why, how],
                Specs.structuredData.reference,
                25
            )
        )
    )
}

export const imageUrlIsEmpty = (cardPromise: Promise<Card>, objectName: string) => {
    const what = Tips.what(
        `The image(s) urls with in the "${objectName}" Structured Data snippet of the page is empty.`
    )
    const why = Tips.why(`Search engines crawlers might ca nbe confused by empty urls.`)
    const how = Tips.how(
        `Update your page Structured Data by adding the missing url.`,
        `If you don't intend to provide this url, just remove the property <code>${objectName}</code> from the page <code>JSON-LD</code>.`
    )
    cardPromise.then(card =>
        card.add(
            CardBlocks.tip(
                `Replace the empty URL in "${objectName}".`,
                [what, why, how],
                Specs.structuredData.reference,
                25
            )
        )
    )
}

export const repeatedSchemas = (card: Card, objectName: string, occurrences: number) => {
    const what = Tips.what(
        `Detected ${occurrences.toFixed()} copies of the "${objectName}" Structured Data snippet of the page.`
    )
    const why = Tips.why(
        `The consistency af Structured Data is very important in order to let the search-engine properly learn about the content and structure of your pages.`,
        `Even marginal errors or duplicated structures can confuse the parser and nullify the contribution and impact of your Structured Data.`
    )
    const how = Tips.how(
        `Consider removing the duplicates and merging the information about the ${objectName} into one single snippet.`
    )
    card.add(
        CardBlocks.tip(
            `Merge the "${objectName}" Data Structures`,
            [what, why, how],
            Specs.structuredData.reference,
            25
        )
    )
}

export const noStructuredData = (card: Card) => {
    const what = Tips.what(
        `This page is missing a Structured Data section describing the content and semantic of the page.`
    )
    const why = Tips.why(
        `Structured Data is an important SEO factor.`,
        `It's critical to add a Structured Data snippet to each page of a website.`,
        `It helps search engines find and understand your content and website.`,
        `It's also an important way to prepare for the future of search, as Google and other engines continue to personalize the user experience and answer questions directly on their SERPs.`
    )
    const how = Tips.how(
        `Add Structured Data to each page of your website. There are 3 available formats: JSON-LD, MicroData and RDFa. Google recommends to use <code>JSON-LD</code>.`,
        `<code>JSON-LD</code> is also the easiest format to create and to maintain.`
    )
    card.add(CardBlocks.tip(`Add Structured Data To the Page`, [what, why, how], Specs.structuredData.howToUseIt, 85))
}

export const invalidSyntax = (card: Card) => {
    const what = Tips.what(`A Structured Data snippet contains invalid JSON code.`)
    const why = Tips.why(
        `Invalid Structured Data can block the Search Engine spiders/bots from efficiently indexing the page.`
    )
    const how = Tips.how(`Fix the LD-JSON code to benefit from the inclusion of Structured Data in the page.`)
    card.add(CardBlocks.tip(`Fix the Invalid Structured Data`, [what, why, how], Specs.structuredData.reference, 75))
}

export const imagesNotFound = (cardPromise: Promise<Card>, images: iImageElement[]) => {
    const plural = images.length > 1
    const what = Tips.what(
        `Unable to locate ${
            plural ? `a set of ${images.length.toFixed()} images` : `An image`
        } listed in the Structured Data.`
    )
    const table = CardBlocks.table(
        `List of Missing Images`,
        images.map(img => [img.src])
    )
    const why = Tips.why(
        `A broken link to a non-existent image can break the validity of the Structured Data and can invalidate the entire <code>JSON-LS</code>.`
    )
    const how = Tips.how(
        `If the issue is a misspell in the image url, edit the <code>JSON-LD</code> adding the correct url.`,
        `If the image is missing, then upload the image at the specified url ASAP.`
    )
    cardPromise.then(card =>
        card.add(
            CardBlocks.tip(
                `Add Missing Image To Structured Data`,
                [what, table, why, how],
                Specs.structuredData.reference,
                75
            )
        )
    )
}
