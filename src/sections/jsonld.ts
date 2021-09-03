// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
// ----------------------------------------------------------------------------
import {Card} from '../card'
import {sectionActions} from '../main'

interface iJsonLD {
    [name: string]: string
}

var level = 0

const renderLine = (line: string) => {
    if (line.length === 0) {
        return ''
    }
    level += line.match(/\}|\]/g) !== null ? -1 : 0
    const indent = `margin-left:${(20 * level).toFixed()}px;`
    level += line.match(/\{|\[/g) !== null ? 1 : 0
    var renderedLine = ''
    var [label, value] = line.split(/\"\s*\:\s*/)
    if (label !== undefined && value !== undefined) {
        label = label.replace(/^\"/, '')
        if (value.startsWith('"https://') || value.startsWith('"http://')) {
            const url = value.slice(1, -1)
            value = `"<a href='${url}' target='_new'>${url}</a>"`
        }
        renderedLine = `<span class='label' style='${indent}'>${label}</span>:
                <span class='value'>${value}</span>`
    } else {
        renderedLine = `<span class='label' style='${indent}'>${line}</span>`
    }
    return `<div>${renderedLine}</div>`
}

const getLines = (script: string) => {
    if (!script.includes('\n')) {
        // Decompress LD+JSON without newlines
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

const report = async (
    url: string | undefined,
    scripts: any
): Promise<string> => {
    const jsonScripts: iJsonLD[] = scripts as iJsonLD[]
    var report: string = ''

    if(url===undefined || jsonScripts.length == 0) {
        return new Card().warning(`No Structured Data found on this page.`)
    }

    jsonScripts.forEach((json, i) => {
        const schemaType = json['@type'] || json['@graph'] || 'Graph'
        const scriptAsString = JSON.stringify(json)

        const links = [
            {
            url: `https://validator.schema.org/#url=${encodeURI(url)}`,
            label: `Validate`,               
            },
            {
            url: `https://shema.org/${schemaType}`,
            label: `Schema`,
            },
        ]

        const card = new Card()
        card.open(``, schemaType, links, 'icon-ld-json')
        card.add(`<div class='ld-json'>`)
        getLines(scriptAsString).forEach(line => card.add(renderLine(line)))
        card.add(`</div>`)
        report += card.close()
    })

    return report
}

export const injectableScript = (): iJsonLD[] => {
    return [...document.scripts]
        .filter(s => s.type === 'application/ld+json')
        .map(s => JSON.parse(s.text.trim()))
}

export const actions: sectionActions = {
    injector: injectableScript,
    reporter: report,
    eventManager: undefined,
}
