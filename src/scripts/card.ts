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
    info,
}

export class Card {
    #div: HTMLDivElement
    #head: HTMLHeadingElement
    #body: HTMLDivElement
    #kind: CardKind
    #footer: HTMLDivElement

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

    public add(div: HTMLDivElement | HTMLDivElement[]) {
        this.#body.append(...(Array.isArray(div) ? div : [div]))
        return this
    }

    public setTag(tagToAdd: string) {
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

    static toggleBlock(box: HTMLElement) {
        box.classList.toggle('box-close')
        box.classList.toggle('box-open')
        box.querySelector('.fa-chevron-down')?.classList.toggle('fa-rotate-180')
    }

    static openBlock(box: HTMLElement) {
        box.classList.remove('box-close')
        box.classList.add('box-open')
        box.querySelector('.fa-chevron-down')?.classList.add('fa-rotate-180')
    }

    static closeBlock(box: HTMLElement) {
        box.classList.remove('box-open')
        box.classList.add('box-close')
        box.querySelector('.fa-chevron-down')?.classList.add('fa-rotate-180')
    }

    public static copyToClipboard(div: HTMLElement) {
        const txt = div.innerText
        navigator.clipboard
            .writeText(txt)
            .then(() => alert(`Code copied to clipboard: \n ${txt}`))
            .catch(() => {
                // On the extension secondary window, clipboard API doesn't work
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
