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
import * as Meta from './cards/mt'
import * as Robots from './cards/rtsm'
import * as Tips from './tips/tips'
import * as Html from './cards/html'
import * as Spinner from './spinner'
import * as Todo from './todo'
import { iWorkerRenderJob as iRenderTask } from './worker'

export type NoArgsNoReturnFunc = () => void
export type CodeInjectorFunc = (() => any) | null
export type ReportGeneratorFunc = (url: string, data: any, report: Report) => void

export type sectionActions = {
    codeToInject: CodeInjectorFunc
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
        tabId: 'id-html',
        name: 'HTML &amp;<br/>Structure',
        reportId: 'id-report-html',
        actions: Html.actions,
    },
    {
        tabId: 'id-credits',
        name: 'About',
        reportId: 'id-report-credits',
        actions: Credits.actions,
    },
]

const worker = new Worker('worker.js')

document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({active: true, currentWindow: true}).then(tabs => {
        const tab = tabs[0]
        buildNavigationArea(sections)
        showReport(sections[0])

        const reportPromise = sections.map(section => generateReport(section, section.actions, tab))
        Promise.all(reportPromise).then(() => enableTodoBtn(tab))
    })
})

worker.addEventListener('message', (event: MessageEvent<iRenderTask>) => {
    const elem = document.getElementById(event.data.id) as HTMLElement
    elem.innerHTML = event.data.code
    addCopyBtn(elem)
})

document.addEventListener('BeforeUnloadEvent', () => {
    worker.terminate()
})

// ----------------------------------------------------------------------------
// FUNCTIONS
// ----------------------------------------------------------------------------
const buildNavigationArea = (sections: SectionType[]) => {
    const versionDiv = document.getElementById('id-version') as HTMLElement
    versionDiv.innerHTML = `Ver. ${versionNumber}`
    const tabsContainer = document.getElementById('id-tabs') as HTMLUListElement
    const reportContainer = document.getElementById('id-report-outer-container') as HTMLDivElement
    sections.forEach((section, i) => {
        const sep = document.createElement('li')
        sep.className = i === 0 ? 'gap-mini' : 'gap-sep'
        tabsContainer.append(sep)
        const tab = document.createElement('li')
        tab.id = section.tabId
        tab.innerHTML = section.name
        tabsContainer.append(tab)
        const reportDiv = document.createElement('div')
        reportDiv.id = section.reportId
        reportDiv.className = 'inner-report-container'
        reportContainer.append(reportDiv)
        tab.addEventListener('click', () => showReport(section))
        Spinner.show(reportDiv)
    })
}

async function generateReport(section: SectionType, actions: sectionActions, tab: chrome.tabs.Tab) {
    let response: chrome.scripting.InjectionResult[] = []
    const report = new Report(section.reportId)
    let data: any = undefined

    try {
        if (actions.codeToInject !== null) {
            response = await chrome.scripting.executeScript({
                target: {tabId: tab.id} as chrome.scripting.InjectionTarget,
                function: actions.codeToInject,
            })
            data = response.length > 0 ? response[0].result : undefined
        }
        actions.reportGenerator(tab.url || '', data, report)
        return Promise.resolve()
    } catch (err: any) {
        console.error(err)
        if (tab.url?.startsWith('chrome://') || tab.url?.startsWith('edge://')) {
            const card = Errors.browser_UnableToAnalyzeTabs()
            report.addCard(card)
            Tips.Internal.unableToAnalyzeBrowserPages(card)
            report.completed()
        } else {
            const tabUrl = tab?.url || ''
            const card = Errors.browser_UnableToAnalyzePage(tabUrl)
            report.addCard(card)
            Tips.Internal.unableToAnalyzeBrowserPages(card)
            report.completed()
        }
        return Promise.reject()
    }
}

const showReport = (activeSec: SectionType) => {
    sections.forEach(sec => {
        document.getElementById(sec.tabId)!.classList.remove('active')
        document.getElementById(sec.reportId)!.classList.remove('show')
    })
    document.getElementById(activeSec.tabId)?.classList.add('active')
    document.getElementById(activeSec.reportId)?.classList.add('show')
    window.scrollTo(0, 0)
}

export const sendRenderTaskToWorker = (task: iRenderTask) => {
    setTimeout(() => worker.postMessage(task), 100)
    return
}

export const addCopyBtn = (elem: HTMLElement) => {
    const copyDiv = elem.ownerDocument.createElement('div')
    copyDiv.className = 'icon-copy'
    copyDiv.title = 'Copy code to clipboard'
    elem.insertBefore(copyDiv, elem.firstChild)
    copyDiv.addEventListener('click', () => Card.copyToClipboard(elem as HTMLDivElement))
}

export const disposableId = () => 'id-' + Math.random().toString(36).substring(2, 15)

export const formatNumber = (num: number) => num.toLocaleString(undefined, {maximumFractionDigits: 0})

const enableTodoBtn = (tab: chrome.tabs.Tab) => {
    const btn = document.getElementById('btn-todo') as HTMLButtonElement
    btn.style.display = 'block'
    btn.addEventListener('click', () => Todo.open(tab.url!, tab.title!))
}
