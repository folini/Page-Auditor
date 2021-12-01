// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {iSize} from 'src/file'
import {Card} from '../card'
import {iTag} from '../cards/mt'
import * as CardBlocks from '../card-blocks'
import {Mode} from '../colorCode'
import {Specs} from '../specs'
import {tipWhat, tipWhy, tipHow} from './tips'

const tagIsCritical = (tag: string) =>
    Specs.openGraphTags.recommendedTags.includes(tag) || Specs.openGraphTags.recommendedTags.includes(tag)

export type Platform = 'Twitter' | 'Facebook' | 'Instagram' | 'LinkedIn' | 'YouTube' | 'Reddit' | 'Standard'

const tagExample = (tagLabel: string, platform: string) => {
    let exampleTagValue = ''
    if (tagLabel.includes('url')) {
        exampleTagValue = `https://mydomain.com/my_page.htm`
    } else if (tagLabel.includes('image')) {
        exampleTagValue = `https://mydomain.com/my_image.png`
    } else if (tagLabel.includes('title')) {
        exampleTagValue = `My click capturing title for ${platform} Tags`
    } else if (tagLabel.includes('description')) {
        exampleTagValue = `My short description of the page for ${platform} Tags`
    } else if (tagLabel === 'twitter:site') {
        exampleTagValue = `@myTwitterId`
    }
    if (exampleTagValue === '') {
        return ''
    }
    return CardBlocks.code(`<meta property="${tagLabel}" content="${exampleTagValue}">`, Mode.html)
}

// ------------------------------------------------------------------------
// META TAGS TIPS
export const noTagsFound = (card: Card) => {
    const what = tipWhat(`The page is doesn't have any meta at all.`)
    const why = tipWhy(
        `Meta Data should always be include in every web page.`,
        `They provide important information to the browser and to the Search Engine bots about the page.`,
        `Also Meta tags allow the page to control how it will be shared by users providing recommendation for title, image and descriptions to be use for sharing post on Social-Media.`
    )
    const how = tipHow(`Add Meta Tags to Your Page in the <code>&lt;head&gt;</code> section of the HTML code.`)
    card.add(CardBlocks.tip(`Add Meta Tags to the Page`, [what, why, how], Specs.metaTags.reference, 85))
}

export const tagWithEmptyValue = (card: Card, platform: Platform, tag: iTag) => {
    const what = tipWhat(`The <code>${tag.label}</code> tag doesn't contain any value.`)
    const why = tipWhy(`A missing value can block crawlers form properly read and process your page meta tags.`)
    const how = tipHow(`Add the missing value to maximize the impact of every on ${platform} post about this page.`)
    card.add(
        CardBlocks.tip(
            `Update The Invalid Meta Tag <code>${tag.label}</code>`,
            [what, why, how],
            platform === 'Twitter' ? Specs.twitterTags.reference : Specs.openGraphTags.reference,
            70
        )
    )
}

export const tagWithObsoleteValue = (card: Card, platform: Platform, tag: iTag, acceptedValues: string[]) => {
    const what = tipWhat(
        `The <code>${tag.label}</code> tag has an obsolete value that is not anymore valid:`,
        CardBlocks.code(`<meta property="${tag.label}" content="${tag.value}">`, Mode.html)
    )
    const why = tipWhy(
        `While for now ${platform} might honoring obsolete values, it's important to update the tag with a proper value.`
    )
    const how = tipHow(
        `Update the obsolete meta tag value on your page by selecting an item from the following list of valid values:`,
        CardBlocks.code(acceptedValues.join('<br>'), Mode.txt)
    )
    card.add(
        CardBlocks.tip(
            `Fix The Obsolete Value for Meta Tag <code>${tag.label}</code>`,
            [what, why, how],
            platform === 'Twitter' ? Specs.twitterTags.reference : Specs.openGraphTags.reference,
            40
        )
    )
}

export const tagWithInvalidValue = (card: Card, platform: Platform, tag: iTag, acceptedValues: string[]) => {
    const what = tipWhat(
        `The <code>${tag.label}</code> is currently set to <code>${tag.value}</code>, not a valid value for this tag.`
    )
    const why = tipWhy(
        `An invalid value can confuse crawlers blocking them form properly read and process your page meta tags.`
    )
    const how = tipHow(
        `Please select a value from the following list of valid values:`,
        CardBlocks.code(acceptedValues.join('<br>'), Mode.txt)
    )
    card.add(
        CardBlocks.tip(
            `Select a Valid Value For <code>${tag.label}</code>`,
            [what, why, how],
            platform === 'Twitter' ? Specs.twitterTags.reference : Specs.openGraphTags.reference,
            80
        )
    )
}

