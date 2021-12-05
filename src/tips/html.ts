// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card} from '../card'
import {Mode} from '../colorCode'
import {Specs} from '../specs'
import * as Tips from './tips'
import {iImg} from '../cards/html'
import {imgArray2Table} from '../cards/html-cards'
import * as CardBlocks from '../card-blocks'

// ---------------------------------------------------------------------------------------------
// HTML TIPS
export const imgWithAltPlaceholder = (card: Card, images: iImg[]) => {
    const isPlural = images.length > 0
    const what = Tips.what(
        `${isPlural ? 'Some' : 'One'} image${isPlural ? 's' : ''} in the HTML of the page ${
            isPlural ? 'have' : 'has'
        } a placeholder for the <code>alt</code> attribute of the <code>img</code> HTML tag.`,
        `The count excludes images like the Facebook Pixel that are typically 1 pixel by 1 pixel in size and are not intended to contribute to the page content.`
    )
    const table = CardBlocks.table(
        `${images.length} Image${isPlural ? 's' : ''} WIth <code>alt</code> Placeholder`,
        imgArray2Table(images),
        'list-style'
    )

    const why = Tips.why(
        `The <code>alt</code> attribute of the <code>&lt;img&gt;</code> tags helps all search engine crawlers.`,
        `Images without a meaningful <code>alt</code> attribute can have a detrimental effect on the ranking of your web pages.`,
        `The <code>alt</code> attribute is also very important to make the page accessible to everybody including disabled people accessing the page with special devices.`
    )
    const how = Tips.how(
        `Edit the HTML of the page adding the missing <code>alt</code> attributes.`,
        `It is important to describe what is happening in the image and to avoid keyword "stuffing".`
    )
    card.add(
        CardBlocks.tip(
            `Replace the Placeholder for the <code>alt</code> Attribute of ${images.length.toFixed()} Image${
                isPlural ? 's' : ''
            }`,
            [what, table, why, how],
            Specs.structuredData.reference,
            20
        )
    )
}

export const imgWithoutAlt = (card: Card, images: iImg[]) => {
    const plural = images.length > 1 ? 's' : ''
    const what = Tips.what(
        `${
            images.length > 1 ? 'Some' : 'One'
        } image${plural} in the HTML of the page are missing have the <code>alt</code> attribute of the <code>img</code> HTML tag.`,
        `The count excludes images like the Facebook Pixel that are typically 1 pixel by 1 pixel in size and are not intended to contribute to the page content.`
    )
    const table = CardBlocks.table(
        `${images.length} Image${plural} Without <code>alt</code> attribute`,
        imgArray2Table(images),
        'list-style'
    )

    const why = Tips.why(
        `The <code>alt</code> attribute of the <code>&lt;img&gt;</code> tags helps all search engine crawlers.`,
        `Images without the <code>alt</code> attribute can have a detrimental effect on the ranking of your web pages.`,
        `The <code>alt</code> attribute is also very important to make the page accessible to everybody including disabled people accessing the page with special devices.`
    )
    const how = Tips.how(
        `Edit the HTML of the page adding the missing <code>alt</code> attributes.`,
        `It is important to describe what is happening in the image and to avoid keyword "stuffing".`
    )
    card.add(
        CardBlocks.tip(
            `Add the Missing <code>alt</code> Attribute to ${images.length.toFixed()} Image${plural}`,
            [what, table, why, how],
            Specs.structuredData.reference,
            20
        )
    )
}

export const imagesNotFound = (card: Card, images: string[]) => {
    const plural = images.length > 1 ? 's' : ''
    const what = Tips.what(`Unable to find the ${images.length} image${plural} used in the HTML code of the page`)
    const table = CardBlocks.table(
        `${images.length} Image${plural} Not Found`,
        images.map(image => [image]),
        'list-style'
    )
    const why = Tips.why(
        `While a few missing images should not directly affect the SEO of a page, they can compromise the user experience resulting in a higher bounce rate.`,
        `Over time an higher bounce rate can hurt the page reputation and the SEO performance.`
    )
    const how = Tips.how(
        `Upload the missing image or remove all the references to that image from the page's HTML code.`
    )
    card.add(
        CardBlocks.tip(
            images.length === 1 ? 'Add a Missing Image' : `Add the Missing ${images.length.toFixed()} Images`,
            [what, table, why, how],
            Specs.structuredData.reference,
            15
        )
    )
}

