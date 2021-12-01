// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
export * as Internal from './internal'
export * as RobotsTxt from './robots-txt'
export * as Sitemap from './sitemap'
export * as MetaTags from './meta-tags'
export * as StructuredData from './structured-data'
export * as Html from './html'
export * as Scripts from './scripts'
import * as CardBlocks from '../card-blocks'

export const tipWhat = (...msg: (string | CardBlocks.CardBlock)[]) => tipWhatWhyHow(`What's Wrong?`, ...msg)
export const tipWhy = (...msg: (string | CardBlocks.CardBlock)[]) => tipWhatWhyHow(`Why To Fix It?`, ...msg)
export const tipHow = (...msg: (string | CardBlocks.CardBlock)[]) => tipWhatWhyHow(`How to Fix It?`, ...msg)

const tipWhatWhyHow = (tipTitle: string, ...msg: (string | CardBlocks.CardBlock)[]): CardBlocks.CardBlock => {
    const div = document.createElement('div')
    div.classList.add('tip-what-why-how')
    const labelSpan = document.createElement('span')
    labelSpan.classList.add('tip-what-why-how-label')
    labelSpan.innerHTML = tipTitle
    div.append(labelSpan)
    msg.forEach(tipMsg => {
        if (typeof tipMsg === 'string') {
            const span = document.createElement('span')
            span.innerHTML = tipMsg
            div.append(span)
        } else if (tipMsg.classList.contains('code')) {
            tipMsg.classList.add('tip-code')
            div.append(tipMsg)
        } else {
            div.append(tipMsg)
        }
    })
    return div
}
