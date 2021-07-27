// ----------------------------------------------------------------------------
// Structured-Data Explorer
// To be installed as a Google Chrome Snippet
// Franco Folini - May 2021
// ----------------------------------------------------------------------------
import "./popup.htm"
import "./manifest.json"
import "./img/Logo256x256.png"
import "./img/JSON-LD_100x100.png"
import "./img/ERROR_100x100.png"
import "./img/WARNING_100x100.png"
import * as LdJson from "./LdJSON"
import * as Card from "./card"
import * as Tracking from './tracking'

async function action(injector: () => any, reporter: (data: any) => string[]) {
  var report: string[] = []
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true})
  try {
    let res = await chrome.scripting.executeScript({
      target: {tabId: tab.id} as chrome.scripting.InjectionTarget,
      function: injector,
    })
    report = reporter(res[0].result)
  } catch (err) {
    report.push(Card.error(err.message))
  }
  document.getElementById("id-container")!.innerHTML = report.join("")
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("id-ld-json")!.addEventListener("click", () => {
    action(LdJson.injectableScript, LdJson.report)
  })
  document.getElementById("id-tracking")!.addEventListener("click", () => {
    action(Tracking.injectableScript, Tracking.report)
  })
  document.getElementById("id-meta")!.addEventListener("click", () => {
    action(LdJson.injectableScript, LdJson.report)
  })
})
