// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card} from '../card'
import {sectionActions, ReportGeneratorFunc, DisplayCardFunc, CodeInjectorFunc} from '../main'
import {ldJsonCard} from './ld-json-functions'
import * as Suggestions from './suggestionCards'

export interface iJsonLD {
    [name: string]: string | [] | {}
}

export interface iJsonLevel {
    depth: number
}

const codeInjector: CodeInjectorFunc = (): iJsonLD[] =>
    [...document.scripts].filter(s => s.type === 'application/ld+json').map(s => JSON.parse(s.text.trim()))

const reportGenerator: ReportGeneratorFunc = (tabUrl: string, scripts: any, renderCard: DisplayCardFunc): void => {
    const jsonScripts: iJsonLD[] = scripts as iJsonLD[]

    if (tabUrl === '') {
        renderCard(
            new Card()
                .warning(`Unable to access the page in order to extract Structured Data.`)
                .setTitle('Browser tab Undefined')
        )
        return
    }

    if (jsonScripts.length == 0) {
        renderCard(new Card().warning(`No Structured Data found on this page.`).setTitle('Missing Structured Data'))
        renderCard(Suggestions.missingStructuredData())
        return
    }

    jsonScripts.map(ldJson => renderCard(ldJsonCard(ldJson, tabUrl)))
}

export const actions: sectionActions = {
    codeInjector: codeInjector,
    reportGenerator: reportGenerator,
}
