// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Report} from '../report'
import {sectionActions, ReportGeneratorFunc, CodeInjectorFunc, disposableId} from '../../main'
import * as HtmlCards from './html-cards'
import {iImgToString} from '../debug'

export interface iImg {
    src: string
    alt: string
    width: number
    height: number
}

type HeadingLabels = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export interface iDataFromInjector {
    title: string
    images: iImg[]
    h1Title: string
    headings: Map<HeadingLabels, number>
}

export const codeInjector: CodeInjectorFunc = (): iDataFromInjector => {
    const imgs = [...document.querySelectorAll(`img`)] as HTMLImageElement[]

    let headings = new Map<HeadingLabels, number>([
        ['h1', 0],
        ['h2', 0],
        ['h3', 0],
        ['h4', 0],
        ['h5', 0],
        ['h6', 0],
    ])
    ;[...document.querySelectorAll(`h1, h2, h3, h4, h5, h6`)]
        .map(elem => elem.tagName.toLowerCase())
        .forEach(tag => headings.set(tag as HeadingLabels, headings.get(tag as HeadingLabels)! + 1))

    return {
        images: imgs.map(img => {
            const alt = img.alt
            const dataSrc = img.getAttribute('data-src') || ''
            const src = img.src.length === 0 && dataSrc.length > 0 ? dataSrc : img.src
            return {src: src, alt: alt, width: img.naturalWidth, height: img.naturalHeight} as iImg
        }),
        title: document.title,
        h1Title: (document.querySelector('h1')?.textContent || '').replace('&nbsp;', ' ').replace(/\s+/g, ' ').trim(),
        headings: headings,
    } as iDataFromInjector
}

const reportGenerator: ReportGeneratorFunc = (tabUrl: string, data: any, report: Report): void => {
    const dataFromInjector = data as iDataFromInjector
    const imgs = dataFromInjector.images
    if (imgs.length > 0) {
        HtmlCards.imgCard(report, imgs)
    }

    HtmlCards.titleCard(report, dataFromInjector.title, dataFromInjector.h1Title)

    report.completed()
}

export const actions: sectionActions = {
    codeToInject: codeInjector,
    reportGenerator: reportGenerator,
}
