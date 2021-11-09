// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
const maxSitemapsToLoad = 15

export enum SmSource {
    RobotsTxt = 1,
    SitemapIndex = 1,
    Default = 0,
}

export interface iSmCandidate {
    url: string
    source: SmSource
}

export class SmList {
    public doneList: iSmCandidate[]
    public skippedList: iSmCandidate[]
    public failedList: iSmCandidate[]
    public toDoList: iSmCandidate[]

    constructor() {
        this.doneList = []
        this.skippedList = []
        this.failedList = []
        this.toDoList = []
    }

    #isFailed(sm: iSmCandidate) {
        return this.failedList.filter(failedSm => failedSm.url === sm.url).length > 0
    }

    #isSkipped(sm: iSmCandidate) {
        return this.skippedList.filter(skippedSm => skippedSm.url === sm.url).length > 0
    }

    #isDone(sm: iSmCandidate) {
        return this.doneList.filter(doneSm => doneSm.url === sm.url).length > 0
    }

    #removeToDo(sm: iSmCandidate) {
        this.toDoList = this.toDoList.filter(item => item.url !== sm.url)
    }

    static #sanitizeSm(sm: iSmCandidate): iSmCandidate {
        return {url: sm.url.replace('http://', 'https://'), source: sm.source}
    }

    public static cleanseCandidates(sitemaps: iSmCandidate[]) {
        sitemaps.forEach((sm1, indexSm1) => {
            while (sitemaps.filter(sm => sm1.url === sm.url).length > 1) {
                const indexSm2 = sitemaps.findIndex((sm, i) => sm.url === sm1.url && i !== indexSm1)
                if (sm1.source > sitemaps[indexSm2].source) {
                    sitemaps.splice(indexSm2, 1)
                } else {
                    sitemaps.splice(indexSm1, 1)
                }
            }
        })
        return sitemaps
    }

    public static maxSitemapsToLoad() {
        return maxSitemapsToLoad
    }

    public addToDo(sms: iSmCandidate[]) {
        sms = sms.map(sm => SmList.#sanitizeSm(sm))
        sms.forEach(candidateSm => {
            if (!this.#isFailed(candidateSm) && !this.#isSkipped(candidateSm) && !this.#isDone(candidateSm)) {
                this.toDoList.push(candidateSm)
            }
        })

        while (this.toDoList.length > maxSitemapsToLoad) {
            this.addSkipped(this.toDoList.at(-1)!)
            this.toDoList.pop()
        }
        SmList.cleanseCandidates(this.toDoList)
    }

    public addFailed(sm: iSmCandidate) {
        sm = SmList.#sanitizeSm(sm)
        if (!this.#isFailed(sm) && !this.#isSkipped(sm) && !this.#isDone(sm)) {
            this.failedList.push(sm)
        }
        this.#removeToDo(sm)
    }

    public addSkipped(sm: iSmCandidate) {
        sm = SmList.#sanitizeSm(sm)
        if (!this.#isFailed(sm) && !this.#isSkipped(sm) && !this.#isDone(sm)) {
            this.skippedList.push(sm)
        }
        this.#removeToDo(sm)
    }

    public addDone(sm: iSmCandidate) {
        sm = SmList.#sanitizeSm(sm)
        if (!this.#isFailed(sm) && !this.#isSkipped(sm) && !this.#isDone(sm)) {
            this.doneList.push(sm)
        }
        this.#removeToDo(sm)
    }

    public toString() {
        return `[Ready: ${this.toDoList.length}, Done: ${this.doneList.length}, Skip: ${this.skippedList.length}, Failed: ${this.failedList.length}]`
    }
}
