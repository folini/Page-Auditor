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
    links.forEach(link => win.document.head.appendChild(link.cloneNode(true)))

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

    const reportInnerCOntainer = win.document.createElement('div')
    reportInnerCOntainer.className = 'inner-report-container show'
    reportOuterContainer.append(context, reportInnerCOntainer)

    const cardsToCOpy = [...shadowDoc.body.children]

    cardsToCOpy
        .sort(
            (a, b) =>
                parseInt(b.firstElementChild!.getAttribute('data-severity') as string) -
                parseInt(a.firstElementChild!.getAttribute('data-severity') as string)
        )
        .map(child => {
            const titleDiv = child.getElementsByClassName('tip-title')!.item(0) as HTMLDivElement
            titleDiv.innerHTML = titleDiv.innerHTML.replace(/^Tip #\d+\:/gi, '')
            titleDiv.style.setProperty(
                '--severity-color',
                severityColorMap(parseInt(titleDiv.getAttribute('data-severity') as string))
            )
            return child
        })
        .forEach(child => reportInnerCOntainer.append(child.cloneNode(true)))

    const titles = [...reportInnerCOntainer.getElementsByClassName('tip-title')]

    titles.forEach(title => {
        title.addEventListener('click', () => Card.Card.toggle(title as HTMLElement))
    })

    btn.addEventListener('click', () => {
        btn.innerText = btn.innerText === 'Open All' ? 'Close All' : 'Open All'
        titles.forEach(title => Card.Card.toggle(title as HTMLElement))
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

const severityColorMap = (severity: number) => (severity > 75 ? '#ff0000' : severity > 25 ? '#ffa500' : '#008000')
