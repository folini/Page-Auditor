// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card} from '../card'
import {sectionActions, ReportGeneratorFunc, DisplayCardFunc, CodeInjectorFunc} from '../main'
import {tagCategories, metaCategoryCard} from './meta-functions'
import * as Suggestions from './suggestionCards'

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

const reportGenerator: ReportGeneratorFunc = (_: string, data: any, renderCard: DisplayCardFunc): void => {
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
            metaCategoryCard(mc, matched, mc.preview(matched, defaultTags, renderCard), renderCard)
            atLeastOneScript = true
            if (mc.title.includes('Twitter')) {
                twitterMetaPresent = true
            } else if (mc.title.includes('Facebook')) {
                openGraphMetaPresent = true
            }
        }
    })

    if (!atLeastOneScript) {
        renderCard(new Card().warning(`No Meta Tags found on this page.`).setPreTitle('Meta Tags'))
        renderCard(Suggestions.noMetaTags())
        return
    }

    if (!twitterMetaPresent) {
        renderCard(Suggestions.noTwitterMetaTags())
    }

    if (!openGraphMetaPresent) {
        renderCard(Suggestions.noOpenGraphMetaTags())
    }
}

export const actions: sectionActions = {
    codeInjector: codeInjector,
    reportGenerator: reportGenerator,
}
