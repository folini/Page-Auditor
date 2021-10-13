// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------

import {htmlEncode} from 'js-htmlencode'
import {html_beautify, js_beautify} from 'js-beautify'
import {colorCode, Mode} from './colorCode'
import {sendTaskToWorker} from './main'

export const codeBlock = (code: string, mode: Mode, id: string = '') => {
    const delayedMode = id !== ''
    let codeToDisplay = ''
    if (mode === Mode.js && code.startsWith('http')) {
        mode = Mode.txt
    }

    switch (mode) {
        case Mode.html:
        case Mode.xml:
            codeToDisplay = htmlEncode(html_beautify(code))
            if (delayedMode) {
                sendTaskToWorker(id, mode, codeToDisplay)
                codeToDisplay = codeToDisplay.replace(/\n/g, '<br/>').replace(/\s/gm, '&nbsp;')
            } else {
                codeToDisplay = colorCode(codeToDisplay, mode)
            }
            break

        case Mode.js:
        case Mode.json:
            codeToDisplay = js_beautify(code)
            if (delayedMode) {
                sendTaskToWorker(id, mode, codeToDisplay)
                codeToDisplay = codeToDisplay.replace(/\n/g, '<br/>').replace(/\s/gm, '&nbsp;')
            } else {
                codeToDisplay = colorCode(codeToDisplay, mode)
            }
            break
        case Mode.txt:
            if (delayedMode) {
                sendTaskToWorker(id, mode, code)
                codeToDisplay = code.replace(/\n/g, '<br/>').replace(/\s/gm, '&nbsp;')
            } else {
                codeToDisplay = colorCode(code, mode)
            }
    }

    return `<div class='code'${id ? `id='${id}'` : ''}>${codeToDisplay}</div>`
}
