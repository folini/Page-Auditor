// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {iJsonLevel, iJsonLD} from './ld-json'
import {Card} from '../card'

export const renderLine = (level: iJsonLevel, line: string) => {
    if (line.length === 0) {
        return ''
    }
    level.depth += line.match(/\}|\]/g) !== null ? -1 : 0
    const indent = `margin-left:${(20 * level.depth).toFixed()}px;`
    level.depth += line.match(/\{|\[/g) !== null ? 1 : 0
    var [label, value] = line.split(/\"\s*\:\s*/)
    var renderedLine = ''
    if (label !== undefined && value !== undefined) {
        label = label.replace(/^\"/, '')
        if (value.startsWith('"https://') || value.startsWith('"http://')) {
            const url = value.slice(1, -1)
            value = `"<a href='${url}' target='_new'>${url}</a>"`
        }
        renderedLine = `<span class='label' style='${indent}'>${label}</span>: <span class='value'>${value}</span>`
    } else {
        renderedLine = `<span class='label' style='${indent}'>${line}</span>`
    }
    return `<div>${renderedLine}</div>`
}

export const getLines = (script: string) => {
    if (!script.includes('\n')) {
        // Decompress LD+JSON adding newlines
        script = script
            .replace(/\{/g, '{\n')
            .replace(/\}/g, '\n}')
            .replace(/\,\"/g, ',\n"')
            .replace(/\,\{/g, ',\n{')
            .replace(/\:\[/g, ': [\n')
            .replace(/\]\,/g, '\n],')
            .replace(/\}\]/g, '}\n],')
            .replace(/\\/g, '')
    }
    return script.split('\n').map(line => line.trim())
}

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
    const schemaType: string = (ldJson['@type'] ||
        ldJson['@graph'] ||
        'Graph') as string
    const scriptAsString = JSON.stringify(ldJson)
    var level: iJsonLevel = {depth: 0}
    const card = new Card()
    card.open(``, schemaType, schemaLinks(schemaType, tabUrl), 'icon-ld-json')
    card.add(`<div class='ld-json'>`)
    getLines(scriptAsString).forEach(line => card.add(renderLine(level, line)))
    card.add(`</div>`)
    return card.close()
}
