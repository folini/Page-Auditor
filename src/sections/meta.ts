// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card} from '../card'
import {Report} from '../report'
import {sectionActions, ReportGeneratorFunc, CodeInjectorFunc} from '../main'
import {tagCategories, metaTagsCard} from './meta-functions'
import * as Suggestions from './suggestionCards'
import * as Warnings from './warningCards'

export interface iMetaTag {
    property: string
    content: string
    class: string
    originalCode: string
}

export interface iDefaultTagValues {
    title: string
    img: string
    description: string
    domain: string
}

const codeInjector: CodeInjectorFunc = () =>
    ([...document.querySelectorAll(`head meta`)] as HTMLMetaElement[])
        .map(
            m =>
                ({
                    property: (
                        m.getAttribute(`property`) ||
                        m.getAttribute('name') ||
                        m.getAttribute('http-equiv') ||
                        ''
                    ).toLowerCase(),
                    content: m.content || '',
                    class: m.getAttribute('class') || '',
                    originalCode: m.outerHTML,
                } as iMetaTag)
        )
        .filter(m => m.content !== '' && m.property !== '') as iMetaTag[]

const reportGenerator: ReportGeneratorFunc = (_: string, data: any, report: Report): void => {
    var meta = data as iMetaTag[]

    var defaultTags: iDefaultTagValues = {
        title: meta.find(m => m.property === 'og:title' || m.property === 'title')?.content || '',
        description: meta.find(m => m.property === 'description')?.content || '',
        img: meta.find(m => m.property === 'og:image')?.content || '',
        domain: meta.find(m => m.property === 'og:url')?.content || '',
    }

    let atLeastOneScript = false
    let twitterMetaPresent = false
    let openGraphMetaPresent = false
    tagCategories.map(mc => {
        const matched = meta.filter(mc.filter)
        meta = meta.filter(m => !matched.includes(m))
        if (matched.length > 0) {
            metaTagsCard(mc, matched, mc.preview(matched, defaultTags, report), report)
            atLeastOneScript = true
            if (mc.title.includes('Twitter')) {
                twitterMetaPresent = true
            } else if (mc.title.includes('Facebook')) {
                openGraphMetaPresent = true
            }
        }
    })

    if (!atLeastOneScript) {
        report.addCard(Warnings.noMetaTagsOnPage())
        report.addCard(Suggestions.noMetaTags())
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
