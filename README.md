# Page Auditor for Technical SEO 
> A Google Chrome Extension to explore the Technical SEO features of any web page.

# Purpose
Exploring all the hidden components of an HTML page, including Meta Tags, Structured Data, JavaScrips, Robots.txt, and Sitemap.xml can be challenging for people without a technical background. All these components are important for the page SEO, and we need an easy way to look at the them for our web pages, as well for our competitors pages.

To look at these components we need to scan the HTML source code of the page and locate the specific `<script>` and `<meta>` tags. Then we have to look inside the tag and try to figure out the meaning of the value we were able to extract. Many times the JSON-LD and teh javaScript code have been compressed making them unreadable for humans. For example, the only way to make sense of a JSON-LD snippet would be to copy the JSON code from the page and paste it in an online _JSON Formatter_.

To make this exploration a little bit easier and simpler for non technical people, I created this _Google Chrome Extension_ that can easily be installed on any Google Chrome and used to explore the content of any webpage. The extension will automatically locate all these items and will present them in a nicely formatted way.

## License
This code snippet is released under [__BSD-3-Clause__](./LICENSE.md) license.

## Deploy the Extension
...

## Activate the Extension
...

## Additional Information
This extension is based on a Google Chroem Snippet I described in an article on Medium.com.
The article is available here: [Exploring Structured Data With A Google Chrome Snippet](https://folini.medium.com/exploring-structured-data-with-a-google-chrome-snippet-944ad4ef831) 


## Roadmap
- [x] Porting the snippet from JavaScript to TypeScript
- [x] Transform the Google Chrome Snippet into a regular Google Chrome Extension
- [ ] Add more SEO features, like highlighting of images missing the `alt` attribute

---
Copyright (c) 2021, Franco Folini
All rights reserved.
