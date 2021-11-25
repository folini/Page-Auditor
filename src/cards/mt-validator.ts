// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {iTag, tagToString} from './mt'
import * as Tips from '../tips/tips'
import {Card} from '../card'
import {Specs} from '../specs'
import * as File from '../file'

export interface iTagValidator {
    (card: Card, allTags: iTag[], selectedTags: iTag[], canonical: string, tabUrl :string): void
}

export const noValidation = (card: Card, allTags: iTag[], selectedTags: iTag[], canonical: string, tabUrl: string) => {}

export const repTags = (card: Card, allTags: iTag[], selectedTags: iTag[], canonical: string, tabUrl: string) => {
    const robots = selectedTags.find(m => m.label.toLowerCase() === 'robots')
    if (!robots) {
        return
    }
    const values = robots.value
        .split(',')
        .map(v => v.trim().toLowerCase())
        .filter(val => val === 'index' || val === 'follow')
    if (values.length > 0) {
        Tips.MetaTags.tagRepRedundantValue(card, selectedTags, values)
    }
}

export const stdTags = (card: Card, allTags: iTag[], selectedTags: iTag[], canonical: string, tabUrl: string) => {
    const keywords = selectedTags.find(m => m.label.toLowerCase() === 'keywords')
    if (keywords) {
        Tips.MetaTags.tagKeywordsIsObsolete(card, keywords)
    }

    const description = selectedTags.find(m => m.label.toLowerCase() === 'description')
    if (!description) {
        Tips.MetaTags.tagIsMissing(card, 'Standard', 'description')
    } else if (description.value.length < Specs.metaTags.descTag.minLen) {
        Tips.MetaTags.tagDescriptionIsTooShort(card, description)
    } else if (description.value.length > Specs.metaTags.descTag.maxLen) {
        Tips.MetaTags.tagDescriptionIsTooLong(card, description)
    }

    const title = selectedTags.find(m => m.label.toLowerCase() === 'title')
    if (!title) {
        Tips.MetaTags.tagIsMissing(card, 'Standard', 'title')
    } else if (title && title.value.length > Specs.metaTags.titleTag.maxLen) {
        Tips.MetaTags.tagTitleIsTooLong(card, title)
    }
}

