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

export const ldJsonCard = (ldJson: iJsonLD, tabUrl: string) => {
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
    const typesCount = typesUnique
        .map(type => [
            `<a href='https://https://schema.org/${type}/' target='_new'>${type.replace(
                /([a-z])([A-Z])/g,
                '$1 $2'
            )}</a>`,
            typesMatches.filter(t => t === type).length.toFixed() + ' occurrence(s)',
        ])
        .sort((a, b) => (a[1] !== b[1] ? b[1].localeCompare(a[1]) : a[0].localeCompare(b[0])))
    const structuredDataDescription = `Structured Data communicates content (data) to the Search Engines in an organized manner so they can display the content in the SERPs in an attractive manner.`
    const btnLabel = 'LD-JSON Code'
    return new Card()
        .open(
            `Structured Data`,
            schemaType.replace(/([a-z])([A-Z])/g, '$1 $2'),
            schemaLinks(schemaType, tabUrl, scriptId),
            'icon-ld-json'
        )
        .addParagraph(structuredDataDescription)
        .addTable(typesCount)
        .addExpandableBlock(btnLabel, codeBlock(jsonCode, Mode.json, scriptId))
}
