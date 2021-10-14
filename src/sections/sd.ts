// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card} from '../card'
import {Report} from '../report'
import {sectionActions, ReportGeneratorFunc, CodeInjectorFunc} from '../main'
import {ldJsonCard} from './sd-functions'
import * as Suggestions from './suggestionCards'
import * as Errors from './errorCards'

export interface iJsonLD {
    [name: string]: string | [] | {}
}

export interface iJsonLevel {
    depth: number
}

const codeInjector: CodeInjectorFunc = (): iJsonLD[] =>
    [...document.scripts].filter(s => s.type === 'application/ld+json').map(s => JSON.parse(s.text.trim()))

const reportGenerator: ReportGeneratorFunc = (tabUrl: string, scripts: any, report: Report): void => {
    const jsonScripts: iJsonLD[] = scripts as iJsonLD[]

    if (tabUrl === '') {
        report.addCard(Errors.chromeTabIsUndefined())
        return
    }

    if (jsonScripts.length == 0) {
        report.addCard(Errors.structuredDataNotFound(tabUrl))
        report.addCard(Suggestions.missingStructuredData())
        return
    }

    jsonScripts.map(ldJson => report.addCard(ldJsonCard(ldJson, tabUrl)))
}

export const actions: sectionActions = {
    codeInjector: codeInjector,
    reportGenerator: reportGenerator,
}
