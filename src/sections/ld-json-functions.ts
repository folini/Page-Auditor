// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {iJsonLD} from './ld-json'
import {Card, iLink} from '../card'
import {Mode} from '../colorCode'
import {js_beautify} from 'js-beautify'
import {sendTaskToWorker as assignTask2Worker, disposableId, copyTxtToClipboard} from '../main'

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
        url: `https://shema.org/${schemaName}`,
        label: `Schema`,
    },
]

export const ldJsonCard = (ldJson: iJsonLD, tabUrl: string) => {
    const schemaType: string = (ldJson['@type'] || 'Graph') as string
    const scriptId = disposableId()
    const scriptAsString = JSON.stringify(ldJson)
    const jsonCode = js_beautify(scriptAsString)
    assignTask2Worker(scriptId, Mode.json, jsonCode, false)
    return new Card()
        .open(`Structured Data`, schemaType, schemaLinks(schemaType, tabUrl, scriptId), 'icon-ld-json')
        .add(`<div class='code x-scrollable' id='${scriptId}'>${jsonCode}</div>`)
}
