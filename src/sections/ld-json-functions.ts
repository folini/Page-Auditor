// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {iJsonLD} from './ld-json'
import {Card, iLink} from '../card'
import {Mode} from '../colorCode'
import {disposableId, copyTxtToClipboard} from '../main'

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
    const typesMatches = jsonCode.match(/("@type":\s*")([a-z0-9]*)/gi) ?? []
    const types = typesMatches.map(match => match.replace(/("@type":\s*")/gi, '')).map(type => ['Type', `<a href='https://https://schema.org/${type}/' target='_new'>${type}</a>`])
    const structuredDataDescription = `Structured Data communicates content (data) to the Search Engines in an organized manner so they can display the content in the SERPs in an attractive manner.`
    return new Card()
        .open(`Structured Data`, schemaType, schemaLinks(schemaType, tabUrl, scriptId), 'icon-ld-json')
        .addParagraph(structuredDataDescription)
        .addTable(types)
        .addCodeBlock(jsonCode, Mode.json, scriptId)
}
