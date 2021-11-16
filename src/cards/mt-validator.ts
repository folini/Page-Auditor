// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {iTag, tagToString} from './mt'
import * as Tips from './tips'
import {Card} from '../card'
import {specs} from './specs'
import * as File from '../file'

export interface iTagValidator {
    (card: Card, allTags: iTag[], selectedTags: iTag[], canonical: string): void
}

export const noValidation = (card: Card, allTags: iTag[], selectedTags: iTag[], canonical: string) => {}

export const repTags = (card: Card, allTags: iTag[], selectedTags: iTag[], canonical: string) => {
    const robots = selectedTags.find(m => m.label.toLowerCase() === 'robots')
    if (!robots) {
        return
    }
    const values = robots.value
        .split(',')
        .map(v => v.trim().toLowerCase())
        .filter(val => val === 'index' || val === 'follow')
    if (values.length > 0) {
        Tips.tag_REP_redundant(card, selectedTags, values)
    }
}

export const stdTags = (card: Card, allTags: iTag[], selectedTags: iTag[], canonical: string) => {
    const keywords = selectedTags.find(m => m.label.toLowerCase() === 'keywords')
    if (keywords) {
        Tips.tag_Std_KeywordsIsObsolete(card, keywords)
    }

    const description = selectedTags.find(m => m.label.toLowerCase() === 'description')
    if (description && description.value.length > specs.stdTags.Desc.MaxLen) {
        Tips.tag_Std_DescriptionIsTooLong(card, description)
    }

    if (description && description.value.length < specs.stdTags.Desc.MinLen) {
        Tips.tag_Std_DescriptionIsTooShort(card, description)
    }

    const title = selectedTags.find(m => m.label.toLowerCase() === 'title')
    if (title && title.value.length > specs.stdTags.Title.MaxLen) {
        Tips.tag_Std_TitleIsTooLong(card, title)
    }
}

