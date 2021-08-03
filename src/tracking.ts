import * as Card from "./card"

interface iTracker {
  url: string
  name: string
  iconClass: string
}

export const injectableScript = (): iTracker[] => {
  const trackerTypes = [
    {
      pattern: "tagmanager\.com\/",
      name: "GTM - Google Tag Manager",
      iconClass: "icon-tag-manager",
    },
    {
      pattern: "googletagservices\.com\/",
      name: "Google Tag Services (GTM)",
      iconClass: "icon-tag-manager",
    },
    {
      pattern: "ads-twitter",
      name: "Twitter Ads",
      iconClass: "icon-twitter-ads",
    },
    {
      pattern: "analytics\.twitter",
      name: "Twitter Analytics",
      iconClass: "icon-twitter-analytics",
    },
    {
      pattern: "/\/www\.googleadservices\.com\/",
      name: "Google Remarketing Ads",
      iconClass: "icon-google-ads",
    },
    {
      pattern: "adservice\.google",
      name: "Google Remarketing Ads",
      iconClass: "icon-google-ads",
    },
    {
      pattern: "connect\.facebook\.net\/signals",
      name: "Facebook Pixel",
      iconClass: "icon-facebook-pixel",
    },
    {
      pattern: "\.doubleclick\.net\/",
      name: "Google DoubleClick Digital Marketing",
      iconClass: "icon-double-click",
    },
    {
      pattern: "\/\/snap\.licdn\.com\/",
      name: "LinkedIn Ads",
      iconClass: "icon-linkedin-ads"
    },
    {
      pattern: "linkedin\.com\/js\/analytics",
      name: "LinkedIn Analytics",
      iconClass: "icon-linkedin-ads"
    },
    {
      pattern: "\/\/bat\.bing\.com\/p\/action",
      name: "Bing Ads (3rd Party Cookies)",
      iconClass: "icon-bing-ads"
    },
    {
      pattern: "\/\/bat\.bing\.com\/bat\.js",
      name: "Bing Tracker",
      iconClass: "icon-bing-ads"
    },
    {
      pattern: "\/\/s\.pinimg\.com\/",
      name: "Pinterest Tracking",
      iconClass: "icon-pinterest"
    },
    {
      pattern: "\/\/www\.google\-analytics\.com\/analytics.js",
      name: "Google Analytics Tracking v3",
      iconClass: "icon-google-analytics-v3"
    },
    {
      pattern: "\/\/cdn\.pdst\.fm\/",
      name: "Podsights Tracking",
      iconClass: "icon-podsights"
    },
    {
      pattern: "\/\/siteimproveanalytics\.com\/",
      name: "Site Improve Analytics",
      iconClass: "icon-site-improve"
    },
    {
      pattern: "\/\/pagead2\.googlesyndication\.com\/",
      name: "Google Syndication",
      iconClass: "icon-google-syndication"
    },
    {
      pattern: "\.wts2\.one\/",
      name: "Web-Stat Analytics",
      iconClass: "icon-web-stat"
    },
    {
      pattern: "\/\/replayapp\.io\/",
      name: "Better-Replay (Shopify App)",
      iconClass: "icon-replay-app"
    },
    {
      pattern: "cartkitcdn\.com\/",
      name: "CartKit (Shopify and Wix App)",
      iconClass: "icon-cartkit"
    },
    {
      pattern: "herokuapp\.com\/",
      name: "Heroku (Apps management) ",
      iconClass: "icon-heroku"
    },
    {
      pattern: "hsadspixel\.net\/",
      name: "HubSpot Tracking Pixel",
      iconClass: "icon-hubspot"
    },
    {
      pattern: "hscollectedforms\.net\/",
      name: "HubSpot Forms Tracker",
      iconClass: "icon-hubspot"
    },
    {
      pattern: "hs-banner\.com\/",
      name: "HubSpot Banner Tracker",
      iconClass: "icon-hubspot"
    },
    {
      pattern: "hs-analytics\.net\/",
      name: "HubSpot Analytics",
      iconClass: "icon-hubspot"
    },
    {
      pattern: "krxd\.net\/",
      name: "Krux (SalesForce) Tracking Pixel",
      iconClass: "icon-krux-pixel"
    },
    {
      pattern: "amazon\-adsystem\.com\/",
      name: "Amazon Ads Tracker",
      iconClass: "icon-amazon-ads"
    },
    {
      pattern: "segment\.com\/analytics",
      name: "Segment Analytics",
      iconClass: "icon-segment-analytics"
    },
    {
      pattern: "turner\.com\/analytics",
      name: "Warner Media Analytics",
      iconClass: "icon-warnermedia-analytics"
    },
    {
      pattern: "criteo\.net\/",
      name: "Criteo Tracking",
      iconClass: "icon-criteo"
    },
    {
      pattern: "boomtrain\.com\/",
      name: "Zeta Global Tracking",
      iconClass: "icon-zeta-global"
    },
    {
      pattern: "quantcount\.com\/",
      name: "QuantCast Tracking",
      iconClass: "icon-quantcast"
    },
    {
      pattern: "quantserve\.com\/",
      name: "QuantCast Tracking",
      iconClass: "icon-quantcast"
    },
    {
      pattern: "washingtonpost\.com\/wp-stat\/",
      name: "Washington Post Tracking",
      iconClass: "icon-washingtonpost"
    },
    {
      pattern: "track\.adform\.net\/",
      name: "ADForm Tracking",
      iconClass: "icon-adform"
    },
    {
      pattern: "ntv.io\/",
      name: "Nativo Tracking",
      iconClass: "icon-nativo"
    },
    {
      pattern: "driftt\.com\/",
      name: "Drift Tracking",
      iconClass: "icon-drift"
    }
  ]

  const trackers: iTracker[] = []
  ;[...document.scripts]
    .map(s => s.src)
    .filter(Boolean)
    .forEach(url =>
      trackerTypes.forEach(t => {
        if (url.match(new RegExp(t.pattern, "ig")) !== null) {
          trackers.push({url: url, name: t.name, iconClass: t.iconClass})
        }
      })
    )
  return trackers
}

export const report = (trackersUntyped: any): string[] => {
  const trackers: iTracker[] = trackersUntyped as iTracker[]

  const report: string[] = []
  trackers
    .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
    .forEach(t => {
      report.push(Card.open(`${t.name}`, `${t.iconClass}`))
      report.push(`<div class='track-url'>${t.url}</div>`)
      report.push(Card.close())
    })
  return report
}
