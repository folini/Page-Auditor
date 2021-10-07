// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {colorCode, Mode} from './colorCode'
import {js_beautify, html_beautify} from 'js-beautify'

export const workerAction = (event: MessageEvent<any>) => {
    let code = event.data.code
    let id = event.data.id
    let mode = event.data.mode as Mode

    if (mode === 'js' && !code.startsWith('http')) {
        code = js_beautify(code)
    } else if (mode === 'html') {
        code = html_beautify(code)
    }

    postMessage({
        id: id,
        code: code.startsWith('http') ? code : colorCode(code, mode),
    })
}

onmessage = workerAction
