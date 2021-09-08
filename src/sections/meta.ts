// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
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

export const injectableScript = () =>
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

export const eventManager = () => undefined

export const report = async (url: string, data: any): Promise<string> => {
    var meta = data as iMetaTag[]
    var report: string = ''

    var defaultTags: iDefaultTagValues = {
        title:
            meta.find(m => m.property === 'og:title' || m.property === 'title')
                ?.content || '',
        description:
            meta.find(m => m.property === 'description')?.content || '',
        img: meta.find(m => m.property === 'og:image')?.content || '',
        domain: meta.find(m => m.property === 'og:url')?.content || '',
    }

    tagCategories.forEach(mc => {
        const matched = meta.filter(mc.filter)
        meta = meta.filter(m => !matched.includes(m))
        report += renderMetaCategory(
            mc,
            matched,
            mc.preview(matched, defaultTags)
        )
    })

    if (report.length == 0) {
        report = new Card().warning(`No Meta Tags found on this page.`)
    }

    return report
}

export const actions: sectionActions = {
    injector: injectableScript,
    reporter: report,
    eventManager: eventManager,
}
