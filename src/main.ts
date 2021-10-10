// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import './default.htm'
import './manifest.json'
import './styles/style.less'
import './logos/Logo_256x256.png'

import {htmlEncode} from 'js-htmlencode'
import {html_beautify, js_beautify} from 'js-beautify'

import {Card} from './card'
import {Mode, colorCode} from './colorCode'
import {version as versionNumber} from '../package.json'
import * as JsonLd from './sections/ld-json'
import * as Scripts from './sections/scripts'
import * as Credits from './sections/credits'
import * as Meta from './sections/meta'
import * as Intro from './sections/intro'
import * as Robots from './sections/robots'

export type DisplayCardFunc = (cardPromises: Promise<Card> | Card) => void
export type NoArgsNoReturnFunc = () => void
export type CodeInjectorFunc = () => any
export type ReportGeneratorFunc = (url: string, data: any, render: DisplayCardFunc) => void

const idLoadingSpinnerDiv = 'id-loading-spinner'

export type sectionActions = {
    codeInjector?: CodeInjectorFunc
    reportGenerator: ReportGeneratorFunc
}

type SectionType = {
    tabId: string
    name: string
    reportId: string
    actions: sectionActions
}

const sections: SectionType[] = [
    {
        tabId: 'id-intro',
        name: 'Intro',
        reportId: 'id-report-intro',
        actions: Intro.actions,
    },
    {
        tabId: 'id-meta',
        name: 'Meta<br/>Tags',
        reportId: 'id-report-meta',
        actions: Meta.actions,
    },
    {
        tabId: 'id-jsonld',
        name: 'Structured<br/>Data',
        reportId: 'id-report-jsonld',
        actions: JsonLd.actions,
    },
    {
        tabId: 'id-scripts',
        name: 'JavaScript<br/>Code',
        reportId: 'id-report-scripts',
        actions: Scripts.actions,
    },
    {
        tabId: 'id-robots',
        name: 'Robots.Txt<br/>Sitemaps',
        reportId: 'id-report-robots',
        actions: Robots.actions,
    },
    {
        tabId: 'id-credits',
        name: 'Credits',
        reportId: 'id-report-credits',
        actions: Credits.actions,
    },
]

const addCardToContainer = (container: HTMLDivElement, card: Card): Promise<HTMLDivElement> => {
    const spinner = document.getElementById(idLoadingSpinnerDiv)
    if (spinner !== null) {
        spinner.remove()
    }
    const div = container.appendChild(card.getDiv())
    return Promise.resolve(div)
}

const displayCard =
    (reportId: string): DisplayCardFunc =>
    async (cardOrPromise: Promise<Card> | Card): Promise<HTMLDivElement> => {
        const container = document.getElementById(reportId) as HTMLDivElement
        try {
            return addCardToContainer(container, await Promise.resolve(cardOrPromise))
        } catch (error) {
            return addCardToContainer(container, await Promise.resolve(new Card().error((error as Error).message)))
        }
    }

async function action(section: SectionType, actions: sectionActions) {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true})
    let res: chrome.scripting.InjectionResult[] = []

    try {
        if (actions.codeInjector) {
            res = await chrome.scripting.executeScript({
                target: {tabId: tab.id} as chrome.scripting.InjectionTarget,
                function: actions.codeInjector,
            })
        }
        actions.reportGenerator(
            tab.url || '',
            res.length > 0 ? res[0].result : undefined,
            displayCard(section.reportId)
        )
    } catch (err: any) {
        const emptyTab = `Cannot access a chrome:// URL`
        const emptyTabMsg = `<b>Page Auditor</b> can not run on empty or internal Chrome tabs.<br/><br/>Please launch <b>Page Auditor for Technical SEO</b> on a regular web page.`
        displayCard(section.reportId)(new Card().error(err.message === emptyTab ? emptyTabMsg : err.message))
    }
}