export const twitterTags = (card: Card, allTags: iTag[], selectedTags: iTag[], canonical: string) => {
    console.log(`Validator.twitterTags => received ${tagToString(selectedTags)}`)
    const obsoleteTag = selectedTags.find(m => m.label === 'twitter:domain')
    const cardTag = selectedTags.find(m => m.label === 'twitter:card')
    const siteTag = selectedTags.find(m => m.label === 'twitter:site')
    const imgTag =
        selectedTags.find(m => m.label === 'twitter:image') || selectedTags.find(m => m.label === 'twitter:image:src')
    const urlTag = selectedTags.find(m => m.label === 'twitter:url')
    const titleTag = selectedTags.find(m => m.label === 'twitter:title')
    const descriptionTag = selectedTags.find(m => m.label === 'twitter:description')
    const domainTag = selectedTags.find(m => m.label === 'twitter:domain')

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
        Tips.tag_Obsolete(card, 'Twitter', obsoleteTag.label, obsoleteTag.code)
    }

    if (!siteTag) {
        Tips.tag_Missing(card, 'Twitter', 'twitter:site')
    }

    if (!cardTag) {
        Tips.tag_Missing(card, 'Twitter', 'twitter:card')
    } else {
        if (specs.twitterTags.twitterCard.obsoleteValues.includes(cardTag.value)) {
            Tips.tag_ObsoleteValue(card, 'Twitter', cardTag, specs.twitterTags.twitterCard.obsoleteValues)
        } else if (!specs.twitterTags.twitterCard.validValues.includes(cardTag.value)) {
            Tips.tag_InvalidValue(card, 'Twitter', cardTag, specs.twitterTags.twitterCard.validValues)
        }
    }

    if (!!urlTag) {
        if (urlTag.value.length === 0) {
            Tips.tag_NoValue(card, 'Twitter', urlTag)
        } else {
            if (!urlTag.value.startsWith('https://')) {
                Tips.tagUrl_RelativePath(card, 'Twitter', urlTag)
            } else if (urlTag.value.startsWith('http://')) {
                Tips.tagUrl_ObsoleteProtocol(card, 'Twitter', urlTag)
            } else if (canonical.length > 0 && urlTag.value.toLowerCase() !== canonical.toLowerCase()) {
                Tips.tagUrl_NonCanonical(card, 'Twitter', urlTag, canonical)
            }
        }
    } else {
        if (url.length > 0) {
            Tips.tag_NonSpecific(card, 'Twitter', 'twitter:url', urlFallbackTag)
        } else {
            Tips.tag_Missing(card, 'Twitter', 'twitter:url')
        }
    }

    if (!!titleTag) {
        if (titleTag.value.length === 0) {
            Tips.tag_NoValue(card, 'Twitter', titleTag)
        } else if (titleTag.value.length <= specs.twitterTags.twTitle.MinLen) {
            Tips.tag_Placeholder(card, 'Twitter', titleTag)
        } else if (titleTag.value.length > specs.twitterTags.twTitle.MaxLen) {
            Tips.tag_OverMaxLength(card, 'Twitter', titleTag, specs.twitterTags.twTitle.MaxLen)
        } else if (titleTag.value.length > specs.twitterTags.twTitle.MaxRecommendedLen) {
            Tips.tag_OverRecommendedLength(
                card,
                'Twitter',
                titleTag,
                specs.twitterTags.twTitle.MaxLen,
                specs.twitterTags.twTitle.MaxRecommendedLen
            )
        }
    } else {
        if (title.length > 0) {
            Tips.tag_NonSpecific(card, 'Twitter', 'twitter:title', titleFallbackTag)
        } else {
            Tips.tag_Missing(card, 'Twitter', 'twitter:title')
        }
    }

    if (!!descriptionTag) {
        if (descriptionTag.value.length === 0) {
            Tips.tag_NoValue(card, 'Twitter', descriptionTag)
        } else if (descriptionTag.value.length <= specs.twitterTags.twDesc.MinLen) {
            Tips.tag_Placeholder(card, 'Twitter', descriptionTag)
        } else if (descriptionTag.value.length > specs.twitterTags.twDesc.MaxLen) {
            Tips.tag_OverMaxLength(card, 'Twitter', descriptionTag, specs.twitterTags.twDesc.MaxLen)
        } else if (descriptionTag.value.length > specs.twitterTags.twDesc.MaxWithUrlLen) {
            Tips.tag_OverRecommendedLength(
                card,
                'Twitter',
                descriptionTag,
                specs.twitterTags.twDesc.MaxLen,
                specs.twitterTags.twDesc.MaxWithUrlLen
            )
        }
    } else {
        if (description.length > 0) {
            Tips.tag_NonSpecific(card, 'Twitter', 'twitter:description', descriptionFallbackTag)
        } else {
            Tips.tag_Missing(card, 'Twitter', 'twitter:description')
        }
    }

    if (!!imgTag) {
        if (imgTag.value.length === 0) {
            Tips.tag_NoValue(card, 'Twitter', imgTag)
        } else {
            if (imgTag.value.includes('/assets/no-image-')) {
                Tips.tagImage_Placeholder(card, 'Twitter', imgTag)
            }
            if (!imgTag.value.startsWith('http')) {
                Tips.tagUrl_RelativePath(card, 'Twitter', imgTag)
                if (canonical.length > 0 && canonical.startsWith('http')) {
                    img = new URL(canonical).origin + imgTag.value
                }
            } else if (imgTag.value.startsWith('http://')) {
                Tips.tagUrl_ObsoleteProtocol(card, 'Twitter', imgTag)
            }
            if (imgTag.value.startsWith('https://')) {
                File.exists(img, File.imageContentType).catch(() => {
                    Tips.tagImage_NoImage(card, 'Twitter', imgTag)
                    card.hideElement(`.preview-img`)
                })
            }
        }
    } else {
        if (img.length > 0) {
            Tips.tag_NonSpecific(card, 'Twitter', 'twitter:image', imgFallbackTag)
        } else {
            Tips.tag_Missing(card, 'Twitter', 'twitter:image')
        }
    }
}

