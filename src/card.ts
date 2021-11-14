// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {disposableId} from './main'
import {codeBlock} from './codeBlock'
import {Mode} from './colorCode'
import * as Todo from './todo'

export interface iLink {
    label: string
    url: string
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
    #tipNumber: number

    constructor(kind: CardKind) {
        this.#div = document.createElement('div')
        this.#div.className = `box-card`
        this.#head = document.createElement('h2')
        this.#head.className = `cardTitle`
        const hr = document.createElement('hr')
        this.#body = document.createElement('div')
        this.#body.className = 'card-body'
        this.#footer = document.createElement('div')
        this.#footer.className = 'card-footer'
        this.#div.append(this.#head, hr, this.#body, this.#footer)
        this.#kind = kind
        this.#tipNumber = 1
        switch (this.#kind) {
            case CardKind.error:
                this.open('Error', '', 'icon-error')
                break
            case CardKind.suggestion:
                this.open('Suggestion', '', 'icon-suggestion')
                break
            case CardKind.info:
                this.open('Info', '', 'icon-info')
                break
        }
        return this
    }

    public open(preTitle: string, title: string, cssClass: string) {
        this.#div.classList.add(cssClass)
        const preTitleDiv = document.createElement('div')
        preTitleDiv.className = 'cardPreTitle'
        preTitleDiv.innerHTML = preTitle
        const titleString = document.createElement('span')
        titleString.className = 'cardTitleString'
        titleString.innerHTML = title
        this.#head.append(preTitleDiv, titleString)
        return this
    }

    public setLogo(cssClass: string) {
        ;[...this.#div.classList.entries()]
            .filter(c => c[1].startsWith('icon-'))
            .forEach(c => this.#div.classList.remove(c[1]))
        this.#div.classList.add(cssClass)
        return this
    }

    public getDiv() {
        return this.#div
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

    public addCTA(links: iLink[]) {
        let toolbar = this.#body.querySelector('.cta-toolbar')
        if (toolbar === null) {
            toolbar = document.createElement('div')
            toolbar.className = 'cta-toolbar'
            this.#footer.append(toolbar)
        }
        if (links.length > 0) {
            this.#footer.style.display = 'block'
        }
        links.forEach(link => {
            const btn = document.createElement('a')
            btn.className = 'large-btn external-link'
            btn.innerHTML = link.label
            btn.href = link.url
            btn.target = '_blank'
            toolbar!.append(btn)
        })
        return this
    }

    #add(str: string) {
        if (str.length === 0) {
            return this
        }
        const tmpDiv = document.createElement('div')
        tmpDiv.innerHTML = str
        this.#body.append(...tmpDiv.childNodes)
        return this
    }

    public addCodeBlock(code: string, mode: Mode) {
        const divId = disposableId()
        this.addParagraph(codeBlock(code, mode, divId))
        return this
    }

    public addExpandableBlock(btnLabel: string, block: string) {
        const divId = disposableId()
        this.#add(
            `<div class='code-box'>` +
                `<div class='code-label label-close' id='${divId}'>${btnLabel}</div>` +
                `<div class='code-body body-close'>${block}</div>` +
                `</div>`
        )
        const labelDiv = this.#div.querySelector(`#${divId}`) as HTMLDivElement
        labelDiv.addEventListener('click', () => Card.toggle(labelDiv))
        return this
    }

    public addParagraph(text: string | undefined, cssClass: string = '', id: string = '') {
        if (text === undefined || text.length === 0) {
            return this
        }
        return this.#add(
            `<div${cssClass !== '' ? ` class='${cssClass}'` : ``}${id === '' ? '' : ` id='${id}'`}>${text}</div>`
        )
    }

    public addPreview(text: string, cssClass: string) {
        this.addParagraph(text, cssClass)
        const divTitle = this.#div.querySelector('.box-label') as HTMLDivElement
        divTitle.addEventListener('click', () => Card.toggle(divTitle))
        return this
    }