export const imgWithoutSrc = (card: Card, nImages: number) => {
    const plural = nImages > 1 ? 's' : ''
    const what = Tips.what(
        `${
            nImages === 1 ? 'One' : nImages.toFixed()
        } image${plural} tags in the HTML code are missing the <code>src</code> attribute or its value.`,
        `They are missing the critical <code>src</code>attribute.`
    )
    const why = Tips.why(
        `HTML Syntax requires all <code>&lt;img&gt;</code> tags to have a valid <code>src</code> attribute.`,
        `Omitting the <code>src</code> attribute, or leaving it empty, invalidates the syntax of the entire page anc can affect the search engines crawler indexing your page.`
    )
    const how = Tips.how(`Add the missing image url or remove the broken <code>&lt;img&gt;</code>.`)
    card.add(
        CardBlocks.tip(
            `Add the Missing <code>src</code> Attribute to ${nImages.toFixed()} <code>&lt;img&gt;</code> HTML Tags`,
            [what, why, how],
            Specs.html.imgTag.reference,
            25
        )
    )
}

export const imgWithInvalidSrc = (card: Card, nImages: number) => {
    const plural = nImages > 1 ? 's' : ''
    const what = Tips.what(
        `The <code>src</code> attribute of ${
            nImages === 1 ? 'one' : nImages.toFixed()
        } image tag${plural} in the HTML code is incomplete or empty.`
    )
    const why = Tips.why(
        `HTML Syntax requires all <code>&lt;img&gt;</code> tags to have a valid url as a value for the <code>src</code> attribute.`,
        `Providing an invalid <code>src</code> attribute invalidate the syntax of the entire page anc can affect the search engines crawler indexing your page.`
    )
    const how = Tips.how(`Replace the image url or remove the broken <code>&lt;img&gt;</code>.`)
    card.add(
        CardBlocks.tip(
            `Replace the incorrect <code>src</code> Attribute for ${nImages.toFixed()} Images`,
            [what, why, how],
            Specs.structuredData.reference,
            25
        )
    )
}

export const titleTooLong = (card: Card, title: string) => {
    const what = Tips.what(
        `The <code>&lt;title&gt;</code> tag in the <code>&lt;head&gt;</code> section of the page is ${title.length} chars, longer than the max recommended length of ${Specs.html.titleTag.maxLen} chars.`
    )
    const why = Tips.why(
        `While the length of the title doesn't have any direct impact on the page SEO,`,
        `the <code>&lt;title&gt;</code> tag is used by Google and other search engines to show a link to this page on SERP.`,
        `Anything over ${Specs.html.titleTag.maxLen} characters will be automatically truncated.`,
        `Automatic truncation of the title can compromise your title transforming it into some obscure sentence.`,
        `Your title could look like this:`,
        CardBlocks.code(`${title.substr(0, Specs.html.titleTag.maxLen)}...`, Mode.txt)
    )
    const how = Tips.how(
        `Rewrite the <code>&lt;title&gt;</code> of the page and replace the content of the <code>&lt;title&gt;</code> tag in the page HTML.`
    )
    card.add(
        CardBlocks.tip(
            `Shorten the <code>&lt;title&gt;</code> of the Page To ${Specs.html.titleTag.maxLen} Chars Or Less`,
            [what, why, how],
            Specs.html.titleTag.reference,
            25
        )
    )
}

export const titleShouldMatchH1 = (card: Card, title: string, h1Title: string) => {
    const what = Tips.what(`The <code>&lt;title&gt;</code> tag should match the <code>&lt;h1&gt;</code> tag.`)
    const why = Tips.why(
        `The <code>&lt;title&gt;</code> tag is very important for SEO, and Google will use it for SERP.`,
        `The <code>&lt;h1&gt;</code> tag wil be used by search engines to better understand the content of the page.`,
        `The impact of having different values for these two tags should be minimal, but SEO Best Practices recommend to match the two tags.`
    )
    const how = Tips.how(
        `Rewrite the <code>&lt;title&gt;</code> and the <code>&lt;h1&gt;</code> tags to match exactly and replace them in the page HTML.`
    )
    card.add(
        CardBlocks.tip(
            `The <code>&lt;title&gt;</code> and <code>&lt;h1&gt;</code> Tags Should Match`,
            [what, why, how],
            Specs.html.titleTag.reference,
            10
        )
    )
}

export const titleIsaPlaceholder = (card: Card, title: string) => {
    const what = Tips.what(
        `The <code>&lt;title&gt;</code> tag for this page is set to <i>${title}</i>, just a placeholder.`
    )
    const why = Tips.why(
        `The <code>&lt;title&gt;</code> tag is very important for SEO and should be clear, concise and able to attract clicks when used by Google in SERP.`
    )
    const how = Tips.how(`Write a good title and replace the placeholder in the page HTML.`)
    card.add(
        CardBlocks.tip(
            `Replace the Placeholder in the <code>&lt;title&gt;</code> HTML Tag`,
            [what, why, how],
            Specs.html.titleTag.reference,
            70
        )
    )
}
