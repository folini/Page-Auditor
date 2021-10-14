// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card} from '../card'
import {Report} from '../report'
import {sectionActions, ReportGeneratorFunc} from '../main'

const scriptClasses = require('../jsons/scriptClasses.json') as any[]

const suggestedSites = [
    {label: 'CNN', url: 'https://cnn.com/'},
    {label: 'MailChimp', url: 'https://mailchimp.com/'},
    {label: 'REI', url: 'https://rei.com/'},
]

const reportGenerator: ReportGeneratorFunc = (tabUrl: string, data: any, report: Report): void => {
    report.addCard(
        new Card()
            .open(``, `How to use Page Auditor for Technical SEO`, [], 'icon-how')
            .addParagraph(
                `<i>Page Auditor</i> shows the snippets of code and tags included in the HTML code relevant for the on-page SEO of a web page.<br/>` +
                    `To test this Chrome Extension, visit a popular page like:` +
                    `<ul>` +
                    suggestedSites
                        .map(link => `<li><a href='${link.url}' target='_new'>${link.label}</a></li>`)
                        .join('') +
                    `</ul>` +
                    `Once the browser has loaded the selected page, launch the Page Auditor for Technical SEO extension. ` +
                    `Now you can access all reports and learn about what contributes to the SEO performance of the page.`
            )
            .setPreTitle('Intro')
    )

    report.addCard(
        new Card()
            .open(``, `Why Page Auditor`, [], 'icon-why')
            .addParagraph(
                `<b>Page Auditor</b> r is a professional tool for Digital Marketers. Even if you are not a marketing expert, you can use "Page Auditor" to learn about on-page technical SEO.
                    <br/>
                    <b>Page Auditor</b> can recognize ${scriptClasses.length.toFixed()} different types of JavaScript code injected into a web page.
                    Among the categories of JavaScript identified by <b>Page Auditor</b>:
                    <ul>
                        <li>Advertising</li>
                        <li>Tracking</li>
                        <li>Email &amp; Marketing Automation</li>
                        <li>Analytics</li>
                        <li>Tag Managers</li>
                    </ul>`
            )
            .setPreTitle('Intro')
    )

    report.addCard(
        new Card()
            .open(``, `Open Source Project`, [], 'icon-open')
            .addParagraph(
                `<b>Page Auditor</b> is an open source project created by <a target="_new" href='https://www.linkedin.com/in/francofolini/'>Franco Folini</a>. 
                    That means anybody is free to use, study, modify, and distribute the source code of project for any purpose, within the limits set by the license.
                    <br/><br/>
                    <b>Page Auditor</b> source code is distributed with a <a target="_new" href='https://github.com/folini/Page-Auditor/blob/main/LICENSE.md'>BSD 3-Clause License</a>. 
                    <br/><br/>
                    The <b>Page Auditor</b> has been created using <a target="_new" href='https://www.typescriptlang.org/'>Typescript</a>. If you are not familiar with development, TypeScript is a superset of the famous JavaScript.
                    The project has been developed <a href='https://code.visualstudio.com/'>Visual Studio Code</a> and extensively tested using the 
                    <a target="_new" href='https://jestjs.io/'>JEST</a> testing tools.
                    <br/><br/>
                    You can access the source code on the <a target="_new" href='https://github.com/folini/Page-Auditor'>public project repository on GitHub</a>.`
            )
            .setPreTitle('Intro')
    )
}

export const actions: sectionActions = {
    codeInjector: undefined,
    reportGenerator: reportGenerator,
}
