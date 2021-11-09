// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {getLanguage, isLanguage} from './language-code'
import {Card, iLink} from './card'
import {openGraphPreview} from './cards/meta-tags-functions'

export interface iJsonLD {
    [name: string | '@type' | '@id']: string | string[] | iJsonLD[] | iJsonLD
}

export interface iJsonLevel {
    depth: number
}

export class Schema {
    #jsonLD: iJsonLD
    #tabUrl: string
    #firstBoxDone: boolean
    static #dictionary: {[key: string]: unknown} = {}
    static #idStack: string[] = []

    constructor(json: string | iJsonLD, url: string) {
        this.#jsonLD = typeof json === 'string' ? JSON.parse(json) : json
        this.#firstBoxDone = false
        this.#tabUrl = url
    }

    getJson() {
        return this.#jsonLD
    }
    isEmpty() {
        return this.#jsonLD === undefined || Object.keys(this.#jsonLD).length === 0
    }
    getCodeAsString() {
        return JSON.stringify(this.#jsonLD)
    }

    static resetDictionary() {
        this.#dictionary = {}
    }

    static #addToDictionary(json: iJsonLD) {
        let id = json['@id']
        if (typeof id === 'string') {
            id = id.trim()
            delete json['@id']
            Schema.#idStack.push(id)
            if (Object.keys(json).length > 1) {
                Schema.#dictionary[id] = json
            }
        }
    }