export const openGraphTags = (card: Card, allTags: iTag[], selectedTags: iTag[], canonical: string) => {
    console.log(`Validator.openGraphTags => received ${tagToString(selectedTags)}`)
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
            Tips.tag_NoValue(card, 'Facebook', urlTag)
        } else {
            if (!urlTag.value.startsWith('http')) {
                Tips.tagUrl_RelativePath(card, 'Facebook', urlTag)
            } else if (urlTag.value.startsWith('http://')) {
                Tips.tagUrl_ObsoleteProtocol(card, 'Facebook', urlTag)
            } else if (canonical.length > 0 && urlTag.value.toLowerCase() !== canonical.toLowerCase()) {
                Tips.tagUrl_NonCanonical(card, 'Facebook', urlTag, canonical)
            }
        }
    } else {
        if (url.length > 0) {
            Tips.tag_NonSpecific(card, 'Facebook', 'og:url', urlFallbackTag)
        } else {
            Tips.tag_Missing(card, 'Facebook', 'og:url')
        }
    }

    if (!!titleTag) {
        if (titleTag.value.length === 0) {
            Tips.tag_NoValue(card, 'Facebook', titleTag)
        } else if (titleTag.value.length <= specs.openGraphTags.ogTitle.MinLen) {
            Tips.tag_Placeholder(card, 'Facebook', titleTag)
        } else if (titleTag.value.length > specs.openGraphTags.ogTitle.MaxLen) {
            Tips.tag_OverMaxLength(card, 'Facebook', titleTag, specs.openGraphTags.ogTitle.MaxLen)
        } else if (titleTag.value.length > specs.openGraphTags.ogTitle.MaxRecommendedLen) {
            Tips.tag_OverRecommendedLength(card, 'Facebook', titleTag, specs.openGraphTags.ogTitle.MaxLen, specs.openGraphTags.ogTitle.MaxRecommendedLen)
        }
    } else {
        if (title.length > 0) {
            Tips.tag_NonSpecific(card, 'Facebook', 'og:title', titleFallbackTag)
        } else {
            Tips.tag_Missing(card, 'Facebook', 'og:title')
        }
    }

    if (!!typeTag) {
        if (typeTag.value.length === 0) {
            Tips.tag_NoValue(card, 'Facebook', typeTag)
        } else if (!specs.openGraphTags.ogType.validValues.includes(typeTag.value) && !typeTag.value.includes(':')) {
            Tips.tag_InvalidValue(card, 'Facebook', typeTag, specs.openGraphTags.ogType.validValues)
        }
    } else {
        Tips.tag_Missing(card, 'Facebook', 'og:type')
    }

    if (!!descriptionTag) {
        if (descriptionTag.value.length === 0) {
            Tips.tag_NoValue(card, 'Facebook', descriptionTag)
        } else if (descriptionTag.value.length <= specs.openGraphTags.ogDescription.MinLen) {
            Tips.tag_Placeholder(card, 'Facebook', descriptionTag)
        } else if (descriptionTag.value.length > specs.openGraphTags.ogDescription.MaxLen) {
            Tips.tag_OverMaxLength(card, 'Facebook', descriptionTag, specs.openGraphTags.ogDescription.MaxLen)
        } else if (descriptionTag.value.length > specs.openGraphTags.ogDescription.MaxRecommendedLen) {
            Tips.tag_OverRecommendedLength(card, 'Facebook', descriptionTag, specs.openGraphTags.ogDescription.MaxLen, specs.openGraphTags.ogDescription.MaxRecommendedLen)
        }
    } else {
        if (description.length > 0) {
            Tips.tag_NonSpecific(card, 'Facebook', 'og:description', descriptionFallbackTag)
        } else {
            Tips.tag_Missing(card, 'Facebook', 'og:description')
        }
    }

    if (!!imgTag) {
        if (imgTag.value.length === 0) {
            Tips.tag_NoValue(card, 'Facebook', imgTag)
        } else {
            if (imgTag.value.includes('/assets/no-image-')) {
                Tips.tagImage_Placeholder(card, 'Facebook', imgTag)
            }
            if (imgTag.value.length === 0) {
                Tips.tagImage_NoTag(card, 'Facebook', imgTag.label)
            }
            if (imgTag.value.startsWith('https://')) {
                File.exists(imgTag.value, File.imageContentType).catch(() => {
                    Tips.tagImage_NoImage(card, 'Facebook', imgTag)
                    card.hideElement(`.preview-img`)
                })
            }
            if (!imgTag.value.startsWith('http')) {
                Tips.tagUrl_RelativePath(card, 'Facebook', imgTag)
                if (canonical.length > 0 && canonical.startsWith('http')) {
                    img = new URL(canonical).origin + imgTag.value
                }
            }
            if (imgTag.value.startsWith('http://')) {
                Tips.tagUrl_ObsoleteProtocol(card, 'Facebook', imgTag)
            }
        }
    } else {
        if (img.length > 0) {
            Tips.tag_NonSpecific(card, 'Facebook', 'og:image', imgFallbackTag)
        } else {
            Tips.tag_Missing(card, 'Facebook', 'og:image')
        }
    }
}
