// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {iJsonLD} from './sd'
import {Card, iLink} from '../card'
import {Mode} from '../colorCode'
import {disposableId, copyTxtToClipboard} from '../main'
import {codeBlock} from '../codeBlock'
import * as Suggestions from './suggestionCards'
import {Report} from '../report'

export const schemaLinks = (schemaName: string, ldjsonUrl: string, codeId: string): iLink[] => [
    {
        label: 'Copy Code',
        onclick: () => copyTxtToClipboard(codeId),
    },
    {
        url: `https://validator.schema.org/#url=${encodeURI(ldjsonUrl)}`,
        label: `Validate`,
    },
    {
        url: `https://schema.org/${schemaName === 'Graph' ? '' : schemaName}`,
        label: `Schema`,
    },
]

export const ldJsonCard = (ldJson: iJsonLD, tabUrl: string, report: Report) => {
    if (JSON.stringify(ldJson) === '{}') {
        report.addCard(Suggestions.emptyStructuredData())
    }
    const schemaType: string = (ldJson['@type'] || 'Graph') as string
    const jsonCode = JSON.stringify(ldJson)
    const scriptId = disposableId()
    // Find all @types in the JSON-LD as string[]
    const typesMatches = (jsonCode.match(/("@type":\s*")([a-z0-9]*)/gi) ?? ([] as string[])).map(m =>
        m.replace(/("@type":\s*")/gi, '')
    )
    // Compute unique @types as string[]
    const typesUnique = [...new Set(typesMatches)]
    //Count occurrences of each @type
    let table = typesUnique
        .map(type => [
            `<a href='https://https://schema.org/${type}/' target='_new'>${type.replace(
                /([a-z])([A-Z])/g,
                '$1 $2'
            )}</a>`,
            typesMatches.filter(t => t === type).length.toFixed() +
                ` occurrence${typesMatches.filter(t => t === type).length > 1 ? 's' : ''}`,
        ])
        .sort((a, b) => (a[1] !== b[1] ? b[1].localeCompare(a[1]) : a[0].localeCompare(b[0])))
    table = getTypes(ldJson)
    const structuredDataDescription = `Structured Data communicates content (data) to the Search Engines in an organized manner so they can display the content in the SERPs in an attractive manner.`
    const btnLabel = 'LD-JSON Code'
    const card = new Card()
        .open(
            `Structured Data`,
            flattenSchemaName(schemaType),
            schemaLinks(schemaType, tabUrl, scriptId),
            'icon-ld-json'
        )
        .addParagraph(structuredDataDescription)
        .addTable('Structured Data Analysis', table)
        .addExpandableBlock(btnLabel, codeBlock(jsonCode, Mode.json, scriptId))
    report.addCard(card)
}

const flattenSchemaName = (name: string): string => name.replace(/([a-z])([A-Z])/g, '$1 $2')

type SdType = [type: string, name: string]

const getTypes = (ldJson: iJsonLD, level = 0): SdType[] => {
    const types: SdType[] = []
    Object.keys(ldJson).forEach(jsonKey => {
        const key = ldJson[jsonKey] as string
        if (jsonKey === '@type') {
            let keyValue: string[] = []
            switch (key) {
                case 'Person':
                    if (ldJson.name) {
                        keyValue.push(`Name: ${ldJson.name}`)
                    }
                    break
                case 'WebSite':
                    if (ldJson.name) {
                        keyValue.push(`Name: ${ldJson.name}`)
                    }
                    if (ldJson.url) {
                        keyValue.push(`<a href='${ldJson.url}' target='_new'>Link</a>`)
                    }
                    break
                case 'Offer':
                    if (ldJson.price && ldJson.priceCurrency) {
                        keyValue.push(`${(ldJson.price as number).toFixed(2)} ${ldJson.priceCurrency}`)
                    }
                    break
                case 'WebPageElement':
                    if (ldJson.cssSelector) {
                        keyValue.push(`CSS Selector: ${ldJson.cssSelector}`)
                    }
                    break
                case 'NewsArticle':
                    if (ldJson.headline) {
                        keyValue.push(`Headline: ${ldJson.headline}`)
                    }
                    if (ldJson.description) {
                        keyValue.push(`Description: ${ldJson.description}`)
                    }
                    break
                case 'Organization':
                    if (ldJson.name) {
                        keyValue.push(`Name: ${ldJson.name}`)
                    }
                    if (ldJson.url) {
                        keyValue.push(`<a href='${ldJson.url}' target='_new'>Link</a>`)
                    }
                    break
                case 'ContactPoint':
                    if (ldJson.contactType) {
                        keyValue.push(`${ldJson.contactType as string}`)
                    }
                    if (ldJson.telephone) {
                        keyValue.push(`Phone: ${ldJson.telephone as string}`)
                    }
                    if (ldJson.email) {
                        keyValue.push(`Email: ${ldJson.email as string}`)
                    }

                    break
                case 'PostalAddress':
                    if (
                        ldJson.streetAddress &&
                        ldJson.postalCode &&
                        ldJson.addressRegion &&
                        ldJson.addressLocality &&
                        ldJson.addressCountry
                    ) {
                        keyValue.push(`${ldJson.streetAddress}`)
                        keyValue.push(`${ldJson.addressLocality}, ${ldJson.addressRegion} ${ldJson.postalCode}`)
                        keyValue.push(`${ldJson.addressCountry}`)
                    }
                    break
                case 'Article':
                    if (ldJson.author && (ldJson.author as any)[0].name) {
                        keyValue.push(`Author: ${(ldJson.author as any)[0].name}`)
                    }
                    break
                case 'GeoCoordinates':
                    if (ldJson.latitude && ldJson.longitude) {
                        keyValue.push(`${ldJson.latitude as string}, ${ldJson.longitude}`)
                    }
                    break
                case 'ListItem':
                    if (ldJson.name) {
                        keyValue.push(`Name: ${ldJson.name}`)
                    }
                    if (ldJson.position) {
                        keyValue.push(`Item at position ${(ldJson.position as number).toFixed()}`)
                    }
                    if (ldJson.url) {
                        keyValue.push(`Url: <a href='${ldJson.url}' target='_new'>Link</a>`)
                    }
                    break
                case 'ItemList':
                    if (ldJson.itemListElement) {
                        keyValue.push(`List of ${(ldJson.itemListElement as []).length.toFixed()} items`)
                    }
                    break
                case 'BreadcrumbList':
                    if (ldJson.itemListElement) {
                        keyValue.push(`List of ${(ldJson.itemListElement as []).length.toFixed()} items`)
                    }
                    break
                case 'ImageGallery':
                    if (ldJson.Image) {
                        keyValue.push(`List of ${(ldJson.Image as []).length.toFixed()} items`)
                    }
                    break
                case 'ImageObject':
                    if (ldJson.url) {
                        keyValue.push(`<a href='${ldJson.url}' target='_new'>Link</a>`)
                    }
                    if (ldJson.height && ldJson.width) {
                        keyValue.push(
                            `Resolution: ${(ldJson.width as number).toFixed()} x ${(
                                ldJson.height as number
                            ).toFixed()} pixels`
                        )
                    }
                    if (ldJson.name) {
                        keyValue.push(`Name: ${ldJson.name}`)
                    }
                    break
            }
            types.push([
                `<span style='text-decoration:line-through'>${'&nbsp;'.repeat(level)}</span>&nbsp;${flattenSchemaName(
                    key
                )}`,
                keyValue.join('<br>'),
            ])
        }
        if (typeof key === 'object') {
            types.push(...getTypes(key, level + 1))
        }
    })
    return types
}
