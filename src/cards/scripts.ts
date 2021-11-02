// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card, iLink, CardKind} from '../card'
import {Report} from '../report'
import {sectionActions, NoArgsNoReturnFunc, disposableId} from '../main'
import {Mode} from '../colorCode'
import {codeBlock} from '../codeBlock'
import {Errors} from './errors'
import {Tips} from './tips'
import {Info} from './info'

const listOfScriptClasses = require('../jsons/scriptClasses.json') as iTrackClass[]

interface iTrackClass {
    patterns: string[]
    url: string
    name: string
    category: string
    iconClass: string
    description: string
}

interface iTrackMatch extends iTrackClass {
    scripts: string[]
}

interface iScript {
    code: string
    done: boolean
}

const unresolvedJS: iTrackMatch = {
    patterns: [],
    name: 'Unrecognized Javascript Code',
    category: 'JavaScript',
    iconClass: 'icon-unclassified',
    description: 'Page Auditor for Technical SEO is not yet able to classify the following JavaScript code.',
    url: '',
    scripts: [],
}

const codeInjector: NoArgsNoReturnFunc = (): iScript[] => {
    return [...document.scripts]
        .filter(s => s.type !== 'application/ld+json')
        .map(s => (s.src === '' ? s.text : s.src))
        .filter(Boolean)
        .map(s => ({code: s, done: false})) as iScript[]
}

const reportGenerator = (tabUrl: string, untypedScripts: any, report: Report): void => {
    var scripts = untypedScripts as iScript[]

    const scriptClasses: iTrackMatch[] = listOfScriptClasses.map(track => ({
        ...track,
        scripts: [],
    })) as iTrackMatch[]

    if (tabUrl !== '') {
        scriptClasses.push(localJsMatch(tabUrl))
    }

    var discoveredScripts: iTrackMatch[] = []

    scriptClasses.forEach(cat => {
        scripts.forEach(scr =>
            cat.patterns
                .map(pattern => scr.code.split('\n')[0].match(new RegExp(pattern, 'ig')))
                .filter(match => match !== null && match.length > 0)
                .forEach(() => {
                    if (!scr.done) {
                        cat.scripts.push(scr.code.replace(/\s/g, ' '))
                        scr.done = true
                    }
                })
        )
        if (cat.scripts.length > 0) {
            discoveredScripts.push(cat)
        }
    })

    scripts
        .filter(scr => !scr.done && scr.code.match(/^https\:\/\//))
        .forEach(scr => unresolvedJS.scripts.push(scr.code))

    if (discoveredScripts === null) {
        const card = Errors.script_NotFound()
        report.addCard(card)
        Tips.internalError(card)
    }

    discoveredScripts = discoveredScripts.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))

    if (unresolvedJS.scripts.length > 0) {
        discoveredScripts.push(unresolvedJS)
    }

    discoveredScripts.forEach(discoveredItem => {
        const links: iLink[] = []
        if (discoveredItem.url.length > 0) {
            links.push({url: discoveredItem.url, label: 'Reference'})
        }
        const plural = discoveredItem.scripts.length > 1 ? 's' : ''
        const btnLabel = `${discoveredItem.scripts.length.toFixed()} Script${plural}`
        const block = discoveredItem.scripts.map((script, j) => codeBlock(script, Mode.js, disposableId())).join('')
        const card = new Card(CardKind.report)
            .open(discoveredItem.category, discoveredItem.name, discoveredItem.iconClass)
            .addParagraph(discoveredItem.description)
            .addExpandableBlock(btnLabel, block)
            .addCTA(links)
            .tag('card-ok')
        report.addCard(card)
    })

    if (discoveredScripts.length === 0) {
        const card = Info.noScriptsOnThisPage()
        report.addCard(card)
    }
}

const localJsMatch = (url: string): iTrackMatch => {
    var domainParts = url.split('/')[2].split('.')
    domainParts = domainParts.splice(-2)
    var patterns = [`(.|/)${domainParts.join('.')}/`]
    patterns.push(`(.|/)${domainParts[0]}cdn.${domainParts[1]}/`)
    patterns.push(`(.|/)cdn${domainParts[0]}.${domainParts[1]}/`)
    patterns.push(`(.|/)static${domainParts[0]}.${domainParts[1]}/`)
    patterns.push(`(.|/)${domainParts[0]}static.${domainParts[1]}/`)

    return {
        patterns: patterns,
        name: 'Local Javascript Code',
        category: 'JavaScript',
        iconClass: 'icon-js',
        description: 'Javascript Code local to this website.',
        url: '',
        scripts: [],
    }
}

export const actions: sectionActions = {
    codeInjector: codeInjector,
    reportGenerator: reportGenerator,
}
