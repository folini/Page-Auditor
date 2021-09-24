// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
export interface iLink {
    label: string
    url: string
}

export enum CardKind {
    report,
    error,
    suggestion,
    warning,
}

export class Card {
    #report: string[]
    #kind: CardKind

    constructor() {
        this.#report = []
        this.#kind = CardKind.report
    }

    public render() {
        return this.#report.join('')
    }

    public open(preTitle: string, title: string, links: iLink[], cssClass: string) {
        this.#report.length = 0
        const linksDiv = `<div class='link-in-card'>${links.reduce(
            (str, link) => str + `<a target='_new' href='${link.url}'>${link.label}</a>`,
            ''
        )}</div>`
        this.#report.push(
            `<div class='box-card'>` +
                `<h2 class='subTitle ${cssClass}'>` +
                `<div class='track-category'>${preTitle}</div>` +
                title +
                linksDiv +
                `</h2>`
        )
        return this
    }

    public getKind() {
        return this.#kind
    }

    public setKind(value: CardKind) {
        this.#kind = value
        return this
    }

    public close() {
        this.#report.push(`</div>`)
        return this
    }

    public error(msg: string, title = 'Error') {
        return this.open('', title, [], 'icon-error').add(`<div>${msg}</div>`).setKind(CardKind.error).close()
    }

    public suggestion(msg: string, title = 'Suggestion') {
        return this.open('', title, [], 'icon-suggestion').add(`<div>${msg}</div>`).setKind(CardKind.suggestion).close()
    }

    public warning(msg: string, title = 'Warning') {
        return this.open('', title, [], 'icon-warning').add(`<div>${msg}</div>`).setKind(CardKind.warning).close()
    }

    public add(str: string) {
        if (str.length > 0) {
            this.#report.push(str)
        }
        return this
    }
}
