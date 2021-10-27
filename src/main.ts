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

import {Report} from './report'
import {Mode} from './colorCode'
import {Errors} from './cards/errors'
import {Card} from './card'
import {version as versionNumber} from '../package.json'
import * as JsonLd from './cards/sd'
import * as Scripts from './cards/scripts'
import * as Credits from './cards/about'
import * as Meta from './cards/meta-tags'
import * as Intro from './cards/intro'
import * as Robots from './cards/robots'
import {Tips} from './cards/tips'

export type NoArgsNoReturnFunc = () => void
export type CodeInjectorFunc = () => any
export type ReportGeneratorFunc = (url: string, data: any, report: Report) => void

const classLoadingSpinnerDiv = 'loading-spinner'

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
        name: 'About',
        reportId: 'id-report-credits',
        actions: Credits.actions,
    },
]

async function action(section: SectionType, actions: sectionActions) {
    let res: chrome.scripting.InjectionResult[] = []
    const report = new Report(section.reportId)
    let tab: chrome.tabs.Tab | undefined = undefined

    try {
        ;[tab] = await chrome.tabs.query({active: true, currentWindow: true})
        if (actions.codeInjector) {
            res = await chrome.scripting.executeScript({
                target: {tabId: tab.id} as chrome.scripting.InjectionTarget,
                function: actions.codeInjector,
            })
        }
        const tabUrl = tab.url || ''
        const data = res.length > 0 ? res[0].result : undefined
        Tips.resetTipCounter()
        actions.reportGenerator(tabUrl, data, report)
    } catch (err: any) {
        if (err.message === `Cannot access a chrome:// URL`) {
            const card = Errors.chrome_UnableToAnalyzeTab()
            report.addCard(card)
            Tips.unableToAnalyzeChromeBrowserPages(card)
        } else {
            const tabUrl = tab?.url || ''
            const card = Errors.chrome_UnableToAnalyzePage(tabUrl)
            report.addCard(card)
            Tips.unableToAnalyzeChromeBrowserPages(card)
        }
    }
}

const activateReport = (activeSec: SectionType) => {
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
    Array.from(container.children).forEach(child => child.remove())
    const spinner = document.createElement('div')
    spinner.className = classLoadingSpinnerDiv
    container.append(spinner)
}

export const worker = new Worker('worker.js')

worker.onmessage = event => {
    let id = event.data.id
    let code = event.data.code
    const elem = document.getElementById(id) as HTMLElement
    elem.innerHTML = code
    const copyDiv = document.createElement('div')
    copyDiv.className = 'icon-copy'
    copyDiv.title = 'Copy code'
    elem.insertBefore(copyDiv, elem.firstChild)
    copyDiv.addEventListener('click', () => Card.copyToClipboard(elem as HTMLDivElement))
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
        tab.addEventListener('click', () => activateReport(section))
        tabsContainer.append(tab)
        const reportDiv = document.createElement('div')
        reportDiv.id = section.reportId
        reportDiv.className = 'inner-report-container'
        reportContainer.append(reportDiv)
        showSpinner(reportDiv)
    })
    activateReport(sections[0])
    ;(document.getElementById('id-version') as HTMLElement).innerHTML = `Version ${versionNumber}`
})

export const formatNumber = (num: number) => num.toLocaleString(undefined, {maximumFractionDigits: 0})

export const fileExists = (url: string) => fetch(url, {method: 'HEAD', cache: 'no-store'}).then(r => r.status === 200)
