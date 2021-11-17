// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card} from '../card'
import {codeBlock} from '../codeBlock'
import {Mode} from '../colorCode'
import {specs} from '../cards/specs'
import {tipWhat, tipWhy, tipHow} from './tips'

// ---------------------------------------------------------------------------------------------
// HTML TIPS
export const imgWithoutAlt = (card: Card, images: string[]) => {
    const plural = images.length > 1 ? 's' : ''
    const what = tipWhat(
        `${
            images.length > 1 ? 'Some' : 'One'
        } image${plural} in the HTML of the page are missing have the alt attribute.`,
        `This is the list:`,
        codeBlock(images.join('\n'), Mode.txt)
    )
    const why = tipWhy(
        `The <code>alt</code> attribute of the <code>&lt;img&gt;</code> tags helps all search engine crawlers.`,
        `Not setting this attribute for all images can have a detrimental effect on the ranking of your web pages.`,
        `The <code>alt</code> attribute is also very important to make the page accessible to everybody including disabled people accessing the page with special devices.`
    )
    const how = tipHow(
        `Edit the HTML of the page adding the missing <code>alt</code> attributes.`,
        `It is important to describe what is happening in the image and to avoid keyword "stuffing".`
    )
    card.addTip(
        `Add the Missing <code>alt</code> attribute to ${images.length.toFixed()} Image${plural}`,
        [what, why, how],
        specs.structuredData.reference,
        20
    )
}

export const imagesNotFound = (card: Card, images: string[]) => {
    const plural = images.length > 1 ? 's' : ''
    const what = tipWhat(
        `Unable to find the following image${plural} used in the HTML code of the page:`,
        codeBlock(images.join('\n'), Mode.txt)
    )
    const why = tipWhy(
        `While a few missing images should does't directly affect the SEO of a page, it can compromise the user experience resulting in a higher bounce rate.`,
        `Over time an higher bounce rate can hurt the page reputation and the SEO performance.`
    )
    const how = tipHow(`Upload the missing image or remove all the references to that image from the page's HTML code.`)
    card.addTip(
        images.length === 1 ? 'Add a Missing Image' : `Add the Missing ${images.length.toFixed()} Images`,
        [what, why, how],
        specs.structuredData.reference,
        15
    )
}

export const imgWithoutSrc = (card: Card, nImages: number) => {
    const plural = nImages > 1 ? 's' : ''
    const what = tipWhat(
        `${
            nImages === 1 ? 'One' : nImages.toFixed()
        } image${plural} tags in the HTML code are missing the <code>src</code> attribute or its value.`,
        `They are missing the critical <code>src</code>attribute.`
    )
    const why = tipWhy(
        `HTML Syntax requires all <code>&lt;img&gt;</code> tags to have a valid <code>src</code> attribute.`,
        `Omitting the <code>src</code> attribute, or leaving it empty, invalidates the syntax of the entire page anc can affect the search engines crawler indexing your page.`
    )
    const how = tipHow(`Add the missing image url or remove the broken <code>&lt;img&gt;</code>.`)
    card.addTip(
        `Add the Missing <code>src</code> attribute to ${nImages.toFixed()} <code>&lt;img&gt;</code> HTML Tags`,
        [what, why, how],
        specs.structuredData.reference,
        25
    )
}

export const imgWithInvalidSrc = (card: Card, nImages: number) => {
    const plural = nImages > 1 ? 's' : ''
    const what = tipWhat(
        `The <code>src</code> attribute of ${
            nImages === 1 ? 'one' : nImages.toFixed()
        } image tag${plural} in the HTML code is incomplete or empty.`
    )
    const why = tipWhy(
        `HTML Syntax requires all <code>&lt;img&gt;</code> tags to have a valid url as a value for the <code>src</code> attribute.`,
        `Providing an invalid <code>src</code> attribute invalidate the syntax of the entire page anc can affect the search engines crawler indexing your page.`
    )
    const how = tipHow(`Replace the image url or remove the broken <code>&lt;img&gt;</code>.`)
    card.addTip(
        `Replace the incorrect <code>src</code> attribute for ${nImages.toFixed()} Images`,
        [what, why, how],
        specs.structuredData.reference,
        25
    )
}
