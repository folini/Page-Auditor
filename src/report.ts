// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Errors} from './cards/errors'

export class Report {
    #container: HTMLDivElement

    constructor(containerId: string) {
        this.#container = document.getElementById(containerId) as HTMLDivElement
    }

    public addCard(card: any) {
        this.#container.querySelector('.loading-spinner')?.remove()
        if (typeof card.getDiv === 'function') {
            this.#container.append(card.getDiv())
        } else {
            const errCard = Errors.internal_fromError(card, 'Unable to add item to report')
            this.#container.append(errCard.getDiv())
        }
        return card
    }
}
