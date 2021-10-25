// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card} from '../card'
import {Mode} from '../colorCode'
import {codeBlock} from '../codeBlock'

export class Info {
    public static notAllSitemapsLoaded(maxNumber: number, urls: string[]) {
        const msg1 = `Too many sitemaps to load and analyze. Only the first ${maxNumber} were loaded and analyzed.`
        const msg2 = `${urls.length} sitemaps in the list below were not loaded and analyzed.`
        const block = `${urls.map(url => `${url.trim()}`).join('\n')}`
        return new Card()
            .info()
            .addParagraph(msg1)
            .addParagraph(msg2)
            .addExpandableBlock('SiteMaps Not Loaded', codeBlock(block, Mode.txt))
            .setTitle('Not All Sitemaps Were Loaded and Analyzed')
    }
}
