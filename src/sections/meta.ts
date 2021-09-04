// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
// ----------------------------------------------------------------------------
import {Card, iLink} from '../card'
import {sectionActions} from '../main'
import {tagCategories, iTagCategory} from './meta-categories'

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

export const injectableScript = () => {
    return ([...document.querySelectorAll(`head meta`)] as HTMLMetaElement[])
        .map(m => ({
            property: (
                m.getAttribute(`property`) ||
                m.getAttribute('name') ||
                m.getAttribute('http-equiv') ||
                ''
            ).toLowerCase(),
            content: m.content || '',
            class: m.getAttribute('class'),
        }))
        .filter(m => m.content !== '' && m.property !== '')
}

const eventManager = () => undefined

const report = async (url: string, data: any): Promise<string> => {
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

const renderMetaCategory = (
    metaCat: iTagCategory,
    metaList: iMetaTag[],
    preview: string
): string => {
    if (metaList.length === 0) {
        return ''
    }
    const listOfMeta = metaList
        .map(
            m =>
                `<div class='single-line-forced'>
                    <span class='label'>${m.property}:</span> 
                    <span class='value'>${m.content}</span>
                  </div>`
        )
        .join('')

    const links: iLink[] = []
    if(metaCat.url.length > 0) {
        links.push({url: metaCat.url, label: 'Reference'})
    }

    return new Card()
        .open(`Meta Tags`, metaCat.title, links, metaCat.cssClass)
        .add(
            `
        <div class='card-description'>${metaCat.description}</div>
        <div class='meta-items'>${listOfMeta}</div>
        ${preview}
      `
        )
        .close()
}

export const actions: sectionActions = {
    injector: injectableScript,
    reporter: report,
    eventManager: eventManager,
}
