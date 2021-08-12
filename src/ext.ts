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
import "./logos/Google_100x100.png"
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
import "./logos/FC_100x100.png"
import "./logos/FC_White_100x100.png"
import "./logos/Medium_100x100.png"
import "./logos/Wordpress_100x100.png"
import "./logos/Git_100x100.png"
import "./logos/Gmail_100x100.png"
import "./logos/Avatar_200x200.png"
import "./logos/Tag_100x100.png"
import "./logos/OpenGraph_100x100.png"
import "./logos/Swiftype_100x100.png"
import "./logos/REP_100x100.png"
import "./logos/Lock_100x100.png"
import "./logos/SEO_100x100.png"
import "./logos/Windows_100x100.png"
import "./logos/Chromium_100x100.png"
import "./logos/Apple_100x100.png"
import "./logos/Shopify_100x100.png"
import "./logos/Branch_100x100.png"
import "./logos/IE_100x100.png"
import "./logos/MS_100x100.png"

import * as LdJson from "./LdJSON"
import {Card} from "./Card"
import * as Tracking from "./tracking"
import * as Credits from "./Credits"
import * as Meta from "./Meta"

async function action(
  injector: undefined | (() => any),
  reporter: (data: any) => string,
  eventManager?: () => void
) {
  var report: string = ""
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true})
  inject: try {
    if (injector === undefined) {
      report = reporter(undefined)
      break inject
    }

    let res = await chrome.scripting.executeScript({
      target: {tabId: tab.id} as chrome.scripting.InjectionTarget,
      function: injector,
    })
    report = reporter(res[0].result)
  } catch (err) {
    const emptyTab = `Cannot access a chrome:// URL`
    const emptyTabMsg = `PageAuditor can not run on aqn empty tab. Please activate the Page Auditor on a regular web page.`
    report = new Card()
      .error(err.message === emptyTab ? emptyTabMsg : err.message)
      .render()
  }
  document.getElementById("id-container")!.innerHTML = report
  if (eventManager !== undefined) {
    eventManager()
  }
}

const tabIds = ["id-ld-json", "id-tracking", "id-meta", "id-credits"]

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
    action(Meta.injectableScript, Meta.report, Meta.eventManager)
  })
  document.getElementById("id-credits")!.addEventListener("click", () => {
    activateTab("id-credits")
    action(Credits.injectableScript, Credits.report)
  })
})
