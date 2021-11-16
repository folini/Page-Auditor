// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card, CardKind, iLink} from '../card'
import {Report} from '../report'
import {sectionActions, ReportGeneratorFunc, CodeInjectorFunc} from '../main'
import * as File from '../file'
import * as Tips from './tips'

interface iImg {
    src: string
    alt: string
}

interface iDataFromInjector {
    title: string
    images: iImg[]
}

const iImgToString = (img: iImg | iImg[]): string => {
    if (Array.isArray(img)) {
        return img.map(iImgToString).join('\n')
    }
    return `[src: "${img.src}", alt: "${img.alt}"]`
}

const reportGenerator: ReportGeneratorFunc = (tabUrl: string, data: any, report: Report): void => {
    const imgs = (data as iDataFromInjector).images
    const table = imgs.map(img => [
        `<a href='${img.src}' target='_new'>${File.name(img.src)}</a>`,
        !!img.alt ? img.alt : `<span class='missing-info'>No Alt Attribute</span>`,
    ])
    const imagesWithoutAlt = imgs
        .filter(img => img.alt === undefined || img.alt.trim().length === 0)
        .map(img => img.src)

    const card = new Card(CardKind.report)
        .open(`Html`, 'IMG Elements', 'icon-html-tag')
        .addParagraph(`Found ${imgs.length} images (HTML tag <code>&lt;img&gt;</code>).`)
        .addTable(`${table.length} Images Analysis`, table)
        .tag('card-ok')

    report.addCard(card)
    report.completed()

    if (imagesWithoutAlt.length > 0) {
        Tips.html_ImgWithoutAlt(card, imagesWithoutAlt)
    }

    imgs.filter(img => !img.src.startsWith('data:')).forEach(img =>
        File.exists(img.src, File.imageContentType).catch(() => Tips.html_ImageNotFound(card, img.src))
    )
}

export const codeInjector: CodeInjectorFunc = () => {
    const imgs = [...document.querySelectorAll(`img`)] as HTMLImageElement[]

    return {
        images: imgs.map(img => ({src: img.src, alt: img.alt})),
        title: document.title,
    }
}

export const actions: sectionActions = {
    codeInjector: codeInjector,
    reportGenerator: reportGenerator,
}
