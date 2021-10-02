// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card, iLink} from '../card'
import {sectionActions, NoArgsNoReturnFunc, DisplayCardFunc, worker} from '../main'
import {js_beautify} from 'js-beautify'
import {Mode} from '../colorCode'

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
    name: 'Unresolved Javascript Code',
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

const reportGenerator = (tabUrl: string, untypedScripts: any, renderCard: DisplayCardFunc): void => {
    var scripts = untypedScripts as iScript[]

    const scriptClasses: iTrackMatch[] = listOfScriptClasses.map(track => ({
        ...track,
        scripts: [],
    })) as iTrackMatch[]

    if (tabUrl !== '') {
        scriptClasses.push(localJsMatch(tabUrl))
    }

    var trackingItems: iTrackMatch[] = []

    scriptClasses.forEach(cat => {
        scripts.forEach(scr => {
            cat.patterns
                .map(pattern => scr.code.split('\n')[0].match(new RegExp(pattern, 'ig')))
                .filter(match => match !== null && match.length > 0)
                .forEach(() => {
                    if (!scr.done) {
                        cat.scripts.push(scr.code.replace(/\s/g, ' '))
                        scr.done = true
                    }
                })
        })
        if (cat.scripts.length > 0) {
            trackingItems.push(cat)
        }
    })

    scripts
        .filter(scr => !scr.done && scr.code.match(/^https\:\/\//))
        .forEach(scr => {
            unresolvedJS.scripts.push(scr.code)
        })

    if (trackingItems === null) {
        renderCard(new Card().error('No trackers found.'))
    }

    trackingItems = trackingItems.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))

    if (unresolvedJS.scripts.length > 0) {
        trackingItems.push(unresolvedJS)
    }

    trackingItems.map((trackingItem, i) => {
        const links: iLink[] = []
        if (trackingItem.url.length > 0) {
            links.push({url: trackingItem.url, label: 'Reference'})
        }
        trackingItem.scripts = trackingItem.scripts.map(script => js_beautify(script))
        renderCard(
            new Card()
                .open(trackingItem.category, trackingItem.name, links, trackingItem.iconClass)
                .add(
                    `
                    <div class='card-description'>${trackingItem.description}</div>
                    <div class='card-options'>
                    <div class='open-closed-icon closed-icon'></div>
                    <a class='link-in-card left-option n-scripts scrips-closed'>
                        ${trackingItem.scripts.length.toFixed()} script${
                        trackingItem.scripts.length === 1 ? '' : 's'
                    } found. </a>
                    <ul class='hide'>
                        ${trackingItem.scripts
                            .map((script, j) => `<li><div class='code' id='id-script-${i}-${j}'>${script}</div></li>`)
                            .join('')}
                    </ul>
                    </div>`
                )
                .close()
        )
            .then(card => {
                const btns = [...card.querySelectorAll('.link-in-card.n-scripts')] as HTMLAnchorElement[]
                btns.forEach(btn => btn.parentElement?.addEventListener('click', () => toggle(btn)))
                return card
            })
            .then(card => {
                const scriptsToColor = [...card.querySelectorAll('.code')] as HTMLDivElement[]
                scriptsToColor.forEach(scriptDiv =>
                    worker.postMessage({id: scriptDiv.id, mode: Mode.js, code: scriptDiv.innerHTML})
                )
            })
    })
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
        scripts: [],
    }
}

export const actions: sectionActions = {
    codeInjector: codeInjector,
    reportGenerator: reportGenerator,
}
