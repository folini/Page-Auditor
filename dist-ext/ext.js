(()=>{"use strict";var e={};e.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),(()=>{var t;e.g.importScripts&&(t=e.g.location+"");var a=e.g.document;if(!t&&a&&(a.currentScript&&(t=a.currentScript.src),!t)){var n=a.getElementsByTagName("script");n.length&&(t=n[n.length-1].src)}if(!t)throw new Error("Automatic publicPath is not supported in this browser");t=t.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),e.p=t})(),e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p;var t,a=function(e,t,a,n){if("a"===a&&!n)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof t?e!==t||!n:!t.has(e))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===a?n:"a"===a?n.call(e):n?n.value:t.get(e)};class n{constructor(){t.set(this,void 0),function(e,t,a,n,i){if("m"===n)throw new TypeError("Private method is not writable");if("a"===n&&!i)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof t?e!==t||!i:!t.has(e))throw new TypeError("Cannot write private member to an object whose class did not declare it");"a"===n?i.call(e,a):i?i.value=a:t.set(e,a)}(this,t,[],"f")}open(e,n,i){return a(this,t,"f").length=0,a(this,t,"f").push(`\n    <div class='box-card'>\n      ${e.length>0?`<div class='track-category'>${e}</div>`:""}\n      <h2 class='subTitle ${i}'>${n}</h2>\n    `),this}close(){return a(this,t,"f").push("</div>"),this}error(e){return this.open("","Error","icon-error").add(`<div>${e}</div>`).close(),this}warning(e){return this.open("","Warning","icon-warning").add(`<div>${e}</div>`).close(),this}add(e){return e.length>0&&a(this,t,"f").push(e),this}render(){return a(this,t,"f").join("")}}t=new WeakMap;var i=0;const s=e=>{const t=e;var a="";return 0==t.length?(new n).warning("No Structured Data found on this page.").render():(t.forEach(((e,t)=>{const s=void 0===e["@type"]?"":`${e["@type"]}`,o=JSON.stringify(e),r=new n;var c;r.open("",`${s}`,"icon-ld-json"),"n/a"!==s&&r.add(`<div class='schema'><a href='https://shema.org/${s}'>shema.org/${s}</a></div>`),r.add("<div class='ld-json'>"),(c=o,c.includes("\n")||(c=c.replace(/\{/g,"{\n").replace(/\}/g,"\n}").replace(/\,\"/g,',\n"').replace(/\,\{/g,",\n{").replace(/\:\[/g,": [\n").replace(/\]\,/g,"\n],").replace(/\}\]/g,"}\n],").replace(/\\/g,"")),c.split("\n").map((e=>e.trim()))).forEach((e=>r.add((e=>{if(0===e.length)return"";const t=`margin-left:${(20*(i+=null!==e.match(/\}|\]/g)?-1:0)).toFixed()}px;`;return i+=null!==e.match(/\{|\[/g)?1:0,`<div class='single-line-forced'>${e=null!==e.match(/\:\ ?\"/)?`<span class='label' style='${t}'>${e.replace(/\: ?\"/,"</span>: <span class='value'>\"")}</span>`:`<span class='label' style='${t}'>${e}</span>`}</div>`})(e)))),r.add("</div>"),r.close(),a+=r.render()})),a)},o=()=>[...document.scripts].filter((e=>"application/ld+json"===e.type)).map((e=>JSON.parse(e.text.trim()))),r=()=>{const e=[],t=[...document.scripts].filter((e=>"application/ld+json"!==e.type)).map((e=>""===e.src?e.text:e.src)).filter(Boolean);return[{patterns:["tagmanager.com/","googletagservices.com/"],name:"GTM - Google Tag Manager",category:"Tracking",iconClass:"icon-tag-manager",description:"Google Tag Manager is a tag management system (TMS) that allows you to quickly and easily update measurement codes and related code fragments collectively known as tags on your website or mobile app.",url:"https://tagmanager.google.com/",matches:[]},{patterns:["ads-twitter",".twitter.com/","analytics.twitter"],name:"Twitter",category:"Ads and Analytics",iconClass:"icon-twitter",description:"Twitter Ads and Analytics shows you how your audience is responding to your content, what's working, and what's not. Use this data to optimize your future Twitter campaigns and get better results. ",url:"https://business.twitter.com/en/advertising/analytics.html",matches:[]},{patterns:[".doubleclick.net/","//www.googleadservices.com/","adservice.google"],name:"Google Ads",category:"Search, Display, and Remarketing Ads",iconClass:"icon-google-ads",description:"According to Google, Google Ad Services is the umbrella term for all the concepts, networks, and features which comprise a Google Ads account. To put it simply, anything which you can achieve with your Google Ads account is part of Google Ad Services.",url:"https://ads.google.com/",matches:[]},{patterns:["connect.facebook.net/"],name:"Facebook Pixel",category:"Ads Tracking",iconClass:"icon-facebook-pixel",description:"The Facebook Pixel is an analytics tool that allows you to measure the effectiveness of your advertising by understanding the actions people take on your website. You can use the pixel to make sure your ads are shown to the right people.",url:"https://www.facebook.com/business/help/742478679120153",matches:[]},{patterns:["//snap.licdn.com/","linkedin.com/js/analytics"],name:"LinkedIn",category:"Analytics and Tracking",iconClass:"icon-linkedin",description:"LinkedIn ads refer to display ads displayed on, and targeted to users of, the LinkedIn social media platform. LinkedIn ads allow advertisers to target people based on a number of professional factors, including: demographics. employment history.",url:"https://business.linkedin.com/marketing-solutions",matches:[]},{patterns:["//bat.bing.com/p/action","//bat.bing.com/bat.js"],name:"Bing",category:" Ads and Tracking",iconClass:"icon-bing-ads",description:"Microsoft Advertising is a service that provides pay per click advertising on the Bing, Yahoo!, and DuckDuckGo search engines. As of June 2015, Bing Ads has 33% market share in the United States.",url:"https://ads.microsoft.com/",matches:[]},{patterns:["//s.pinimg.com/"],name:"Pinterest",category:"Ads and Tracking",iconClass:"icon-pinterest",description:"Pinterest is an American image sharing and social media service designed to enable saving and discovery of information on the internet using images and, on a smaller scale, animated and videos, in the form of pinboards.",url:"https://ads.pinterest.com/",matches:[]},{patterns:[".google-analytics.com/"],name:"Google Analytics",category:"Tracking",iconClass:"icon-google-analytics-v3",description:"Google Analytics is a web analytics service offered by Google that tracks and reports website traffic, currently as a platform inside the Google Marketing Platform brand. Google launched the service in November 2005 after acquiring Urchin.",url:"https://analytics.google.com/",matches:[]},{patterns:[".pdst.fm/"],name:"Podsights Pixel",category:"Podcast Ads Tracking",iconClass:"icon-podsights",description:"Podcast advertising tracking. The average podcast has three slots for ads — a pre-roll, mid-roll and post-roll. A pre-roll ad greets listeners during the first 15 to 30 seconds of an episode. Mid-roll ads last 60 to 90 seconds and play halfway through an episode. A 20- to 30-second post-roll ad plays just before the closing credits.",url:"https://podsights.com/",matches:[]},{patterns:["//siteimproveanalytics.com/"],name:"Site Improve",category:"Analytics",iconClass:"icon-site-improve",description:"SiteImprove Analytics gives you powerful insights into visitor behavior and website performance with intuitive dashboard and easy-to-use reporting, so you can make data-driven decisions to consistently deliver business results across teams.",url:"https://siteimprove.com/",matches:[]},{patterns:[".sophus3.com/"],name:"Sophus3",category:"Analytics for the Automotive Industry",iconClass:"icon-sophus3",description:"Sophus3 is the cross-platform measurement company that analyses consumer behavior and engages with digital consumers for the world's largest automotive brands.",url:"https://www.sophus3.com/",matches:[]},{patterns:[".getdrip.com/"],name:"Drip",category:"Marketing Automation",iconClass:"icon-drip",description:"Drip is a marketing automation platform built for Ecommerce - utilizing email, SMS and tight 3rd-party integrations to help businesses drive revenue.",url:"https://www.drip.com/",matches:[]},{patterns:[".crazyegg.com/"],name:"Crazy Egg",category:"Heatmaps",iconClass:"icon-crazy-egg",description:"Crazy Egg lets you visualize your website's visitors through a heatmap. A heatmap is an easy way to understand what users want, care about and do on your site by visually representing their clicks - which are the strongest indicators of visitor motivation and desire.",url:"https://crazyegg.com/",matches:[]},{patterns:[".lfeeder.com/"],name:"LeadFeeder",category:"Analytics",iconClass:"icon-leadfeeder",description:"Leadfeeder shows you the companies visiting your website, how they found you and what they are interested in.",url:"https://www.leadfeeder.com/",matches:[]},{patterns:[".outbrain.com/"],name:"OutBrain",category:"Ads Tracking",iconClass:"icon-outbrain",description:"Outbrain is a web advertising platform that displays boxes of links to pages within websites. It displays links to the sites' pages in addition to sponsored content, generating revenue from the latter. Outbrain has been praised for providing a vital source of revenue to publishers.",url:"https://www.outbrain.com/",matches:[]},{patterns:[".qualtrics.com/"],name:"Qualtric",category:"User Experience Management",iconClass:"icon-qualtric",description:"Qualtrics empowers companies to capture and act on customer, product, brand & employee experience insights in one place.",url:"https://www.qualtrics.com/",matches:[]},{patterns:[".avmws.com/"],name:"AvantLink",category:"Tracking",iconClass:"icon-avantlink",description:"AvantLink is an online affiliate referral platform that allows its clients to connect and expand their business partnerships.",url:"https://avantlink.com/",matches:[]},{patterns:[".channeladvisor.com/"],name:"Channel Advisor",category:"Tracking and Analytics",iconClass:"icon-channel-advisor",description:"ChannelAdvisor is a multichannel commerce platform used to connect and optimize the world's commerce. ChannelAdvisor helps brands and retailers worldwide improve their online performance by expanding sales channels, connecting with consumers across the entire buying cycle, optimizing their operations for peak performance, and providing actionable analytics to improve competitiveness.",url:"https://www.channeladvisor.com/",matches:[]},{patterns:["amazon-adsystem.com/"],name:"Amazon Ads",category:"Ads Tracking",iconClass:"icon-amazon-ads",description:"Amazon Advertising (formerly AMS or Amazon Marketing Services) is a service that works in a similar way to pay-per-click ads on Google: sellers only pay when shoppers click on ads (regardless of whether or not the item sells).",url:"https://advertising.amazon.com/",matches:[]},{patterns:["criteo.net/"],name:"Criteo",category:"Ads Tracking",iconClass:"icon-criteo",description:"Criteo is an advertising company that provides online display advertisements. The company was founded and is headquartered in Paris, France.",url:"https://www.criteo.com/",matches:[]},{patterns:["hsadspixel.net/","hscollectedforms.net/","hs-banner.com/","hs-analytics.net/"],name:"HubSpot Analytics",category:"Social Media Tracking",iconClass:"icon-hubspot",description:"HubSpot is an American developer and marketer of software products for inbound marketing, sales, and customer service. Hubspot was founded in 2006.",url:"https://www.hubspot.com/",matches:[]},{patterns:["segment.com/analytics"],name:"Segment",category:"Analytics",iconClass:"icon-segment-analytics",description:"Segment is a Customer Data Platform (CDP), which means that we provide a service that simplifies collecting and using data from the users of your digital properties (websites, apps, etc). With Segment, you can collect, transform, send, and archive your first-party customer data. ",url:"https://segment.com/",matches:[]},{patterns:["quantcount.com/","quantserve.com/"],name:"QuantCast",category:"Tracking",iconClass:"icon-quantcast",description:"Quantcast is an American technology company, founded in 2006, that specializes in AI-driven real-time advertising, audience insights and measurement. It has offices in the United States, Canada, Australia, Singapore, United Kingdom, Ireland, France, Germany, Italy, and Sweden.",url:"https://www.quantcast.com/",matches:[]},{patterns:["neodatagroup.com/"],name:"NeoData Group",category:"Tracking",iconClass:"icon-neodata",description:"NeoData Group masters innovative digital technologies to create solutions to support Brands, Publishers, Broadcasters and Media Agencies engaging their Audience in a Mutual Profitable Relationship.",url:"https://www.neodatagroup.com/en/",matches:[]},{patterns:["driftt.com/"],name:"Drift",category:"Tracking",iconClass:"icon-drift",description:"Drift is the Conversational Marketing platform that combines chat, email, video, and automation to remove the friction from business buying. With Drift, you can start conversations with future customers now, on their terms -- not days later.",url:"https://www.drift.com/",matches:[]},{patterns:["krxd.net/"],name:"Krux (SalesForce)",category:"Analytics",iconClass:"icon-krux-pixel",description:"The krxd.net domain is used in the URLs for Krux`s pixel tracking. Krux is a neutral, pure-play Data Management Platform with no conflicts of interest. Krux was acquired in 2016 by SalesForce.",url:"https://www.kruxanalytics.com/",matches:[]},{patterns:[".scorecardresearch.com/"],name:"ScorecardResearch",category:"Tracking",iconClass:"icon-scorecard",description:"ScorecardResearch, a service of Full Circle Studies, Inc., is part of the Comscore, Inc. market research community, a leading global market research effort that studies and reports on Internet trends and behavior. ScorecardResearch conducts research by collecting Internet web browsing data and then uses that data to help show how people use the Internet, what they like about it, and what they don`t.",url:"https://www.scorecardresearch.com/",matches:[]},{patterns:["ntv.io/"],name:"Nativo",category:"Tracking",iconClass:"icon-nativo",description:"Nativo is an advertising technology platform for brand advertisers and publishers to scale, automate, and measure native ads. For brands, Nativo is the ultimate content advertising platform that combines automation and insights with high-quality reach to scale and optimize engagement with brand content.",url:"https://www.nativo.com/",matches:[]},{patterns:[".adform.net/"],name:"ADForm",category:"Tracking",iconClass:"icon-adform",description:"Adform is a global digital media advertising technology company. Its operations are headquartered in Europe, and its clients vary in size and industry. The company was the first pan-European DSP.",url:"https://site.adform.com/",matches:[]},{patterns:[".taboola.com/"],name:"Taboola",category:"Tracking",iconClass:"icon-taboola",description:"Taboola is a public advertising company headquartered in New York City. It is mostly known for their chumbox online thumbnail grid ads. The company was founded in 2007.",url:"https://www.taboola.com/",matches:[]},{patterns:[".imrworldwide.com/"],name:"Nielsen",category:"Tracking",iconClass:"icon-nielsen",description:"Nielsen Holdings Inc. is an American, information, data and market measurement firm. Nielsen operates in over 100 countries and employs approximately 44,000 people worldwide.",url:"http://www.nielsen.com/",matches:[]},{patterns:[".wt-safetag.com/"],name:"Webtrekk",category:"Analytics",iconClass:"icon-webtrekk",description:"Webtrekk is a German company specialized in the development and sale of software products for the real-time web analytics with raw data.",url:"https://www.webtrekk.com/",matches:[]},{patterns:[".iubenda.com/"],name:"Iubenda",category:"Cookies and Privacy Management",iconClass:"icon-iubenda",description:"Iubenda is an online tool to generate a privacy policy for websites, mobile apps and facebook apps.",url:"https://www.iubenda.com/",matches:[]},{patterns:["cdn.cookielaw.org/"],name:"Cookielaw",category:"Cookies and Privacy Management",iconClass:"icon-cookielaw",description:"Cookielaw is an online tool to manage cookies and privacy in accordance with local laws and regulations.",url:"https://www.cookielaw.org/",matches:[]},{patterns:[".cxense.com/"],name:"Cxense (Piano)",category:"Tracking",iconClass:"icon-cxense",description:"Cxense ASA was a technology company, formed in Oslo, Norway in 2010. In 2019 it was acquired by Piano Media.",url:"https://www.cxense.com/",matches:[]},{patterns:[".wts2.one/"],name:"Web-Stat",category:"Analytics",iconClass:"icon-web-stat",description:"WTS2 observes your visitors in real time as they interact with your site and allows you to optimize your landing pages and website navigation.",url:"https://www.wts2.one/",matches:[]},{patterns:["//replayapp.io/"],name:"Better-Replay",category:"Shopify App",iconClass:"icon-replay-app",description:"Watch full screen recording with playback. See when your users get stuck or confused. Fix areas of your site that lead to drops in conversion.",url:"https://www.better-replay.com/",matches:[]},{patterns:["cartkitcdn.com"],name:"CartKit",category:"Shopify and Wix App",iconClass:"icon-cartkit",description:"Empowering digital businesses so that they can focus on what they do best: creating and selling their unique products.",url:"https://cartkit.com/",matches:[]},{patterns:["herokuapp.com/"],name:"Heroku",category:"Apps Management",iconClass:"icon-heroku",description:"Heroku is a cloud platform that lets companies build, deliver, monitor and scale apps.",url:"https://www.heroku.com/",matches:[]},{patterns:["turner.com/analytics"],name:"Warner Media",category:"Analytics",iconClass:"icon-warnermedia-analytics",description:"",url:"",matches:[]},{patterns:["boomtrain.com/"],name:"Zeta Global",category:"Tracking",iconClass:"icon-zeta-global",description:"",url:"",matches:[]}].forEach((a=>{t.forEach((e=>{a.patterns.map((t=>e.match(new RegExp(t,"ig")))).filter((e=>null!==e&&e.length>0)).forEach((t=>{a.matches.push(e)}))})),a.matches.length>0&&e.push(a)})),e},c=e=>{var t="";return e.sort(((e,t)=>e.name>t.name?1:t.name>e.name?-1:0)).forEach(((e,a)=>{const i=e.url.length>0?`<a target='_new' class='link-in-card' href='${e.url}'>website</a>`:"",s=e.matches.map((e=>e.replace(/\&/g,"&amp;").replace(/(\?|\&)/gi,"\n$1").split("\n").map((e=>{if(e.includes("=")){const t=e.split("=");return`${t[0]}=${decodeURI(t[1])}`}return e})).join("<br/><span></span>"))),o=new n;o.open(`${e.category}`,`${e.name+i}`,`${e.iconClass}`),o.add(`\n        <div class='card-description'>${e.description}</div>\n        <div class='card-options'>\n          <a class='link-in-card left-option n-scripts'>\n            ${s.length.toFixed()} script${1===s.length?"":"s"} found. </a>\n          <ul class='hide'>\n            <li>${s.join("</li><li>")}</li>\n          </ul>\n        </div>`),o.close(),t+=o.render()})),t},l=()=>{[...document.querySelectorAll(".link-in-card.n-scripts")].forEach((e=>e.addEventListener("click",(()=>d(e)))))},d=e=>{var t;const a=null===(t=e.parentElement)||void 0===t?void 0:t.children[1];a.classList.contains("hide")?(a.classList.remove("hide"),a.classList.add("show")):(a.classList.remove("show"),a.classList.add("hide"))},p=()=>{},h=e=>{var t="";return(t+=(new n).open("","Page Auditor","icon-fc").add('\n        <div class=\'credits\'><b>Page Auditor</b> is a free Google Chrome Extension created by Franco Folini.\n        The purpose of <i>PageAuditor</i> is to show, in a way that is simple and easy to understand, all the tracking technologies implemented by a website or single webpage.\n        <br/><br/>\n        This project was inspired by my students\' questions while teaching the Digital Marketing Bootcamp for UC Berkeley Extension.\n            <div class=\'support-form\'>\n                <form action="https://www.paypal.com/donate" method="post" target="_new">\n                    <input type="hidden" name="business" value="UZ2HN43RZVJGA" />\n                    <input type="hidden" name="no_recurring" value="0" />\n                    <input type="hidden" name="item_name" value="Support the development and maintenance of the free \'Page Auditor\' Chrome Extension." />\n                    <input type="hidden" name="currency_code" value="USD" />\n                    <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />\n                </form>\n            </div>\n        </div>').close().render())+(new n).open("","About the Author","icon-franco-avatar").add("<b>Franco Folini</b> is a Digital Marketer with a passion for Web Development, \n        and a Web Developer with a passion for Digital Marketing.\n        You can check Franco work and contact him on the following platforms:\n        <ul class='pointers'>\n            <li class='credits-pointer icon-linkedin'><a href='https://www.linkedin.com/in/francofolini/'>LinkedIn</a></li>\n            <li class='credits-pointer icon-medium'><a href='https://folini.medium.com/'>Medium</a></li>\n            <li class='credits-pointer icon-wordpress'><a href='https://francofolini.com/'>Personal Blog</a></li>\n            <li class='credits-pointer icon-git'><a href='https://github.com/folini'>GIT profile</a></li>\n            <li class='credits-pointer icon-gmail'><a href='mailto:folini@gmail.com'>eMail</a></li>\n        </ul>").close().render()};var m,u=function(e,t,a,n){if("a"===a&&!n)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof t?e!==t||!n:!t.has(e))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===a?n:"a"===a?n.call(e):n?n.value:t.get(e)};class g{constructor(){m.set(this,void 0),function(e,t,a,n,i){if("m"===n)throw new TypeError("Private method is not writable");if("a"===n&&!i)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof t?e!==t||!i:!t.has(e))throw new TypeError("Cannot write private member to an object whose class did not declare it");"a"===n?i.call(e,a):i?i.value=a:t.set(e,a)}(this,m,[],"f")}open(e,t,a){return u(this,m,"f").length=0,u(this,m,"f").push(`\n    <div class='box-card'>\n      ${e.length>0?`<div class='track-category'>${e}</div>`:""}\n      <h2 class='subTitle ${a}'>${t}</h2>\n    `),this}close(){return u(this,m,"f").push("</div>"),this}error(e){return this.open("","Error","icon-error").add(`<div>${e}</div>`).close(),this}warning(e){return this.open("","Warning","icon-warning").add(`<div>${e}</div>`).close(),this}add(e){return e.length>0&&u(this,m,"f").push(e),this}render(){return u(this,m,"f").join("")}}m=new WeakMap;const w=()=>[...document.querySelectorAll("head meta")].map((e=>({property:e.getAttribute("property"),content:e.content}))).filter((e=>null!==e.content&&null!==e.property)),y=e=>{const t=e;var a="";const n=t.filter((e=>e.property.startsWith("twitter:")));if(n.length>0){const e=n.map((e=>`<div class='single-line-forced'>\n            <span class='label'>${e.property}:</span> \n            <span class='value'>${e.content}</span>\n          </div>`)).join(""),t=n.find((e=>"twitter:title"===e.property)).content,i=n.find((e=>"twitter:image"===e.property)).content;s=(s=n.find((e=>"twitter:description"===e.property)).content).length<215?s:s.substr(0,214)+"&mldr;",a+=(new g).open("","Twitter Meta Tags","icon-twitter").add(`\n      <div class='card-description'>With Twitter Cards, you can attach rich photos, videos and media experiences to Tweets, helping to drive traffic to your website. Simply add a few lines of markup to your webpage, and users who Tweet links to your content will have a “Card” added to the Tweet that's visible to their followers.</div>\n      <div class='meta-items'>${e}</div>\n      <div class='card-options'>\n          <a class='link-in-card left-option' id='id-twitter-card-preview'>Preview Twitter Post</a>\n          <div class='hide' id='id-twitter-card'>\n          <h2>${t}</h2>\n          <img src='${i}'>\n          <div>${s}</div>\n          </div>\n      </div>`).close().render()}const i=t.filter((e=>e.property.startsWith("og:")));if(i.length>0){const e=i.map((e=>`<div class='single-line-forced'>\n            <span class='label'>${e.property}:</span> \n            <span class='value'>${e.content}</span>\n          </div>`)).join(""),t=i.find((e=>"og:title"===e.property)).content,n=i.find((e=>"og:image"===e.property)).content;var s;s=(s=i.find((e=>"og:description"===e.property)).content).length<215?s:s.substr(0,214)+"&mldr;",a+=(new g).open("","OpenGraph Meta Tags","icon-open-graph").add(`\n      <div class='card-description'>Open Graph meta tags are snippets of code that control how URLs are displayed when shared on social media. They're part of Facebook's Open Graph protocol and are also used by other social media sites, including LinkedIn and Twitter (if Twitter Cards are absent). You can find them in the <head> section of a webpage.</div>\n      <div class='meta-items'>${e}</div>\n      <div class='card-options'>\n          <a class='link-in-card left-option' id='id-open-graph-card-preview'>Preview Facebook Post</a>\n          <div class='hide' id='id-facebook-card'>        \n          <img src='${n}'>\n          <div>\n            <h2>${t}</h2>\n            ${s}</div>\n          </div>\n      </div>`).close().render()}const o=t.filter((e=>!e.property.startsWith("twitter:")&&!e.property.startsWith("og:")));return o.length>0&&o.forEach((e=>{const t=new g;a+=t.open("","Meta Tags","icon-tag").add(`<div class='meta-items'>\n              <div class='single-line-forced'>\n              <span class='label'>${e.property}:</span> \n              <span class='value'>${e.content}</span>\n              </div>\n          </div>`).close().render()})),0==a.length&&(a=(new g).warning("No Meta Tags found on this page.").render()),a},f=()=>{const e=document.getElementById("id-twitter-card-preview");null!==e&&e.addEventListener("click",(()=>v(e)));const t=document.getElementById("id-open-graph-card-preview");null!==t&&t.addEventListener("click",(()=>v(t)))},v=e=>{var t;const a=null===(t=e.parentElement)||void 0===t?void 0:t.children[1];a.classList.contains("hide")?(e.innerHTML=e.innerHTML.replace("Preview","Hide"),a.classList.remove("hide"),a.classList.add("show")):(e.innerHTML=e.innerHTML.replace("Hide","Preview"),a.classList.remove("show"),a.classList.add("hide"))};async function b(e,t,a){var i="";const[s]=await chrome.tabs.query({active:!0,currentWindow:!0});try{i=t((await chrome.scripting.executeScript({target:{tabId:s.id},function:e}))[0].result)}catch(e){i=(new n).error(e.message).render()}document.getElementById("id-container").innerHTML=i,void 0!==a&&a()}const k=["id-ld-json","id-tracking","id-meta","id-credits"],A=e=>{var t;k.forEach((e=>document.getElementById(e).classList.remove("active"))),null===(t=document.getElementById(e))||void 0===t||t.classList.add("active")};document.addEventListener("DOMContentLoaded",(()=>{document.getElementById("id-ld-json").addEventListener("click",(()=>{A("id-ld-json"),b(o,s)})),document.getElementById("id-tracking").addEventListener("click",(()=>{A("id-tracking"),b(r,c,l)})),document.getElementById("id-meta").addEventListener("click",(()=>{A("id-meta"),b(w,y,f)})),document.getElementById("id-credits").addEventListener("click",(()=>{A("id-credits"),b(p,h)}))}))})();