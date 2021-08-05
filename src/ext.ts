// ----------------------------------------------------------------------------
// Structured-Data Explorer
// To be installed as a Google Chrome Snippet
// Franco Folini - May 2021
// ----------------------------------------------------------------------------
import "./popup.htm"
import "./manifest.json"

import "./logos/Logo256x256.png"
import "./logos/JSON-LD_100x100.png"
import "./logos/ERROR_100x100.png"
import "./logos/WARNING_100x100.png"
import "./logos/DoubleClick_100x100.png"
import "./logos/GoogleAds_100x100.png"
import "./logos/GoogleTagManager_100x100.png"
import "./logos/FacebookPixel_100x100.png"
import "./logos/TwitterAds_100x100.png"
import "./logos/TwitterAnalytics_100x100.png"
import "./logos/LinkedInAds_100x100.png"
import "./logos/BingAds_100x100.png"
import "./logos/Pinterest_100x100.png"
import "./logos/GoogleAnalyticsV3_100x100.png"
import "./logos/Podsights_100x100.png"
import "./logos/SiteImprove_100x100.png"
import "./logos/GoogleSyndication_100x100.png"
import "./logos/WebStat_100x100.png"
import "./logos/ReplayApp_100x100.png"
import "./logos/CartKit_100x100.png"
import "./logos/Heroku_100x100.png"
import "./logos/Hubspot_100x100.png"
import "./logos/KruxPixel_100x100.png"
import "./logos/AmazonAds_100x100.png"
import "./logos/SegmentAnalytics_100x100.png"
import "./logos/TurnerAnalytics_100x100.png"
import "./logos/Criteo_100x100.png"
import "./logos/Zeta_100x100.png"
import "./logos/QuantCast_100x100.png"
import "./logos/AdForm_100x100.png"
import "./logos/Nativo_100x100.png"
import "./logos/Drift_100x100.png"
import "./logos/NeodataGroup_100x100.png"
import "./logos/Sophus3_100x100.png"
import "./logos/Drip_100x100.png"
import "./logos/CrazyEgg_100x100.png"
import "./logos/LeadFeeder_100x100.png"
import "./logos/OutBrain_100x100.png"
import "./logos/Qualtric_100x100.png"
import "./logos/AvantLink_100x100.png"
import "./logos/ChannelAdvisor_100x100.png"
import "./logos/ScoreCard_100x100.png"
import "./logos/Taboola_100x100.png"
import "./logos/Nielsen_100x100.png"
import "./logos/Webtrekk_100x100.png"
import "./logos/Iubenda_100x100.png"
import "./logos/Cxense_100x100.png"
import "./logos/Cookielaw_100x100.png"

import * as LdJson from "./LdJSON"
import * as Card from "./card"
import * as Tracking from "./tracking"

async function action(injector: () => any, reporter: (data: any) => string[], eventManager?: () => void) {
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
  if(eventManager !== undefined) {
    eventManager()
  }
}

const tabIds = ["id-ld-json", "id-tracking", "id-meta"]

const activateTab = (tabId: string) => {
  tabIds.forEach(t => document.getElementById(t)!.classList.remove("active"))
  document.getElementById(tabId)?.classList.add("active")
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("id-ld-json")!.addEventListener("click", () => {
    activateTab("id-ld-json")
    action(LdJson.injectableScript, LdJson.report)
  })
  document.getElementById("id-tracking")!.addEventListener("click", () => {
    activateTab("id-tracking")
    action(Tracking.injectableScript, Tracking.report, Tracking.eventManager)
  })
  document.getElementById("id-meta")!.addEventListener("click", () => {
    activateTab("id-meta")
    action(LdJson.injectableScript, LdJson.report)
  })
})
