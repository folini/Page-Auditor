// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Mode} from './colorCode'
import {htmlEncode} from 'js-htmlencode'
import {html_beautify, js_beautify} from 'js-beautify'
import {sendRenderTaskToWorker, disposableId, compactUrl} from './main'
import {Card, iLink} from './card'

export type CardBlock = HTMLDivElement

export type TableStyle = 'table-style' | 'list-style'

export const paragraph = (text: string, cssClass: string = '', id: string = ''): CardBlock => {
    const div = document.createElement('div')
    if (cssClass !== '') {
        div.classList.add(...cssClass.split(' '))
    }
    if (id !== '') {
        div.id = id
    }
    div.innerHTML = text

    return div
}

export const code = (code: string, mode: Mode, id: string = ''): CardBlock => {
    id = id === '' ? disposableId() : id
    let codeToDisplay = ''
    if (mode === Mode.js && code.startsWith('http')) {
        mode = Mode.txt
    }

    switch (mode) {
        case Mode.html:
        case Mode.xml:
            codeToDisplay = htmlEncode(html_beautify(code))
            sendRenderTaskToWorker({id: id, mode: mode, code: codeToDisplay})
            codeToDisplay = codeToDisplay.replace(/\n/g, '<br/>').replace(/\s/gm, '&nbsp;')
            break

        case Mode.js:
        case Mode.json:
            codeToDisplay = js_beautify(code)
            sendRenderTaskToWorker({id: id, mode: mode, code: codeToDisplay})
            codeToDisplay = codeToDisplay.replace(/\n/g, '<br/>').replace(/\s/gm, '&nbsp;')
            break
        case Mode.txt:
            sendRenderTaskToWorker({id: id, mode: mode, code: code})
            codeToDisplay = code.replace(/\n/g, '<br/>').replace(/\s/gm, '&nbsp;')
    }

    const div = document.createElement('div')
    div.classList.add('code')
    div.id = id
    div.setAttribute('data-mode', mode)
    div.innerHTML = codeToDisplay

    return div
}

export const expandable = (label: string, block: CardBlock, cssClass: string = ''): CardBlock => {
    const boxDiv = document.createElement('div')
    boxDiv.className = 'box-close'
    if (cssClass !== '') {
        boxDiv.classList.add(...cssClass.split(' '))
    }

    const labelDiv = document.createElement('div')
    labelDiv.className = 'box-label'
    labelDiv.innerHTML = label

    const bodyDiv = document.createElement('div')
    bodyDiv.className = 'box-body'
    boxDiv.append(labelDiv, bodyDiv)

    bodyDiv.append(block)
    labelDiv.addEventListener('click', () => Card.toggleBlock(boxDiv))
    return boxDiv
}

export const table = (
    label: string,
    tables: string[][] | HTMLTableElement[],
    tableStyle: TableStyle = 'table-style'
): CardBlock => {
    const boxDiv = document.createElement('div')
    boxDiv.className = `box-table box-close ${tableStyle}`

    const labelDiv = document.createElement('div')
    labelDiv.className = `box-label`
    labelDiv.innerHTML = label

    const bodyDiv = document.createElement('div')
    bodyDiv.className = 'box-body'
    boxDiv.append(labelDiv, bodyDiv)

    if (tables[0] instanceof Array) {
        const strTable = tables as string[][]
        bodyDiv.append(tableFromStrings(strTable))
    } else {
        const tableElements = tables as HTMLTableElement[]
        bodyDiv.append(...tableElements)
    }

    labelDiv.addEventListener('click', () => Card.toggleBlock(boxDiv))
    return boxDiv
}

const tableFromStrings = (stringTable: string[][]): CardBlock => {
    const isUrl = (url: string) => url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')

    const formatCell = (content: string, maxLen: number) =>
        isUrl(content)
            ? `<a href='${content}' title='${content}' target='_new'><code>${compactUrl(content, maxLen)}</code></a>`
            : content

    const table = document.createElement('table')

    let html = ''
    html += '<tbody>'
    html += stringTable
        .map(row =>
            row.length === 1
                ? `<tr>${row.map(col => `<td colspan='99'>${formatCell(col, 55)}</td>`)}</tr>`
                : `<tr>${row.map(col => `<td>${formatCell(col, 55)}</td>`).join('')}</tr>`
        )
        .join('')
    html += '</tbody>'
    table.innerHTML = html
    return table
}

export const tip = (label: string, divs: HTMLElement[], cta: iLink, severity: number = 0) => {
    const boxDiv = document.createElement('div')
    boxDiv.className = 'box-tip box-close'

    const labelDiv = document.createElement('div')
    labelDiv.className = 'box-label'
    labelDiv.innerHTML = label
    labelDiv.setAttribute('data-severity', severity > 0 ? severity.toString() : '')

    const bodyDiv = document.createElement('div')
    bodyDiv.className = 'box-body'
    bodyDiv.append(...divs.filter(div => div.innerHTML.length > 0))

    if (severity > 0) {
        const scaleLevel = document.createElement('div')
        scaleLevel.className = 'tip-scale-level'
        scaleLevel.style.width = `${severity.toFixed()}%`
        scaleLevel.setAttribute('data-scale', `${severity.toFixed()}`)

        const scaleDiv = document.createElement('div')
        scaleDiv.className = 'tip-scale'
        scaleDiv.append(scaleLevel)
        bodyDiv.insertBefore(scaleDiv, bodyDiv.firstChild)

        const scaleTitle = document.createElement('div')
        scaleTitle.innerText = `Severity`
        scaleTitle.className = 'tip-scale-title'
        bodyDiv.insertBefore(scaleTitle, bodyDiv.firstChild)
    }

    const tipBtn = document.createElement('a')
    tipBtn.className = 'large-btn external-link'
    tipBtn.innerHTML = cta.label
    tipBtn.target = '_blank'
    tipBtn.href = cta.url as string

    const tipCTA = document.createElement('div')
    tipCTA.className = 'cta-toolbar'
    tipCTA.append(tipBtn)

    bodyDiv.append(tipCTA)
    boxDiv.append(labelDiv, bodyDiv)
    labelDiv.addEventListener('click', () => Card.toggleBlock(boxDiv))

    return boxDiv
}
