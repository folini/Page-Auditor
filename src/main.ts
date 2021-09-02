// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
// ----------------------------------------------------------------------------
import "./logos/Logo_256x256.png"
import "./default.htm"
import "./manifest.json"
import "./styles/style.less"

import {Card} from "./card"
import * as JsonLd from "./sections/jsonld"
import * as Scripts from "./sections/scripts"
import * as Credits from "./sections/credits"
import * as Meta from "./sections/meta"
import * as Intro from "./sections/intro"
import * as Robots from "./sections/robots"

export type sectionActions = {
    injector: undefined | (() => any)
    reporter: (url: string | undefined, data: any) => Promise<string>
    eventManager: undefined | (() => void)
}

type sectionType = {
    tabId: string
    name: string
    reportId: string
    actions: sectionActions
}

const sections: sectionType[] = [
    {
        tabId: "id-intro",
        name: "Intro",
        reportId: "id-report-intro",
        actions: Intro.actions,
    },
    {
        tabId: "id-meta",
        name: "Meta<br/>Tags",
        reportId: "id-report-meta",
        actions: Meta.actions,
    },
    {
        tabId: "id-jsonld",
        name: "Structured<br/>Data",
        reportId: "id-report-jsonld",
        actions: JsonLd.actions,
    },
    {
        tabId: "id-scripts",
        name: "JavaScript<br/>Code",
        reportId: "id-report-scripts",
        actions: Scripts.actions,
    },
    {
        tabId: "id-robots",
        name: "Robots.Txt<br/>Sitemaps",
        reportId: "id-report-robots",
        actions: Robots.actions,
    },
    {
        tabId: "id-credits",
        name: "Credits",
        reportId: "id-report-credits",
        actions: Credits.actions,
    },
]

async function action(section: sectionType, actions: sectionActions) {
    var report: string = ""
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true})
    let res: chrome.scripting.InjectionResult[] = []

    try {
        if (actions.injector !== undefined) {
            res = await chrome.scripting.executeScript({
                target: {tabId: tab.id} as chrome.scripting.InjectionTarget,
                function: actions.injector,
            })
        }
        report = await actions.reporter(
            tab.url,
            res.length > 0 ? res[0].result : undefined
        )
    } catch (err: any) {
        const emptyTab = `Cannot access a chrome:// URL`
        const emptyTabMsg = `PageAuditor can not run on empty or internal Chrome tabs.<br/><br/>Please launch <b>Page Auditor for Technical SEO</b> on a regular web page.`
        report = new Card().error(
            (err as Error).message === emptyTab ? emptyTabMsg : err.message
        )
    }

    document.getElementById(section.reportId)!.innerHTML = report

    if (actions.eventManager !== undefined) {
        actions.eventManager()
    }
}

const activateSection = (activeSec: sectionType) => {
    sections.forEach(sec => {
        document.getElementById(sec.tabId)!.classList.remove("active")
        document.getElementById(sec.reportId)!.classList.remove("show")
    })
    document.getElementById(activeSec.tabId)?.classList.add("active")
    document.getElementById(activeSec.reportId)?.classList.add("show")
    action(activeSec, activeSec.actions)
}

document.addEventListener("DOMContentLoaded", () => {
    const tabsContainer = document.getElementById("id-tabs") as HTMLUListElement
    const reportContainer = document.getElementById(
        "id-report-outer-container"
    ) as HTMLDivElement
    sections.forEach((section, i) => {
        const sep = document.createElement("li")
        sep.className = i === 0 ? "gap-mini" : "gap-sep"
        tabsContainer.append(sep)
        const tab = document.createElement("li")
        tab.id = section.tabId
        tab.innerHTML = section.name
        tab.addEventListener("click", () => activateSection(section))
        tabsContainer.append(tab)
        const report = document.createElement("div")
        report.id = section.reportId
        report.className = "inner-report-container"
        reportContainer.append(report)
        const spinner = document.createElement("div")
        spinner.className = "loading-spinner"
        report.append(spinner)
    })
    activateSection(sections[0])
})
