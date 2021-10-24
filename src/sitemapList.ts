// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
//
// This code is based on the original work of w3schools.com:
// https://www.w3schools.com/lib/w3codecolor.js version 1.32
//
// ----------------------------------------------------------------------------

const maxSitemapsToLoad = 15

export class SitemapList {
    public doneList: string[]
    public skippedList: string[]
    public failedList: string[]
    public readyList:string[]

    constructor() {
        this.doneList = []
        this.skippedList = []
        this.failedList = []
        this.readyList = []
    }

    public static cleanseUrls(urls: string[]) {
        return[...new Set(urls.map(url => url.trim().replace('http://', 'https://')))]
    }

    private static removeUrlFromList(url: string, list: string[]) {
        const position = list.indexOf(url)
        if(position >= 0) {
            list.splice(position, 1)
        }
    }

    public static maxSitemapsToLoad() {
        return maxSitemapsToLoad
    }

    public addToReady(urlsToAdd: string[]) {
        let toAdd: string[]= []
        let toSkip: string[] = []
        urlsToAdd = SitemapList.cleanseUrls(urlsToAdd)
        urlsToAdd.forEach(url => {
            if(toAdd.length + this.doneList.length + this.readyList.length >= SitemapList.maxSitemapsToLoad()) {
                toSkip.push(url)
            } else {
                toAdd.push(url)
            }
        })
        this.addToSkipped(toSkip)
        this.failedList.forEach(url => SitemapList.removeUrlFromList(url, toAdd))
        this.skippedList.forEach(url => SitemapList.removeUrlFromList(url, toAdd))
        this.readyList.forEach(url => SitemapList.removeUrlFromList(url, toAdd))
        this.readyList.push(...toAdd)
    }

    public addToFailed(urlsToAdd: string[]) {
        let toAdd = SitemapList.cleanseUrls(urlsToAdd)
        toAdd.forEach(url => SitemapList.removeUrlFromList(url, this.readyList))
        toAdd.forEach(url => SitemapList.removeUrlFromList(url, this.failedList))
        toAdd.forEach(url => SitemapList.removeUrlFromList(url, this.skippedList))
        this.failedList.push(...toAdd)
    }

    public addToSkipped(urlsToAdd: string[]) {
        let toAdd = SitemapList.cleanseUrls(urlsToAdd)
        toAdd.forEach(url => SitemapList.removeUrlFromList(url, this.readyList))
        toAdd.forEach(url => SitemapList.removeUrlFromList(url, this.failedList))
        toAdd.forEach(url => SitemapList.removeUrlFromList(url, this.skippedList))
        this.skippedList.push(...toAdd)
    }

    public addToDone(urlsToAdd: string[]) {
        let toAdd = SitemapList.cleanseUrls(urlsToAdd)
        toAdd.forEach(url => SitemapList.removeUrlFromList(url, this.readyList))
        toAdd.forEach(url => SitemapList.removeUrlFromList(url, this.failedList))
        toAdd.forEach(url => SitemapList.removeUrlFromList(url, this.skippedList))
        toAdd.forEach(url => SitemapList.removeUrlFromList(url, this.doneList))
        this.doneList.push(...toAdd)
    }

    public toString() {
        return `[Ready: ${this.readyList.length}, Done: ${this.doneList.length}, Skip: ${this.skippedList.length}, Failed: ${this.failedList.length}]`
    }
}