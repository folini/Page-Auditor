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
import {Card} from './card'
import {Mode} from './colorCode'
import * as Errors from './sections/errorCards'
import {version as versionNumber} from '../package.json'
import * as JsonLd from './sections/sd'
import * as Scripts from './sections/scripts'
import * as Credits from './sections/credits'
import * as Meta from './sections/meta'
import * as Intro from './sections/intro'
import * as Robots from './sections/robots'

export type NoArgsNoReturnFunc = () => void
export type CodeInjectorFunc = () => any
export type ReportGeneratorFunc = (url: string, data: any, report: Report) => void

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

async function action(section: SectionType, actions: sectionActions) {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true})
    let res: chrome.scripting.InjectionResult[] = []

    const report = new Report(section.reportId)

    try {
        if (actions.codeInjector) {
            res = await chrome.scripting.executeScript({
                target: {tabId: tab.id} as chrome.scripting.InjectionTarget,
                function: actions.codeInjector,
            })
        }
        actions.reportGenerator(tab.url || '', res.length > 0 ? res[0].result : undefined, report)
    } catch (err: any) {
        if (err.message === `Cannot access a chrome:// URL`) {
            report.addCard(Errors.unableToAnalyzeChromeTabs())
        } else {
            report.addCard(Errors.unableToAnalyzePage(tab.url || ''))
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
        tab.addEventListener('click', () => activateReport(section))
        tabsContainer.append(tab)
        const report = document.createElement('div')
        report.id = section.reportId
        report.className = 'inner-report-container'
        reportContainer.append(report)
        showSpinner(report)
    })
    activateReport(sections[0])
    ;(document.getElementById('id-version') as HTMLElement).innerHTML = `Version ${versionNumber}`
})

export const copyTxtToClipboard = (divId: string) => {
    const div = document.getElementById(divId) as HTMLDivElement
    const txt = div.innerText
    navigator.clipboard.writeText(txt)
}

export const formatNumber = (num: number) => num.toLocaleString(undefined, {maximumFractionDigits: 0})
