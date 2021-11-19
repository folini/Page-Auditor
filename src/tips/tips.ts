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

export const tipWhat = (...msg: string[]) => tipWhatWhyHow(`What's Wrong?`, ...msg)
export const tipWhy = (...msg: string[]) => tipWhatWhyHow(`Why To Fix It?`, ...msg)
export const tipHow = (...msg: string[]) => tipWhatWhyHow(`How to Fix It?`, ...msg)

const tipWhatWhyHow = (label: string, ...msg: string[]) => {
    const div = document.createElement('div')
    div.classList.add('tip-what-why-how')
    div.innerHTML =
        `<b>${label} </b>` +
        msg.map(str => (str.startsWith(`<div class='code'`) ? `<div class='tip-code'>${str}</div>` : str)).join(' ') +
        `</div>`
    return div
}
