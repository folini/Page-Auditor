// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {getLanguage, isLanguage} from './language-code'
import {Card, iLink} from './card'
import {disposableId} from './main'
import * as Tips from './tips/tips'
import * as File from './file'

export interface iJsonLD {
    [name: string | '@type' | '@id']: string | string[] | iJsonLD[] | iJsonLD
}

export interface iImageElement {
    src: string
    id: string
    label: string
    sdType: string
}

export class Schema {
    #jsonLD: iJsonLD
    #tabUrl: string
    #firstBoxDone: boolean
    #cardPromise: Promise<Card> | undefined
    #relativeUrls: string[]
    static #dictionary: {[key: string]: iJsonLD} = {}
    static #schemaCounter: {[schema: string]: number} = {}
    static #idStack: string[] = []
    static #referenceBlocks: boolean = false
    static #images: iImageElement[] = []

    constructor(json: string | iJsonLD, url: string) {
        this.#jsonLD = typeof json === 'string' ? JSON.parse(json) : json
        this.#firstBoxDone = false
        this.#tabUrl = url
        this.#cardPromise = undefined
        this.#relativeUrls = []
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

    getRelativeUrls() {
        return this.#relativeUrls
    }

    setCardPromise(cardPromise: Promise<Card>) {
        this.#cardPromise = cardPromise
    }

    static resetDictionary() {
        this.#dictionary = {}
    }

    static getSchemaCounter(schemaName: string) {
        return Schema.#schemaCounter[schemaName] ?? 0
    }

    static #addToDictionary(json: iJsonLD) {
        let id = Schema.getId(json)
        if (typeof id === 'string' && id.length > 0) {
            id = id.trim()
            delete json['@id']
            if (Object.keys(json).length > 1) {
                Schema.#dictionary[id] = json
            }
        }
    }

