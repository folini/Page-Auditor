// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card} from '../card'
import {Specs} from '../specs'
import * as Tips from './tips'
import * as CardBlocks from '../card-blocks'

// ---------------------------------------------------------------------------------------------
// SCRIPTS TIPS
export const unsafeLinks = (card: Card, urls: string[]) => {
    const plural = urls.length > 1 ? 's' : ''
    const what = Tips.what(
        `${urls.length > 1 ? 'Some' : 'One'} script${plural} included in the HTML of the page ${
            urls.length === 1 ? 'is' : 'are'
        } using the obsolete and unsafe <code>http:</code> protocol instead of the safest <code>https://</code> protocol.`
    )
    const table = CardBlocks.table(
        `List of ${urls.length} Scrip${plural} not using <code>https://</code> as protocol.`,
        urls.map(url => [url]),
        'list-style'
    )

    const why = Tips.why(
        `According to the most recent specs and recommendations, all links should always use the safest <code>https:</code> protocol.`
    )
    const how = Tips.how(
        `Edit the HTML of the page changing every occurrence of the old <code>http:</code> protocol with the safest <code>http:</code>.`
    )
    const tableHTTP = CardBlocks.table(
        `List of unsafe links to Scrips`,
        urls.map(url => [url]),
        'list-style'
    )
    const tableHTTPS = CardBlocks.table(
        `List of proposed safer links to Scrips`,
        urls.map(url => [url.replace('https://', 'https://')]),
        'list-style'
    )
    card.add(
        CardBlocks.tip(
            `Change the Protocol of ${urls.length.toFixed()} JavaScript Link${plural}`,
            [what, table, why, how, tableHTTP, tableHTTPS],
            Specs.structuredData.reference,
            30
        )
    )
}

export const scriptNotFound = (card: Card, scripts: string[]) => {
    const plural = scripts.length > 1 ? 's' : ''
    const what = Tips.what(
        `${scripts.length > 1 ? 'Some' : 'One'} script${plural} included in the HTML of the page ${
            scripts.length === 1 ? 'is' : 'are'
        } is not available online, the link is broken.`
    )
    const why = Tips.why(
        `A broken link to a script can not be resolved by the browser and can affect either the user experience of visitors coming to your website as well the results of some analytics monitoring your page.`
    )
    const how = Tips.how(`Edit the HTML of the page and fix the broken link.`)
    const table = CardBlocks.table(
        `List of ${scripts.length} Broken Links to Scrip${plural}.`,
        scripts.map(url => [url]),
        'list-style'
    )

    card.add(
        CardBlocks.tip(
            `Unable to locate ${scripts.length.toFixed()} JavaScript Link${plural}`,
            [what, table, why, how, table],
            Specs.structuredData.reference,
            30
        )
    )
}
