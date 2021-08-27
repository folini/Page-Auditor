// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
// ----------------------------------------------------------------------------
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
import "./logos/Unclassified_100x100.png"
import "./logos/Xandr_100x100.png"
import "./logos/IAS_100x100.png"
import "./logos/Wunderkind_100x100.png"
import "./logos/Heap_100x100.png"
import "./logos/Marketo_100x100.png"
import "./logos/VWO_100x100.png"
import "./logos/Cookiebot_100x100.png"
import "./logos/Pardot_100x100.png"
import "./logos/AdRoll_100x100.png"
import "./logos/Quora_100x100.png"
import "./logos/Hotjar_100x100.png"
import "./logos/Trustpilot_100x100.png"
import "./logos/LivePerson_100x100.png"
import "./logos/Reddit_100x100.png"
import "./logos/BuySellAds_100x100.png"
import "./logos/CloudFlare_100x100.png"
import "./logos/GoogleOptimize_100x100.png"
import "./logos/Firebase_100x100.png"
import "./logos/Wordpress_100x100.png"
import "./logos/Riskified_100x100.png"
import "./logos/Onetrust_100x100.png"
import "./logos/Amplitude_100x100.png"
import "./logos/NewRelic_100x100.png"
import "./logos/Squarespace_100x100.png"
import "./logos/Stripe_100x100.png"
import "./logos/AppsFlyer_100x100.png"
import "./logos/Appcues_100x100.png"
import "./logos/BrandMetrics_100x100.png"
import "./logos/Parrable_100x100.png"
import "./logos/Neustar_100x100.png"
import "./logos/TheTradeDesk_100x100.png"
import "./logos/TIDIO_100x100.png"
import "./logos/jQuery_100x100.png"
import "./logos/Tapfiliate_100x100.png"
import "./logos/Intercom_100x100.png"
import "./logos/Clearbit_100x100.png"
import "./logos/Chartbeat_100x100.png"
import "./logos/Onetag_100x100.png"
import "./logos/InsurAds_100x100.png"
import "./logos/UserZoom_100x100.png"
import "./logos/Consensu_100x100.png"
import "./logos/Adobe_100x100.png"
import "./logos/TikTok_100x100.png"

import "./popup.htm"
import "./manifest.json"

import * as LdJson from "./LdJSON"
import {Card} from "./Card"
import * as Tracking from "./tracking"
import * as Credits from "./Credits"
import * as Meta from "./Meta"
import * as Intro from "./Intro"
import * as Robots from "./Robots"

async function action(
  injector: undefined | (() => any),
  reporter: (data: any) => Promise<string>,
  eventManager?: () => void
) {
  var report: string = ""
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true})
  inject: try {
    if (injector === undefined) {
      report = await reporter(undefined)
      break inject
    }

    let res = await chrome.scripting.executeScript({
      target: {tabId: tab.id} as chrome.scripting.InjectionTarget,
      function: injector,
    })
    report = await reporter(res[0].result)
  } catch (err) {
    const emptyTab = `Cannot access a chrome:// URL`
    const emptyTabMsg = `PageAuditor can not run on empty or internal Chrome tabs.<br/><br/>Please launch <b>Page Auditor for Technical SEO</b> on a regular web page.`
    report = new Card()
      .error(err.message === emptyTab ? emptyTabMsg : err.message)
      .render()
  }
  document.getElementById("id-container")!.innerHTML = report

  if (eventManager !== undefined) {
    eventManager()
  }
}

const tabIds = ["id-intro", "id-ld-json", "id-tracking", "id-meta", "id-credits", "id-robots"]

const activateTab = (tabId: string) => {
  tabIds.forEach(t => document.getElementById(t)!.classList.remove("active"))
  document.getElementById(tabId)?.classList.add("active")
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("id-intro")!.addEventListener("click", () => {
    activateTab("id-intro")
    action(Intro.injectableScript, Intro.report)
  })
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
    action(Meta.injectableScript, Meta.report)
  })
  document.getElementById("id-credits")!.addEventListener("click", () => {
    activateTab("id-credits")
    action(Credits.injectableScript, Credits.report)
  })
  document.getElementById("id-robots")!.addEventListener("click", () => {
    activateTab("id-robots")
    action(Robots.injectableScript, Robots.report)
  })

  action(Intro.injectableScript, Intro.report)
})