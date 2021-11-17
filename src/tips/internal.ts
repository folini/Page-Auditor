// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card} from '../card'
import {specs} from '../cards/specs'
import {tipWhat, tipWhy, tipHow} from './tips'

// ----------------------------------------------------------------------------
// INTERNAL ERROR TIPS
export const internalError = (card: Card) => {
    const what = tipWhat(`Something went wrong.`)
    const why = tipWhy(`Something unexpected happened that the Extension was not able to properly manage.`)
    const how = tipHow(
        `Consider updating the "Page Auditor" Microsoft Edge and Google Chrome Extension to the latest version.`
    )
    card.addTip(`Update Page Auditor to the latest version`, [what, why, how], specs.robotsTxt.reference)
}

export const unableToAnalyzeBrowserPages = (card: Card) => {
    const what = tipWhat(`Unable to analyze browser proprietary pages.`)
    const why = tipWhy(`The browser doesn't allow the analysis of internal pages and empty tabs.`)
    const how = tipHow(
        `Consider opening any website before opening the "Page Auditor" Microsoft Edge and Google Chrome Extension`
    )
    card.addTip(`Open a Regular WebSite or Web Page`, [what, why, how], specs.robotsTxt.reference)
}
