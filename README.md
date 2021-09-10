# Page Auditor for Technical SEO 
<img src='./web-store-images/Store-Icon_128x128.png' align='right' style='margin-right:16px;width:72px;'>**Page Auditor for Technical SEO** is an open source free _Google Chrome Extension_ created by [Franco Folini](https://www.linkedin.com/in/francofolini/) to explore and analyze the main technical SEO features of any web page.



# Purpose
**Page Auditor** is a _Google Chrome Extension_ that can be installed on any Google Chrome and used to explore the content of any webpage. The goal is to make the _Technical SEO Analysis_ of a web page easier for everybody, and in particular for non technical people.

Performing a  _Technical SEO Analysis_ requires exploring many of the hidden elements of an HTML page, including Meta Tags, Structured Data, JavaScrips, `Robots.txt` and `Sitemap.xml` files. It can be challenging, in particular for people without a technical background. All these components are important for the page SEO performance. **Page Auditor** makes it easy to look at all these elements and can be used to analyze our own web pages, as well our competitors' pages.

**Page Auditor** automatically scans the HTML code of the selected page and locates specific HTML elements, like the `<script>` element and `<meta>` tags. Then it extracts the content of each tag and classifies it according to its internal lists of categories. The result of the analysis is then presented to the user in clearly formatted, human readable reports. Compared to a manual analysis of the same page, the benefits are evident. For example, the JSON-LD and the JavaScript code included in a page can provide critical information about the page, but they are frequently compressed and therefore almost unreadable for humans. Without this **Page Auditor**, the only way to make sense of these JSON-LD and JavaScript snippets would be to copy the JSON and JavaScript code and paste it on an online _JSON Formatter_.

## License
This code snippet is released under [__BSD-3-Clause__](./LICENSE.md) license.

## Running the Live Version
To test the live version of **Page Auditor** is very simple. Visit the **Page Auditor** page on the Google Chrome Store and select the [__Add to Chrome__] button on the top right corner.
Once you have installed the extension go to any web page you would like to analyze and start the extension from the *Extensions Menu* on the top right corner of the browser.

## Running and Testing a New Version
This is how to test the Extension or any variation opf it on your Google Chrome:
1. Open your Google Chrome Extensions page by entering the following URL: [`chrome://extensions/`](chrome://extensions/)
2. Select the [*Load Unpacked*] button on the top left corner of the page.
3. When the [*Select Folder*] panel opens, select the `/dist` folder of the extension on your computer.
4. Now you can run your local copy of the extension jus clicking on the extension icon on the top right corner of the Chrome browser. If you don't see the Extension logo on the browser corner, select the _extensions_ icon  and pin the _PageAuditor_ extension.
5. To test new changes (fresh files are in the `./dist` folder) click the refresh icon on the Extension box in the same [`chrome://extensions/`](chrome://extensions/) page.



## Testing the Code
There is a basic battery of tests implements with [`jest`](https://jestjs.io/).
Run `npm run test-coverage` to check also for tests coverage. 

The tests coverage report will be available at [`coverage/lcov-report/index.html`](coverage/lcov-report/index.html)

## Formatting the Code
To format the code with [Prettier](https://prettier.io/) run `npm run format`.

## Additional Information
This extension is based on a Google Chrome Snippet I described in an article on Medium.com.
The article is available here: [Exploring Structured Data With A Google Chrome Snippet](https://folini.medium.com/exploring-structured-data-with-a-google-chrome-snippet-944ad4ef831). Since the initial idea and implementation the extension has been growing significantly including more analysis and brand new reports.

All information required to publish the Google Chrome eExtension is available on the the [Google Web Store creative material](./GoogleWebStore.md).

## Roadmap
- [x] Porting the snippet from JavaScript to TypeScript
- [x] Transform the Google Chrome Snippet into a regular Google Chrome Extension
- [ ] Add more SEO features, like highlighting of images missing the `alt` attribute

---
Copyright (c) 2021, Franco Folini
All rights reserved.