    static #getFromDictionary(key: string): unknown {
        return Schema.#dictionary[key.trim()]
    }

    static flattenName(name: string | undefined) {
        if (!name) {
            return ''
        }
        name = name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^@/, '')
        return name.charAt(0).toUpperCase() + name.slice(1)
    }

    static getType(json: iJsonLD): string {
        const schemaType = json['@type']

        if (schemaType === undefined) {
            return 'Graph'
        }
        if (typeof schemaType === 'string' && schemaType.startsWith('http')) {
            return Schema.flattenName(Schema.#getSchemaEnum(schemaType))
        }
        if (typeof schemaType === 'string') {
            return schemaType
        }
        if (Array.isArray(schemaType) && schemaType.length > 0) {
            return typeof schemaType[0] === 'string' ? schemaType[0] : Schema.getType(schemaType[0])
        }
        return ''
    }

    #openBox(label: string, schemaName: string) {
        const links: iLink[] = [
            {
                url: `https://schema.org/${schemaName === 'Graph' ? '' : schemaName}`,
                label: `${schemaName} Schema`,
            },
        ]

        if (!this.#firstBoxDone) {
            links.push({
                url: `https://validator.schema.org/#url=${encodeURI(this.#tabUrl)}`,
                label: `Validate`,
            })
        }

        const linksHtml = links
            .map(link => `<a class='small-btn' href='${link.url}' target='_blank'>${link.label}</a>`)
            .join('')

        const openStr =
            `<div class='sd-box'>` +
            `<div class='sd-box-label ${
                this.#firstBoxDone ? `label-open` : `label-close`
            }'>${label}${linksHtml}</div>` +
            `<div class='sd-box-body ${this.#firstBoxDone ? `body-open` : `body-close`}'>`
        this.#firstBoxDone = true

        return openStr
    }

    #closeBox() {
        return `</div></div>`
    }

    schemaToHtml(): string {
        return this.#toHtml(this.#jsonLD, Schema.getType(this.#jsonLD), Schema.getType(this.#jsonLD))
    }

    #toHtml(genericSd: unknown, label: string, typeName: string): string {
        label = Schema.flattenName(label)
        if (genericSd === undefined || genericSd == null) {
            return ''
        }

        if (typeof genericSd === 'number') {
            return this.#number(genericSd, label)
        }

        if (typeof genericSd === 'boolean') {
            return this.#bool(genericSd, label)
        }

        if (
            (typeof genericSd === 'string' || Schema.#isArrayOfStrings(genericSd)) &&
            ['image', 'logo'].includes(label.toLowerCase())
        ) {
            return this.#image(genericSd as string[], label, typeName)
        }

        if (typeof genericSd === 'string' && isLanguage(genericSd)) {
            return this.#string(getLanguage(genericSd), label, typeName)
        }

        if (typeof genericSd === 'string' && Schema.#isSchemaEnum(genericSd)) {
            return this.#string(Schema.#getSchemaEnum(genericSd), label, typeName)
        }

        if (typeof genericSd === 'string' || Schema.#isArrayOfStrings(genericSd)) {
            return this.#string(genericSd as string, label, typeName)
        }

        const sd = genericSd as iJsonLD

        if (Array.isArray(genericSd)) {
            return genericSd
                .map(json => {
                    const sdJson = json as iJsonLD
                    const newTypeName = Schema.getType(sdJson)
                    return this.#toHtml(sdJson, `${newTypeName}`, newTypeName)
                })
                .join('')
        }

        const newTypeName = Schema.getType(sd)
        return (
            this.#openBox(label, newTypeName) +
            Object.keys(sd)
                .map(key => this.#toHtml(sd[key], key, newTypeName))
                .join('') +
            this.#closeBox()
        )
    }

    #string(str: string | string[], label: string, typeName: string): string {
        if (Array.isArray(str)) {
            if (label.toLowerCase().includes('url')) {
                str = str.map(u => (u.startsWith('/') ? `${this.#tabUrl}${u}` : u))
            }
            if (
                ['image', 'imageobject', 'logo'].includes(typeName.toLowerCase()) &&
                label.toLowerCase().includes('url')
            ) {
                return str.map((url, i) => this.#image(url, `${label} #${i + 1}`, typeName)).join('')
            }
            return (
                `<div class='sd-description-line'>` +
                `<span class='sd-label'>${label}:</span>` +
                `<ul>${str
                    .map(word => (word.startsWith('https://') ? `<a href='${word}'>${word}</a>` : word))
                    .map(word => `<li>${word}</li>`)
                    .join('')}</ul>` +
                `</div>`
            )
        }

        if (label.toLowerCase().includes('url')) {
            str = str.startsWith('/') ? `${this.#tabUrl}${str}` : str
        }

        if (['image', 'imageobject', 'logo'].includes(typeName.toLowerCase()) && label.toLowerCase().includes('url')) {
            return this.#image(str, label, typeName)
        }

        if (label.toLowerCase() === 'type') {
            str = Schema.flattenName(str)
        }

        return `<div class='sd-description-line'><span class='sd-label'>${label}:</span> <span class='sd-description'>${
            str.startsWith('https://') ? `<a href='${str}'>${str}</a>` : str
        }</span></div>`
    }

    #bool(bool: boolean, label: string): string {
        return `<div class='sd-description-line'><span class='sd-label'>${label}:</span> <span class='sd-description'>${
            bool ? 'Yes' : 'No'
        }</span></div>`
    }

    #number(num: number | number[], label: string): string {
        if (Array.isArray(num)) {
            return (
                `<div class='sd-description-line'>` +
                `<span class='sd-label'>${label}s:</span>` +
                `<ul>${num.map(n => `<li>${(n as number).toFixed()}</li>`).join('')}</ul>` +
                `</div>`
            )
        }

        return `<div class='sd-description-line'><span class='sd-label'>${label}:</span> <span class='sd-description'>${num.toFixed()}</span></div>`
    }

    #image(sd: string | string[], label: string, typeName: string): string {
        console.log(`#image("${sd}", "${label}", "${typeName}")`)
        if (Array.isArray(sd)) {
            return (
                this.#string(sd, label, typeName) +
                `<div class='sd-description-line'>` +
                sd.map((url, i) => this.#image(url, `${label} #${i + 1}`, typeName)).join('') +
                `</div>`
            )
        }

        const src = sd.startsWith('//')
            ? `https:${sd}`
            : sd.startsWith('http')
            ? sd
            : sd.startsWith('/')
            ? `https://${new URL(this.#tabUrl).host}${sd}`
            : `../logos/_noRendering_400x200.png`

        return (
            `<div class='sd-description-line'>` +
            `<span class='sd-label'>${label}:</span> ` +
            `<a href='${sd}' target='_new'>${
                sd.length > 0 ? sd : `<span style='color:red'>Image Url is Empty</span>`
            }</a>` +
            `</div>` +
            `<div class='sd-description-line'>` +
            `<a href='${sd}' target='_new'>` +
            `<picture data-label='Image Preview'><img src='${src}'></picture>` +
            `</a>` +
            `</div>`
        )
    }

    static enableOpenClose(div: HTMLDivElement) {
        const boxLabels = [...div.getElementsByClassName(`sd-box-label`)] as HTMLDivElement[]
        boxLabels.forEach(boxLabel => {
            const boxBody = boxLabel.nextElementSibling as HTMLDivElement
            boxLabel.addEventListener('click', () => Card.toggle(boxLabel))
        })
    }

    static #isArrayOfStrings(arr: unknown): boolean {
        return Array.isArray(arr) && arr.every(x => typeof x === 'string')
    }

    static #isSchemaEnum(str: string): boolean {
        return str.startsWith('https://schema.org/') || str.startsWith('http://schema.org/')
    }

    static #getSchemaEnum(str: string): string {
        return Schema.flattenName(str).split('/').at(-1)!
    }
}
