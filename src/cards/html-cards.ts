// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card, CardKind} from '../card'
import {Report} from '../report'
import {disposableId, compactUrl} from '../main'
import {iImg} from './html'
import * as File from '../file'
import * as Tips from '../tips/tips'
import {Specs} from '../specs'
import {Mode} from '../colorCode'
import {htmlEncode} from 'js-htmlencode'

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

    const imagesWithPlaceholderAlt = imgs
        .filter(img => img.width > 1 && img.height > 1)
        .filter(img => img.alt !== undefined && img.alt.trim().length > 0)
        .filter(img => altIsPlaceholder(img.alt, File.name(img.src)))

    const nOfImagesWithNoSrc = imgs.filter(img => img.src === undefined || img.src.trim().length === 0).length
    const nOfImagesOnePixel = imgs.filter(img => img.width <= 1 && img.height <= 1).length
    const nOfImagesWithInvalidSrc = imgs.filter(
        img => !!img.src && !img.src.startsWith('data:') && File.name(img.src).length === 0
    ).length
    const nOfImageFiles = imgs.filter(img => !!img.src && !img.src.startsWith('data:')).length
    const nOfImageData = imgs.filter(img => !!img.src && img.src.startsWith('data:')).length

    const id = disposableId()
    const table = [
        ['Images Detected', imgs.length.toFixed()],
        ['Images Status', `<span id='${id}'>Calculating...</span>`],
    ]

    if (nOfImageFiles > 0) {
        table.push([
            'Linked Images (.gif, .png, .jpg, .webp)',
            `${nOfImageFiles.toFixed()} (${((nOfImageFiles / imgs.length) * 100).toFixed(2)}%)`,
        ])
    }

    if (nOfImageData > 0) {
        table.push([
            'Embedded Images (data:)',
            `${nOfImageData.toFixed()} (${((nOfImageData / imgs.length) * 100).toFixed(2)}%)`,
        ])
    }

    if (nOfImagesOnePixel > 0) {
        table.push(['Pixels (1 by 1 px or less)', `${nOfImagesOnePixel.toFixed()}`])
    }

    if (imagesWithNoAlt.length > 0) {
        table.push([
            'Without Alt (excluding pixels)',
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
        .addParagraph(`Found ${imgs.length} <code>&lt;img&gt;</code> HTML tags.`)
        .addHtmlElement(Card.tableBlock(`<code>&lt;img&gt;</code> Tags Analysis`, table))
        .addHtmlElement(Card.tableBlock(`Image List`, imgArray2Table(imgs)))
        .tag('card-ok')

    report.addCard(card)

    if (imagesWithPlaceholderAlt.length > 0) {
        Tips.Html.imgWithAltPlaceholder(card, imagesWithPlaceholderAlt)
    }

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
        .filter(img => img.width > 1 && img.height > 1)
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

export const imgArray2Table = (imgs: iImg[]) =>
    imgs.map(img => {
        const isPixel = img.width <= 1 && img.height <= 1
        const fileSize = [
            `<div class='cell-label'>Size (W x H)</div>`,
            `<div class='unbreakable'>${img.width.toFixed()}px by ${img.height.toFixed()}px</div>`,
        ]
        const fileName = [
            `<div class='cell-label'>Name</div>`,
            `${
                img.src.startsWith('data:')
                    ? `<span class='regular-info'>Embedded Image</span>`
                    : htmlEncode(File.name(img.src))
            }`,
        ]
        const filePreview = [
            `<a class='image-in-list' href='${img.src}' title='${htmlEncode(img.src)}' target='_new'><img src='${
                img.src
            }'></a>`,
        ]
        const fileAlt = [
            `<div class='cell-label'>Alt</div>`,
            `${
                isPixel
                    ? `Likely a tracking Pixel, no need for the alt attribute`
                    : !img.alt
                    ? `<span class='missing-info'>The Alt attribute is missing</span>`
                    : altIsPlaceholder(img.alt, File.name(img.src))
                    ? `<div class='missing-info'>The Alt attribute is just a placeholder</div>${img.alt}`
                    : img.alt
            }`,
        ]
        const fileUrl = [
            `<div class='cell-label'>URL</div>`,
            `<a href='${img.src}' title='${htmlEncode(img.src)}'>${compactUrl(img.src.split('?')[0], 55)}</a>`,
        ]

        const tableContent = [filePreview, fileName, fileUrl, fileSize, fileAlt]
        if (isPixel) {
            tableContent.shift()
        }

        const table: HTMLTableElement = document.createElement('table')
        table.className = 'card-table table-img'
        const tBody = document.createElement('tbody')
        table.append(tBody)

        tableContent.forEach(row => {
            const tr = document.createElement('tr')
            tBody.append(tr)
            const labelCell = document.createElement('td')
            tr.append(labelCell)
            labelCell.innerHTML = row[0]
            if (row.length > 1) {
                const labelValue = document.createElement('td')
                tr.append(labelValue)
                labelValue.innerHTML = row[1]
            } else {
                labelCell.colSpan = 2
            }
        })

        return table
    })

const altIsPlaceholder = (alt: string, fileName: string) =>
    alt.length <= 5 || alt === fileName || alt === fileName.replace(/\.\w*$/, '')
