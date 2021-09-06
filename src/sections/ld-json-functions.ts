// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
// ----------------------------------------------------------------------------
import {iJsonLevel} from './ld-json'

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
    console.log(`getLines("${script}")`)
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