export const twitterTags = (card: Card, allTags: iTag[], selectedTags: iTag[], canonical: string, tabUrl: string) => {
    const obsoleteTag = selectedTags.find(m => m.label === 'twitter:domain')
    const cardTag = selectedTags.find(m => m.label === 'twitter:card')
    const siteTag = selectedTags.find(m => m.label === 'twitter:site')
    const imgTag =
        selectedTags.find(m => m.label === 'twitter:image') || selectedTags.find(m => m.label === 'twitter:image:src')
    const urlTag = selectedTags.find(m => m.label === 'twitter:url')
    const titleTag = selectedTags.find(m => m.label === 'twitter:title')
    const descriptionTag = selectedTags.find(m => m.label === 'twitter:description')

    const imgFallbackTag = allTags.find(m => m.label === 'og:image') || allTags.find(m => m.label === 'image')
    const titleFallbackTag = allTags.find(m => m.label === 'og:title') || allTags.find(m => m.label === 'title')
    const descriptionFallbackTag =
        allTags.find(m => m.label === 'og:description') || allTags.find(m => m.label === 'description')
    const urlFallbackTag = allTags.find(m => m.label === 'og:url') || allTags.find(m => m.label === 'url')

    let url = urlTag?.value || urlFallbackTag?.value || ''
    let title = titleTag?.value || titleFallbackTag?.value || ''
    let img = imgTag?.value || imgFallbackTag?.value || ''
    let description = descriptionTag?.value || descriptionFallbackTag?.value || ''

    if (!!obsoleteTag) {
        Tips.MetaTags.tagIsObsolete(card, 'Twitter', obsoleteTag.label, obsoleteTag.code)
    }

    if (!siteTag) {
        Tips.MetaTags.tagIsMissing(card, 'Twitter', 'twitter:site')
    }

    if (!cardTag) {
        Tips.MetaTags.tagIsMissing(card, 'Twitter', 'twitter:card')
    } else {
        if (Specs.twitterTags.twitterCard.obsoleteValues.includes(cardTag.value)) {
            Tips.MetaTags.tagWithObsoleteValue(card, 'Twitter', cardTag, Specs.twitterTags.twitterCard.obsoleteValues)
        } else if (!Specs.twitterTags.twitterCard.validValues.includes(cardTag.value)) {
            Tips.MetaTags.tagWithInvalidValue(card, 'Twitter', cardTag, Specs.twitterTags.twitterCard.validValues)
        }
    }

    if (!!urlTag) {
        if (urlTag.value.length === 0) {
            Tips.MetaTags.tagWithEmptyValue(card, 'Twitter', urlTag)
        } else {
            if (!urlTag.value.startsWith('https://')) {
                Tips.MetaTags.tagUrlIsRelativePath(card, 'Twitter', urlTag, canonical)
            } else if (urlTag.value.startsWith('http://')) {
                Tips.MetaTags.tagUrlUsesObsoleteProtocol(card, 'Twitter', urlTag)
            } else if (canonical.length > 0 && !areTheSameUrl(canonical, urlTag.value)) {
                Tips.MetaTags.tagUrlIsNonCanonical(card, 'Twitter', urlTag, canonical)
            }
        }
    } else {
        if (url.length > 0 && urlFallbackTag) {
            Tips.MetaTags.tagShouldBeSpecific(card, 'Twitter', 'twitter:url', urlFallbackTag)
        } else {
            Tips.MetaTags.tagIsMissing(card, 'Twitter', 'twitter:url')
        }
    }

    if (!!titleTag) {
        if (titleTag.value.length === 0) {
            Tips.MetaTags.tagWithEmptyValue(card, 'Twitter', titleTag)
        } else if (titleTag.value.length <= Specs.twitterTags.twTitle.minLen) {
            Tips.MetaTags.tagIsaPlaceholder(card, 'Twitter', titleTag)
        } else if (titleTag.value.length > Specs.twitterTags.twTitle.maxLen) {
            Tips.MetaTags.tagLongerThanMax(card, 'Twitter', titleTag, Specs.twitterTags.twTitle.maxLen)
        } else if (titleTag.value.length > Specs.twitterTags.twTitle.maxRecommendedLen) {
            Tips.MetaTags.tagLongerThanRecommended(
                card,
                'Twitter',
                titleTag,
                Specs.twitterTags.twTitle.maxLen,
                Specs.twitterTags.twTitle.maxRecommendedLen
            )
        }
    } else {
        if (title.length > 0 && titleFallbackTag) {
            Tips.MetaTags.tagShouldBeSpecific(card, 'Twitter', 'twitter:title', titleFallbackTag)
        } else {
            Tips.MetaTags.tagIsMissing(card, 'Twitter', 'twitter:title')
        }
    }

    if (!!descriptionTag) {
        if (descriptionTag.value.length === 0) {
            Tips.MetaTags.tagWithEmptyValue(card, 'Twitter', descriptionTag)
        } else if (descriptionTag.value.length <= Specs.twitterTags.twDesc.minLen) {
            Tips.MetaTags.tagIsaPlaceholder(card, 'Twitter', descriptionTag)
        } else if (descriptionTag.value.length > Specs.twitterTags.twDesc.maxLen) {
            Tips.MetaTags.tagLongerThanMax(card, 'Twitter', descriptionTag, Specs.twitterTags.twDesc.maxLen)
        } else if (descriptionTag.value.length > Specs.twitterTags.twDesc.maxWithUrlLen) {
            Tips.MetaTags.tagLongerThanRecommended(
                card,
                'Twitter',
                descriptionTag,
                Specs.twitterTags.twDesc.maxLen,
                Specs.twitterTags.twDesc.maxWithUrlLen
            )
        }
    } else {
        if (description.length > 0 && descriptionFallbackTag) {
            Tips.MetaTags.tagShouldBeSpecific(card, 'Twitter', 'twitter:description', descriptionFallbackTag)
        } else {
            Tips.MetaTags.tagIsMissing(card, 'Twitter', 'twitter:description')
        }
    }

    if (!!imgTag) {
        if (imgTag.value.length === 0) {
            Tips.MetaTags.tagWithEmptyValue(card, 'Twitter', imgTag)
        } else {
            if (imgTag.value.includes('/assets/no-image-')) {
                Tips.MetaTags.tagImageIsaPlaceholder(card, 'Twitter', imgTag)
            }
            if (!imgTag.value.startsWith('http')) {
                Tips.MetaTags.tagUrlIsRelativePath(card, 'Twitter', imgTag, canonical)
                if (canonical.length > 0 && canonical.startsWith('http')) {
                    img = new URL(canonical).origin + imgTag.value
                }
            } else if (imgTag.value.startsWith('http://')) {
                Tips.MetaTags.tagUrlUsesObsoleteProtocol(card, 'Twitter', imgTag)
            }
            imgTag.value = imgTag.value.replace('http://', 'https://') || ''
            if (imgTag.value.startsWith('//')) {
                imgTag.value = `https:${imgTag.value}`
            }
            if (imgTag.value.startsWith('/')) {
                imgTag.value = `${new URL(tabUrl).origin}${imgTag.value}`
            }
            if (imgTag.value.startsWith('https://')) {
                File.imageSize(img)
                    .then((size: File.iSize) => {
                        if (
                            Specs.twitterTags.twImage.minSize.width > size.width ||
                            Specs.twitterTags.twImage.minSize.height > size.height
                        ) {
                            Tips.MetaTags.tagImageIsTooSmall(
                                card,
                                'Twitter',
                                imgTag,
                                Specs.twitterTags.twImage.minSize,
                                Specs.twitterTags.twImage.recommendedSize
                            )
                        } else if (
                            Specs.twitterTags.twImage.maxSize.width < size.width ||
                            Specs.twitterTags.twImage.maxSize.height < size.height
                        ) {
                            Tips.MetaTags.tagImageIsTooLarge(
                                card,
                                'Twitter',
                                imgTag,
                                Specs.twitterTags.twImage.maxSize,
                                Specs.twitterTags.twImage.recommendedSize
                            )
                        }
                    })
                    .catch(() => {
                        Tips.MetaTags.tagImageNotFound(card, 'Twitter', imgTag)
                        card.hideElement(`.preview-img`)
                    })
            }
        }
    } else {
        if (img.length > 0 && imgFallbackTag) {
            Tips.MetaTags.tagShouldBeSpecific(card, 'Twitter', 'twitter:image', imgFallbackTag)
        } else {
            Tips.MetaTags.tagIsMissing(card, 'Twitter', 'twitter:image')
        }
    }
}