    static #getFromDictionary(id: string): iJsonLD {
        if (id.length === 0 || Schema.#idStack.includes(id) || Schema.#dictionary[id] === undefined) {
            return {'@id': id}
        }
        return Schema.#dictionary[id.trim()]
    }

    static flattenName(name: string | undefined) {
        if (!name) {
            return ''
        }
        name = name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^@/, '')
        return name.charAt(0).toUpperCase() + name.slice(1)
    }

    static getId(json: iJsonLD): string {
        return (json['@id'] as string) ?? ''
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
        Schema.#schemaCounter[schemaName] = Schema.#schemaCounter[schemaName]
            ? Schema.#schemaCounter[schemaName] + 1
            : 1
        const links: iLink[] = []

        if (!this.#firstBoxDone) {
            links.push({
                url: `https://validator.schema.org/#url=${encodeURI(this.#tabUrl)}`,
                label: `Validate`,
            })
        }

        const linksHtml = links
            .map(link => `<a class='small-btn' href='${link.url}' target='_blank'>${link.label}</a>`)
            .join('')

        const blockIsOpen = this.#firstBoxDone && !Schema.#referenceBlocks
        const boxOpenClose = blockIsOpen ? ` box-open` : ` box-close`
        const labelReference = Schema.#referenceBlocks ? ` label-reference` : ''
        const labelShowIcon = this.#firstBoxDone ? ' label-json-no-icon' : ' label-json-icon'

        let openStr =
            `<div class='box-sd ${boxOpenClose}'>` +
            `<div class='box-label${labelShowIcon}${labelReference}'><span class='label-text'>${label}${linksHtml}</span></div>` +
            `<div class='box-body'>`
        this.#firstBoxDone = true

        if (Schema.#referenceBlocks) {
            openStr += `<div class='sd-description-line sd-block-intro'>This block is a reference to a block of information defined elsewhere. The items you see here are just a copy of the original; items.</div>`
        }

        openStr += this.#string(
            `https://schema.org/${schemaName === 'Graph' ? '' : schemaName}`,
            `${schemaName} Schema`,
            ''
        )

        return openStr
    }

    #closeBox() {
        return `</div></div>`
    }

    schemaToHtml(): string {
        this.#cardPromise!.then(card => {
            const imgPromises = Schema.#images.map(img =>
                File.exists(img.src, File.imageContentType)
                    .then(() => Promise.resolve(img))
                    .catch(() => Promise.reject(img))
            )
            Promise.allSettled(imgPromises).then(results => {
                let missingImages = results
                    .filter(p => p.status === 'rejected')
                    .map(p => (p as any).reason) as iImageElement[]
                if (missingImages.length === 0) {
                    return
                }
                missingImages.forEach(imgObj => {
                    const imgTag = card.getDiv().querySelector(`#${imgObj.id}`) as HTMLImageElement | undefined
                    if (imgTag) {
                        imgTag.src = `Assets/logos/_noRendering_400x200.png`
                    }
                })
                Tips.StructuredData.imagesNotFound(this.#cardPromise!, missingImages)
            })
        })

        const html = this.#toHtml(this.#jsonLD, Schema.getType(this.#jsonLD), Schema.getType(this.#jsonLD))
        return html
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
            ['image', 'logo', 'content url'].includes(label.toLowerCase())
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

        let sd = genericSd as iJsonLD

        if (Array.isArray(genericSd)) {
            if (genericSd.length === 1 && genericSd[0] === null) {
                return this.#string('NULL', label, typeName)
            }

            return genericSd
                .map(json => {
                    const sdJson = json as iJsonLD
                    const newTypeName = Schema.getType(sdJson)
                    return this.#toHtml(sdJson, `${newTypeName}`, newTypeName)
                })
                .join('')
        }

        const newTypeName = Schema.getType(sd)
        const blockId = Schema.getId(sd)
        if (blockId.length > 0 && Object.entries(sd).length > 1) {
            Schema.#addToDictionary(sd)
        }

        const isResolving = Schema.#referenceBlocks
        if (Object.keys(sd).length === 1 && Object.keys(sd)[0] === '@id') {
            sd = Schema.#getFromDictionary(blockId)
            Schema.#referenceBlocks = Object.keys(sd).length > 1
        }

        Schema.#idStack.push(blockId)
        let html = this.#openBox(label, newTypeName)

        html += Object.keys(sd)
            .map(key => this.#toHtml(sd[key], key, newTypeName))
            .join('')

        html += this.#closeBox()
        Schema.#idStack.pop()

        Schema.#referenceBlocks = isResolving

        return html
    }

    #string(str: string | string[], label: string, typeName: string): string {
        if (Array.isArray(str)) {
            if (label.toLowerCase().includes('url')) {
                this.#relativeUrls.push(...str.filter(s => s.startsWith('/')))
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
        if (Array.isArray(sd)) {
            return (
                this.#string(sd, label, typeName) +
                `<div class='sd-description-line'>` +
                sd.map((url, i) => this.#image(url, `${label} #${i + 1}`, typeName)).join('') +
                `</div>`
            )
        }

        let src = sd
        if (sd.startsWith('//')) {
            Tips.StructuredData.imageUrlMissingProtocol(this.#cardPromise!, label, [sd])
            sd = `https:${sd}`
            src = `Assets/logos/_noRendering_400x200.png`
        }

        if (sd.startsWith('/')) {
            const correctUrl = `https://${new URL(this.#tabUrl).host}${sd}`
            Tips.StructuredData.avoidRelativeUrls(this.#cardPromise!, label, [sd], this.#tabUrl)
            src = correctUrl
        }

        if (sd.length === 0) {
            Tips.StructuredData.imageUrlIsEmpty(this.#cardPromise!, label)
            src = `Assets/logos/_noRendering_400x200.png`
        }

        const imgId = disposableId()

        Schema.#images.push({src: src, id: imgId, label: label, sdType: typeName})

        return (
            `<div class='sd-description-line'>` +
            `<span class='sd-label'>${label}:</span> ` +
            `<a href='${sd}' target='_new'>${
                sd.length > 0 ? sd : `<span style='color:red'>Image Url is Empty</span>`
            }</a>` +
            `</div>` +
            `<div class='sd-description-line'>` +
            `<a href='${sd}' target='_new'>` +
            `<picture data-label='Image Preview'><img src='${src}' id='${imgId}'></picture>` +
            `</a>` +
            `</div>`
        )
    }

    static enableOpenClose(div: HTMLDivElement) {
        const boxes = [...div.getElementsByClassName(`box-sd`)] as HTMLDivElement[]
        boxes.forEach(boxDiv => {
            const labelDiv = boxDiv.firstElementChild as HTMLDivElement
            labelDiv.addEventListener('click', () => Card.toggleBlock(boxDiv))
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
