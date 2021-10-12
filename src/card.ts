// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {access} from 'fs'
import {codeBlock} from './codeBlock'
import {Mode} from './colorCode'

export interface iLink {
    label: string
    url?: string
    onclick?: () => void
}

export enum CardKind {
    report,
    error,
    suggestion,
    warning,
}

export class Card {
    #div: HTMLDivElement
    #head: HTMLHeadingElement
    #body: HTMLDivElement
    #kind: CardKind

    constructor() {
        this.#div = document.createElement('div')
        this.#div.className = `box-card`
        this.#head = document.createElement('h2')
        this.#head.className = `cardTitle`
        const hr = document.createElement('hr')
        this.#body = document.createElement('div')
        this.#body.className = 'card-body'
        this.#div.append(this.#head, hr, this.#body)

        this.#kind = CardKind.report
    }

    public open(preTitle: string, title: string, links: iLink[], cssClass: string) {
        const btnsContainer = document.createElement('div')
        btnsContainer.className = 'card-toolbar'
        links.forEach(link => {
            const btn = document.createElement('a')
            btn.className = 'small-btn'
            btn.innerHTML = link.label
            if (link.url) {
                btn.href = link.url
                btn.target = '_blank'
            }
            if (link.onclick) {
                btn.onclick = link.onclick
            }
            btnsContainer.append(btn)
        })

        this.#div.classList.add(cssClass)
        const preTitleDiv = document.createElement('div')
        preTitleDiv.className = 'cardPreTitle'
        preTitleDiv.innerHTML = preTitle
        const titleString = document.createElement('span')
        titleString.className = 'cardTitleString'
        titleString.innerHTML = title
        this.#head.append(preTitleDiv, titleString, btnsContainer)
        return this
    }

    public getDiv() {
        return this.#div
    }

    public getKind() {
        return this.#kind
    }

    public setKind(value: CardKind) {
        this.#kind = value
        return this
    }

    public setTitle(title: string) {
        const h2span = this.#div.querySelector('.cardTitleString') as HTMLSpanElement
        h2span.innerHTML = title
        return this
    }

    public setPreTitle(title: string) {
        const h2div = this.#div.querySelector('.cardPreTitle') as HTMLDivElement
        h2div.innerHTML = title
        return this
    }

    public error(msg: string) {
        return this.open('', '', [], 'icon-error').addParagraph(msg).setKind(CardKind.error).setPreTitle('Error')
    }

    public suggestion() {
        return this.open('', '', [], 'icon-suggestion').setKind(CardKind.suggestion).setPreTitle('Suggestion')
    }

    public addCTA(links: iLink[]) {
        return this.add(
            `<div class='cta-toolbar'>${links
                .map(link => `<a class='large-btn' href='${link.url}' target='_blank'>${link.label}</a>`)
                .join(' ')}</div>`
        )
    }

    public warning(msg: string) {
        return this.open('', '', [], 'icon-warning').addParagraph(msg).setKind(CardKind.warning).setPreTitle('Warning')
    }

    public add(str: string) {
        const tmpDiv = document.createElement('div')
        tmpDiv.innerHTML = str
        if (str.length > 0) {
            this.#body.append(...tmpDiv.childNodes)
        }
        return this
    }

    public addCodeBlock(code: string, mode: Mode, id: string = '') {
        return this.add(codeBlock(code, mode, id))
    }

    public addParagraph(text: string) {
        return this.add(`<div>${text}</div>`)
    }

    public addTable(table: string[][]) {
        let html = ''
        html += '<table class="card-table">'
        html += '<tbody>'
        html += table.map(row => `<tr>${row.map(col => `<td>${col}</td>`).join('')}</tr>`).join('')
        html += '</tbody>'
        html += '</table>'
        return this.add(`<div>${html}</div>`)
    }
}
