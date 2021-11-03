// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------

import {
    Product,
    Offer,
    Organization,
    Person,
    NewsArticle,
    WebSite,
    BreadcrumbList,
    ImageObject,
    VideoObject,
    AudioObject,
    CollectionPage,
    WebPage,
    SoftwareApplication,
    Article,
    AggregateRating,
    Review,
    AdministrativeArea,
    Rating,
    Thing,
    ListItem,
} from 'schema-dts'
import {Card, iLink} from './card'

export interface iJsonLD {
    [name: string | '@type' | '@id']: string | string[] | iJsonLD[] | iJsonLD
}

export interface iJsonLevel {
    depth: number
}

export class Schema {
    #jsonLD: iJsonLD
    #tabUrl: string
    #relativeUrls: string[]
    #firstBoxDone: boolean
    #dictionary: {[key: string]: unknown}

    constructor(json: string | iJsonLD, url: string) {
        this.#jsonLD = typeof json === 'string' ? JSON.parse(json) : json
        this.#relativeUrls = []
        this.#firstBoxDone = false
        this.#dictionary = {}
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
    #addToDictionary(key: string, type: unknown) {
        this.#dictionary[key] = type
    }
    #getFromDictionary(key: string): unknown {
        return this.#dictionary[key]
    }

    static flattenName(name: string | undefined) {
        if (!name) {
            return ''
        }
        return name.replace(/([a-z])([A-Z])/g, '$1 $2')
    }

    static getSchemaType(json: iJsonLD): string {
        const schemaType = json['@type']

        if (schemaType === undefined) {
            return 'Graph'
        }
        if (typeof schemaType === 'string') {
            return schemaType
        }
        if (Array.isArray(schemaType) && schemaType.length > 0) {
            return typeof schemaType[0] === 'string' ? schemaType[0] : Schema.getSchemaType(schemaType[0])
        }
        return ''
    }

    validateUrl(url: string): string {
        if (!url.startsWith('http')) {
            this.#relativeUrls.push(url)
        }
        return url
    }

    #openBox(label: string, schemaName: string) {
        const linksHtml = Schema.schemaLinks(schemaName, this.#tabUrl)
            .map(link => `<a class='small-btn' href='${link.url}' target='_blank'>${link.label}</a>`)
            .join(' ')

        const openStr =
             `<div class='sd-box'>` +
            `<div class='sd-box-label ${this.#firstBoxDone ? `label-open` : `label-close`}'>${label}${linksHtml}</div>` + 
            `<div class='sd-box-body ${this.#firstBoxDone ? `body-open` : `body-close`}'>`
            this.#firstBoxDone = true
            
        return openStr
        }

    #closeBox() {
        return `</div></div>`
    }

    schemaToHtml(): string {
        if (typeof this.#jsonLD !== 'object') {
            return ''
        }

        if (Array.isArray(this.#jsonLD['@graph'])) {
            console.log('@graph is an array')
            const boxes = this.#jsonLD['@graph'].map(json => {
                const schema = new Schema(json, this.#tabUrl)
                return schema.schemaToHtml()
            })
            return boxes.join('')
        }

        if (!this.#jsonLD['@type']) {
            return ''
        }

        let html: string[] = []
        console.log(`@type is an ${this.#jsonLD['@type']}`)
        switch (this.#jsonLD['@type']) {
            case 'Product':
                html.push(...this.#product(this.#jsonLD as any as Product, `Product`))
                break
            case 'Organization':
                html.push(...this.#organization(this.#jsonLD as any as Organization, `Organization`))
                break
            case 'Person':
                html.push(...this.#person(this.#jsonLD as any as Person, `Person`))
                break
            case 'Article':
                html.push(...this.#article(this.#jsonLD as any as Article, `Article`))
                break
            case 'NewsArticle':
                html.push(...this.#newsArticle(this.#jsonLD as any as NewsArticle, `News Article`))
                break
            case 'WebSite':
                html.push(...this.#webSite(this.#jsonLD as any as WebSite, `WebSite`))
                break
            case 'BreadcrumbList':
                html.push(...this.#breadcrumbList(this.#jsonLD as any as BreadcrumbList, `Breadcrumb List`))
                break
            case 'ImageObject':
                html.push(...this.#imageObject(this.#jsonLD as any as ImageObject, `Image Object`))
                break
            case 'VideoObject':
                html.push(...this.#videoObject(this.#jsonLD as any as VideoObject, `Video Object`))
                break
            case 'AggregateRating':
                html.push(...this.#aggregateRating(this.#jsonLD as any as AggregateRating, `Aggregate Rating`))
                break
            case 'Review':
                html.push(...this.#review(this.#jsonLD as any as Review, `Review`))
                break
            case 'WebPage':
                html.push(...this.#webPage(this.#jsonLD as any as WebPage, `Web Page`))
                break
            case 'SoftwareApplication':
                html.push(
                    ...this.#softwareApplication(this.#jsonLD as any as SoftwareApplication, `Software Application`)
                )
                break
        }

        return html.join('')
    }

    #string(str: unknown, label: string): string[] {
        if (str === undefined) {
            return []
        }

        if (Array.isArray(str)) {
            return [
                `<div class='sd-description-line'>` +
                    `<span class='sd-label'>${label}s:</span>` +
                    `<ul>${str.map(word => `<li>${word}</li>`).join('')}</ul>` +
                    `</div>`,
            ]
        }

        if (typeof str !== 'string') {
            return []
        }

        return [
            `<div class='sd-description-line'><span class='sd-label'>${label}:</span> <span class='sd-description'>${str}</span></div>`,
        ]
    }

    #number(num: unknown, label: string): string[] {
        if (num === undefined) {
            return []
        }

        if (Array.isArray(num)) {
            return [
                `<div class='sd-description-line'>` +
                    `<span class='sd-label'>${label}s:</span>` +
                    `<ul>${num.map(n => `<li>${(n as number).toFixed()}</li>`).join('')}</ul>` +
                    `</div>`,
            ]
        }

        if (typeof num !== 'number') {
            return []
        }

        return [
            `<div class='sd-description-line'><span class='sd-label'>${label}:</span> <span class='sd-description'>${num.toFixed()}</span></div>`,
        ]
    }

    #const(str: unknown, label: string): string[] {
        if (str === undefined || typeof str !== 'string') {
            return []
        }

        return [
            `<div class='sd-description-line'><span class='sd-label'>${label}: </span><span class='sd-description'>${Schema.flattenName(
                str.split('/').at(-1)
            )}</span></div>`,
        ]
    }

    #url(sd: unknown, label: string): string[] {
        if (sd === undefined) {
            return []
        }

        if (Array.isArray(sd)) {
            return [
                `<div class='sd-description-line'>` +
                    `<span class='sd-label'>${label}: </span>` +
                    `<ul>` +
                    sd
                        .map(url => this.validateUrl(url))
                        .map(url => `<li><a href='${url}' target='_new'>${url}</a></li>`)
                        .join('') +
                    `</ul>` +
                    `</div>`,
            ]
        }

        if (typeof sd !== 'string') {
            return []
        }

        return [
            `<div class='sd-description-line'>` +
                `<span class='sd-label'>${label}: </span>` +
                `<a href='${this.validateUrl(sd)}' target='_new'>${sd}</a>` +
                `</div>`,
        ]
    }

    #product(sd: undefined | Product, label: string): string[] {
        if (sd === undefined) {
            return []
        }

        if (sd['@id'] !== undefined && Object.keys(sd).length > 1) {
            this.#addToDictionary(sd['@id'], sd)
        } else if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            this.#product(this.#getFromDictionary(sd['@id']) as Product, label)
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'Product'))
        html.push(...this.#string(sd.name, `Name`))
        html.push(...this.#string(sd.description, `Description`))
        html.push(...this.#string(sd.weight, `Weight`))
        html.push(...this.#string(sd.mpn, `MPN (Manufacturer Part Number)`))
        html.push(...this.#string(sd.sku, `SKU (Stock-Keeping Unit)`))
        html.push(...this.#thing(sd.brand as Thing, `Brand`))
        html.push(...this.#offers(sd.offers as Offer, `Offers`))
        html.push(...this.#aggregateRating(sd.aggregateRating as AggregateRating, 'Aggregate Rating'))
        html.push(...this.#review(sd.review as Review, 'Review(s)'))
        html.push(this.#closeBox())

        return html
    }

    #offers(sd: undefined | Offer | Offer[], label: string): string[] {
        if (sd === undefined) {
            return []
        }

        const html: string[] = []
        if (Array.isArray(sd)) {
            html.push(this.#openBox(label, 'Offer'))
            sd.forEach((offer, i) => {
                html.push(...this.#offers(offer, `Offer #${i + 1}`))
            })
            html.push(this.#closeBox())
            return html
        }

        if (sd['@id'] !== undefined && Object.keys(sd).length > 1) {
            this.#addToDictionary(sd['@id'], sd)
        } else if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#offers(this.#getFromDictionary(sd['@id']) as unknown as Offer, label)
        }

        html.push(this.#openBox(label, 'Offer'))
        if (sd.priceCurrency && sd.price !== undefined) {
            html.push(...this.#string(`${sd.priceCurrency.valueOf()} ${sd.price.valueOf()}`, `Price`))
        }
        html.push(...this.#string(sd.mpn, `MPN (Manufacturer Part Number)`))
        html.push(...this.#string(sd.sku, `SKU (Stock-Keeping Unit)`))
        html.push(...this.#string(sd.priceValidUntil, `Price valid Until`))
        html.push(...this.#const(sd.availability, `Availability`))
        html.push(...this.#const(sd.availableDeliveryMethod, `Available Delivery Method`))
        html.push(...this.#const(sd.itemCondition, `Condition`))
        html.push(...this.#url(sd.url, 'Url'))
        html.push(...this.#image(sd.image as string, 'Image'))
        html.push(...this.#personOrOrganization(sd.seller as Person | Organization, 'Seller'))
        html.push(this.#closeBox())

        return html
    }

    #thing(sd: undefined | string | Thing, label: string): string[] {
        if (sd === undefined) {
            return []
        }

        if (typeof sd === 'string') {
            if (sd.startsWith('http')) {
                return this.#url(sd, label)
            } else {
                return this.#string(sd, label)
            }
        }

        if (sd['@id'] !== undefined && Object.keys(sd).length > 1) {
            this.#addToDictionary(sd['@id'], sd)
        } else if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#thing(this.#getFromDictionary(sd['@id']) as unknown as Thing, label)
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'Thing'))
        html.push(...this.#string(sd.name, `Name`))
        html.push(this.#closeBox())

        return html
    }

    #person(sd: undefined | string | Person | Person[], label: string): string[] {
        if (sd === undefined) {
            return []
        }

        if (typeof sd === 'string') {
            return this.#string(sd, label)
        }

        if (Array.isArray(sd)) {
            return sd.map(person => this.#person(person, label)).flat()
        }

        if (sd['@id'] !== undefined && Object.keys(sd).length > 1) {
            this.#addToDictionary(sd['@id'], sd)
        } else if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#person(this.#getFromDictionary(sd['@id']) as Person, label)
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'Person'))
        html.push(...this.#string(sd.name, `Name`))
        html.push(...this.#string(sd.description, `Description`))
        html.push(...this.#imageObject(sd.image as ImageObject, `Logo`))
        html.push(this.#closeBox())
        return html
    }

    #organization(sd: undefined | string | Organization | Organization[], label: string): string[] {
        if (sd === undefined) {
            return []
        }

        if (typeof sd === 'string') {
            return this.#string(sd, label)
        }

        if (Array.isArray(sd)) {
            return sd.map(org => this.#organization(org, label)).flat() as string[]
        }

        if (sd['@id'] !== undefined && Object.keys(sd).length > 1) {
            this.#addToDictionary(sd['@id'], sd)
        } else if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#organization(this.#getFromDictionary(sd['@id']) as unknown as Organization, label)
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'Organization'))
        html.push(...this.#string(sd.name, `Name`))
        html.push(...this.#url(sd.url, `Url`))
        html.push(...this.#imageObject(sd.logo as ImageObject, `Logo`))
        html.push(this.#closeBox())
        return html
    }

    #personOrOrganization(
        sd: undefined | string | Person | Person[] | Organization | Organization[],
        label: string
    ): string[] {
        if (sd === undefined) {
            return []
        }

        if (typeof sd === 'string') {
            return this.#string(sd, label)
        }

        if (Array.isArray(sd)) {
            return sd.map(personOrOrg => this.#personOrOrganization(personOrOrg, label)).flat() as string[]
        }

        if (sd['@id'] !== undefined && Object.keys(sd).length > 1) {
            this.#addToDictionary(sd['@id'], sd)
        } else if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#personOrOrganization(this.#getFromDictionary(sd['@id']) as Person | Organization, label)
        }

        if (sd['@type'] === 'Person') {
            return this.#person(sd, label)
        } else if (sd['@type'] === 'Organization') {
            return this.#organization(sd, label)
        }

        return ['ERROR']
    }

    #newsArticle(sd: undefined | NewsArticle, label: string): string[] {
        if (sd === undefined) {
            return []
        }

        if (sd['@id'] !== undefined && Object.keys(sd).length > 1) {
            this.#addToDictionary(sd['@id'], sd)
        } else if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#newsArticle(this.#getFromDictionary(sd['@id']) as unknown as NewsArticle, label)
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'NewsArticle'))
        html.push(...this.#string(sd.headline, `Headline`))
        html.push(...this.#string(sd.inLanguage, `Language`))
        html.push(...this.#string(sd.keywords, `Keywords`))
        html.push(...this.#person(sd.author as Person, `Author`))
        html.push(...this.#imageObject(sd.image as ImageObject, `Image`))
        html.push(...this.#organization(sd.publisher as Organization, `Publisher`))
        html.push(this.#closeBox())

        return html
    }

    #article(sd: undefined | Article, label: string): string[] {
        if (sd === undefined) {
            return []
        }

        if (sd['@id'] !== undefined && Object.keys(sd).length > 1) {
            this.#addToDictionary(sd['@id'], sd)
        } else if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#article(this.#getFromDictionary(sd['@id']) as Article, label)
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'Article'))
        html.push(...this.#person(sd.author as Person, `Author`))
        html.push(...this.#string(sd.headline, `Headline`))
        html.push(...this.#string(sd.inLanguage, `Language`))
        html.push(...this.#string(sd.wordCount, `Word Count`))
        html.push(...this.#string(sd.commentCount, `Comment Count`))
        html.push(...this.#image(sd.thumbnailUrl as string, `Thumbnail`))
        html.push(this.#closeBox())

        return html
    }

    #webSite(sd: undefined | WebSite, label: string): string[] {
        if (sd === undefined) {
            return []
        }

        if (sd['@id'] !== undefined && Object.keys(sd).length > 1) {
            this.#addToDictionary(sd['@id'], sd)
        } else if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#webSite(this.#getFromDictionary(sd['@id']) as WebSite, label)
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'WebSite'))
        html.push(...this.#url(sd.url, `Url`))
        html.push(...this.#string(sd.name, `Name`))
        html.push(...this.#string(sd.description, `Description`))
        html.push(...this.#string(sd.inLanguage, `Language`))
        html.push(this.#closeBox())

        return html
    }

    #breadcrumbList(sd: undefined | BreadcrumbList, label: string): string[] {
        if (sd === undefined) {
            return []
        }

        if (sd['@id'] !== undefined && Object.keys(sd).length > 1) {
            this.#addToDictionary(sd['@id'], sd)
        } else if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#breadcrumbList(this.#getFromDictionary(sd['@id']) as BreadcrumbList, label)
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'BreadcrumbList'))
        html.push(...this.#listItem(sd.itemListElement as ListItem, `Breadcrumbs`))
        html.push(this.#closeBox())

        return html
    }

    #listItem(sd: undefined | ListItem | ListItem[], label: string): string[] {
        if (sd === undefined) {
            return []
        }

        const html: string[] = []
        if (Array.isArray(sd)) {
            html.push(this.#openBox(label, 'ListItem'))
            sd.forEach((item, i) => {
                html.push(...this.#listItem(item, `Item #${i + 1}`))
            })
            html.push(this.#closeBox())
            return html
        }

        if (sd['@id'] !== undefined && Object.keys(sd).length > 1) {
            this.#addToDictionary(sd['@id'], sd)
        } else if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#listItem(this.#getFromDictionary(sd['@id']) as ListItem, label)
        }

        html.push(this.#openBox(label, 'ListItem'))
        html.push(...this.#string(sd.position, `Position`))
        html.push(...this.#string(sd.name, `Name`))
        html.push(...this.#thing(sd?.item as Thing, `Item`))
        html.push(this.#closeBox())

        return html
    }

    #image(sd: undefined | string | string[], label: string): string[] {
        if (sd === undefined) {
            return []
        }

        if (Array.isArray(sd)) {
            return [
                `<div class='sd-description-line'>` +
                    sd.map((url, i) => this.#image(url, `Image #${i + 1}`)).join('') +
                    `</div>`,
            ]
        }

        const src = sd.startsWith('//')
            ? `https:${sd}`
            : sd.startsWith('http')
            ? sd
            : `../logos/_noRendering_400x200.png`

        return [
            `<div class='sd-description-line'>` +
                `<a href='${sd}' target='_new'>` +
                `<picture data-label='${label}:'><img src='${src}'></picture>` +
                `</a>` +
                `</div>`,
        ]
    }

    #imageObject(sd: undefined | string | ImageObject, label: string): string[] {
        if (sd === undefined) {
            return []
        }

        const html: string[] = []
        if (typeof sd === 'string') {
            html.push(this.#openBox(label, 'ImageObject'))
            html.push(...this.#image(sd, `Image`))
            html.push(this.#closeBox())
            return html
        }

        if (sd['@id'] !== undefined && Object.keys(sd).length > 1) {
            this.#addToDictionary(sd['@id'], sd)
        } else if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#imageObject(this.#getFromDictionary(sd['@id']) as ImageObject, label)
        }

        html.push(this.#openBox(label, 'ImageObject'))
        html.push(...this.#image((sd.contentUrl || sd.url) as string, `Image`))
        if (sd.width && sd.height) {
            html.push(...this.#string(`${sd.width} x ${sd.height} pixels`, `Size`))
        }
        html.push(...this.#string(sd.caption as any, `Caption`))
        html.push(...this.#string(sd.name, `Name`))
        html.push(...this.#string(sd.description, `Description`))
        html.push(this.#closeBox())

        return html
    }

    #videoObject(sd: undefined | VideoObject, label: string): string[] {
        if (sd === undefined) {
            return []
        }

        if (sd['@id'] !== undefined && Object.keys(sd).length > 1) {
            this.#addToDictionary(sd['@id'], sd)
        } else if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#videoObject(this.#getFromDictionary(sd['@id']) as VideoObject, label)
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'VideoObject'))
        html.push(...this.#string(sd.name, `Name`))
        html.push(...this.#string(sd.description, `Description`))
        html.push(...this.#string(sd.duration, `Duration`))
        html.push(...this.#imageObject(sd.image as ImageObject, `Image`))
        html.push(...this.#image(sd.thumbnailUrl as string, `Thumbnail`))
        html.push(this.#closeBox())
        return html
    }

    #aggregateRating(sd: undefined | AggregateRating, label: string): string[] {
        if (sd === undefined) {
            return []
        }

        if (sd['@id'] !== undefined && Object.keys(sd).length > 1) {
            this.#addToDictionary(sd['@id'], sd)
        } else if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#aggregateRating(this.#getFromDictionary(sd['@id']) as AggregateRating, label)
        }

        const html: string[] = []
        html.push(this.#openBox(`Aggregate Rating`, 'AggregateRating'))
        html.push(...this.#string(sd.ratingValue, `Rating Value`))
        html.push(...this.#string(sd.ratingCount, `Rating Count`))
        html.push(...this.#string(sd.reviewCount, `Review Count`))
        html.push(this.#closeBox())

        return html
    }

    #review(sd: undefined | Review | Review[], label: string): string[] {
        if (sd === undefined) {
            return []
        }

        if (Array.isArray(sd)) {
            return sd.map((review, i) => this.#review(review, `Review #${i + 1}`)).flat()
        }

        if (sd['@id'] !== undefined && Object.keys(sd).length > 1) {
            this.#addToDictionary(sd['@id'], sd)
        } else if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#review(this.#getFromDictionary(sd['@id']) as Review, label)
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'Review'))
        html.push(...this.#string(sd.name, `Name`))
        html.push(...this.#string(sd.reviewBody, `Review Body`))
        html.push(...this.#person(sd.author as Person, `Author`))
        html.push(...this.#administrativeArea(sd.locationCreated as AdministrativeArea, `Location Created`))
        html.push(...this.#rating(sd.reviewRating as Rating, `Review Rating`))
        html.push(this.#closeBox())

        return html
    }

    #webPage(sd: undefined | WebPage, label: string): string[] {
        if (sd === undefined) {
            return []
        }

        if (sd['@id'] !== undefined && Object.keys(sd).length > 1) {
            this.#addToDictionary(sd['@id'], sd)
        } else if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#webPage(this.#getFromDictionary(sd['@id']) as WebPage, label)
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'WebPage'))
        html.push(...this.#string(sd.name, `Name`))
        html.push(...this.#url(sd.url, `Url`))
        html.push(...this.#string(sd.description, `Description`))
        html.push(...this.#string(sd.inLanguage, `Language`))
        html.push(...this.#imageObject(sd.image as ImageObject | string, `Image`))
        html.push(...this.#personOrOrganization(sd.publisher as Organization | Person | string, `Publisher`))
        html.push(this.#closeBox())

        return html
    }

    #softwareApplication(sd: undefined | SoftwareApplication, label: string): string[] {
        if (sd === undefined) {
            return []
        }

        if (sd['@id'] !== undefined && Object.keys(sd).length > 1) {
            this.#addToDictionary(sd['@id'], sd)
        } else if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#softwareApplication(this.#getFromDictionary(sd['@id']) as SoftwareApplication, label)
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'SoftwareApplication'))
        html.push(...this.#string(sd.name, `Name`))
        html.push(...this.#url(sd.url, `Url`))
        html.push(...this.#string(sd.description, `Description`))
        html.push(...this.#string(sd.operatingSystem, `Operating System`))
        html.push(...this.#string(sd.applicationCategory, `Category`))
        html.push(...this.#personOrOrganization(sd.author as Person, `Author`))
        html.push(...this.#aggregateRating(sd.aggregateRating as AggregateRating, `Rating`))
        html.push(...this.#offers(sd.offers as Offer, `Offers`))

        html.push(this.#closeBox())

        return html
    }

    #administrativeArea(sd: undefined | AdministrativeArea, label: string): string[] {
        if (sd === undefined) {
            return []
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'AdministrativeArea'))
        html.push(...this.#string((sd as any).name, `Location Name`))
        html.push(this.#closeBox())
        return html
    }

    #rating(sd: undefined | Rating, label: string): string[] {
        if (sd === undefined) {
            return []
        }

        if (sd['@id'] !== undefined && Object.keys(sd).length > 1) {
            this.#addToDictionary(sd['@id'], sd)
        } else if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#rating(this.#getFromDictionary(sd['@id']) as Rating, label)
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'Rating'))
        html.push(...this.#string(sd.ratingValue, `Rating Value`))
        html.push(this.#closeBox())

        return html
    }

    static schemaLinks = (schemaName: string, ldjsonUrl: string): iLink[] => [
        {
            url: `https://validator.schema.org/#url=${encodeURI(ldjsonUrl)}`,
            label: `Validate`,
        },
        {
            url: `https://schema.org/${schemaName === 'Graph' ? '' : schemaName}`,
            label: `Schema`,
        },
    ]

    static enableOpenClose(div: HTMLDivElement) {
        const boxLabels = [...div.getElementsByClassName(`sd-box-label`)] as HTMLDivElement[]
        boxLabels.forEach(boxLabel => {
            const boxBody = boxLabel.nextElementSibling as HTMLDivElement
            boxLabel.addEventListener('click', () => Card.toggle(boxLabel))
        })
    }
}
