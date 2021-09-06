// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
// ----------------------------------------------------------------------------
import {Card} from '../card'
import {sectionActions} from '../main'
import {getLines, renderLine, schemaLinks} from "./ld-json-functions"

interface iJsonLD {
    [name: string]: string
}

export interface iJsonLevel {
    depth: number
}

const report = async (
    url: string,
    scripts: any
): Promise<string> => {
    const jsonScripts: iJsonLD[] = scripts as iJsonLD[]
    var report: string = ''

    if(url==='' || jsonScripts.length == 0) {
        return new Card().warning(`No Structured Data found on this page.`)
    }

    jsonScripts.forEach((json, i) => {
        const schemaType = json['@type'] || json['@graph'] || 'Graph'
        const scriptAsString = JSON.stringify(json)
        var level: iJsonLevel = {depth: 0}
        const card = new Card()
        card.open(``, schemaType, schemaLinks(schemaType, url), 'icon-ld-json')
        card.add(`<div class='ld-json'>`)
        getLines(scriptAsString).forEach(line => card.add(renderLine(level, line)))
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

const eventManager = () => undefined

export const actions: sectionActions = {
    injector: injectableScript,
    reporter: report,
    eventManager: eventManager,
}
