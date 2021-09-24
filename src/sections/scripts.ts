// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card, iLink} from '../card'
import {sectionActions} from '../main'
import {htmlEncode} from 'js-htmlencode'
import {js_beautify} from 'js-beautify'

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
    matches: string[]
}

interface iScript {
    code: string
    done: boolean
}

const unresolvedJS: iTrackMatch = {
    patterns: [],
    name: 'Unresolved Javascript Code',
    category: 'JavaScript',
    iconClass: 'icon-unclassified',
    description: 'Page Auditor for Technical SEO is not yet able to classify the following JavaScript code.',
    url: '',
    matches: [],
}

const codeInjector = (): iScript[] => {
    return [...document.scripts]
        .filter(s => s.type !== 'application/ld+json')
        .map(s => (s.src === '' ? s.text : s.src))
        .filter(Boolean)
        .map(s => ({code: s, done: false})) as iScript[]
}

const reportGenerator = async (tabUrl: string, untypedScripts: any): Promise<Promise<Card>[]> => {
    var scripts = untypedScripts as iScript[]

    const result: Promise<Card>[] = []

    const scriptClasses: iTrackMatch[] = listOfScriptClasses.map(track => ({
        ...track,
        matches: [],
    })) as iTrackMatch[]

    if (tabUrl !== '') {
        scriptClasses.push(localJsMatch(tabUrl))
    }

    var trackingItems: iTrackMatch[] = []

    scriptClasses.forEach(cat => {
        scripts.forEach(scr => {
            cat.patterns
                .map(pattern => scr.code.match(new RegExp(pattern, 'ig')))
                .filter(match => match !== null && match.length > 0)
                .forEach(() => {
                    if (!scr.done) {
                        cat.matches.push(scr.code.replace(/\s/g, ' '))
                        scr.done = true
                    }
                })
        })
        if (cat.matches.length > 0) {
            trackingItems.push(cat)
        }
    })

    scripts
        .filter(scr => !scr.done && scr.code.match(/^https\:\/\//))
        .forEach(scr => {
            unresolvedJS.matches.push(scr.code)
        })

    var report: string = ''

    if (trackingItems === null) {
        throw new Error('No trackers found.')
    }

    trackingItems = trackingItems.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))

    if (unresolvedJS.matches.length > 0) {
        trackingItems.push(unresolvedJS)
    }

    trackingItems.forEach((t, i) => {
        const links: iLink[] = []
        if (t.url.length > 0) {
            links.push({url: t.url, label: 'Reference'})
        }
        const card = new Card()
        card.open(t.category, t.name, links, t.iconClass)
        card.add(
            `
            <div class='card-description'>${t.description}</div>
            <div class='card-options'>
            <div class='open-closed-icon closed-icon'></div>
            <a class='link-in-card left-option n-scripts scrips-closed'>
                ${t.matches.length.toFixed()} script${t.matches.length === 1 ? '' : 's'} found. </a>
            <ul class='hide'>
                ${t.matches
                    .map(script => {
                        const lines: string = js_beautify(script)
                            .split('\n')
                            .map(line => htmlEncode(line))
                            .join('</br>')
                            .replace(/\s/g, '&nbsp;')
                        return `<li><div class='code'>${lines}</div></li>`
                    })
                    .join('')}
            </ul>
            </div>`
        ).close()
        result.push(Promise.resolve(card))
    })
    return result
}

const eventManager = () => {
    const btns = [...document.querySelectorAll('.link-in-card.n-scripts')] as HTMLAnchorElement[]
    btns.forEach(btn => btn.parentElement?.addEventListener('click', () => toggle(btn)))
}

const toggle = (btn: HTMLAnchorElement) => {
    const ul: HTMLUListElement = btn.parentElement?.children[2] as HTMLUListElement
    if (ul === undefined) {
        return
    }
    const icon = btn.parentElement?.children[0] as HTMLUListElement
    if (ul.classList.contains('hide')) {
        ul.classList.remove('hide')
        ul.classList.add('show')
        icon.classList.replace('closed-icon', 'open-icon')
    } else {
        ul.classList.remove('show')
        ul.classList.add('hide')
        icon.classList.replace('open-icon', 'closed-icon')
    }
}

const localJsMatch = (url: string): iTrackMatch => {
    var domainParts = url.split('/')[2].split('.')
    if (domainParts[0] === 'www') {
        domainParts = domainParts.splice(1)
    }
    var patterns = [`.${domainParts.join('.')}/`]

    if (domainParts.length === 2) {
        patterns.push(`.${domainParts[0]}cdn.${domainParts[1]}/`)
    }

    return {
        patterns: patterns,
        name: 'Local Javascript Code',
        category: 'JavaScript',
        iconClass: 'icon-js',
        description: 'Javascript Code local to this website.',
        url: '',
        matches: [],
    }
}

export const actions: sectionActions = {
    codeInjector: codeInjector,
    reportGenerator: reportGenerator,
    eventManager: eventManager,
}
