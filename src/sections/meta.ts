// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card, iLink} from '../card'
import {sectionActions} from '../main'
import {tagCategories, renderMetaCategory} from './meta-functions'

export interface iMetaTag {
    property: string
    content: string
    class: string
}

export interface iDefaultTagValues {
    title: string
    img: string
    description: string
    domain: string
}

const codeInjector = () =>
    ([...document.querySelectorAll(`head meta`)] as HTMLMetaElement[])
        .map(m => ({
            property: (
                m.getAttribute(`property`) ||
                m.getAttribute('name') ||
                m.getAttribute('http-equiv') ||
                ''
            ).toLowerCase(),
            content: m.content || '',
            class: m.getAttribute('class') || '',
        }))
        .filter(m => m.content !== '' && m.property !== '') as iMetaTag[]

const eventManager = () => undefined

const reportGenerator = async (tabUrl: string, data: any): Promise<Promise<Card>[]> => {
    var meta = data as iMetaTag[]
    var result: Promise<Card>[] = []

    var defaultTags: iDefaultTagValues = {
        title: meta.find(m => m.property === 'og:title' || m.property === 'title')?.content || '',
        description: meta.find(m => m.property === 'description')?.content || '',
        img: meta.find(m => m.property === 'og:image')?.content || '',
        domain: meta.find(m => m.property === 'og:url')?.content || '',
    }

    tagCategories.forEach(mc => {
        const matched = meta.filter(mc.filter)
        meta = meta.filter(m => !matched.includes(m))
        if (matched.length > 0) {
            result.push(Promise.resolve(renderMetaCategory(mc, matched, mc.preview(matched, defaultTags))))
        }
    })

    if (result.length == 0) {
        result.push(Promise.resolve(new Card().warning(`No Meta Tags found on this page.`)))
    }

    return result
}

export const actions: sectionActions = {
    codeInjector: codeInjector,
    reportGenerator: reportGenerator,
    eventManager: eventManager,
}
