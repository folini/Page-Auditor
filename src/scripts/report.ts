// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card} from './card'
import * as Spinner from './spinner'

export class Report {
    #container: HTMLDivElement

    constructor(containerId: string) {
        this.#container = document.getElementById(containerId) as HTMLDivElement
    }

    public addCard(card: Card): Report {
        this.#container.append(card.getDiv())
        return this
    }

    public completed() {
        Spinner.remove(this.#container)
        return this
    }
}
