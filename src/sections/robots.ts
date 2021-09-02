// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
// ----------------------------------------------------------------------------
import {Card} from "../card"
import {sectionActions} from "../main"

const injectableScript = () => {
    return document.location.origin
}

const report = async (url: string | undefined, data: any): Promise<string> => {
    const robotsTxtUrl = `${data as string}/robots.txt`

    var report: string = ""
    var robotsTxtBody: string = ""

    try {
        var response = await fetch(robotsTxtUrl)
        if (response.status !== 200) {
            throw `File '${robotsTxtUrl}' not found.`
        }
        robotsTxtBody = await response.text()

        report += new Card()
            .open(``, `Robots.txt`, "icon-rep")
            .add(`<div class='firstLine'>File name: ${robotsTxtUrl}</div>`)
            .add(`<pre class='x-scrollable'>${robotsTxtBody}</pre>`)
            .close()
    } catch (err) {
        report += new Card().warning(err as string)
    }

    var sitemap = await getSiteMap(robotsTxtBody)
    if ((await sitemap).length > 0) {
        report += sitemap
    }
    return report
}

const getSiteMap = async (robotsTxt: string): Promise<string> => {
    var lines = robotsTxt
        .split("\n")
        .filter(line => line.startsWith("Sitemap: "))
    if (lines.length === 0) {
        return ""
    }
    var url = lines[0].split(": ")[1]
    if (url === "") {
        return ""
    }

    var sitemapBody = ""
    try {
        var response = await fetch(url)
        if (response.status !== 200) {
            throw `Sitemap '${url}' not found.`
        }
        sitemapBody = await response.text()
        return new Card()
            .open(``, `Sitemap.xml`, "icon-sitemap")
            .add(`<div class='firstLine'>File name: ${url}</div>`)
            .add(
                `<pre class='x-scrollable'>${sitemapBody
                    .replace(/\</g, "&lt;")
                    .replace(/\>/g, "&gt;")}</pre>`
            )
            .close()
    } catch (err) {
        return new Card().warning(err as string)
    }
}

export const actions: sectionActions = {
    injector: injectableScript,
    reporter: report,
    eventManager: undefined,
}
