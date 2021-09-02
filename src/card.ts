// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
// ----------------------------------------------------------------------------
export class Card {
    #report: string[]

    constructor() {
        this.#report = []
    }

    #render() {
        return this.#report.join("")
    }

    public open(preTitle: string, title: string, cssClass: string) {
        this.#report.length = 0
        this.#report.push(
            `<div class='box-card'>` +
                `<h2 class='subTitle ${cssClass}'>` +
                `<div class='track-category'>${preTitle}</div>` +
                title +
                `</h2>`
        )
        return this
    }

    public close() {
        this.#report.push(`</div>`)
        return this.#render()
    }

    public error(msg: string) {
        return this.open("", "Error", "icon-error")
            .add(`<div>${msg}</div>`)
            .close()
    }

    public warning(msg: string) {
        return this.open("", "Warning", "icon-warning")
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
