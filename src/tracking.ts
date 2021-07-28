import * as Card from "./card"

interface iTracker {
  url: string
  name: string
  iconClass: string
}

export const injectableScript = (): iTracker[] => {
  const trackerTypes = [
    {
      pattern: "tagmanager",
      name: "Google Tag Manager",
      iconClass: "icon-tag-manager",
    },
    {
      pattern: "ads-twitter",
      name: "Twitter Ads",
      iconClass: "icon-twitter-ads",
    },
    {
      pattern: "analytics.twitter",
      name: "Twitter Analytics",
      iconClass: "icon-twitter-analytics",
    },
    {
      pattern: "https\\:/\/www\.googleadservices\.com\/",
      name: "Google Ads",
      iconClass: "icon-google-ads",
    },
    {
      pattern: "connect\.facebook\.net\/signals",
      name: "Facebook Pixel",
      iconClass: "icon-facebook-pixel",
    },
    {
      pattern: "https\:\/\/googleads\.g\.doubleclick\.net\/",
      name: "Google DoubleClick Digital Marketing",
      iconClass: "icon-double-click",
    },
    {
      pattern: "https\:\/\/snap\.licdn\.com\/",
      name: "LinkedIn Ads",
      iconClass: "icon-linkedin-ads"
    },
    {
      pattern: "https\:\/\/bat\.bing\.com\/",
      name: "Bing Ads",
      iconClass: "icon-bing-ads"
    },
    {
      pattern: "https\:\/\/s\.pinimg\.com\/",
      name: "Pinterest Tracking",
      iconClass: "icon-pinterest"
    },
    {
      pattern: "https\:\/\/www\.google\-analytics\.com\/analytics.js",
      name: "Google Analytics Tracking v3",
      iconClass: "icon-google-analytics-v3"
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
