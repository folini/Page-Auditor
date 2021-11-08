// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Report} from '../report'
import {sectionActions, ReportGeneratorFunc, CodeInjectorFunc} from '../main'
import {ldJsonCard} from './sd-functions'
import {Errors} from './errors'
import * as Tips from './tips'
import {Schema} from '../schema'

export type MustBeUniqueOccurrences = {
    organization: number
    breadcrumbs: number
    website: number
}

const codeInjector: CodeInjectorFunc = (): string[] =>
    [...document.scripts].filter(s => s.type === 'application/ld+json').map(s => s.text.trim())

const reportGenerator: ReportGeneratorFunc = (tabUrl: string, scripts: any, report: Report): void => {
    const jsonStrings: string[] = scripts as string[]

    if (tabUrl === '') {
        const card = Errors.chrome_TabUrlUndefined()
        report.addCard(card)
        Tips.sd_noSdInChromeBrowserPages(card)
        return
    }

    if (jsonStrings.length == 0) {
        const card = Errors.sd_NotFound(tabUrl)
        report.addCard(card)
        Tips.sd_noStructuredData(card)
        return
    }

    const occurrences: MustBeUniqueOccurrences = {
        organization: 0,
        breadcrumbs: 0,
        website: 0,
    }
    jsonStrings.forEach(json => {
        try {
            const schema = new Schema(json, tabUrl)
            if (Schema.getType(schema.getJson()) === '') {
                const card = Errors.sd_InvalidJSON(json)
                Tips.sd_invalidSyntax(card)
                return
            }
            ldJsonCard(schema, tabUrl, occurrences, report)
        } catch (err) {
            const card = Errors.sd_InvalidJSON(json)
            Tips.sd_invalidSyntax(card)
        }
    })
}

export const actions: sectionActions = {
    codeInjector: codeInjector,
    reportGenerator: reportGenerator,
}
