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

// ----------------------------------------------------------------------------
// INTERNAL ERROR TIPS
export const internalError = (card: Card) => {
    const what = Tips.what(`Something went wrong.`)
    const why = Tips.why(`Something unexpected happened that the Extension was not able to properly manage.`)
    const how = Tips.how(
        `Consider updating the "Page Auditor" Microsoft Edge and Google Chrome Extension to the latest version.`
    )
    card.add(CardBlocks.tip(`Update Page Auditor to the latest version`, [what, why, how], Specs.robotsTxt.reference))
}

export const unableToAnalyzeBrowserPages = (card: Card) => {
    const what = Tips.what(`Unable to analyze browser proprietary pages.`)
    const why = Tips.why(`The browser doesn't allow the analysis of internal pages and empty tabs.`)
    const how = Tips.how(
        `Consider opening any website before opening the "Page Auditor" Microsoft Edge and Google Chrome Extension`
    )
    card.add(CardBlocks.tip(`Open a Regular WebSite or Web Page`, [what, why, how], Specs.robotsTxt.reference))
}