export const tagRepRedundantValue = (card: Card, tags: iTag[], redundantValues: string[]) => {
    const what = tipWhat(
        `The <code>${tags[0].label}</code> is currently set to some redundant values that are not required or making any difference.`,
        `These are the redundant values listed for the tag:`,
        CardBlocks.code(redundantValues.join('<br>'), Mode.txt)
    )
    const why = tipWhy(
        `There is no need to specify the default values for the REP (Robots Exclusion Protocol).`,
        `According to Google documentation, the values <i>${redundantValues.join(
            ', '
        )}</i> are already set by default, no need to specify them explicitly`
    )
    const how = tipHow(`Remove the listed values, and if nothing else is left, remove the entire meta tag.`)
    card.add(
        CardBlocks.tip(
            `Remove the Redundant Value For the <code>${tags[0].label}</code> Meta Tag`,
            [what, why, how],
            {
                label: `Google Reference`,
                url: 'https://developers.google.com/search/blog/2007/03/using-robots-meta-tag',
            },
            10
        )
    )
}

export const tagKeywordsIsObsolete = (card: Card, keywordsTag: iTag) => {
    const what = tipWhat(
        `This page includes a <code>${keywordsTag.label}</code> Meta tag. This tag is not required anymore and is obsolete.`
    )
    const why = tipWhy(
        `The <code>${keywordsTag.label}</code> Meta tag was abused in the past and stuffed with all sort of unrelated keywords.`,
        `Because of that all major search engines are now ignoring this tag and the tag itself is considered obsolete.`
    )
    const how = tipHow(
        `Remove the <code>${keywordsTag.label}</code> from the HTML of your page. There will be no direct SEO benefit, but your page will be simpler and smaller.`
    )
    card.add(
        CardBlocks.tip(
            `Remove the Useless and Obsolete <code>${keywordsTag.label}</code> Meta Tag.`,
            [what, why, how],
            {
                label: `Google Reference`,
                url: 'https://developers.google.com/search/blog/2007/03/using-robots-meta-tag',
            },
            10
        )
    )
}

export const tagTitleIsTooLong = (card: Card, titleTag: iTag) => {
    const what = tipWhat(
        `This page includes a <code>${titleTag.label}</code> Meta tag that is longer than the recommended max of <b>${Specs.metaTags.titleTag.maxLen}<b> characters.`
    )
    const why = tipWhy(
        `The <code>${titleTag.label}</code> might be used by Google when returning your page as a result of a search.`,
        `According to Moz, if the title is longer than ${Specs.metaTags.titleTag.maxLen} characters, Google will truncate it or will use a sentence arbitrarily selected from the page content.`
    )
    const how = tipHow(
        `Rewrite the title using less than ${Specs.metaTags.titleTag.maxLen} characters and update the <code>${titleTag.label}</code> Meta tag accordingly.`
    )
    card.add(
        CardBlocks.tip(
            `Shorten the Meta Tag <code>${titleTag.label}</code>`,
            [what, why, how],
            {
                label: `Google Reference`,
                url: 'https://developers.google.com/search/blog/2007/03/using-robots-meta-tag',
            },
            25
        )
    )
}

export const tagDescriptionIsTooLong = (card: Card, descriptionTag: iTag) => {
    const what = tipWhat(
        `This page includes a <code>${descriptionTag.label}</code> Meta tag that is longer than the recommended max of <b>${Specs.metaTags.descTag.maxLen}</b> characters.`
    )
    const why = tipWhy(
        `The <code>${descriptionTag.label}</code> might be used by Google when returning your page as a result of a search.`,
        `If the description is longer than ${Specs.metaTags.descTag.maxLen} characters, Google will truncate it or will use a sentence arbitrarily selected from the page content.`
    )
    const how = tipHow(
        `Rewrite the description using less than ${Specs.metaTags.descTag.maxLen} characters and update the <code>${descriptionTag.label}</code> Meta tag accordingly.`
    )
    card.add(
        CardBlocks.tip(
            `Shorten the Meta Tag <code>${descriptionTag.label}</code>`,
            [what, why, how],
            {
                label: `Google Reference`,
                url: 'https://developers.google.com/search/blog/2007/03/using-robots-meta-tag',
            },
            35
        )
    )
}

