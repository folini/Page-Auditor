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
        .open(`Html`, `&lt;title&gt; Tag`, 'icon-html-tag')
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
        `${img.width.toFixed()}px x ${img.height.toFixed()}px`,
    ])

    const id = disposableId()
    const table = [
        ['Images On This Page', imgs.length.toFixed()],
        [
            'Regular Images (gif, png, jpg, webp)',
            `${nOfImageFiles > 0 ? nOfImageFiles.toFixed() : 'None'} ${
                imgs.length > 0 && nOfImageFiles > 0 ? `(${((nOfImageFiles / imgs.length) * 100).toFixed(2)}%)` : ''
            }`,
        ],
        [
            'Embedded Images (data:)',
            `${nOfImageData > 0 ? nOfImageData.toFixed() : 'None'} ${
                imgs.length > 0 && nOfImageData > 0 ? `(${((nOfImageData / imgs.length) * 100).toFixed(2)}%)` : ''
            }`,
        ],
        [
            'Images With No Alt',
            `${imagesWithNoAlt.length > 0 ? imagesWithNoAlt.length.toFixed() : 'None'} ${
                imgs.length > 0 && imagesWithNoAlt.length > 0
                    ? `(${((imagesWithNoAlt.length / imgs.length) * 100).toFixed(2)}%)`
                    : ''
            }`,
        ],
        [
            'Images With No Src',
            `${nOfImagesWithNoSrc > 0 ? nOfImagesWithNoSrc.toFixed() : 'None'} ${
                imgs.length > 0 && nOfImagesWithNoSrc > 0
                    ? `(${((nOfImagesWithNoSrc / imgs.length) * 100).toFixed(2)}%)`
                    : ''
            }`,
        ],
        ['Pixel Images (1 x 1 pixels)', `${nOfImages1by1 > 0 ? nOfImages1by1.toFixed() : 'None'}`],
        [
            'Images With Invalid Src',
            `${nOfImagesWithInvalidSrc > 0 ? nOfImagesWithInvalidSrc.toFixed() : 'None'} ${
                imgs.length > 0 && nOfImagesWithInvalidSrc > 0
                    ? `(${((nOfImagesWithInvalidSrc / imgs.length) * 100).toFixed(2)}%)`
                    : ''
            }`,
        ],
        ['Img Download Status', `<span id='${id}'>Calculating...</span>`],
    ]

    const card = new Card(CardKind.report)
        .open(`Html`, `&lt;img&gt; Tags`, 'icon-html-tag')
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
