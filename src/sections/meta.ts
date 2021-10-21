// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Tips} from './tips'
import {Report} from '../report'
import {sectionActions, ReportGeneratorFunc, CodeInjectorFunc} from '../main'
import {tagCategories, metaTagsCard} from './meta-functions'
import * as Suggestions from './suggestionCards'
import * as Errors from './errorCards'

export interface iTag {
    tagLabel: string
    tagValue: string
    class: string
    originalCode: string
}

const codeInjector: CodeInjectorFunc = () =>
    ([...document.querySelectorAll(`head meta`)] as HTMLMetaElement[])
        .map(
            m =>
                ({
                    tagLabel: (
                        m.getAttribute(`property`) ||
                        m.getAttribute('name') ||
                        m.getAttribute('http-equiv') ||
                        ''
                    ).toLowerCase(),
                    tagValue: (m.content || '').trim(),
                    class: m.getAttribute('class') || '',
                    originalCode: m.outerHTML.replace(/content="\s*/gi, 'content="'),
                } as iTag)
        )
        .filter(m => m.tagValue !== '' && m.tagLabel !== '') as iTag[]

const reportGenerator: ReportGeneratorFunc = (url: string, data: any, report: Report): void => {
    var allTags = data as iTag[]
    let atLeastOneScript = false
    let twitterMetaPresent = false
    let openGraphMetaPresent = false
    tagCategories.map(tagCategory => {
        const selectedTags = allTags.filter(tagCategory.filter)
        allTags = allTags.filter(tag => !selectedTags.includes(tag))
        if (selectedTags.length > 0) {
            metaTagsCard(allTags, tagCategory, selectedTags, report)
            atLeastOneScript = true
            if (tagCategory.title.includes('Twitter')) {
                twitterMetaPresent = true
            } else if (tagCategory.title.includes('Facebook')) {
                openGraphMetaPresent = true
            }
        }
    })

    if (!atLeastOneScript) {
        const card = Errors.noMetaTagsOnPage()
        report.addCard(card)
        Tips.addMetaTags(card)
        return
    }

    if (!twitterMetaPresent) {
        report.addCard(Suggestions.noTwitterMetaTags())
    }

    if (!openGraphMetaPresent) {
        report.addCard(Suggestions.noOpenGraphMetaTags())
    }
}

export const actions: sectionActions = {
    codeInjector: codeInjector,
    reportGenerator: reportGenerator,
}
