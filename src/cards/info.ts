// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card, CardKind} from '../card'
import {SmList, maxSitemapsToLoad} from '../sitemapList'
import * as CardBlocks from '../card-blocks'
import * as Icons from '../icons'

export function sitemapsOverallAnalysis(sitemaps: SmList, existingCard: Card | undefined = undefined) {
    const nFailed = sitemaps.failedList.length
    const nSkipped = sitemaps.skippedList.length
    const nDone = sitemaps.doneList.length
    const nTotal = nDone + nSkipped

    const msg1 =
        nDone === 0
            ? `No sitemaps were detected on this website.`
            : `A total of ${nTotal} sitemap${nTotal > 1 ? 's' : ''} ${
                  nDone > 1 ? 'were' : 'was'
              } detected on this web site.`
    const tableAnalysis = [
        ['Sitemaps Detected', nTotal.toFixed()],
        ['Loaded and Analyzed', nDone.toFixed()],
    ]
    if (nFailed > 0) {
        tableAnalysis.push(['Failed To Load', nFailed.toFixed()])
    }
    if (nSkipped > 0) {
        tableAnalysis.push(['Skipped (too many)', nSkipped.toFixed()])
    }

    const card = existingCard ?? new Card(CardKind.info)
    card.setTitle('Sitemap Analysis')
        .add(CardBlocks.paragraph(msg1))
        .add(CardBlocks.table('Overall Sitemaps Analysis', tableAnalysis))

    if (nDone > 0) {
        const table = sitemaps.doneList.map(sm => [sm.url])
        card.add(CardBlocks.table(`Successfully Loaded (${nDone})`, table, Icons.list))
    }

    if (nSkipped > 0) {
        const table = sitemaps.skippedList.map(sm => [sm.url])
        card.add(CardBlocks.table(`Not Tested (${nSkipped}) - Only ${maxSitemapsToLoad} are tested`, table, Icons.list))
    }

    if (nFailed > 0) {
        const table = sitemaps.failedList.map(sm => [sm.url])
        card.add(CardBlocks.table(`Not Found (${nFailed})`, table, Icons.list))
    }

    return card
}

export function noScriptsOnThisPage() {
    const msg1 = `No External Scripts were found on this page.`
    return new Card(CardKind.info).add(CardBlocks.paragraph(msg1)).setTitle('No JavaScripts found on this page')
}