const activateSection = (activeSec: SectionType) => {
    sections.forEach(sec => {
        document.getElementById(sec.tabId)!.classList.remove('active')
        document.getElementById(sec.reportId)!.classList.remove('show')
    })
    document.getElementById(activeSec.tabId)?.classList.add('active')
    document.getElementById(activeSec.reportId)?.classList.add('show')
    showSpinner(document.getElementById(activeSec.reportId) as HTMLDivElement)
    window.scrollTo(0, 0)
    action(activeSec, activeSec.actions)
}

const showSpinner = (container: HTMLDivElement) => {
    const spinner = document.createElement('div')
    spinner.id = idLoadingSpinnerDiv
    Array.from(container.children).forEach(child => child.remove())
    container.append(spinner)
}

export const worker = new Worker('worker.js')

worker.onmessage = event => {
    let id = event.data.id
    let code = event.data.code
    document.getElementById(id)!.innerHTML = code
}

export const sendTaskToWorker = (divId: string, mode: Mode, code: string) => {
    setTimeout(() => worker.postMessage({id: divId, mode: mode, code: code}), 100)
    return
}

export const disposableId = () => 'id-' + Math.random().toString(36).substring(2, 15)

document.addEventListener('BeforeUnloadEvent', () => {
    worker.terminate()
})

document.addEventListener('DOMContentLoaded', () => {
    const tabsContainer = document.getElementById('id-tabs') as HTMLUListElement
    const reportContainer = document.getElementById('id-report-outer-container') as HTMLDivElement
    sections.forEach((section, i) => {
        const sep = document.createElement('li')
        sep.className = i === 0 ? 'gap-mini' : 'gap-sep'
        tabsContainer.append(sep)
        const tab = document.createElement('li')
        tab.id = section.tabId
        tab.innerHTML = section.name
        tab.addEventListener('click', () => activateSection(section))
        tabsContainer.append(tab)
        const report = document.createElement('div')
        report.id = section.reportId
        report.className = 'inner-report-container'
        reportContainer.append(report)
        showSpinner(report)
    })
    activateSection(sections[0])
    ;(document.getElementById('id-version') as HTMLElement).innerHTML = `Version ${versionNumber}`
})

export const copyTxtToClipboard = (divId: string) => {
    const div = document.getElementById(divId) as HTMLDivElement
    const txt = div.innerText
    navigator.clipboard.writeText(txt)
}

export const codeBlock = (code: string, mode: Mode, id: string = '') => {
    const delayedMode = id !== ''
    let codeToDisplay = code
    if (mode === Mode.js && code.startsWith('http')) {
        mode = Mode.txt
    }

    switch (mode) {
        case Mode.html:
        case Mode.xml:
            codeToDisplay = htmlEncode(html_beautify(code))
            if (delayedMode) {
                sendTaskToWorker(id, mode, codeToDisplay)
                codeToDisplay = codeToDisplay.replace(/\n/g, '<br/>').replace(/\s/gm, '&nbsp;')
            } else {
                codeToDisplay = colorCode(codeToDisplay, mode)
            }
            break

        case Mode.js:
        case Mode.json:
            codeToDisplay = js_beautify(code)
            if (delayedMode) {
                sendTaskToWorker(id, mode, codeToDisplay)
                codeToDisplay = codeToDisplay.replace(/\n/g, '<br/>').replace(/\s/gm, '&nbsp;')
            } else {
                codeToDisplay = colorCode(codeToDisplay, mode)
            }
            break
        case Mode.txt:
            if (delayedMode) {
                sendTaskToWorker(id, mode, codeToDisplay)
                codeToDisplay = code.replace(/\n/g, '<br/>').replace(/\s/gm, '&nbsp;')
            } else {
                codeToDisplay = colorCode(codeToDisplay, mode)
            }
    }

    return `<div class="code"${id ? `id='${id}'` : ''}>${codeToDisplay}</div>`
}
