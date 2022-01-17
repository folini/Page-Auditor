// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------

import * as Card from './card'

let Platform = require('../../package.json');

export const open = (url: string, title: string) => {
    const width = 620
    const height = 800
    const screenWidth = window.screen.width
    const screenHeight = window.screen.height
    const posX = Math.round((screenWidth - width) / 2)
    const posY = Math.round((screenHeight - height) / 2)
    const win = window.open(
        '',
        '_blank',
        `popup=1,width=${width},height=${height},screenX=${posX},screenY=${posY}`
    ) as Window

    // Clone the style sheet and links from the extension window HEAD section
    const styles = [...document.head.querySelectorAll('style,link')].map(element => element.cloneNode(true))
    win.document.head.append(...styles)

    // Create the ToDo Report
    win.document.title = `ToDo Report`
    win.document.body.id = 'id-page-auditor-todo'
    win.document.body.className = 'todo-report'
    const header = win.document.createElement('header')

    const version = win.document.createElement('div')
    version.id = 'id-version'
    version.textContent = `Ver. ${ Platform.version }`

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
    divTodoCritical.className = 'todo-score-card todo-critical'
    divTodoCritical.innerHTML = `<div class='todo-summary-label'>Critical Issues</div><div class='todo-summary-value' id='id-todo-critical'>0</div>`

    const divTodoMedium = win.document.createElement('div')
    divTodoMedium.className = 'todo-score-card todo-medium'
    divTodoMedium.innerHTML = `<div class='todo-summary-label'>Medium Issues</div><div class='todo-summary-value' id='id-todo-medium'>0</div>`

    const divTodoMinor = win.document.createElement('div')
    divTodoMinor.className = 'todo-score-card todo-minor'
    divTodoMinor.innerHTML = `<div class='todo-summary-label'>Minor Issues</div><div class='todo-summary-value' id='id-todo-minor'>0</div>`
    divTodoSummary.append(divTodoCritical, divTodoMedium, divTodoMinor)

    const reportInnerContainer = win.document.createElement('div')
    reportInnerContainer.className = 'inner-report-container show'
    reportOuterContainer.append(context, divTodoSummary, reportInnerContainer)

    // Get all the tips, clone and add them to the ToDo report
    const cardsToCopy = [...document.querySelectorAll(`.box-tip`)]
        .filter(card => parseInt(card.firstElementChild!.getAttribute('data-severity') as string) > severity.minor.min)
        .map(card => card.cloneNode(true) as HTMLElement)

    // Populate 3 score cards
    cardsToCopy.forEach(card => {
        const severityValue = parseInt(card.firstElementChild!.getAttribute('data-severity')!)
        if (severityValue > severity.critical.min) {
            severity.critical.numberOfIssues++
            win.document.getElementById(severity.critical.divId)!.innerHTML = severity.critical.numberOfIssues.toFixed()
        } else if (severityValue > severity.medium.min) {
            severity.medium.numberOfIssues++
            win.document.getElementById(severity.medium.divId)!.innerHTML = severity.medium.numberOfIssues.toFixed()
        } else {
            severity.minor.numberOfIssues++
            win.document.getElementById(severity.minor.divId)!.innerHTML = severity.minor.numberOfIssues.toFixed()
        }
    })

    // Sort report by severity, and display severity for each tip
    cardsToCopy
        .sort(
            (a, b) =>
                parseInt(b.firstElementChild!.getAttribute('data-severity') as string) -
                parseInt(a.firstElementChild!.getAttribute('data-severity') as string)
        )
        .map(child => {
            const labelDiv = child.getElementsByClassName('box-label')!.item(0) as HTMLDivElement
            labelDiv.innerHTML = labelDiv.innerHTML
            labelDiv.style.setProperty(
                '--severity-color',
                severityColorMap(parseInt(labelDiv.getAttribute('data-severity') as string))
            )
            return child
        })
        .forEach(child => reportInnerContainer.append(child))

    const labels = [...reportInnerContainer.getElementsByClassName('box-label')]

    // [Open All] / [Close All] buttons behavior
    btn.addEventListener('click', () => {
        type Cmd = 'open' | 'close'
        const cmd = btn.innerText === 'Open All' ? 'open' : 'close'
        btn.innerText = cmd === 'open' ? 'Close All' : 'Open All'
        labels.forEach(label =>
            cmd === 'open'
                ? Card.Card.openBlock(label.parentElement as HTMLElement )
                : Card.Card.closeBlock(label.parentElement as HTMLElement)
        )
    })

    // Recreate original events for each card
    labels.forEach(label => {
        label.addEventListener('click', () => Card.Card.toggleBlock(label.parentElement as HTMLElement))
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

const severity = {
    critical: {
        divId: 'id-todo-critical',
        max: 100,
        min: 75,
        color: '#ff0000',
        numberOfIssues: 0,
    },
    medium: {
        divId: 'id-todo-medium',
        max: 75,
        min: 25,
        color: '#ffa500',
        numberOfIssues: 0,
    },
    minor: {
        divId: 'id-todo-minor',
        max: 25,
        min: 0,
        color: '#008000',
        numberOfIssues: 0,
    },
}

const severityColorMap = (severityValue: number) =>
    severityValue > severity.critical.min
        ? severity.critical.color
        : severityValue > severity.medium.min
        ? severity.medium.color
        : severity.minor.color
