// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------

import {getLanguage} from './language-code'
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
    ItemList,
    Store,
    Brand,
    GeoCoordinates,
    PostalAddress,
    Corporation,
    Recipe,
    NutritionInformation,
    HowToStep,
    HowToSection,
    ContactPoint,
    SiteNavigationElement,
} from 'schema-dts'
import {Card, iLink} from './card'

declare type IdReference = {
    "@id": string;
}

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
    static #dictionary: {[key: string]: unknown} = {}
    static #idStack: string[] = []

    constructor(json: string | iJsonLD, url: string) {
        this.#jsonLD = typeof json === 'string' ? JSON.parse(json) : json
        this.#relativeUrls = []
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

    #validateUrl(url: string): string {
        if (!url.startsWith('http')) {
            this.#relativeUrls.push(url)
        }
        return url
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
            .join(' ')

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
        if (typeof this.#jsonLD !== 'object') {
            return ''
        }

        if (Array.isArray(this.#jsonLD['@graph'])) {
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
        switch (this.#jsonLD['@type']) {
            case 'Product':
                html.push(...this.#product(this.#jsonLD as unknown as Product, `Product`))
                break
            case 'Organization':
                html.push(...this.#organization(this.#jsonLD as unknown as Organization, `Organization`))
                break
            case 'Store':
                html.push(...this.#store(this.#jsonLD as unknown as Store, `Store`))
                break
            case 'Brand':
                html.push(...this.#brand(this.#jsonLD as unknown as Brand, `Brand`))
                break
            case 'Corporation':
                html.push(...this.#corporation(this.#jsonLD as unknown as Corporation, `Corporation`))
                break
            case 'Person':
                html.push(...this.#person(this.#jsonLD as unknown as Person, `Person`))
                break
            case 'ContactPoint':
                html.push(...this.#contactPoint(this.#jsonLD as unknown as ContactPoint, `Contact Point`))
                break
            case 'Article':
                html.push(...this.#article(this.#jsonLD as unknown as Article, `Article`))
                break
            case 'NewsArticle':
                html.push(...this.#newsArticle(this.#jsonLD as unknown as NewsArticle, `News Article`))
                break
            case 'WebSite':
                html.push(...this.#webSite(this.#jsonLD as unknown as WebSite, `WebSite`))
                break
            case 'BreadcrumbList':
                html.push(...this.#breadcrumbList(this.#jsonLD as unknown as BreadcrumbList, `Breadcrumb List`))
                break
            case 'ImageObject':
                html.push(...this.#imageObject(this.#jsonLD as unknown as ImageObject, `Image Object`))
                break
            case 'VideoObject':
                html.push(...this.#videoObject(this.#jsonLD as unknown as VideoObject, `Video Object`))
                break
            case 'AggregateRating':
                html.push(...this.#aggregateRating(this.#jsonLD as unknown as AggregateRating, `Aggregate Rating`))
                break
            case 'Review':
                html.push(...this.#review(this.#jsonLD as unknown as Review, `Review`))
                break
            case 'WebPage':
                html.push(...this.#webPage(this.#jsonLD as unknown as WebPage, `Web Page`))
                break
            case 'Recipe':
                html.push(...this.#recipe(this.#jsonLD as unknown as Recipe, `Recipe`))
                break
            case 'HowToStep':
                html.push(...this.#howToStep(this.#jsonLD as unknown as HowToStep, `HowTo Step`))
                break
            case 'HowToSection':
                html.push(...this.#howToSection(this.#jsonLD as unknown as HowToSection, `HowTo Section`))
                break
            case 'GeoCoordinate':
                html.push(...this.#geoCoordinates(this.#jsonLD as unknown as GeoCoordinates, `Geo Coordinate`))
                break
            case 'PostalAddress':
                html.push(...this.#postalAddress(this.#jsonLD as unknown as PostalAddress, `Postal Address`))
                break
            case 'NutritionInformation':
                html.push(
                    ...this.#nutritionInformation(
                        this.#jsonLD as unknown as NutritionInformation,
                        `Nutrition Information`
                    )
                )
                break
            case 'SoftwareApplication':
                html.push(
                    ...this.#softwareApplication(this.#jsonLD as unknown as SoftwareApplication, `Software Application`)
                )
                break
        }

        return html.join('')
    }

    #language = (str: unknown, label: string): string[] => this.#string(getLanguage(str as string), label)

    #string(str: unknown, label: string): string[] {
        if (str === undefined) {
            return []
        }

        if (Array.isArray(str)) {
            return [
                `<div class='sd-description-line'>` +
                    `<span class='sd-label'>${label}:</span>` +
                    `<ul>${str.map(word => `<li>${word}</li>`).join('')}</ul>` +
                    `</div>`,
            ]
        }

        if (typeof str === 'number') {
            return this.#number(str, label)
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

        if (typeof num === 'string') {
            return this.#string(num, label)
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
                        .map(url => this.#validateUrl(url))
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
                `<a href='${this.#validateUrl(sd)}' target='_new'>${sd}</a>` +
                `</div>`,
        ]
    }

    #product(sd: undefined | Product, label: string): string[] {
        if (sd === undefined) {
            return []
        }

        Schema.#addToDictionary(sd as unknown as iJsonLD)
        if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            this.#product(Schema.#getFromDictionary(sd['@id']) as Product, label)
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

        Schema.#addToDictionary(sd as unknown as iJsonLD)
        if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#offers(Schema.#getFromDictionary(sd['@id']) as unknown as Offer, label)
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
        html.push(...this.#offers((sd as any).offers as Offer, 'Offers'))
        html.push(...this.#personOrOrganizationOrBrand(sd.seller as Person | Organization, 'Seller'))
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

        Schema.#addToDictionary(sd as unknown as iJsonLD)
        if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#thing(Schema.#getFromDictionary(sd['@id']) as unknown as Thing, label)
        }

        const typeName = sd['@type']

        if(typeName === 'ItemList') {
            return this.#itemList(sd as ItemList, label)
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'Thing'))
        html.push(...this.#string(sd.name, `Name`))
        html.push(this.#closeBox())

        return html
    }

    #contactPoint(sd: undefined | string | ContactPoint | ContactPoint[], label: string): string[] {
        if (sd === undefined) {
            return []
        }

        if (typeof sd === 'string') {
            return this.#string(sd, label)
        }

        if (Array.isArray(sd)) {
            return sd.map(contact => this.#contactPoint(contact, label)).flat()
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'Person'))
        html.push(...this.#string(sd.contactType, `Contact Type`))
        html.push(...this.#string(sd.telephone, `Telephone`))
        html.push(...this.#string(sd.faxNumber, `Fax`))
        html.push(...this.#string(sd.email, `E-mail`))
        html.push(...this.#url(sd.sameAs, `Same As`))
        html.push(...this.#imageObject(sd.image as ImageObject, `Logo`))
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

        Schema.#addToDictionary(sd as unknown as iJsonLD)
        if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#person(Schema.#getFromDictionary(sd['@id']) as Person, label)
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'Person'))
        html.push(...this.#string(sd.name, `Name`))
        html.push(...this.#string(sd.description, `Description`))
        html.push(...this.#url(sd.sameAs, `Same As`))
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

        Schema.#addToDictionary(sd as unknown as iJsonLD)
        if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#organization(Schema.#getFromDictionary(sd['@id']) as unknown as Organization, label)
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'Organization'))
        html.push(...this.#string(sd.name, `Name`))
        html.push(...this.#string(sd.description, `Description`))
        html.push(...this.#string(sd.legalName, `Legal Name`))
        html.push(...this.#string(sd.telephone, `Telephone`))
        html.push(...this.#string(sd.naics, `NAICS Code`))
        html.push(...this.#string(sd.foundingDate, `Founding Date`))
        html.push(...this.#url(sd.url, `Url`))
        html.push(...this.#url(sd.sameAs, `Same As`))
        html.push(...this.#imageObject(sd.image as ImageObject, `Image`))
        html.push(...this.#imageObject(sd.logo as ImageObject, `Logo`))
        html.push(...this.#brand(sd.brand as Brand, `Brand`))
        html.push(...this.#postalAddress(sd.address as PostalAddress, `Address`))
        html.push(...this.#contactPoint(sd.contactPoint as ContactPoint, `Contact Point`))
        html.push(this.#closeBox())
        return html
    }

    #corporation(sd: undefined | string | Corporation | Corporation[], label: string): string[] {
        if (sd === undefined) {
            return []
        }

        if (typeof sd === 'string') {
            return this.#string(sd, label)
        }

        if (Array.isArray(sd)) {
            return sd.map(org => this.#corporation(org, label)).flat() as string[]
        }

        Schema.#addToDictionary(sd as unknown as iJsonLD)
        if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#organization(Schema.#getFromDictionary(sd['@id']) as unknown as Organization, label)
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'Corporation'))
        html.push(...this.#string(sd.name, `Name`))
        html.push(...this.#string(sd.brand, `Brand`))
        html.push(...this.#url(sd.url, `Url`))
        html.push(...this.#string(sd.founders, `Founders`))
        html.push(...this.#string(sd.foundingDate, `Founding Date`))
        html.push(...this.#string(sd.foundingLocation, `Founding Location`))
        html.push(...this.#string(sd.knowsAbout, `Knows About`))
        html.push(...this.#string(sd.legalName, `Legal Name`))
        html.push(...this.#string(sd.leiCode, `LEI Code`))
        html.push(...this.#string(sd.numberOfEmployees, `Number Of Employees`))
        html.push(...this.#string(sd.slogan, `Slogan`))
        html.push(...this.#string(sd.tickerSymbol, `Ticker Symbol`))
        html.push(...this.#url(sd.ownershipFundingInfo, `Ownership Funding Info`))
        html.push(...this.#url(sd.award, `Awards`))
        html.push(...this.#url(sd.sameAs, `Same As`))
        html.push(...this.#imageObject(sd.logo as ImageObject, `Logo`))
        html.push(this.#closeBox())
        return html
    }

    #brand(sd: undefined | string | Brand | Brand[], label: string): string[] {
        if (sd === undefined) {
            return []
        }

        if (typeof sd === 'string') {
            return this.#string(sd, label)
        }

        if (Array.isArray(sd)) {
            return sd.map(org => this.#brand(sd, label)).flat() as string[]
        }

        Schema.#addToDictionary(sd as unknown as iJsonLD)
        if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#organization(Schema.#getFromDictionary(sd['@id']) as unknown as Organization, label)
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'Brand'))
        html.push(...this.#string(sd.name, `Name`))
        html.push(...this.#string(sd.description, `Description`))
        html.push(...this.#url(sd.url, `Url`))
        html.push(...this.#url(sd.sameAs, `Same As`))
        html.push(...this.#imageObject(sd.image as ImageObject, `Image`))
        html.push(...this.#imageObject(sd.logo as ImageObject, `Logo`))
        html.push(this.#closeBox())
        return html
    }

    #personOrOrganizationOrBrand(
        sd: undefined | string | Person | Person[] | Organization | Organization[] | Brand | Brand[],
        label: string
    ): string[] {
        if (sd === undefined) {
            return []
        }

        if (typeof sd === 'string') {
            return this.#string(sd, label)
        }

        if (Array.isArray(sd)) {
            return sd.map(personOrOrg => this.#personOrOrganizationOrBrand(personOrOrg, label)).flat() as string[]
        }

        Schema.#addToDictionary(sd as unknown as iJsonLD)
        if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#personOrOrganizationOrBrand(
                Schema.#getFromDictionary(sd['@id']) as Person | Organization,
                label
            )
        }

        if (sd['@type'] === 'Person') {
            return this.#person(sd, label)
        }

        if (sd['@type'] === 'Organization') {
            return this.#organization(sd, label)
        }

        if (sd['@type'] === 'Brand') {
            return this.#brand(sd, label)
        }

        return [`INTERNAL ERROR: Unrecognized Schema Object "${sd['@type']}"`]
    }

    #newsArticle(sd: undefined | NewsArticle, label: string): string[] {
        if (sd === undefined) {
            return []
        }

        Schema.#addToDictionary(sd as unknown as iJsonLD)
        if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#newsArticle(Schema.#getFromDictionary(sd['@id']) as unknown as NewsArticle, label)
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'NewsArticle'))
        html.push(...this.#string(sd.headline, `Headline`))
        html.push(...this.#language(sd.inLanguage, `Language`))
        html.push(...this.#string(sd.keywords, `Keywords`))
        html.push(...this.#string(sd.datePublished, `Published`))
        html.push(...this.#string(sd.dateModified, `Modified`))
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

        Schema.#addToDictionary(sd as unknown as iJsonLD)
        if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#article(Schema.#getFromDictionary(sd['@id']) as Article, label)
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'Article'))
        html.push(...this.#person(sd.author as Person, `Author`))
        html.push(...this.#string(sd.headline, `Headline`))
        html.push(...this.#language(sd.inLanguage, `Language`))
        html.push(...this.#string(sd.datePublished, `Published`))
        html.push(...this.#string(sd.dateModified, `Modified`))
        html.push(...this.#string(sd.wordCount, `Word Count`))
        html.push(...this.#string(sd.commentCount, `Comment Count`))
        html.push(...this.#string(sd.articleSection, `Sections`))
        html.push(...this.#image(sd.thumbnailUrl as string, `Thumbnail`))
        html.push(this.#closeBox())

        return html
    }

    #webSite(sd: undefined | WebSite, label: string): string[] {
        if (sd === undefined) {
            return []
        }

        Schema.#addToDictionary(sd as unknown as iJsonLD)
        if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#webSite(Schema.#getFromDictionary(sd['@id']) as WebSite, label)
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'WebSite'))
        html.push(...this.#url(sd.url, `Url`))
        html.push(...this.#string(sd.name, `Name`))
        html.push(...this.#string(sd.description, `Description`))
        html.push(...this.#string(sd.alternateName, `Alternative Name`))
        html.push(...this.#language(sd.inLanguage, `Language`))
        html.push(this.#closeBox())

        return html
    }

    #breadcrumbList(sd: undefined | BreadcrumbList, label: string): string[] {
        if (sd === undefined) {
            return []
        }

        Schema.#addToDictionary(sd as unknown as iJsonLD)
        if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#breadcrumbList(Schema.#getFromDictionary(sd['@id']) as BreadcrumbList, label)
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'BreadcrumbList'))
        html.push(...this.#listItem(sd.itemListElement as ListItem, `Breadcrumbs`))
        html.push(this.#closeBox())

        return html
    }

    #itemList(sd: undefined | ItemList | ItemList[], label: string): string[] {
        if (sd === undefined) {
            return []
        }

        const html: string[] = []
        if (Array.isArray(sd)) {
            html.push(this.#openBox(label, 'ItemList'))
            sd.filter(item => !!item).forEach((item, i) => {
                html.push(...this.#listItem(item as ListItem, `${`Item`} #${i + 1}`))
            })
            html.push(this.#closeBox())
            return html
        }

        Schema.#addToDictionary(sd as unknown as iJsonLD)
        if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#listItem(Schema.#getFromDictionary(sd['@id']) as ListItem, label)
        }

        html.push(this.#openBox(label, 'ListItem'))
        html.push(...this.#url(sd.url, `Url`))
        html.push(...this.#string(sd.numberOfItems, `Number Of Items`))
        html.push(...this.#listItem(sd.itemListElement as ListItem[], `Items`))
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
            sd.filter(item => !!item).forEach((item, i) => {
                const itemType = item['@type']
                html.push(
                    ...this.#listItem(
                        item,
                        `${
                            itemType === 'HowToStep'
                                ? `Step`
                                : itemType === 'HowToSection'
                                ? `Section`
                                : `Item`
                        } #${i + 1}`
                    )
                )
            })
            html.push(this.#closeBox())
            return html
        }

        Schema.#addToDictionary(sd as unknown as iJsonLD)

        if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#listItem(Schema.#getFromDictionary(sd['@id']) as ListItem, label)
        }

        if (typeof sd === 'string') {
            return this.#string(sd, label)
        }

        const typeName = sd['@type']

        if (typeName === 'HowToStep') {
            return this.#howToStep(sd, label)
        }

        if (typeName === 'HowToSection') {
            return this.#howToSection(sd, label)
        }

        if ((typeName as string) === 'SiteNavigationElement') {
            return this.#siteNavigationElement(sd as unknown as SiteNavigationElement, label)
        }

        html.push(this.#openBox(label, 'ListItem'))
        html.push(...this.#string(sd.position, `Position`))
        html.push(...this.#string(sd.name, `Name`))
        html.push(...this.#url(sd.url, `Url`))
        html.push(...this.#thing(sd.item as Thing, `Item`))
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

        if (typeof sd === 'string') {
            return this.#image(sd, label)
        }

        Schema.#addToDictionary(sd as unknown as iJsonLD)
        if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#imageObject(Schema.#getFromDictionary(sd['@id']) as ImageObject, label)
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'ImageObject'))
        if (sd.width && sd.height) {
            html.push(...this.#string(`${sd.width} x ${sd.height} pixels`, `Size`))
        }
        html.push(...this.#string(sd.caption as any, `Caption`))
        html.push(...this.#string(sd.name, `Name`))
        html.push(...this.#string(sd.description, `Description`))
        html.push(...this.#language(sd.inLanguage, `Language`))
        html.push(...this.#image((sd.contentUrl || sd.url) as string, `Image`))
        html.push(this.#closeBox())

        return html
    }

    #videoObject(sd: undefined | VideoObject, label: string): string[] {
        if (sd === undefined) {
            return []
        }

        Schema.#addToDictionary(sd as unknown as iJsonLD)
        if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#videoObject(Schema.#getFromDictionary(sd['@id']) as VideoObject, label)
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'VideoObject'))
        html.push(...this.#string(sd.name, `Name`))
        html.push(...this.#string(sd.description, `Description`))
        html.push(...this.#string(sd.duration, `Duration`))
        html.push(...this.#string(sd.uploadDate, `Upload Date`))
        html.push(...this.#url(sd.embedUrl, `Embed Url`))
        html.push(...this.#imageObject(sd.image as ImageObject, `Image`))
        html.push(...this.#image(sd.thumbnailUrl as string, `Thumbnail`))
        html.push(this.#closeBox())
        return html
    }

    #aggregateRating(sd: undefined | AggregateRating, label: string): string[] {
        if (sd === undefined) {
            return []
        }

        Schema.#addToDictionary(sd as unknown as iJsonLD)
        if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#aggregateRating(Schema.#getFromDictionary(sd['@id']) as AggregateRating, label)
        }

        const html: string[] = []
        html.push(this.#openBox(`Aggregate Rating`, 'AggregateRating'))
        html.push(...this.#string(sd.ratingValue, `Rating Value`))
        html.push(...this.#number(sd.ratingCount, `Rating Count`))
        html.push(...this.#number(sd.reviewCount, `Review Count`))
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

        Schema.#addToDictionary(sd as unknown as iJsonLD)
        if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#review(Schema.#getFromDictionary(sd['@id']) as Review, label)
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

        Schema.#addToDictionary(sd as unknown as iJsonLD)
        if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#webPage(Schema.#getFromDictionary(sd['@id']) as WebPage, label)
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'WebPage'))
        html.push(...this.#string(sd.name, `Name`))
        html.push(...this.#url(sd.url, `Url`))
        html.push(...this.#string(sd.description, `Description`))
        html.push(...this.#language(sd.inLanguage, `Language`))
        html.push(...this.#string(sd.datePublished, `Published`))
        html.push(...this.#string(sd.dateModified, `Modified`))
        html.push(...this.#imageObject(sd.image as ImageObject | string, `Image`))
        html.push(...this.#imageObject(sd.primaryImageOfPage as ImageObject, `Primary Image Of Page`))
        html.push(...this.#thing(sd.mainEntity as Thing, `Main Entities`))
        html.push(...this.#personOrOrganizationOrBrand(sd.publisher as Organization | Person | string, `Publisher`))
        html.push(this.#closeBox())

        return html
    }

    #softwareApplication(sd: undefined | SoftwareApplication, label: string): string[] {
        if (sd === undefined) {
            return []
        }

        Schema.#addToDictionary(sd as unknown as iJsonLD)
        if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#softwareApplication(Schema.#getFromDictionary(sd['@id']) as SoftwareApplication, label)
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'SoftwareApplication'))
        html.push(...this.#string(sd.name, `Name`))
        html.push(...this.#url(sd.url, `Url`))
        html.push(...this.#string(sd.description, `Description`))
        html.push(...this.#string(sd.operatingSystem, `Operating System`))
        html.push(...this.#string(sd.applicationCategory, `Category`))
        html.push(...this.#personOrOrganizationOrBrand(sd.author as Person, `Author`))
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

    #store(sd: undefined | Store, label: string): string[] {
        if (sd === undefined) {
            return []
        }

        if (typeof sd === 'string') {
            return this.#url(sd, `Url`)
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'Store'))
        html.push(...this.#string(sd.name, `Name`))
        html.push(...this.#string(sd.priceRange, `Price Range`))
        html.push(...this.#url(sd.url, `Url`))
        html.push(...this.#string(sd.description, `Description`))
        html.push(...this.#string(sd.telephone, `Telephone`))
        html.push(...this.#string(sd.openingHours, `Opening Hours`))
        html.push(...this.#url(sd.hasMap, `Map Link`))
        html.push(...this.#personOrOrganizationOrBrand(sd.brand as Organization, `Brand`))
        html.push(...this.#imageObject(sd.image as ImageObject, `Image`))
        html.push(...this.#geoCoordinates(sd.geo as GeoCoordinates, `Geo Coordinates`))
        html.push(...this.#postalAddress(sd.address as PostalAddress, `Address`))
        html.push(this.#closeBox())
        return html
    }

    #rating(sd: undefined | Rating, label: string): string[] {
        if (sd === undefined) {
            return []
        }

        Schema.#addToDictionary(sd as unknown as iJsonLD)
        if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#rating(Schema.#getFromDictionary(sd['@id']) as Rating, label)
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'Rating'))
        html.push(...this.#string(sd.ratingValue, `Rating Value`))
        html.push(this.#closeBox())

        return html
    }

    #geoCoordinates(sd: undefined | GeoCoordinates, label: string): string[] {
        if (sd === undefined) {
            return []
        }

        Schema.#addToDictionary(sd as unknown as iJsonLD)
        if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#rating(Schema.#getFromDictionary(sd['@id']) as Rating, label)
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'Geo Coordinates'))
        html.push(...this.#string(sd.latitude, `Latitude`))
        html.push(...this.#string(sd.longitude, `Longitude`))
        html.push(this.#closeBox())

        return html
    }

    #postalAddress(sd: undefined | PostalAddress, label: string): string[] {
        if (sd === undefined) {
            return []
        }

        Schema.#addToDictionary(sd as unknown as iJsonLD)
        if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#rating(Schema.#getFromDictionary(sd['@id']) as Rating, label)
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'Postal Address'))
        html.push(...this.#string(sd.streetAddress, `Address`))
        html.push(...this.#string(sd.addressLocality, `Locality`))
        html.push(...this.#string(sd.addressRegion, `Region`))
        html.push(...this.#string(sd.postalCode, `Postal Code`))
        html.push(...this.#string(sd.addressCountry, `Country`))
        html.push(this.#closeBox())

        return html
    }

    #nutritionInformation(sd: undefined | NutritionInformation, label: string): string[] {
        if (sd === undefined) {
            return []
        }

        Schema.#addToDictionary(sd as unknown as iJsonLD)
        if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#rating(Schema.#getFromDictionary(sd['@id']) as Rating, label)
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'NutritionInformation'))
        html.push(...this.#string(sd.calories, `Calories`))
        html.push(...this.#string(sd.carbohydrateContent, `Carbohydrate Content`))
        html.push(...this.#string(sd.cholesterolContent, `Cholesterol Content`))
        html.push(...this.#string(sd.fatContent, `Fat Content`))
        html.push(...this.#string(sd.fiberContent, `Fiber Content`))
        html.push(...this.#string(sd.proteinContent, `Protein Content`))
        html.push(...this.#string(sd.saturatedFatContent, `Saturated Fat Content`))
        html.push(...this.#string(sd.servingSize, `Serving Size`))
        html.push(...this.#string(sd.sodiumContent, `Sodium Content`))
        html.push(...this.#string(sd.sugarContent, `Sugar Content`))
        html.push(...this.#string(sd.transFatContent, `Trans Fat Content`))
        html.push(...this.#string(sd.unsaturatedFatContent, `Unsaturated Fat Content`))
        html.push(this.#closeBox())

        return html
    }

    #recipe(sd: undefined | Recipe, label: string): string[] {
        if (sd === undefined) {
            return []
        }

        Schema.#addToDictionary(sd as unknown as iJsonLD)
        if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#rating(Schema.#getFromDictionary(sd['@id']) as Rating, label)
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'Postal Address'))
        html.push(...this.#string(sd.name, `Name`))
        html.push(...this.#string(sd.description, `Description`))
        html.push(...this.#string(sd.datePublished, `Date Published`))
        //html.push(...this.#number(sd.recipeYield, `Recipe Yield`))
        html.push(...this.#string(sd.recipeCategory, `Category`))
        html.push(...this.#string(sd.recipeCuisine, `Cuisine`))
        html.push(...this.#string(sd.prepTime, `Prep Time`))
        html.push(...this.#string(sd.cookTime, `Cook Time`))
        html.push(...this.#string(sd.performTime, `Perform Time`))
        html.push(...this.#string(sd.totalTime, `Total Time`))
        html.push(...this.#string(sd.recipeIngredient, `Ingredients`))
        html.push(...this.#string(sd.keywords, `Keywords`))
        html.push(...this.#image(sd.image as string[], `Image`))
        html.push(...this.#listItem(sd.recipeInstructions as ListItem, `Instructions`))
        html.push(...this.#person(sd.author as Person, `Author`))
        html.push(...this.#nutritionInformation(sd.nutrition as NutritionInformation, `Nutrition`))
        html.push(...this.#aggregateRating(sd.aggregateRating as AggregateRating, `Aggregate Rating`))
        html.push(this.#closeBox())

        return html
    }

    #howToStep(sd: undefined | string | HowToStep, label: string): string[] {
        if (sd === undefined) {
            return []
        }

        if (typeof sd === 'string') {
            return this.#string(sd, label)
        }

        Schema.#addToDictionary(sd as unknown as iJsonLD)
        if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#rating(Schema.#getFromDictionary(sd['@id']) as Rating, label)
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'HowTo Step'))
        html.push(...this.#string(sd.name, `Name`))
        html.push(...this.#string(sd.text, `Description`))
        html.push(...this.#url(sd.url, `Url`))
        html.push(this.#closeBox())

        return html
    }

    #siteNavigationElement(sd: undefined | string | SiteNavigationElement, label: string): string[] {
        if (sd === undefined) {
            return []
        }

        if (typeof sd === 'string') {
            return this.#string(sd, label)
        }

        Schema.#addToDictionary(sd as unknown as iJsonLD)
        if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#rating(Schema.#getFromDictionary(sd['@id']) as Rating, label)
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'Site Navigation Element'))
        html.push(...this.#string(sd.name, `Name`))
        html.push(...this.#string(sd.text, `Description`))
        html.push(...this.#url(sd.url, `Url`))
        html.push(this.#closeBox())

        return html
    }

    #howToSection(sd: undefined | HowToSection, label: string): string[] {
        if (sd === undefined) {
            return []
        }

        if (typeof sd === 'string') {
            return this.#string(sd, label)
        }

        Schema.#addToDictionary(sd as unknown as iJsonLD)
        if (sd['@id'] !== undefined && Object.keys(sd).length === 1) {
            return this.#rating(Schema.#getFromDictionary(sd['@id']) as Rating, label)
        }

        const html: string[] = []
        html.push(this.#openBox(label, 'HowTo Step'))
        html.push(...this.#string(sd.name, `Name`))
        html.push(...this.#string(sd.text, `Description`))
        html.push(...this.#url(sd.url, `Url`))
        html.push(...this.#listItem(sd.itemListElement as ListItem, `Item List`))
        html.push(this.#closeBox())

        return html
    }

    static enableOpenClose(div: HTMLDivElement) {
        const boxLabels = [...div.getElementsByClassName(`sd-box-label`)] as HTMLDivElement[]
        boxLabels.forEach(boxLabel => {
            const boxBody = boxLabel.nextElementSibling as HTMLDivElement
            boxLabel.addEventListener('click', () => Card.toggle(boxLabel))
        })
    }
}
