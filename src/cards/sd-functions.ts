// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {MustBeUniqueOccurrences} from './sd'
import {Card, CardKind} from '../card'
import {Mode} from '../colorCode'
import {disposableId} from '../main'
import {codeBlock} from '../codeBlock'
import {Report} from '../report'
import {Tips} from './tips'
import {Errors} from './errors'
import {Schema} from '../schema'

import '../logos/_noRendering_400x200.png'

export const ldJsonCard = (ldJson: Schema, tabUrl: string, occurrences: MustBeUniqueOccurrences, report: Report) => {
    if (ldJson.isEmpty()) {
        const card = Errors.sd_IsEmpty(tabUrl)
        report.addCard(card)
        Tips.sd_noStructuredData(card)
    }
    let schemaType = Schema.getSchemaType(ldJson.getJson())
    Schema.resetDictionary()

    const scriptId = disposableId()
    const structuredDataDescription = `Structured Data communicates content (data) to the Search Engines in an organized manner so they can display the content in the SERPs in an attractive manner.`
    const btnLabel = 'LD-JSON Code'
    const relativeUrlList: string[] = []
    const card = new Card(CardKind.report)
        .open(`Structured Data`, Schema.flattenName(schemaType), 'icon-ld-json')
        .addParagraph(structuredDataDescription)

    card.addParagraph(ldJson.schemaToHtml())
    card.addExpandableBlock(btnLabel, codeBlock(ldJson.getCodeAsString(), Mode.json, scriptId)).tag('card-ok')
    Schema.enableOpenClose(card.getDiv())

    report.addCard(card)

    if (relativeUrlList.length > 0) {
        Tips.sd_relativeUrl(card, Schema.flattenName(schemaType), relativeUrlList)
    }

    switch (schemaType) {
        case 'Organization':
            occurrences.organization++
            if (occurrences.organization > 1) {
                Tips.sd_repeatedSchemas(card, schemaType, occurrences.organization)
            }
            break
        case 'WebSite':
            occurrences.website++
            if (occurrences.website > 1) {
                Tips.sd_repeatedSchemas(card, schemaType, occurrences.website)
            }
            break
        case 'BreadcrumbList':
            occurrences.breadcrumbs++
            if (occurrences.breadcrumbs > 1) {
                Tips.sd_repeatedSchemas(card, schemaType, occurrences.breadcrumbs)
            }
            break
    }
}



