// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {iJsonLevel, iJsonLD} from './ld-json'
import {Card} from '../card'
import {htmlEncode} from 'js-htmlencode'
import {js_beautify} from 'js-beautify'

export const schemaLinks = (schemaName: string, ldjsonUrl: string) => [
    {
        url: `https://validator.schema.org/#url=${encodeURI(ldjsonUrl)}`,
        label: `Validate`,
    },
    {
        url: `https://shema.org/${schemaName}`,
        label: `Schema`,
    },
]

export const ldJsonCard = (ldJson: iJsonLD, tabUrl: string) => {
    const schemaType: string = (ldJson['@type'] || 'Graph') as string
    const scriptAsString = JSON.stringify(ldJson)
    return new Card()
        .open(``, schemaType, schemaLinks(schemaType, tabUrl), 'icon-ld-json')
        .add(`<div class='code x-scrollable'>`)
        .add(
            js_beautify(scriptAsString)
                .split('\n')
                .map(line => htmlEncode(line))
                .join('</br>')
                .replace(/\s/g, '&nbsp;')
        )
        .add(`</div>`)
        .close()
}
