// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {disposableId} from './main'
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
    info,
}

export class Card {
    #div: HTMLDivElement
    #head: HTMLHeadingElement
    #body: HTMLDivElement
    #kind: CardKind
    #footer: HTMLDivElement

    constructor() {
        this.#div = document.createElement('div')
        this.#div.className = `box-card`
        this.#head = document.createElement('h2')
        this.#head.className = `cardTitle`
        const hr = document.createElement('hr')
        this.#body = document.createElement('div')
        this.#body.className = 'card-body'
        this.#footer = document.createElement('div')
        this.#footer.className = 'card-footer hide'
        this.#div.append(this.#head, hr, this.#body, this.#footer)

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

    public error() {
        return this.open('Error', '', [], 'icon-error').setKind(CardKind.error)
    }

    public suggestion() {
        return this.open('Suggestion', '', [], 'icon-suggestion').setKind(CardKind.suggestion)
    }

    public info() {
        return this.open('Info', '', [], 'icon-info').setKind(CardKind.info)
    }

    public addCTA(links: iLink[]) {
        return this.#add(
            `<div class='cta-toolbar'>${links
                .map(link => `<a class='large-btn' href='${link.url}' target='_blank'>${link.label}</a>`)
                .join(' ')}</div>`
        )
    }

    #add(str: string) {
        const tmpDiv = document.createElement('div')
        tmpDiv.innerHTML = str
        if (str.length > 0) {
            this.#body.append(...tmpDiv.childNodes)
        }
        return this
    }

    public addCodeBlock(code: string, mode: Mode, id: string = '') {
        return this.addParagraph(codeBlock(code, mode, id))
    }

    public addExpandableBlock(btnLabel: string, block: string) {
        const divId = disposableId()
        const btnId = disposableId()
        this.addParagraph(`<a class='large-btn btn-expandable' id='${btnId}'>${btnLabel}</a>`, 'cta-toolbar')
        this.addParagraph(block, 'code-snippets', divId)
        const btn = this.#div.querySelector(`#${btnId}`) as HTMLAnchorElement
        const div = this.#div.querySelector(`#${divId}`) as HTMLDivElement
        div.style.display = 'none'
        btn.addEventListener('click', () => this.#toggle(btn, div))
        return this
    }

    public addParagraph(text: string | undefined, cssClass: string = '', id: string = '') {
        return text === undefined
            ? this
            : this.#add(
                  `<div${cssClass !== '' ? ` class='${cssClass}'` : ``}${id === '' ? '' : ` id='${id}'`}>${text}</div>`
              )
    }

    public addTable(title: string, table: string[][]) {
        let html = ''
        html += '<table class="card-table">'
        if (title.length > 0) {
            html += `<thead>`
            html += `<tr>`
            html += `<th colspan='2'>${title}</th>`
            html += `</tr>`
            html += `</thead>`
        }
        html += '<tbody>'
        html += table.map(row => `<tr>${row.map(col => `<td>${col}</td>`).join('')}</tr>`).join('')
        html += '</tbody>'
        html += '</table>'
        return this.#add(`<div>${html}</div>`)
    }

    public tag(tag: string) {
        if (tag === 'card-ok' && this.#head.classList.contains('card-fix')) {
            return this
        }
        this.#head.classList.add(tag)
        return this
    }
    public addTip(title: string, txts: string[], cta: iLink = {label: ''}) {
        const tipDiv = document.createElement('div')
        tipDiv.className = 'card-tip'
        const tipTitle = document.createElement('div')
        tipTitle.className = 'tip-title'
        tipTitle.innerHTML = title
        const tipBody = document.createElement('div')
        tipBody.className = 'tip-body'
        tipBody.innerHTML = txts.map(txt => `<div>${txt}</div>`).join('')
        const tipCTA = document.createElement('div')
        tipCTA.className = 'cta-toolbar'
        const tipBtn = document.createElement('a')
        tipBtn.className = 'large-btn'
        tipBtn.innerHTML = cta.label
        tipBtn.target = '_blank'
        tipBtn.href = cta.url as string
        tipCTA.append(tipBtn)
        tipDiv.append(tipTitle, tipBody, tipCTA)

        this.#footer.append(tipDiv)
        if (this.#footer.classList.contains('hide')) {
            this.#footer.classList.remove('hide')
            this.#footer.classList.add('show')
        }
        this.tag('card-fix')
        return this
    }

    #toggle(btn: HTMLAnchorElement, codeDiv: HTMLDivElement) {
        if (btn.classList.contains('btn-expandable')) {
            codeDiv.style.display = 'block'
            btn.classList.remove('btn-expandable')
            btn.classList.add('btn-expanded')
            btn.parentElement!.style.marginBottom = '16px'
        } else {
            codeDiv.style.display = 'none'
            btn.classList.remove('btn-expanded')
            btn.classList.add('btn-expandable')
            btn.parentElement!.style.marginBottom = '0'
        }
    }
}
