// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
// ----------------------------------------------------------------------------
import {Card} from "./Card"
const trackingClasses = require("./trackingClasses.json") as iTrackClass[]

interface iTrackClass {
  patterns: string[]
  url: string
  name: string
  category: string
  iconClass: string
  description: string
}

interface iTrackMatch extends iTrackClass {
  matches: string[]
}

interface iScript {
  script: string
  done: boolean
}

  const unresolvedCat: iTrackMatch = {
    patterns: [],
    name: "Unresolved Javascript Code",
    category: "JavaScript",
    iconClass: "icon-unclassified",
    description:
      "Page Auditor for Technical SEO is not yet able to classify the following JavaScript code.",
    url: "",
    matches: [],
  }


export const injectableScript = (): iScript[] => {
  return [...document.scripts]
    .filter(s => s.type !== "application/ld+json")
    .map(s => (s.src === "" ? s.text : s.src))
    .filter(Boolean)
    .map(s => ({script: s, done: false})) as iScript[]
}


export const report = async (untypedScripts: any): Promise<string> => {

  var scripts = untypedScripts as iScript[]

  const trackMatches: iTrackMatch[] = trackingClasses.map(track => ({
    ...track,
    matches: [],
  })) as iTrackMatch[]

  var trackingItems: iTrackMatch[] = []

  trackMatches.forEach(cat => {
    scripts.forEach(scr => {
      cat.patterns
        .map(pattern => scr.script.match(new RegExp(pattern, "ig")))
        .filter(match => match !== null && match.length > 0)
        .forEach(m => {
          const script =
            scr.script.length > 80
              ? `${scr.script.substr(0, 80)}...`
              : scr.script
          cat.matches.push(script.replace(/\s/g, " "))
          scr.done = true
        })
    })
    if (cat.matches.length > 0) {
      trackingItems.push(cat)
    }
  })

  scripts
    .filter(scr => !scr.done && scr.script.match(/^https\:\/\//))
    .forEach(scr => {
      unresolvedCat.matches.push(scr.script)
    })

  if (unresolvedCat.matches.length > 0) {
    trackingItems.push(unresolvedCat)
  }

  var report: string = ""

  if (trackingItems === null) {
    throw new Error("No trackers found.")
  }

  trackingItems
    .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
    .forEach((t, i) => {
      const link =
        t.url.length > 0
          ? `<a target='_new' class='link-in-card' href='${t.url}'>website</a>`
          : ``
      const matches = t.matches.map(match =>
        match
          .replace(/\&/g, `&amp;`)
          .replace(/(\?|\&)/gi, "\n$1")
          .split("\n")
          .map(m => {
            if (!m.includes("=")) {
              return m
            }
            try {
              const labelValue = m.split("=")
              return `${labelValue[0]}=${decodeURI(labelValue[1])}`
            } catch (_) {
              return m
            }
          })
          .join("<br/><span></span>")
      )

      const card = new Card()
      card.open(t.category, `${t.name + link}`, t.iconClass)
      card.add(`
        <div class='card-description'>${t.description}</div>
        <div class='card-options'>
          <a class='link-in-card left-option n-scripts'>
            ${matches.length.toFixed()} script${
        matches.length === 1 ? "" : "s"
      } found. </a>
          <ul class='hide'>
            <li>${matches.join("</li><li>")}</li>
          </ul>
        </div>`)
      card.close()
      report += card.render()
    })
  return report
}

export const eventManager = () => {
  const btns = [
    ...document.querySelectorAll(".link-in-card.n-scripts"),
  ] as HTMLAnchorElement[]
  btns.forEach(btn => btn.addEventListener("click", () => toggle(btn)))
}

export const toggle = (btn: HTMLAnchorElement) => {
  const ul: HTMLUListElement = btn.parentElement
    ?.children[1] as HTMLUListElement
  if (ul.classList.contains("hide")) {
    ul.classList.remove("hide")
    ul.classList.add("show")
  } else {
    ul.classList.remove("show")
    ul.classList.add("hide")
  }
}
