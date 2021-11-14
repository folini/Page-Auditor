// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import * as Tips from './tips'
import {Report} from '../report'
import {sectionActions, ReportGeneratorFunc, CodeInjectorFunc} from '../main'
import {tagCategories, metaTagsCard} from './meta-tags-functions'
import {Errors} from './errors'

export interface iTag {
    label: string
    value: string
    class: string
    code: string
}

interface iDataFromPage {
    tags: iTag[]
    canonical: string
    title :string
}

const codeInjector: CodeInjectorFunc = () => {
    const tags = ([...document.querySelectorAll(`head meta`)] as HTMLMetaElement[])
        .map(
            m =>
                ({
                    label: (
                        m.getAttribute(`property`) ||
                        m.getAttribute('name') ||
                        m.getAttribute('http-equiv') ||
                        ''
                    ).toLowerCase(),
                    value: (m.content || '').trim(),
                    class: m.getAttribute('class') || '',
                    code: m.outerHTML.replace(/content="\s*/gi, 'content="'),
                } as iTag)
        )
        .filter(m => m.value !== '' && m.label !== '') as iTag[]
    const canonical = document.querySelector('head link[rel="canonical"]')?.getAttribute('href') || ''
    return {
        tags: tags,
        canonical: canonical,
        title: document.title
    }
}

const reportGenerator: ReportGeneratorFunc = (url: string, data: any, report: Report): void => {
    var allTags = (data as iDataFromPage).tags
    const canonical = (data as iDataFromPage).canonical
    const title = (data as iDataFromPage).title
    let scriptsDone = 0
    let twitterDone = false
    let openGraphDone = false
    tagCategories.map(tagCategory => {
        const selectedTags = allTags.filter(tagCategory.filter)
        allTags = allTags.filter(tag => !selectedTags.includes(tag))
        if (selectedTags.length > 0) {
            metaTagsCard(allTags, tagCategory, selectedTags, canonical, title, url, report)
            scriptsDone++
            if (tagCategory.title.includes('Twitter')) {
                twitterDone = true
            } else if (tagCategory.title.includes('OpenGraph')) {
                openGraphDone = true
            }
        }
    })

    if (scriptsDone === 0) {
        const card = Errors.metaTags_NotFound()
        report.addCard(card)
        Tips.tag_AllMissing(card)
        report.completed()
        return
    }

    if (!twitterDone) {
        const card = Errors.metaTags_noTwitterTags()
        report.addCard(card)
        Tips.tag_noTwitterTags(card)
    }

    if (!openGraphDone) {
        const card = Errors.metaTags_noOpenGraphTags()
        report.addCard(card)
        Tips.tag_noOpenGraphTags(card)
    }

    report.completed()
}

export const actions: sectionActions = {
    codeInjector: codeInjector,
    reportGenerator: reportGenerator,
}
