# Page Auditor for Technical SEO 
<img src='./web-store-images/Store-Icon_128x128.png' align='right' style='margin-right:16px;width:72px;'>**Page Auditor for Technical SEO** is an open source free _Google Chrome Extension_ created by [Franco Folini](https://www.linkedin.com/in/francofolini/) to explore and analyze the main on-page technical SEO features of any web page.



# Purpose
**Page Auditor** is a _Google Chrome Extension_ that can be installed on any Google Chrome and used to explore the content of any webpage. The goal is to make the _On-Page Technical SEO Analysis_ of a web page easier for everybody, and in particular for non technical people.

Performing a _On-Page Technical SEO Analysis_ requires exploring many of the hidden elements of an HTML page, including Meta Tags, Structured Data, JavaScrips, `Robots.txt` and `Sitemap.xml` files. It can be challenging, in particular for people without a technical background. All these components are important for the page SEO performance. **Page Auditor** makes it easy to look at all these elements and can be used to analyze our own web pages, as well our competitors' pages.

**Page Auditor** automatically scans the HTML code of the selected page to locate specific HTML elements, like the `<script>` and `<meta>` tag elements. Then it extracts the content of each tag and classifies it according to manually-curated internal lists of categories. The result of the analysis is then presented to the user as clearly formatted, human readable reports. Compared to a manual analysis of the same page, the benefits are evident. For example, the JSON-LD and the JavaScript code included in a page provide critical information about the page, but they are frequently compressed and almost unreadable for humans. **Page Auditor** takes care of it by properly formatting the code and providing detailed information about the meaning and use of each item. Without this **Page Auditor**, the only way to make sense of these JSON-LD and JavaScript snippets would be to copy the JSON and JavaScript code and paste it on an online _JSON Formatter_.


## Features
| Structured Data Report
| -
![Screenshot 1 640x400 pixels](./web-store-images/1_Screenshot_640x400.png)|

| JavaScript Code (Tracking, Analytics, Ads)
| -
|![Screenshot 2 640x400 pixels](./web-store-images/2_Screenshot_640x400.png)|

| Meta Tags
| -
|![Screenshot 3 640x400 pixels](./web-store-images/3_Screenshot_640x400.png)|

| Robots.txt & Sitemap.xml
| -
|![Screenshot 4 640x400 pixels](./web-store-images/4_Screenshot_640x400.png)|

| Credits
| -
|![Screenshot 5 640x400 pixels](./web-store-images/5_Screenshot_640x400.png)|


## License
This _Google Chrome Extension_ is open source and it is released under [__BSD-3-Clause__](./LICENSE.md) license.

## Running the Live Version
Testing the live version of **Page Auditor**, the version publicly available on the Google Web Store, is very simple. Visit the [*Page Auditor* page](https://chrome.google.com/webstore/detail/page-auditor-for-technica/dogloealpnibhaieipodofhcbamacabh) on Google Chrome Store and select the [__Add to Chrome__] button on the top right corner to start the installation.
Once you installed the extension, visit to any web page you would like to analyze and start the extension from the *Extensions Menu* on the top right corner of the browser.

| _Page Auditor_ on Google Chrome Web Store |
| -- |
|!["Page Auditor" on Google Chrome Web Store](web-store-images/ChromeWebStore.png)|


## Testing a New Version 
This is how to test the Extension or any variation opf it on your Google Chrome:
1. Generate a new build with the command `npm run build`
1. Open the Google Chrome Extensions page on your browser by entering the following URL: [`chrome://extensions/`](chrome://extensions/)
1. Select the [*Load Unpacked*] button on the top left corner of the page.
1. When the [*Select Folder*] panel opens, navigate your computer file system and select the `/dist` folder of the extension.
1. Now you can run your local copy of the extension by clicking on the extension icon on the top right corner of your Google Chrome browser. If you don't see the Extensions logo on the browser corner, select the _extensions_ icon and pin the _PageAuditor_ extension to the main toolbar.
1. To test new changes (fresh files are in the `./dist` folder) click the refresh icon on the Extension box in the same [`chrome://extensions/`](chrome://extensions/) page.



## Testing the Code
There is a battery of tests implemented with [`jest`](https://jestjs.io/). At the moment, September 2021, the tests are covering 100% of Statements and Functions.

| File                    | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
|-------------------------|---------|----------|---------|---------|-------------------
| All files               |     100 |    96.02 |     100 |     100 |                   
|  src                    |     100 |      100 |     100 |     100 |                   
|  - card.ts              |     100 |      100 |     100 |     100 |                   
|  src/sections           |     100 |    95.98 |     100 |     100 |                   
|  - credits.ts           |     100 |      100 |     100 |     100 |                   
|  - intro.ts             |     100 |      100 |     100 |     100 |                   
|  - ld-json-functions.ts |     100 |    84.21 |     100 |     100 | 33-60
|  - ld-json.ts           |     100 |      100 |     100 |     100 | 
|  - meta-functions.ts    |     100 |     98.1 |     100 |     100 | 61,93
|  - meta.ts              |     100 |    94.74 |     100 |     100 | 28-33
|  - robots-functions.ts  |     100 |      100 |     100 |     100 | 
|  - robots.ts            |     100 |      100 |     100 |     100 | 

Run `npm run test-coverage` to generate the tests coverage report. 
The report will be available at [`coverage/lcov-report/index.html`](coverage/lcov-report/index.html)

## Formatting the Code
To format the code with [Prettier](https://prettier.io/) run `npm run format`.

## Additional Information
* This extension is based on a Google Chrome Snippet I described in an article I published on Medium on May 14, 2021. The article's title is [Exploring Structured Data With A Google Chrome Snippet](https://folini.medium.com/exploring-structured-data-with-a-google-chrome-snippet-944ad4ef831). Since the initial idea and implementation the extension has been growing significantly including more analysis and brand new reports.

* On September 16, 2021 I published an article on Medium for a non-technical audience describing the features and the usage of the _Page Auditor_ Chrome Extension. The article's title is [I wrote a Chrome Extension to perform on-page SEO analysis](https://folini.medium.com/i-wrote-a-chrome-extension-to-perform-on-page-seo-analysis-d680f6713707).

All information and creative required to publish the Google Chrome eExtension are available on the folder [Google Web Store creative material](./GoogleWebStore.md).

## Roadmap
- [x] Porting the snippet from JavaScript to TypeScript
- [x] Transform the Google Chrome Snippet into a regular Google Chrome Extension
- [ ] Reorganize the user interface with a summary and links to each section. No more tabs.
- [ ] Add more SEO features, like highlighting of images missing the `alt` attribute

---
Copyright (c) 2021, Franco Folini
All rights reserved.