    public addTable(title: string, table: string[][], links: iLink[] = []) {
        const divId = disposableId()
        const linksHtml = links
            .map(link => `<a class='small-btn' href='${link.url}' target='_blank'>${link.label}</a>`)
            .join(' ')
        let html = ''
        html += `<div class='table-title label-close' id='${divId}'>${title}${linksHtml}</div>`
        html += `<div class='body-close'>`
        html += '<table class="card-table">'
        html += '<tbody>'
        html += table.map(row => `<tr>${row.map(col => `<td>${col}</td>`).join('')}</tr>`).join('')
        html += '</tbody>'
        html += '</table>'
        html += `</div>`
        const card = this.#add(`<div class='table-container'>${html}</div>`)
        const titleDiv = card.#div.querySelector(`#${divId}`) as HTMLDivElement
        titleDiv.addEventListener('click', () => Card.toggle(titleDiv))

        return this
    }

    public tag(tagToAdd: string) {
        if (
            tagToAdd === 'card-ok' &&
            (this.#head.classList.contains('card-fix') || this.#head.classList.contains('card-error'))
        ) {
            return this
        }
        if (tagToAdd === 'card-fix' && this.#head.classList.contains('card-error')) {
            return this
        }
        this.#head.classList.remove('card-ok')
        this.#head.classList.remove('card-error')
        this.#head.classList.remove('card-fix')
        this.#head.classList.add(tagToAdd)
        return this
    }

    public addTipDiv(div: HTMLDivElement) {
        this.#body.append(div)
        this.tag('card-fix')
        Todo.add(div.cloneNode(true) as HTMLElement)
        return this
    }

    public addTip(title: string, txts: string[], cta: iLink, severity: number = 0) {
        const tipDiv = document.createElement('div')
        tipDiv.className = 'card-tip'

        const tipTitle = document.createElement('div')
        tipTitle.className = 'tip-title label-close'
        tipTitle.innerHTML = `Tip #${this.#tipNumber++}: ${title}`
        tipTitle.setAttribute('data-severity', severity > 0 ? severity.toString() : '')

        const tipBody = document.createElement('div')
        tipBody.className = 'tip-body body-close'
        tipBody.innerHTML = txts
            .filter(txt => txt.length > 0)
            .map(txt => `<div>${txt}</div>`)
            .join('')

        if (severity > 0) {
            const scaleLevel = document.createElement('div')
            scaleLevel.className = 'tip-scale-level'
            scaleLevel.style.width = `${severity.toFixed()}%`
            scaleLevel.setAttribute('data-scale', `${severity.toFixed()}`)

            const scaleDiv = document.createElement('div')
            scaleDiv.className = 'tip-scale'
            scaleDiv.append(scaleLevel)
            tipBody.insertBefore(scaleDiv, tipBody.firstChild)

            const scaleTitle = document.createElement('div')
            scaleTitle.innerText = `Severity`
            scaleTitle.className = 'tip-scale-title'
            tipBody.insertBefore(scaleTitle, tipBody.firstChild)
        }

        const tipBtn = document.createElement('a')
        tipBtn.className = 'large-btn external-link'
        tipBtn.innerHTML = cta.label
        tipBtn.target = '_blank'
        tipBtn.href = cta.url as string

        const tipCTA = document.createElement('div')
        tipCTA.className = 'cta-toolbar'
        tipCTA.append(tipBtn)

        tipBody.append(tipCTA)
        tipDiv.append(tipTitle, tipBody)
        tipTitle.addEventListener('click', () => Card.toggle(tipTitle))

        return this.addTipDiv(tipDiv)
    }

    public getTips() {
        return [...this.#div.getElementsByClassName('card-tip')] as HTMLDivElement[]
    }

    static toggle(label: HTMLElement) {
        label.classList.toggle('label-close')
        label.classList.toggle('label-open')
        const body = label.nextElementSibling as HTMLElement
        body.classList.toggle('body-open')
        body.classList.toggle('body-close')
    }

    public static copyToClipboard(div: HTMLElement) {
        const txt = div.innerText
        navigator.clipboard
            .writeText(txt)
            .then(() => alert(`Code copied to clipboard: \n ${txt}`))
            .catch(() => {
                // On the extension secondary window clipboard API doesn't work
                // We need to go the old way
                const copyFrom = document.createElement('textarea')
                copyFrom.textContent = txt
                document.body.appendChild(copyFrom)
                copyFrom.select()
                document.execCommand('copy')
                copyFrom.blur()
                document.body.removeChild(copyFrom)
            })
    }
}
