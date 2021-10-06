// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
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
    #kind: CardKind

    constructor() {
        this.#div = document.createElement('div')
        this.#kind = CardKind.report
    }

    public open(preTitle: string, title: string, links: iLink[], cssClass: string) {
        const btnsContainer = document.createElement('div')
        btnsContainer.className = 'card-buttons'
        links.forEach(link => {
            const btn = document.createElement('a')
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

        this.#div.className = `box-card ${cssClass}`
        const h2 = document.createElement('h2')
        h2.className = `cardTitle`
        const preTitleDiv = document.createElement('div')
        preTitleDiv.className = 'cardPreTitle'
        preTitleDiv.innerHTML = preTitle
        const titleString = document.createElement('span')
        titleString.className = 'cardTitleString'
        titleString.innerHTML = title
        h2.append(preTitleDiv, titleString, btnsContainer)
        const hr = document.createElement('hr')
        this.#div.append(h2, hr)
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

    public error(msg: string, title = 'Error') {
        return this.open('', title, [], 'icon-error')
            .add(`<div class='card-description'>${msg}</div>`)
            .setKind(CardKind.error)
    }

    public suggestion(msg: string, links: iLink[] = [], title = 'Suggestion') {
        return this.open('', title, [], 'icon-suggestion')
            .add(`<div class='card-description'>${msg}</div>`)
            .add(
                `<div class='suggestion-buttons'>${links
                    .map(link => '<a href="' + link.url + '" target="_blank">' + link.label + '</a>')
                    .join(' ')}</div>`
            )
            .setKind(CardKind.suggestion)
    }

    public warning(msg: string, title = 'Warning') {
        return this.open('', title, [], 'icon-warning')
            .add(`<div class='card-description'>${msg}</div>`)
            .setKind(CardKind.warning)
    }

    public add(str: string) {
        const tmpDiv = document.createElement('div')
        tmpDiv.innerHTML = str
        if (str.length > 0) {
            this.#div.append(...tmpDiv.childNodes)
        }
        return this
    }
}
