// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import * as HTML from '../scripts/cards/html'
import * as SitemapList from './sitemapList'

export const iImgToString = (img: HTML.iImg[] | HTML.iImg): string => {
    if (Array.isArray(img)) {
        return img.map(iImgToString).join('\n')
    }
    return `[src: "${img.src}", alt: "${img.alt}"]`
}

export const smListToString = (sm: SitemapList.SmList) => {
    return `[Ready: ${sm.toDoList.length}, Done: ${sm.doneList.length}, Skip: ${sm.skippedList.length}, Failed: ${sm.failedList.length}]`
}
