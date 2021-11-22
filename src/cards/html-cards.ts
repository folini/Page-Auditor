// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card, CardKind} from '../card'
import {Report} from '../report'
import {disposableId} from '../main'
import {iImg} from './html'
import * as File from '../file'
import * as Tips from '../tips/tips'
import {Specs} from '../specs'
import {Mode} from '../colorCode'

export const titleCard = (report: Report, title: string, h1Title: string): void => {
    if (title.length === 0) {
        const card = new Card(CardKind.error)
        report.addCard(card)
        return
    }

    const card = new Card(CardKind.report)
        .open(`Html`, `<code>&lt;title&gt;</code> Tag`, 'icon-html-tag')
        .tag('card-ok')
        .addParagraph(`The page title from the <code>&lt;title&gt;</code> is:`)
        .addCodeBlock(title, Mode.txt)

    if (h1Title.length > 0) {
        card.addParagraph(`The document title from the <code>&lt;h1&gt;</code> tag is:`).addCodeBlock(h1Title, Mode.txt)

        if (title.trim() !== h1Title.trim()) {
            Tips.Html.titleShouldMatchH1(card, title, h1Title)
        }
    }
    report.addCard(card)

    if (title.length > Specs.html.titleTag.maxLen) {
        Tips.Html.titleTooLong(card, title)
    }

    if (['index', 'home'].includes(title.toLowerCase())) {
        Tips.Html.titleIsaPlaceholder(card, title)
    }
}

export const imgCard = (report: Report, imgs: iImg[]): void => {
    const imagesWithNoAlt = imgs
        .filter(img => img.alt === undefined || img.alt.trim().length === 0)
        .filter(img => img.width > 1 && img.height > 1)
        .map(img => img.src)
    const nOfImagesWithNoSrc = imgs.filter(img => img.src === undefined || img.src.trim().length === 0).length
    const nOfImages1by1 = imgs.filter(img => img.width <= 1 && img.height <= 1).length
    const nOfImagesWithInvalidSrc = imgs.filter(
        img => !!img.src && !img.src.startsWith('data:') && File.name(img.src).length === 0
    ).length
    const nOfImageFiles = imgs.filter(img => !!img.src && !img.src.startsWith('data:')).length
    const nOfImageData = imgs.filter(img => !!img.src && img.src.startsWith('data:')).length

    const tableAllImages = imgs.map(img => [
        `<a href='${img.src}' title='${img.src}' target='_new'>${File.name(img.src)}</a>`,
        img.width <= 1 && img.height <= 1
            ? `<span class='regular-info'>Tracking Pixel</span>`
            : !!img.alt
            ? img.alt
            : `<span class='missing-info'>No Alt Attribute</span>`,
        `<div class='unbreakable'>${img.width.toFixed()}px by ${img.height.toFixed()}px</div>`,
    ])

    const id = disposableId()
    const table = [
        ['Images Detected', imgs.length.toFixed()],
        ['Images Status', `<span id='${id}'>Calculating...</span>`]
    ]

    if(nOfImageFiles > 0) {
        table.push([
            'Linked Images (.gif, .png, .jpg, .webp)',
            `${nOfImageFiles.toFixed()} (${
                ((nOfImageFiles / imgs.length) * 100).toFixed(2)}%)`
        ])
    }

    if(nOfImageData > 0) {
        table.push([
            'Embedded Images (data:)',
            `${nOfImageData.toFixed()} (${((nOfImageData / imgs.length) * 100).toFixed(2)}%)`
        ])
    }

    if(nOfImages1by1> 0) {
        table.push(['Pixel Images (1 x 1 / 0 x 0 pixels)', `${nOfImages1by1.toFixed()}`])
    }

    if (imagesWithNoAlt.length > 0) {
        table.push([
            'Images Without Alt',
            `<span class='missing-info'>${imagesWithNoAlt.length.toFixed()} (${(
                (imagesWithNoAlt.length / imgs.length) *
                100
            ).toFixed(2)}%)</span>`,
        ])
    }
    if (nOfImagesWithNoSrc > 0) {
        table.push([
            'Images Without Src',
            `<span class='missing-info'>${nOfImagesWithNoSrc.toFixed()} (${(
                (nOfImagesWithNoSrc / imgs.length) *
                100
            ).toFixed(2)}%)</span>`,
        ])
    }
    if (nOfImagesWithInvalidSrc > 0) {
        table.push([
            'Images With Invalid Src',
            `<span class='missing-info'>${nOfImagesWithInvalidSrc.toFixed()} (${(
                (nOfImagesWithInvalidSrc / imgs.length) *
                100
            ).toFixed(2)}%)</span>`,
        ])
    }

    const card = new Card(CardKind.report)
        .open(`Html`, `<code>&lt;img&gt;</code> Tags`, 'icon-html-tag')
        .addParagraph(`Found ${imgs.length} images in  <code>&lt;img&gt;</code> HTML tags.`)
        .addTable(`<code>&lt;img&gt;</code> Tags Analysis`, table)
        .addTable(`Images List`, tableAllImages)
        .tag('card-ok')

    report.addCard(card)

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
        htmlElem.innerHTML =
            missingImages.length === 0
                ? `<span class='regular-info'>All Images OK</span>`
                : `<span class='missing-info'>${missingImages.length.toFixed()} Missing Images</span>`
    })
}
