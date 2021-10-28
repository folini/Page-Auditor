// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {iJsonLD, MustBeUniqueOccurrences} from './sd'
import {Card, iLink} from '../card'
import {Mode} from '../colorCode'
import {disposableId} from '../main'
import {codeBlock} from '../codeBlock'
import {Suggestions} from './suggestions'
import {Report} from '../report'
import {htmlEncode} from 'js-htmlencode'
import {Tips} from './tips'
import "../logos/_noRendering_400x200.png"

export const schemaLinks = (schemaName: string, ldjsonUrl: string, codeId: string): iLink[] => [
    {
        url: `https://validator.schema.org/#url=${encodeURI(ldjsonUrl)}`,
        label: `Validate`,
    },
    {
        url: `https://schema.org/${schemaName === 'Graph' ? '' : schemaName}`,
        label: `Schema`,
    },
]

export const getSchemaType = (ldJson: iJsonLD) => {
    const schemaType = ldJson['@type']

    if (schemaType === undefined) {
        return 'Graph'
    }
    if (typeof schemaType === 'string') {
        return schemaType
    }
    if (Array.isArray(schemaType) && schemaType.length > 0) {
        return (schemaType as string[])[0]
    }
    return ''
}

export const ldJsonCard = (ldJson: iJsonLD, tabUrl: string, occurrences: MustBeUniqueOccurrences, report: Report) => {
    if (Object.keys(ldJson).length === 0) {
        report.addCard(Suggestions.emptyStructuredData())
    }
    let schemaType = getSchemaType(ldJson)

    const jsonCode = JSON.stringify(ldJson)
    const scriptId = disposableId()
    const structuredDataDescription = `Structured Data communicates content (data) to the Search Engines in an organized manner so they can display the content in the SERPs in an attractive manner.`
    const btnLabel = 'LD-JSON Code'
    const relativeUrlList: string[] = []
    const card = new Card()
        .open(`Structured Data`, flatSchemaName(schemaType), 'icon-ld-json')
        .addParagraph(structuredDataDescription)
    if (schemaType === 'Graph' && Array.isArray(ldJson['@graph'])) {
        const schemas = ldJson['@graph']
        schemas.forEach(schema => {
            const subSchemaType = getSchemaType(schema)
            card.addTable(
                `<b>${flatSchemaName(subSchemaType)}</b> Schema Analysis`,
                getTypes(schema, relativeUrlList),
                schemaLinks(subSchemaType, tabUrl, scriptId)
            )
        })
    } else {
        card.addTable(
            `<b>${flatSchemaName(schemaType)}</b> Schema Analysis`,
            getTypes(ldJson, relativeUrlList),
            schemaLinks(schemaType, tabUrl, scriptId)
        )
    }
    card.addExpandableBlock(btnLabel, codeBlock(jsonCode, Mode.json, scriptId)).tag('card-ok')

    report.addCard(card)

    if (relativeUrlList.length > 0) {
        Tips.sd_relativeUrl(card, flatSchemaName(schemaType), relativeUrlList)
    }

    switch (schemaType) {
        case 'Organization':
            occurrences.organization++
            if (occurrences.organization > 1) {
                Tips.sd_repeatedSchemas(card, schemaType, occurrences.organization)
            }
            break
        case 'WebSite':
            occurrences.website++
            if (occurrences.website > 1) {
                Tips.sd_repeatedSchemas(card, schemaType, occurrences.website)
            }
            break
        case 'BreadcrumbList':
            occurrences.breadcrumbs++
            if (occurrences.breadcrumbs > 1) {
                Tips.sd_repeatedSchemas(card, schemaType, occurrences.breadcrumbs)
            }
            break
    }
}

const flatSchemaName = (name: string): string => name.replace(/([a-z])([A-Z])/g, '$1 $2')

export type SdType = [type: string, name: string]

const dLine = (par1: string, par2: string = '') =>
    par2.length > 0
        ? `<div class='sd-description-line'><span class='sd-label'>${par1}:</span> <span class='sd-description'>${par2}</span></div>`
        : `<div class='sd-description-line'><span class='sd-description'>${par1}</span></div>`

const dImg = (url: string) => {
    const src = url.startsWith('http') ? url : `../logos/_noRendering_400x200.png`
    return `<div class='sd-description-line'><a href='${url}' target='_new'><img src='${src}'></a></div>`
}

const dList = (label: string, list: string[]) =>
    `<div class='sd-description-line'><span class='sd-label'>${label}s:</span>
    <ul>${list.map(word => `<li>${word}</li>`).join('')}</ul></div>`

const dUrlList = (label: string, list: string[], relativeUrls: string[]) =>
    `<div class='sd-description-line'><span class='sd-label'>${label}:</span>
    <ul>${list
        .map(url => validateUrl(url, relativeUrls))
        .map(url => `<li><a href='${url}' target='_new'>${url}</a></li>`)
        .join('')}</ul></div>`

const validateUrl = (url: string, list: string[]): string => {
    if (!url.startsWith('http')) {
        list.push(url)
    }
    return url
}

