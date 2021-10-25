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
    const table = getTypes(ldJson)
    const structuredDataDescription = `Structured Data communicates content (data) to the Search Engines in an organized manner so they can display the content in the SERPs in an attractive manner.`
    const btnLabel = 'LD-JSON Code'
    const card = new Card()
        .open(
            `Structured Data`,
            flattenSchemaName(schemaType),
            'icon-ld-json'
        )
        .addParagraph(structuredDataDescription)
        .addTable('Structured Data Analysis', table, schemaLinks(schemaType, tabUrl, scriptId))
        .addExpandableBlock(btnLabel, codeBlock(jsonCode, Mode.json, scriptId))
        .tag('card-ok')

    report.addCard(card)

    switch (schemaType) {
        case 'Organization':
            occurrences.organization++
            if (occurrences.organization > 1) {
                Tips.multipleStructuredData(card, schemaType, occurrences.organization)
            }
            break
        case 'WebSite':
            occurrences.website++
            if (occurrences.website > 1) {
                Tips.multipleStructuredData(card, schemaType, occurrences.website)
            }
            break
        case 'BreadcrumbList':
            occurrences.breadcrumbs++
            if (occurrences.breadcrumbs > 1) {
                Tips.multipleStructuredData(card, schemaType, occurrences.breadcrumbs)
            }
            break
    }
}

const flattenSchemaName = (name: string): string => name.replace(/([a-z])([A-Z])/g, '$1 $2')

export type SdType = [type: string, name: string]

const descriptionLine = (label: string, description: string) =>
    `<div class='sd-description-line'><span class='sd-label'>${label}:</span> <span class='sd-description'>${description}</span></div>`

const getTypes = (ldJson: iJsonLD, level = 0): SdType[] => {
    const types: SdType[] = []
    Object.keys(ldJson).forEach(jsonKey => {
        if (jsonKey === '@type') {
            let keyValueDesc: string[] = []
            if (ldJson['@id']) {
                keyValueDesc.push(descriptionLine(`Id`, ldJson['@id'] as string))
            }
            if (ldJson.name) {
                keyValueDesc.push(descriptionLine(`Name`, ldJson.name as string))
            }
            if (ldJson.url) {
                keyValueDesc.push(descriptionLine(`Url`, `<a href='${ldJson.url}' target='_new'>${ldJson.url}</a>`))
            }
            if (ldJson.price && ldJson.priceCurrency) {
                keyValueDesc.push(
                    descriptionLine(`Price`, `${(ldJson.price as number).toFixed(2)} ${ldJson.priceCurrency}`)
                )
            }
            if (ldJson.cssSelector) {
                keyValueDesc.push(descriptionLine(`CSS Selector`, `${ldJson.cssSelector}`))
            }
            if (ldJson.headline) {
                keyValueDesc.push(descriptionLine(`Headline`, `${ldJson.headline}`))
            }
            if (ldJson.description) {
                keyValueDesc.push(descriptionLine(`Description`, `${htmlEncode(ldJson.description as string)}`))
            }
            if (ldJson.caption) {
                keyValueDesc.push(descriptionLine(`Caption`, `${ldJson.caption}`))
            }
            if (ldJson.target) {
                keyValueDesc.push(descriptionLine(`Target`, `${ldJson.target}`))
            }
            if (ldJson.contactType) {
                keyValueDesc.push(descriptionLine(`Contact Type`, `${ldJson.contactType as string}`))
            }
            if (ldJson.telephone) {
                keyValueDesc.push(descriptionLine(`Phone`, ` ${ldJson.telephone as string}`))
            }
            if (ldJson.email) {
                keyValueDesc.push(descriptionLine(`Email`, `${ldJson.email as string}`))
            }
            if (
                ldJson.streetAddress &&
                ldJson.postalCode &&
                ldJson.addressRegion &&
                ldJson.addressLocality &&
                ldJson.addressCountry
            ) {
                keyValueDesc.push(
                    descriptionLine(
                        `Address`,
                        `${ldJson.streetAddress}<br>${ldJson.addressLocality}, ${ldJson.addressRegion}<br>${ldJson.postalCode}`
                    )
                )
                keyValueDesc.push(`${ldJson.addressCountry}`)
            }
            if (ldJson.latitude && ldJson.longitude) {
                keyValueDesc.push(
                    descriptionLine(`Geo Coordinates`, `${ldJson.latitude as string}, ${ldJson.longitude}`)
                )
            }
            if (ldJson.position) {
                keyValueDesc.push(descriptionLine(`Position`, `${(ldJson.position as number).toFixed()}`))
            }
            if (ldJson.itemListElement) {
                keyValueDesc.push(descriptionLine(`List Size`, `${(ldJson.itemListElement as []).length.toFixed()}`))
            }
            if (ldJson.Image) {
                keyValueDesc.push(descriptionLine(`List Size`, `${(ldJson.Image as []).length.toFixed()}`))
            }
            if (ldJson.height && ldJson.width) {
                keyValueDesc.push(
                    descriptionLine(
                        `Resolution`,
                        `${(ldJson.width as number).toFixed()} x ${(ldJson.height as number).toFixed()} pixels`
                    )
                )
            }
            types.push([flattenSchemaName(getSchemaType(ldJson)), keyValueDesc.join('')])
        }
        if (typeof ldJson[jsonKey] === 'object') {
            types.push(...getTypes(ldJson[jsonKey] as iJsonLD, level + 1))
        }
    })
    return types
}
