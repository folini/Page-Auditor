// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card, CardKind, iLink} from '../card'
import {Report} from '../report'
import {sectionActions, ReportGeneratorFunc, CodeInjectorFunc, disposableId} from '../main'
import * as File from '../file'
import * as Tips from '../tips/tips'

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
    const imagesWithNoAlt = imgs.filter(img => img.alt === undefined || img.alt.trim().length === 0).map(img => img.src)
    const nOfImagesWithNoSrc = imgs.filter(img => img.src === undefined || img.src.trim().length === 0).length
    const nOfImagesWithInvalidSrc = imgs.filter(
        img => !!img.src && !img.src.startsWith('data:') && File.name(img.src).length === 0
    ).length
    const nOfImageFiles = imgs.filter(img => !!img.src && !img.src.startsWith('data:')).length
    const nOfImageData = imgs.filter(img => !!img.src && img.src.startsWith('data:')).length

    const tableAllImages = imgs.map(img => [
        `<a href='${img.src}' target='_new'>${File.name(img.src)}</a>`,
        !!img.alt ? img.alt : `<span class='missing-info'>No Alt Attribute</span>`,
    ])

    const id = disposableId()
    const table = [
        ['Images', imgs.length.toFixed()],
        [
            'Regular Img',
            `${nOfImageFiles.toFixed()} ${
                imgs.length > 0 && nOfImageFiles > 0 ? `(${((nOfImageFiles / imgs.length) * 100).toFixed(2)}%)` : ''
            }`,
        ],
        [
            'Embedded Img',
            `${nOfImageData.toFixed()} ${
                imgs.length > 0 && nOfImageData > 0 ? `(${((nOfImageData / imgs.length) * 100).toFixed(2)}%)` : ''
            }`,
        ],
        [
            'Img Without Alt',
            `${imagesWithNoAlt.length.toFixed()} ${
                imgs.length > 0 && imagesWithNoAlt.length > 0
                    ? `(${((imagesWithNoAlt.length / imgs.length) * 100).toFixed(2)}%)`
                    : ''
            }`,
        ],
        [
            'Img Without Src',
            `${nOfImagesWithNoSrc.toFixed()} ${
                imgs.length > 0 && nOfImagesWithNoSrc > 0
                    ? `(${((nOfImagesWithNoSrc / imgs.length) * 100).toFixed(2)}%)`
                    : ''
            }`,
        ],
        [
            'Img With Invalid Src',
            `${nOfImagesWithInvalidSrc.toFixed()} ${
                imgs.length > 0 && nOfImagesWithInvalidSrc > 0
                    ? `(${((nOfImagesWithInvalidSrc / imgs.length) * 100).toFixed(2)}%)`
                    : ''
            }`,
        ],
        ['Img Download Status', `<span id='${id}'>Calculating...</span>`],
    ]

    const card = new Card(CardKind.report)
        .open(`Html`, 'IMG Elements', 'icon-html-tag')
        .addParagraph(`Found ${imgs.length} images (HTML tag <code>&lt;img&gt;</code>).`)
        .addTable(`Img Tags Analysis`, table)
        .addTable(`Images`, tableAllImages)
        .tag('card-ok')

    report.addCard(card)
    report.completed()

    if (imagesWithNoAlt.length > 0) {
        Tips.Html.imgWithoutAlt(card, imagesWithNoAlt)
    }

    if (nOfImagesWithNoSrc > 0) {
        Tips.Html.imgWithoutSrc(card, nOfImagesWithNoSrc)
    }

    if (nOfImagesWithInvalidSrc > 0) {
        Tips.Html.imgWithInvalidSrc(card, nOfImagesWithInvalidSrc)
    }

    const missingImages: string[] = []
    const imgPromises = imgs
        .filter(img => !img.src.startsWith('data:'))
        .map(img => File.exists(img.src, File.imageContentType).catch(() => missingImages.push(img.src)))

    Promise.allSettled(imgPromises).then(() => {
        if (missingImages.length > 0) {
            Tips.Html.imagesNotFound(card, missingImages)
        }
        const htmlElem = card.getDiv().querySelector(`#${id}`) as HTMLSpanElement
        htmlElem.innerText =
            missingImages.length === 0 ? 'Everything OK' : `${missingImages.length.toFixed()} Missing Images`
    })
}

export const codeInjector: CodeInjectorFunc = () => {
    const imgs = [...document.querySelectorAll(`img`)] as HTMLImageElement[]

    return {
        images: imgs.map(img => {
            const alt = img.alt
            const dataSrc = img.getAttribute('data-src') || ''
            const src = img.src.length === 0 && dataSrc.length > 0 ? dataSrc : img.src
            return {src: src, alt: alt}
        }),
        title: document.title,
    }
}

export const actions: sectionActions = {
    codeInjector: codeInjector,
    reportGenerator: reportGenerator,
}