export const tagDescriptionIsTooShort = (card: Card, descriptionTag: iTag) => {
    const what = tipWhat(
        `This page includes a <code>${descriptionTag.label}</code> Meta tag that is shorter than the recommended minimum of <b>${Specs.metaTags.descTag.minLen}<b> characters.`
    )
    const why = tipWhy(
        `The <code>${descriptionTag.label}</code> might be used by Google when returning your page as a result of a search.`,
        `If the description is shorter than ${Specs.metaTags.descTag.minLen} characters, Google might use a sentence arbitrarily selected from the page content.`
    )
    const how = tipHow(
        `Rewrite the description using more than ${Specs.metaTags.descTag.minLen} characters and update the <code>${descriptionTag.label}</code> Meta tag accordingly.`
    )
    card.add(
        CardBlocks.tip(
            `The <code>${descriptionTag.label}</code> Meta Tag Is Too Short.`,
            [what, why, how],
            {
                label: `Google Reference`,
                url: 'https://developers.google.com/search/blog/2007/03/using-robots-meta-tag',
            },
            40
        )
    )
}

export const tagImageIsMissing = (card: Card, platform: Platform, tag: string) => {
    const what = tipWhat(
        `This page is lacking the <code>${tag}</code> meta tag to use with ${platform} when posting about this page.`
    )
    const why = tipWhy(
        `If the <code>${tag}</code> meta tag is missing, ${platform} will not able to associate an image to any post or link about this page, compromising its visibility across social-media.`
    )
    const how = tipHow(
        `Add the missing tag.`,
        `This is an example of the ${platform} Meta Tag that should be added:`,
        CardBlocks.code(`<meta property="${tag}" content="https://www.example.com/my_image.jpg">`, Mode.html),
        platform === 'Twitter' ? Specs.twitterTags.twImage.textualSpecs : Specs.openGraphTags.ogImage.textualSpecs
    )
    card.add(
        CardBlocks.tip(
            `Add the Meta Tag <code>${tag}</code> for Image Preview`,
            [what, why, how],
            'Twitter' ? Specs.twitterTags.reference : Specs.openGraphTags.reference,
            70
        )
    )
}

export const tagImageNotFound = (card: Card, platform: Platform, tag: iTag) => {
    const what = tipWhat(
        `The image at following url specified in the <code>${tag.label}</code> meta tags for ${platform} doesn't exist.`,
        CardBlocks.code(tag.value, Mode.txt)
    )
    const why = tipWhy(
        `If the image linked by the <code>${tag.label}</code> meta tag is missing, ${platform} will not able to associate an image to any post or link about this page, compromising its visibility across social-media.`
    )
    const how = tipHow(
        `Upload the missing image or fix the url to maximize the visual impact on ${platform} of every posts about this page.`,
        platform === 'Twitter' ? Specs.twitterTags.twImage.textualSpecs : Specs.openGraphTags.ogImage.textualSpecs
    )
    card.add(
        CardBlocks.tip(
            `The Image in Meta Tag <code>${tag.label}</code> Is Missing. Upload it.`,
            [what, why, how],
            'Twitter' ? Specs.twitterTags.reference : Specs.openGraphTags.reference,
            65
        )
    )
}

export const tagImageIsaPlaceholder = (card: Card, platform: Platform, tag: iTag) => {
    const what = tipWhat(
        `The image linked in the <code>${tag.label}</code> meta tags for ${platform} is only a placeholder.`,
        `This is the current value of the tag:`,
        CardBlocks.code(tag.value, Mode.txt)
    )
    const why = tipWhy(
        `When this page is shared on ${platform} the image is the most prominent and visible part of the post.`,
        `It's critical to select an image that is relevant to the content of the page and has a high visual impact.`
    )
    const how = tipHow(
        `Upload an image to maximize the visual impact of posts on ${platform} sharing this page.`,
        platform === 'Twitter' ? Specs.twitterTags.twImage.textualSpecs : Specs.openGraphTags.ogImage.textualSpecs
    )
    card.add(
        CardBlocks.tip(
            `Replace the Image Preview Placeholder in <code>${tag.label}</code>`,
            [what, why, how],
            'Twitter' ? Specs.twitterTags.reference : Specs.openGraphTags.reference,
            60
        )
    )
}

