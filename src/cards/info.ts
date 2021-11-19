// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card, CardKind} from '../card'
import {SmList, maxSitemapsToLoad} from '../sitemapList'
import * as File from '../file'

export class Info {
    public static sitemapsOverallAnalysis(sitemaps: SmList, existingCard: Card | undefined = undefined) {
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
        card.setTitle('Sitemap Analysis').addParagraph(msg1).addTable('Overall Sitemaps Analysis', tableAnalysis)

        if (nDone > 0) {
            const table = sitemaps.doneList.map(sm => [sm.url])
            card.addTable(`Successfully Loaded (${nDone})`, table, 'list-style')
        }

        if (nSkipped > 0) {
            const table = sitemaps.skippedList.map(sm => [sm.url])
            card.addTable(`Not Tested (${nSkipped}) - Only ${maxSitemapsToLoad} are tested`, table, 'list-style')
        }

        if (nFailed > 0) {
            const table = sitemaps.failedList.map(sm => [sm.url])
            card.addTable(`Not Found (${nFailed})`, table, 'list-style')
        }

        return card
    }

    public static noScriptsOnThisPage() {
        const msg1 = `No External Scripts were found on this page.`
        return new Card(CardKind.info).addParagraph(msg1).setTitle('No JavaScripts found on this page')
    }
}
