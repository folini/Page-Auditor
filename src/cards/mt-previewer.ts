// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {iTag} from './mt'
import {Card} from '../card'
import {htmlEncode} from 'js-htmlencode'

export interface iTagPreviewer {
    (card: Card, selectedTags: iTag[], allTags: iTag[], canonical: string, title: string, url: string): void
}

export const noPreview: iTagPreviewer = (
    card: Card,
    selectedTag: iTag[],
    allTags: iTag[],
    canonical: string,
    title: string
) => void 0

const twitterLinkIcon =
    `<svg viewBox="0 0 24 24" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr">` +
    `<g>` +
    `<path d="M11.96 14.945c-.067 0-.136-.01-.203-.027-1.13-.318-2.097-.986-2.795-1.932-.832-1.125-1.176-2.508-.968-3.893s.942-2.605 2.068-3.438l3.53-2.608c2.322-1.716 5.61-1.224 7.33 1.1.83 1.127 1.175 2.51.967 3.895s-.943 2.605-2.07 3.438l-1.48 1.094c-.333.246-.804.175-1.05-.158-.246-.334-.176-.804.158-1.05l1.48-1.095c.803-.592 1.327-1.463 1.476-2.45.148-.988-.098-1.975-.69-2.778-1.225-1.656-3.572-2.01-5.23-.784l-3.53 2.608c-.802.593-1.326 1.464-1.475 2.45-.15.99.097 1.975.69 2.778.498.675 1.187 1.15 1.992 1.377.4.114.633.528.52.928-.092.33-.394.547-.722.547z"></path><path d="M7.27 22.054c-1.61 0-3.197-.735-4.225-2.125-.832-1.127-1.176-2.51-.968-3.894s.943-2.605 2.07-3.438l1.478-1.094c.334-.245.805-.175 1.05.158s.177.804-.157 1.05l-1.48 1.095c-.803.593-1.326 1.464-1.475 2.45-.148.99.097 1.975.69 2.778 1.225 1.657 3.57 2.01 5.23.785l3.528-2.608c1.658-1.225 2.01-3.57.785-5.23-.498-.674-1.187-1.15-1.992-1.376-.4-.113-.633-.527-.52-.927.112-.4.528-.63.926-.522 1.13.318 2.096.986 2.794 1.932 1.717 2.324 1.224 5.612-1.1 7.33l-3.53 2.608c-.933.693-2.023 1.026-3.105 1.026z"></path>` +
    `</g>` +
    `</svg>`

export const stdTags = (
    card: Card,
    selectedTags: iTag[],
    allTag: iTag[],
    canonical: string,
    tabTitle: string,
    tabUrl: string
) => {
    const description = selectedTags.find(m => m.label.toLowerCase() === 'description')?.value || ''
    const title = selectedTags.find(m => m.label.toLowerCase() === 'title')?.value || tabTitle

    card.addPreview(
        `<div class='box-label label-close'>Google SERP Preview</div>` +
            `<div class='box-body body-close'>` +
            `<div class='serp-body'>` +
                `<div class='serp-card-url'>${tabUrl}</div>` +
                `<div class='serp-card-title'>${title}</div>` +
                `<div class='serp-card-description'>${description}</div>` +
            `</div>` +
            `</div>`,
        'serp-card'
    )
}

export const twitterTags = (card: Card, selectedTags: iTag[], allTag: iTag[], canonical: string, tabTitle: string) => {
    const imgTag = selectedTags.find(m => m.label === 'twitter:image' || m.label === 'twitter:image:src')
    const urlTag = selectedTags.find(m => m.label === 'twitter:url')
    const titleTag = selectedTags.find(m => m.label === 'twitter:title')
    const descriptionTag = selectedTags.find(m => m.label === 'twitter:description')

    const imgFallbackTag = allTag.find(m => m.label === 'og:image' || m.label === 'image')
    const titleFallbackTag = allTag.find(m => m.label === 'og:title' || m.label === 'title')
    const descriptionFallbackTag = allTag.find(m => m.label === 'og:description' || m.label === 'description')
    const urlFallbackTag = allTag.find(m => m.label === 'og:url' || m.label === 'url')

    let title = titleTag?.value || titleFallbackTag?.value || ''
    let img = imgTag?.value || imgFallbackTag?.value || ''
    let description = descriptionTag?.value || descriptionFallbackTag?.value || ''
    description = description.length < 128 ? description : description.substr(0, 128) + '&mldr;'
    var domain = urlTag?.value || urlFallbackTag?.value || ''

    if (domain.startsWith('http')) {
        domain = domain.replace(/https?:\/\/(www.)?((\w+\.)?\w+\.\w+).*/i, `$2`)
    }

    if (img.startsWith('http://')) {
        img = img.replace('http://', 'https://')
    }

    card.addPreview(
        `<div class='box-label label-close'>Twitter Preview</div>` +
            `<div class='box-body body-close'>` +
            (img.length > 0 && img.startsWith('http') ? `<img class='preview-img' src='${img}'>` : ``) +
            `<div class='preview-legend'>` +
            (domain.length > 0 ? `<div class='twitter-card-domain'>${domain}</div>` : '') +
            `<div class='twitter-card-title'>${htmlEncode(title)}</div>` +
            `<div class='twitter-card-description'>${htmlEncode(description)}</div>` +
            `</div>` +
            `</div>` +
            `</div>`,
        'twitter-card'
    )

    if (!img.startsWith('http')) {
        card.hideElement(`.preview-img`)
    }
}

export const openGraphTags = (card: Card, selectedTags: iTag[], allMeta: iTag[], tabTitle: string) => {
    const imgTag = selectedTags.find(m => m.label === 'og:image')
    const urlTag = selectedTags.find(m => m.label === 'og:url' || m.label === 'og:image:secure_url')
    const titleTag = selectedTags.find(m => m.label === 'og:title')
    const descriptionTag = selectedTags.find(m => m.label === 'og:description')

    const imgFallbackTag = allMeta.find(m => m.label === 'image')
    const descriptionFallbackTag = allMeta.find(m => m.label === 'description')
    const urlFallbackTag = allMeta.find(m => m.label === 'url')
    const titleFallbackTag = allMeta.find(m => m.label === 'title')

    let url = urlTag?.value || urlFallbackTag?.value || ''
    if (url && url.startsWith('http')) {
        url = url.replace(/https?:\/\/(www.)?((\w+\.)?\w+\.\w+).*/i, `$2`)
    }

    let img = imgTag?.value || imgFallbackTag?.value || ''
    img = img.replace('http://', 'https://')

    let title = titleTag?.value || titleFallbackTag?.value || ''

    let description = descriptionTag?.value || descriptionFallbackTag?.value || ''
    description = description.length < 215 ? description : description.substr(0, 214) + '&mldr;'

    card.addPreview(
        `<div class="box-label label-close">Facebook Preview</div>` +
            `<div class='box-body body-close'>` +
            (img.length > 0 ? `<img class='preview-img' src='${img}'>` : ``) +
            `<div class='preview-legend'>` +
            (url.length > 0 ? `<div class='open-graph-card-domain'>${url.toUpperCase()}</div>` : '') +
            `<h2>${htmlEncode(title)}</h2>` +
            `<div class='og-description'>${htmlEncode(description)}</div>` +
            `</div>` +
            `</div>` +
            `</div>`,
        'facebook-card'
    )

    if (!img.startsWith('https://')) {
        card.hideElement(`.preview-img`)
    }
}