export const openGraphTags = (card: Card, allTags: iTag[], selectedTags: iTag[], canonical: string, tabUrl: string) => {
    const imgTag = selectedTags.find(m => m.label === 'og:image')
    const urlTag = selectedTags.find(m => m.label === 'og:url' || m.label === 'og:image:secure_url')
    const titleTag = selectedTags.find(m => m.label === 'og:title')
    const descriptionTag = selectedTags.find(m => m.label === 'og:description')
    const typeTag = selectedTags.find(m => m.label === 'og:type')

    const imgFallbackTag = allTags.find(m => m.label === 'image')
    const descriptionFallbackTag = allTags.find(m => m.label === 'description')
    const urlFallbackTag = allTags.find(m => m.label === 'url')
    const titleFallbackTag = allTags.find(m => m.label === 'title')

    let url = urlTag?.value || urlFallbackTag?.value || ''
    if (url && url.startsWith('http')) {
        url = url.replace(/https?:\/\/(www.)?((\w+\.)?\w+\.\w+).*/i, `$2`)
    }

    let img = imgTag?.value || imgFallbackTag?.value || ''
    img = img.replace('http://', 'https://')

    let title = titleTag?.value || titleFallbackTag?.value || ''

    let description = descriptionTag?.value || descriptionFallbackTag?.value || ''
    description = description.length < 215 ? description : description.substr(0, 214) + '&mldr;'

    if (!!urlTag) {
        if (urlTag.value.length === 0) {
            Tips.MetaTags.tagWithEmptyValue(card, 'Facebook', urlTag)
        } else {
            if (!urlTag.value.startsWith('http')) {
                Tips.MetaTags.tagUrlIsRelativePath(card, 'Facebook', urlTag, canonical)
            } else if (urlTag.value.startsWith('http://')) {
                Tips.MetaTags.tagUrlUsesObsoleteProtocol(card, 'Facebook', urlTag)
            } else if (canonical.length > 0 && !areTheSameUrl(canonical, urlTag.value)) {
                Tips.MetaTags.tagUrlIsNonCanonical(card, 'Facebook', urlTag, canonical)
            }
        }
    } else {
        if (url.length > 0 && urlFallbackTag) {
            Tips.MetaTags.tagShouldBeSpecific(card, 'Facebook', 'og:url', urlFallbackTag)
        } else {
            Tips.MetaTags.tagIsMissing(card, 'Facebook', 'og:url')
        }
    }

    if (!!titleTag) {
        if (titleTag.value.length === 0) {
            Tips.MetaTags.tagWithEmptyValue(card, 'Facebook', titleTag)
        } else if (titleTag.value.length <= Specs.openGraphTags.ogTitle.minLen) {
            Tips.MetaTags.tagIsaPlaceholder(card, 'Facebook', titleTag)
        } else if (titleTag.value.length > Specs.openGraphTags.ogTitle.maxLen) {
            Tips.MetaTags.tagLongerThanMax(card, 'Facebook', titleTag, Specs.openGraphTags.ogTitle.maxLen)
        } else if (titleTag.value.length > Specs.openGraphTags.ogTitle.maxRecommendedLen) {
            Tips.MetaTags.tagLongerThanRecommended(
                card,
                'Facebook',
                titleTag,
                Specs.openGraphTags.ogTitle.maxLen,
                Specs.openGraphTags.ogTitle.maxRecommendedLen
            )
        }
    } else {
        if (title.length > 0 && titleFallbackTag) {
            Tips.MetaTags.tagShouldBeSpecific(card, 'Facebook', 'og:title', titleFallbackTag)
        } else {
            Tips.MetaTags.tagIsMissing(card, 'Facebook', 'og:title')
        }
    }

    if (!!typeTag) {
        if (typeTag.value.length === 0) {
            Tips.MetaTags.tagWithEmptyValue(card, 'Facebook', typeTag)
        } else if (!Specs.openGraphTags.ogType.validValues.includes(typeTag.value) && !typeTag.value.includes(':')) {
            Tips.MetaTags.tagWithInvalidValue(card, 'Facebook', typeTag, Specs.openGraphTags.ogType.validValues)
        }
    } else {
        Tips.MetaTags.tagIsMissing(card, 'Facebook', 'og:type')
    }

    if (!!descriptionTag) {
        if (descriptionTag.value.length === 0) {
            Tips.MetaTags.tagWithEmptyValue(card, 'Facebook', descriptionTag)
        } else if (descriptionTag.value.length <= Specs.openGraphTags.ogDescription.minLen) {
            Tips.MetaTags.tagIsaPlaceholder(card, 'Facebook', descriptionTag)
        } else if (descriptionTag.value.length > Specs.openGraphTags.ogDescription.maxLen) {
            Tips.MetaTags.tagLongerThanMax(card, 'Facebook', descriptionTag, Specs.openGraphTags.ogDescription.maxLen)
        } else if (descriptionTag.value.length > Specs.openGraphTags.ogDescription.maxRecommendedLen) {
            Tips.MetaTags.tagLongerThanRecommended(
                card,
                'Facebook',
                descriptionTag,
                Specs.openGraphTags.ogDescription.maxLen,
                Specs.openGraphTags.ogDescription.maxRecommendedLen
            )
        }
    } else {
        if (description.length > 0 && descriptionFallbackTag) {
            Tips.MetaTags.tagShouldBeSpecific(card, 'Facebook', 'og:description', descriptionFallbackTag)
        } else {
            Tips.MetaTags.tagIsMissing(card, 'Facebook', 'og:description')
        }
    }

    if (!!imgTag) {
        if (imgTag.value.length === 0) {
            Tips.MetaTags.tagWithEmptyValue(card, 'Facebook', imgTag)
        } else {
            if (imgTag.value.includes('/assets/no-image-')) {
                Tips.MetaTags.tagImageIsaPlaceholder(card, 'Facebook', imgTag)
            }
            if (imgTag.value.length === 0) {
                Tips.MetaTags.tagImageIsMissing(card, 'Facebook', imgTag.label)
            }
            imgTag.value = imgTag.value.replace('http://', 'https://') || ''
            if (imgTag.value.startsWith('//')) {
                imgTag.value = `https:${imgTag.value}`
            }
            if (imgTag.value.startsWith('/')) {
                imgTag.value = `${new URL(tabUrl).origin}${imgTag.value}`
            }
            if (imgTag.value.startsWith('https://')) {
                File.imageSize(img)
                    .then((size: File.iSize) => {
                        if (
                            Specs.openGraphTags.ogImage.minSize.width > size.width ||
                            Specs.openGraphTags.ogImage.minSize.height > size.height
                        ) {
                            Tips.MetaTags.tagImageIsTooSmall(
                                card,
                                'Facebook',
                                imgTag,
                                Specs.openGraphTags.ogImage.minSize,
                                Specs.openGraphTags.ogImage.recommendedSize
                            )
                        } else if (
                            Specs.openGraphTags.ogImage.maxSize.width < size.width ||
                            Specs.openGraphTags.ogImage.maxSize.height < size.height
                        ) {
                            Tips.MetaTags.tagImageIsTooLarge(
                                card,
                                'Facebook',
                                imgTag,
                                Specs.openGraphTags.ogImage.maxSize,
                                Specs.openGraphTags.ogImage.recommendedSize
                            )
                        }
                    })
                    .catch(() => {
                        Tips.MetaTags.tagImageNotFound(card, 'Facebook', imgTag)
                        card.hideElement(`.preview-img`)
                    })
            }
            if (!imgTag.value.startsWith('http')) {
                Tips.MetaTags.tagUrlIsRelativePath(card, 'Facebook', imgTag, canonical)
                if (canonical.length > 0 && canonical.startsWith('http')) {
                    img = new URL(canonical).origin + imgTag.value
                }
            }
            if (imgTag.value.startsWith('http://')) {
                Tips.MetaTags.tagUrlUsesObsoleteProtocol(card, 'Facebook', imgTag)
            }
        }
    } else {
        if (img.length > 0 && imgFallbackTag) {
            Tips.MetaTags.tagShouldBeSpecific(card, 'Facebook', 'og:image', imgFallbackTag)
        } else {
            Tips.MetaTags.tagIsMissing(card, 'Facebook', 'og:image')
        }
    }
}

const areTheSameUrl = (url1: string, url2: string) => {
    const u1 = url1.toLowerCase()
    const u2 = url2.toLowerCase()
    return u1 === u2 || `${u1}/` === u2 || u1 === `${u2}/`
}