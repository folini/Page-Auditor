// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
// ----------------------------------------------------------------------------
import {convertCompilerOptionsFromJson} from 'typescript'
import {Card} from '../card'
import {sectionActions} from '../main'

const injectableScript = () => {
    return document.location.origin
}

const report = async (url: string | undefined, data: any): Promise<string> => {
    var report: string = ''
    var robotsTxtBody: string = ''

    if (url === undefined) {
        return ''
    }

    url = `${data as string}/robots.txt`
    const sitemapUrl = `${data as string}/sitemap.xml`

    try {
        var response = await fetch(url)
        if (response.status !== 200) {
            throw `File '${url}' not found.`
        }
        robotsTxtBody = await response.text()
        const links = [
            {
                url: `https://en.ryte.com/free-tools/robots-txt/?refresh=1&useragent=Googlebot&submit=Evaluate&url=${encodeURI(
                    url
                )}`,
                label: `Validate`,
            },
            {url: url, label: 'Open'},
        ]
        report += new Card()
            .open(``, `Robots.txt`, links, 'icon-rep')
            .add(`<pre class='x-scrollable'>${robotsTxtBody}</pre>`)
            .close()
    } catch (err) {
        report += new Card().warning(err as string)
    }

    var sitemap = await getSiteMaps(robotsTxtBody, sitemapUrl)
    if (sitemap.length > 0) {
        report += sitemap
    }
    return report
}

const getSiteMaps = async (robTxt: string, altUrl: string): Promise<string> => {
    var urls = robTxt
        .split('\n')
        .filter(line => line.startsWith('Sitemap: '))
        .map(line => line.split(': ')[1].trim())
        .map(url => url.trim())
        .filter(line => line.length > 0)

    if (urls.length === 0) {
        urls = [altUrl]
    }

    var report = ''

    for(const url of urls) {
        try {
            console.log(`Report length [${report.length}]`)
            var response = await fetch(url)
            if (response.status !== 200) {
                report += new Card().warning(`Sitemap '${url}' not found.`)
                break
            }
            var xml = await response.text()
            console.log(`Building links...`)
            const links = [
                {
                    url: `https://www.xml-sitemaps.com/validate-xml-sitemap.html?op=validate-xml-sitemap&go=1&sitemapurl=${encodeURI(
                        url
                    )}`,
                    label: `Validate`,
                },
                {url: url, label: 'Open'},
            ]
            report += new Card()
                .open(``, `Sitemap.xml`, links, 'icon-sitemap')
                .add(
                    `<pre class='x-scrollable'>${xml
                        .replace(/\</g, '&lt;')
                        .replace(/\>/g, '&gt;')}</pre>`
                )
                .close()
        } catch (err) {
            console.log(`ERROR [${(err as Error).message}]`)
        }
    }
    return report
}

export const actions: sectionActions = {
    injector: injectableScript,
    reporter: report,
    eventManager: undefined,
}