export const tagUrlIsNonCanonical = (card: Card, platform: Platform, tag: iTag, canonical: string) => {
    const what = tipWhat(
        `The Meta Tag <code>${tag.label}</code> for ${platform} must be consistent with the canonical URL specified in the <code>&lt;head&gt;</code> section of the HTML page (the must be identical).`
    )
    const why = tipWhy(
        `Sharing a page on social-media with a non-canonical url can dilute the reputation (page-ranking) of the page across multiple urls.`
    )
    const how = tipHow(
        `Replace the current value of the <code>${tag.label}</code> Meta Tag:`,
        CardBlocks.code(`<meta property="${tag.label}" content="${tag.value}">`, Mode.html),
        `With the following <code>${tag.label}</code> code:`,
        CardBlocks.code(`<meta property="${tag.label}" content="${canonical}">`, Mode.html)
    )
    card.add(
        CardBlocks.tip(
            `Use the Canonical Url for the Meta Tag <code>${tag.label}</code>`,
            [what, why, how],
            platform === 'Twitter' ? Specs.twitterTags.reference : Specs.openGraphTags.reference,
            60
        )
    )
}

export const tagUrlIsRelativePath = (card: Card, platform: Platform, tag: iTag, canonical: string) => {
    const what = tipWhat(`The Meta Tag <code>${tag.label}</code> for ${platform} is using a relative url path.`)
    const why = tipWhy(
        `Links in the Meta Tags must always use absolute paths, starting with <code>https://</code>.`,
        `Relative paths will be completely ignored by all search-engine crawler and they will compromise the value of the entire Structured Data section.`
    )
    const how = tipHow(
        `This is the current meta tag:`,
        CardBlocks.code(tag.code, Mode.html),
        canonical.length === 0 ? '' : `And this is how you should fix it:`,
        canonical.length === 0
            ? ''
            : CardBlocks.code(tag.code.replace(' content="', `content="${new URL(canonical).origin}`), Mode.html)
    )
    card.add(
        CardBlocks.tip(
            `Change the Url to Absolute in <code>${tag.label}</code>`,
            [what, why, how],
            platform === 'Twitter' ? Specs.twitterTags.reference : Specs.openGraphTags.reference,
            75
        )
    )
}

export const tagUrlUsesObsoleteProtocol = (card: Card, platform: Platform, tag: iTag) => {
    const what = tipWhat(
        `The url in the Meta Tag <code>${tag.label}</code> for ${platform} is using the unsafe and now obsolete <code>http:</code> protocol.`
    )
    const why = tipWhy(
        `According to the Structured Data specs, all links in the Meta Tags should always use the safest <code>https:</code> protocol.`
    )
    const how = tipHow(`This is the meta tag you should fix:`, CardBlocks.code(tag.code, Mode.html))
    card.add(
        CardBlocks.tip(
            `Change <code>${tag.label}</code> Url Protocol To HTTPS`,
            [what, why, how],
            platform === 'Twitter' ? Specs.twitterTags.reference : Specs.openGraphTags.reference,
            35
        )
    )
}

export const tagIsaPlaceholder = (card: Card, platform: Platform, tag: iTag) => {
    const what = tipWhat(
        `The <code>${tag.label}</code> tag appears to contain only a short placeholder for the tag value:`,
        CardBlocks.code(`<meta property="${tag.label}" content="${tag.value}">`, Mode.html)
    )
    const why = tipWhy(
        `In order for this page to be successfully shared on ${platform} all critical meta tags must be present.`
    )
    const how = tipHow(
        `Replace the placeholder with something more meaningful to maximize the impact of posts on ${platform} sharing this page.`
    )
    card.add(
        CardBlocks.tip(
            `Replace the Placeholder in the <code>${tag.label}</code>`,
            [what, why, how],
            'Twitter' ? Specs.twitterTags.reference : Specs.openGraphTags.reference,
            50
        )
    )
}

