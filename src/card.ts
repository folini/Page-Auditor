// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
export interface iLink {
    label: string
    url: string
}

export class Card {
    #report: string[]

    constructor() {
        this.#report = []
    }

    private render() {
        return this.#report.join('')
    }

    public open(
        preTitle: string,
        title: string,
        links: iLink[],
        cssClass: string
    ) {
        this.#report.length = 0
        const linksDiv = `<div class='link-in-card'>${links.reduce(
            (str, link) =>
                str + `<a target='_new' href='${link.url}'>${link.label}</a>`,
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

    public close() {
        this.#report.push(`</div>`)
        return this.render()
    }

    public error(msg: string) {
        return this.open('', 'Error', [], 'icon-error')
            .add(`<div>${msg}</div>`)
            .close()
    }

    public warning(msg: string) {
        return this.open('', 'Warning', [], 'icon-warning')
            .add(`<div>${msg}</div>`)
            .close()
    }

    public add(str: string) {
        if (str.length > 0) {
            this.#report.push(str)
        }
        return this
    }
}
