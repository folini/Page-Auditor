// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import * as Tips from '../tips/tips'
import {Report} from '../report'
import {Card, CardKind} from '../card'
import * as CardBlocks from '../card-blocks'
import {Mode} from '../colorCode'
import {sectionActions, ReportGeneratorFunc, CodeInjectorFunc} from '../main'
import {tagCategories, iTagCategory} from './mt-categories'
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
    title: string
}

export const tagToString = (tag: iTag | iTag[]): string => {
    if (Array.isArray(tag)) {
        return `\n[${tag.map(t => tagToString(t)).join('\n')}]\n\n`
    }
    return `{"${tag.label}": "${tag.value}"`
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
        title: document.title,
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
            metaTagsCard(tagCategory, selectedTags, allTags, canonical, title, url, report)
            scriptsDone++
            if (tagCategory.title.includes('Twitter')) {
                twitterDone = true
            }
            if (tagCategory.title.includes('OpenGraph')) {
                openGraphDone = true
            }
        }
    })

    if (scriptsDone === 0) {
        const card = Errors.metaTags_NotFound()
        report.addCard(card)
        Tips.MetaTags.noTagsFound(card)
        report.completed()
        return
    }

    if (!twitterDone) {
        const card = Errors.metaTags_noTwitterTags()
        report.addCard(card)
        Tips.MetaTags.tagTwitterNotFound(card)
    }

    if (!openGraphDone) {
        const card = Errors.metaTags_noOpenGraphTags()
        report.addCard(card)
        Tips.MetaTags.tagOpenGraphNotFound(card)
    }

    report.completed()
}

export const actions: sectionActions = {
    codeToInject: codeInjector,
    reportGenerator: reportGenerator,
}

export const metaTagsCard = (
    tagCategory: iTagCategory,
    selectedTags: iTag[],
    allTags: iTag[],
    canonical: string,
    title: string,
    url: string,
    report: Report
) => {
    if (selectedTags.length === 0) {
        const card = Errors.internal_NoMetaTagsInThisCategory(tagCategory.title)
        report.addCard(card)
        Tips.Internal.unableToAnalyzeBrowserPages(card)
        return
    }

    let table = selectedTags
        .map(tag => {
            if (tag.label === 'twitter:creator' || tag.label === 'twitter:site') {
                return {
                    label: tag.label,
                    value: `<a href='https://twitter.com/${tag.value.substr(1)}'>${tag.value}</a>`,
                } as iTag
            }
            return {label: tag.label, value: tag.value} as iTag
        })
        .map(tag => [tag.label, tag.value])

    if (tagCategory.url.length > 0) {
        table = [
            [
                'Reference',
                `<a class='small-btn' href='${tagCategory.url}' target='_blank'>${tagCategory.title} Reference</a>`,
            ],
            ...table,
        ]
    }

    const selectedTagsAsString = selectedTags.map(m => m.code.trim()).join('\n')

    const card = new Card(CardKind.report)
        .open(`Detected Meta Tags`, tagCategory.title, tagCategory.cssClass)
        .add(CardBlocks.paragraph(tagCategory.description))
        .add(CardBlocks.table(`Tags Analysis`, table))
        .add(CardBlocks.expandable('HTML Code', CardBlocks.code(selectedTagsAsString, Mode.html), `box-code`))
        .setTag('card-ok')

    tagCategory.previewer(card, allTags, selectedTags, canonical, title, url)
    tagCategory.validator(card, allTags, selectedTags, canonical, url)
    report.addCard(card)
}