export const tagLongerThanRecommended = (
    card: Card,
    platform: Platform,
    tag: iTag,
    maxLength: number,
    recommendedLength: number
) => {
    const what = tipWhat(
        `On this page, the <code>${tag.label}</code> tag is <b>${tag.value.length}</b> characters long.`
    )
    const why = tipWhy(
        `While this tag value is below the the maximum length for <code>${
            tag.label
        }</code>, set at ${maxLength.toFixed()} by the specs, best practices recommend to keep the field even shorter, below <b>${recommendedLength}</b>.`,
        `Keeping the tag at that length will ensure that the value will not be trimmed when a post on ${platform} sharing this page is displayed an small devices.`,
        `Automatic trim can disrupt the content you carefully crafted for this page with unpredictable results.`
    )
    const how = tipHow(`Reduce the length of the tag value to ${recommendedLength.toFixed()}.`)
    card.add(
        CardBlocks.tip(
            `Consider Shortening the Meta Tag <code>${tag.label}</code>`,
            [what, why, how],
            'Twitter' ? Specs.twitterTags.reference : Specs.openGraphTags.reference,
            15
        )
    )
}

export const tagLongerThanMax = (card: Card, platform: Platform, tag: iTag, maxLength: number) => {
    const what = tipWhat(`The <code>${tag.label}</code> tag value is <b>${tag.value.length}</b> characters long.`)
    const why = tipWhy(
        `The length is over the maximum of <b>${maxLength.toFixed()}</b>, specified by ${platform} for this tag.`,
        `Longer values could be trimmed on some device when ${platform} will display a post linking to this page.`,
        `Automatic trim of the content can affect visibility and popularity of post sharing your page on ${platform}.`
    )
    const how = tipHow(
        `Reduce the length of the tag value to make sure your <code>${tag.label}</code> will not be trimmed by ${platform} on posts sharing this page.`
    )
    card.add(
        CardBlocks.tip(
            `Shorten the Meta Tag <code>${tag.label}</code>`,
            [what, why, how],
            'Twitter' ? Specs.twitterTags.reference : Specs.openGraphTags.reference,
            40
        )
    )
}

export const tagShouldBeSpecific = (card: Card, platform: Platform, tagLabel: string, fallbackTag: iTag) => {
    const what = tipWhat(
        `The page doesn't include the specific ${
            tagIsCritical(tagLabel) ? `and critical ` : ``
        } ${platform} meta <code>${tagLabel}</code>, only the generic <code>${
            fallbackTag.label
        }</code> tag is present.`,
        `Crawlers and bots looking for ${platform} tags will fall back to the generic tag.`
    )
    const why = tipWhy(
        `While this issue doesn't have any direct impact on the page SEO, best practices recommend to use the specific meta tags for the ${platform} platform to maximize the performance and visibility of all posts sharing this page on social media.`
    )
    const how = tipHow(`Add the following meta tag to your page:`, tagExample(tagLabel, platform))
    card.add(
        CardBlocks.tip(
            `Add the ${tagIsCritical(tagLabel) ? `Critical` : `Specific`} Meta Tag <code>${tagLabel}</code>`,
            [what, why, how],
            platform === 'Twitter' ? Specs.twitterTags.reference : Specs.openGraphTags.reference,
            tagIsCritical(tagLabel) ? 20 : 10
        )
    )
}

export const tagIsMissing = (card: Card, platform: Platform, tagLabel: string) => {
    const what = tipWhat(
        `The page doesn't include the ${
            tagIsCritical(tagLabel) ? `critical ` : ``
        } ${platform} meta <code>${tagLabel}</code> tag.`
    )
    const why = tipWhy(
        tagIsCritical(tagLabel) ? `Critical ` : ``,
        `Meta tags like <code>${tagLabel}</code> are giving you full control on how a link to your page will be rendered on social-media when someone shares or links your page.`,
        `A well defined and complete set of meta tags maximizes your page visibility and visual impact.`
    )
    const how = tipHow(`Add a meta tag similar to the following:`, tagExample(tagLabel, platform))
    card.add(
        CardBlocks.tip(
            `Add the ${tagIsCritical(tagLabel) ? `Critical ` : platform} Meta Tag <code>${tagLabel}</code>`,
            [what, why, how],
            platform === 'Twitter' ? Specs.twitterTags.reference : Specs.openGraphTags.reference,
            tagIsCritical(tagLabel) ? 65 : 45
        )
    )
}

