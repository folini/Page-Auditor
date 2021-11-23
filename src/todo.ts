// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import * as Card from './card'
import {version as versionNumber} from '../package.json'

const shadowDoc: Document = document.implementation.createHTMLDocument('ToDo List')

export const open = (url: string, title: string) => {
    const width = 600
    const height = 800
    const screenWidth = window.screen.width
    const screenHeight = window.screen.height
    const posX = Math.round((screenWidth - width) / 2)
    const posY = Math.round((screenHeight - height) / 2)
    const win = window.open(
        '',
        '_blank',
        `popup,width=${width},height=${height},screenX=${posX},screenY=${posY}`
    ) as Window
    const style = document.head.querySelector('style')?.cloneNode(true) as HTMLStyleElement
    win.document.head.appendChild(style)

    const links = [...document.head.querySelectorAll('link')]
    links.forEach(link => win.document.head.appendChild(link)) //.cloneNode(true)))

    win.document.body.id = 'id-page-auditor-todo'
    win.document.body.className = 'todo-report'
    const header = win.document.createElement('header')

    const version = win.document.createElement('div')
    version.id = 'id-version'
    version.textContent = `Ver. ${versionNumber}`

    const btn = win.document.createElement('button')
    btn.id = 'btn-open-close'
    btn.classList.add('small-btn', 'inverted-colors')
    btn.textContent = `Open All`

    const preTitle = win.document.createElement('div')
    preTitle.className = 'pre-title'
    preTitle.innerHTML = 'Page Auditor for Technical SEO'

    const h1 = win.document.createElement('h1')
    h1.innerHTML = 'ToDo List'

    const postTitle = win.document.createElement('div')
    postTitle.className = 'post-title'
    postTitle.innerHTML = 'an open source project by Franco Folini'

    header.append(version, btn, preTitle, h1, postTitle)

    const main = win.document.createElement('main')
    win.document.body.append(header, main)

    const reportOuterContainer = win.document.createElement('div')
    reportOuterContainer.id = 'id-report-outer-container'
    main.append(reportOuterContainer)

    const context = win.document.createElement('div')
    context.id = 'id-context'
    context.innerHTML = title

    const urlDiv = win.document.createElement('div')
    urlDiv.id = 'id-url'
    urlDiv.innerHTML = url
    context.append(urlDiv)

    const divTodoSummary = win.document.createElement('div')
    divTodoSummary.className = 'todo-summary'
    const divTodoCritical = win.document.createElement('div')
    divTodoCritical.className = 'todo-class todo-critical'
    divTodoCritical.innerHTML = `<div class='todo-summary-label'>Critical Issues</div><div class='todo-summary-value' id='id-todo-critical'>0</div>`
    const divTodoMedium = win.document.createElement('div')
    divTodoMedium.className = 'todo-class todo-medium'
    divTodoMedium.innerHTML = `<div class='todo-summary-label'>Medium Issues</div><div class='todo-summary-value' id='id-todo-medium'>0</div>`
    const divTodoMinor = win.document.createElement('div')
    divTodoMinor.className = 'todo-class todo-minor'
    divTodoMinor.innerHTML = `<div class='todo-summary-label'>Minor Issues</div><div class='todo-summary-value' id='id-todo-minor'>0</div>`
    divTodoSummary.append(divTodoCritical, divTodoMedium, divTodoMinor)

    const reportInnerCOntainer = win.document.createElement('div')
    reportInnerCOntainer.className = 'inner-report-container show'
    reportOuterContainer.append(context, divTodoSummary, reportInnerCOntainer)

    const cardsToCopy = [...shadowDoc.body.children].filter(
        card => parseInt(card.firstElementChild!.getAttribute('data-severity') as string) > severity.minor.min
    )

    cardsToCopy.forEach(card => {
        const severityValue = parseInt(card.firstElementChild!.getAttribute('data-severity')!)
        if (severityValue > severity.critical.min) {
            severity.critical.value++
            win.document.getElementById(severity.critical.divId)!.innerHTML = severity.critical.value.toFixed()
        } else if (severityValue > severity.medium.min) {
            severity.medium.value++
            win.document.getElementById(severity.medium.divId)!.innerHTML = severity.medium.value.toFixed()
        } else {
            severity.minor.value++
            win.document.getElementById(severity.minor.divId)!.innerHTML = severity.minor.value.toFixed()
        }
    })

    cardsToCopy
        .sort(
            (a, b) =>
                parseInt(b.firstElementChild!.getAttribute('data-severity') as string) -
                parseInt(a.firstElementChild!.getAttribute('data-severity') as string)
        )
        .map(child => {
            const titleDiv = child.getElementsByClassName('tip-title')!.item(0) as HTMLDivElement
            titleDiv.innerHTML = titleDiv.innerHTML
            titleDiv.style.setProperty(
                '--severity-color',
                severityColorMap(parseInt(titleDiv.getAttribute('data-severity') as string))
            )
            return child
        })
        .forEach(child => reportInnerCOntainer.append(child.cloneNode(true)))

    const titles = [...reportInnerCOntainer.getElementsByClassName('label-close')]

    titles.forEach(title => {
        title.addEventListener('click', () => Card.Card.toggleBlock(title as HTMLElement))
    })

    btn.addEventListener('click', () => {
        type Cmd = 'open' | 'close'
        const cmd = btn.innerText === 'Open All' ? 'open' : 'close'
        btn.innerText = cmd === 'open' ? 'Close All' : 'Open All'
        titles.forEach(title =>
            cmd === 'open' ? Card.Card.openBlock(title as HTMLElement) : Card.Card.closeBlock(title as HTMLElement)
        )
    })

    const codeBlocks = [...document.getElementsByClassName('code')] as HTMLElement[]
    codeBlocks.forEach(block => {
        const todoBlock = win.document.getElementById(block.id as string)
        if (todoBlock !== null) {
            const originalHtml = block.innerHTML
            todoBlock.innerHTML = originalHtml
            const copyDiv = todoBlock.firstElementChild!
            copyDiv.addEventListener('click', () => Card.Card.copyToClipboard(todoBlock))
        }
    })
}

export const add = (tip: HTMLElement) => shadowDoc.body.append(tip)

const severity = {
    critical: {
        divId: 'id-todo-critical',
        max: 100,
        min: 75,
        color: '#ff0000',
        value: 0,
    },
    medium: {
        divId: 'id-todo-medium',
        max: 75,
        min: 25,
        color: '#ffa500',
        value: 0,
    },
    minor: {
        divId: 'id-todo-minor',
        max: 25,
        min: 0,
        color: '#008000',
        value: 0,
    },
}

const severityColorMap = (severityValue: number) =>
    severityValue > severity.critical.min
        ? severity.critical.color
        : severityValue > severity.medium.min
        ? severity.medium.color
        : severity.minor.color