const getTypes = (ldJson: iJsonLD, relativeUrls: string[], level = 0): SdType[] => {
    const types: SdType[] = []
    Object.keys(ldJson).forEach(jsonKey => {
        if (jsonKey === '@type') {
            let keyValueDesc: string[] = []
            if (ldJson['@id']) {
                // IGNORE: @id
            }
            if (ldJson.name && typeof ldJson.name === 'string') {
                keyValueDesc.push(dLine(`<b>${ldJson.name as string}</b>`))
            }
            if (ldJson.url && typeof ldJson.url === 'string') {
                const url = validateUrl(ldJson.url, relativeUrls)
                if (getSchemaType(ldJson) === 'ImageObject') {
                    keyValueDesc.push(dImg(url))
                } else {
                    keyValueDesc.push(dLine(`<a href='${url}' target='_new'>${url}</a>`))
                }
            }
            if (ldJson.price && ldJson.priceCurrency) {
                keyValueDesc.push(dLine(`Price`, `${(ldJson.price as number).toFixed(2)} ${ldJson.priceCurrency}`))
            }
            if (ldJson.cssSelector) {
                keyValueDesc.push(dLine(`CSS Selector`, `${ldJson.cssSelector}`))
            }
            if (ldJson.headline) {
                keyValueDesc.push(dLine(`Headline`, `${ldJson.headline}`))
            }
            if (ldJson.description) {
                keyValueDesc.push(dLine(`Description`, `${htmlEncode(ldJson.description as string)}`))
            }
            if (ldJson.caption) {
                keyValueDesc.push(dLine(`Caption`, `${ldJson.caption}`))
            }
            if (ldJson.target) {
                keyValueDesc.push(dLine(`Target`, `${ldJson.target}`))
            }
            if (ldJson.contactType) {
                keyValueDesc.push(dLine(`Type`, `${ldJson.contactType as string}`))
            }
            if (ldJson.telephone) {
                keyValueDesc.push(dLine(`Phone`, ` ${ldJson.telephone as string}`))
            }
            if (ldJson.areaServed) {
                keyValueDesc.push(dLine(`Area Served`, ` ${ldJson.areaServed as string}`))
            }
            if (ldJson.availableLanguage) {
                if (Array.isArray(ldJson.availableLanguage)) {
                    keyValueDesc.push(dList(`Area Served`, ldJson.availableLanguage as string[]))
                } else if(typeof ldJson.availableLanguage === 'string') {
                    keyValueDesc.push(dLine(`Area Served`, ` ${ldJson.availableLanguage as string}`))
                }
            }
            if (ldJson.email) {
                keyValueDesc.push(dLine(`Email`, `${ldJson.email as string}`))
            }
            if (
                ldJson.streetAddress &&
                ldJson.postalCode &&
                ldJson.addressRegion &&
                ldJson.addressLocality &&
                ldJson.addressCountry
            ) {
                keyValueDesc.push(
                    dLine(
                        `${ldJson.streetAddress}<br>${ldJson.addressLocality}, ${ldJson.addressRegion}<br>${ldJson.postalCode}<br>${ldJson.addressCountry}`
                    )
                )
            }
            if (ldJson.latitude && ldJson.longitude) {
                keyValueDesc.push(
                    dLine(
                        `<a target='_new' href='https://maps.google.com/?q=${ldJson.latitude as string},${
                            ldJson.longitude as string
                        }'>${ldJson.latitude as string}, ${ldJson.longitude as string}</a>`
                    )
                )
            }
            if (ldJson.position) {
                keyValueDesc.push(dLine(`Position`, `${(ldJson.position as number).toFixed()}`))
            }
            if (ldJson.itemListElement) {
                keyValueDesc.push(dLine(`List Size`, `${(ldJson.itemListElement as []).length.toFixed()}`))
            }
            if (ldJson.image) {
                if (Array.isArray(ldJson.image)) {
                    keyValueDesc.push(dLine(`Images List Size`, `${(ldJson.image as []).length.toFixed()}`))
                } else if (typeof ldJson.image === 'object' && (ldJson.image as any).url) {
                    const url = validateUrl((ldJson.image as any).url, relativeUrls)
                    keyValueDesc.push(dImg(url))
                } else if (typeof ldJson.image === 'string') {
                    const url = validateUrl(ldJson.image, relativeUrls)
                    keyValueDesc.push(dImg(url))
                }
            }
            if (ldJson.thumbnailUrl && typeof ldJson.thumbnailUrl === 'string') {
                const url = validateUrl(ldJson.thumbnailUrl, relativeUrls)
                keyValueDesc.push(dImg(url))
            }
            if (ldJson.logo) {
                if (typeof ldJson.logo === 'object' && (ldJson.logo as any).url) {
                    const url = validateUrl((ldJson.logo as any).url, relativeUrls)
                    keyValueDesc.push(dImg(url))
                } else if (typeof ldJson.logo === 'string') {
                    const url = validateUrl(ldJson.logo, relativeUrls)
                    keyValueDesc.push(dImg(url))
                }
            }
            if (ldJson.sameAs) {
                if (Array.isArray(ldJson.sameAs)) {
                    keyValueDesc.push(dUrlList(`Same As`, ldJson.sameAs as string[], relativeUrls))
                } else if(typeof ldJson.sameAs === 'string') {
                    const url = validateUrl(ldJson.sameAs, relativeUrls)
                    keyValueDesc.push(dLine(`Same As`, `${url}`))
                }
            }
            if (ldJson.keywords) {
                if (Array.isArray(ldJson.keywords)) {
                    keyValueDesc.push(dList(`Keywords`, ldJson.keywords as string[]))
                } else if(typeof ldJson.keywords === 'string') {
                    keyValueDesc.push(dLine(`Keywords`, `${ldJson.keywords}`))
                }
            }
            if (ldJson.height && ldJson.width) {
                keyValueDesc.push(
                    dLine(
                        `Resolution`,
                        `${(ldJson.width as number).toFixed()} x ${(ldJson.height as number).toFixed()} pixels`
                    )
                )
            }
            types.push([flatSchemaName(getSchemaType(ldJson)), keyValueDesc.join('')])
        }
        if (typeof ldJson[jsonKey] === 'object') {
            types.push(...getTypes(ldJson[jsonKey] as iJsonLD, relativeUrls, level + 1))
        }
    })
    return types
}