export const tagIsObsolete = (card: Card, platform: Platform, tagName: string, htmlTag: string) => {
    const what = tipWhat(`The Meta Tag <code>${tagName}</code> for ${platform} is considered obsolete.`)
    const why = tipWhy(
        `Obsolete tags will not hurd the SEO of the page.`,
        `They will be ignored by the search-engine crawlers, but they will make the content of the page less clear, and the maintenance more laborsome.`
    )
    const how = tipHow(
        `Remove the following Meta Tag to comply with the best practices recommended by ${platform}:`,
        CardBlocks.code(htmlTag, Mode.html)
    )
    card.add(
        CardBlocks.tip(
            `Remove the Obsolete ${platform} Meta Tag <code>${tagName}</code>`,
            [what, why, how],
            platform === 'Twitter' ? Specs.twitterTags.reference : Specs.openGraphTags.reference,
            15
        )
    )
}

export const tagOpenGraphNotFound = (card: Card) => {
    const what = tipWhat(`The page doesn't include any Open Graph meta tag.`)
    const why = tipWhy(
        `Meta Tags specific for Facebook, called Open Graph meta tags, should always be include in every web page.`,
        `While they don't have a direct impact on SEO, they control how the page will appear when shared on Facebook and other social-media, like LinkedIn, that are levering the Open Graph standards.` +
            `They provide recommendation to Twitter for title, image, and descriptions.`
    )
    const how = tipHow(
        `Add at least the following most critical Open Graph meta tags to the page.`,
        CardBlocks.code(Specs.openGraphTags.recommendedTags.join('\n'), Mode.txt)
    )
    card.add(
        CardBlocks.tip(
            `Add Facebook (Open Graph) Meta Tags to the Page`,
            [what, why, how],
            Specs.openGraphTags.reference,
            75
        )
    )
}

export const tagTwitterNotFound = (card: Card) => {
    const what = tipWhat(`The page doesn't include any Twitter meta tag.`)
    const why = tipWhy(
        `Meta Tags specific for Twitter should always be include in every web page.`,
        `While they don't have a direct impact on SEO, they control how the page will appear when shared on Twitter.`,
        `They provide recommendation to Twitter for title, image, and descriptions.`
    )
    const how = tipHow(
        `Add at least the following most critical Twitter meta tags to the page.`,
        CardBlocks.code(Specs.twitterTags.recommendedTags.join('\n'), Mode.txt)
    )
    card.add(CardBlocks.tip(`Add Twitter Meta Tags to the Page`, [what, why, how], Specs.twitterTags.reference, 75))
}

export const tagImageIsTooSmall = (
    card: Card,
    platform: Platform,
    tag: iTag,
    minSize: iSize,
    recommendedSize: iSize
) => {
    const what = tipWhat(`The images is smaller that the size recommended by Twitter specs.`)
    const why = tipWhy(
        `Image Meta Tags must conform to the ${platform} specs in order to be successfully included in a social media post.`,
        `While they don't have a direct impact on SEO, non properly sized images can affect how the page will appear when shared on ${platform}.`
    )
    const how = tipHow(
        `Replace the image with a new one with a size larger than ${minSize.width} by ${minSize.height} pixels.`,
        `The recommended size is ${recommendedSize.width} by ${recommendedSize.height} pixels.`
    )
    card.add(
        CardBlocks.tip(
            `Replace <code>${tag.label}</code> with a larger image`,
            [what, why, how],
            Specs.twitterTags.reference,
            75
        )
    )
}

export const tagImageIsTooLarge = (
    card: Card,
    platform: Platform,
    tag: iTag,
    maxSize: iSize,
    recommendedSize: iSize
) => {
    const what = tipWhat(`The images is larger that the size recommended by Twitter specs.`)
    const why = tipWhy(
        `Image Meta Tags must conform to the ${platform} specs in order to be successfully included in a social media post.`,
        `While they don't have a direct impact on SEO, non properly sized images can affect how the page will appear when shared on ${platform}.`
    )
    const how = tipHow(
        `Replace the image with a new one with a size smaller than ${maxSize.width} by ${maxSize.height} pixels.`,
        `The recommended size is ${recommendedSize.width} by ${recommendedSize.height} pixels.`
    )
    card.add(
        CardBlocks.tip(
            `Replace <code>${tag.label}</code> with a smaller image`,
            [what, why, how],
            Specs.twitterTags.reference,
            75
        )
    )
}
