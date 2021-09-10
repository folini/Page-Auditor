// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card} from '../card'
import {sectionActions} from '../main'

const scriptClasses = require('../jsons/scriptClasses.json') as any[]

const injector = () => undefined
const eventManager = () => undefined

const reporter = async (url: string, data: any): Promise<string> => {
    var report: string = ''

    const suggestedSites = [
        {label: 'CNN', url: 'https://cnn.com/'},
        {label: 'MailChimp', url: 'https://mailchimp.com/'},
        {label: 'REI', url: 'https://rei.com/'},
    ]
    report += new Card()
        .open(``, `How to use Page Auditor for Technical SEO`, [], 'icon-how')
        .add(
            `Page Auditor shows the hidden parts of the HTML code of any web page.<br/>` +
                `To test this Google Chrome Extension visit a popular page like:` +
                `<ul>` +
                suggestedSites
                    .map(
                        link =>
                            `<li><a href='${link.url}' target='_new'>${link.label}</a></li>`
                    )
                    .join('') +
                `</ul>` +
                `Once the page is loaded launch the <b>Page Auditor for Technical SEO</b> extension and check all the hidden content.`
        )
        .close()

    report += new Card()
        .open(``, `Why Page Auditor`, [], 'icon-why')
        .add(
            `
    <b>Page Auditor</b> is one of the best tool to analyze the technical features of a web page.
    <br/>
    <b>Page Auditor</b> can recognize ${scriptClasses.length.toFixed()} different types of JavaScript code injected into a web page.
    Among the categories of JavaScript identified by <b>Page Auditor</b>:
    <ul>
      <li>Advertising</li>
      <li>Tracking</li>
      <li>Email &amp; marketing Automation</li>
      <li>Analytics</li>
      <li>Tag Managers</li>
    </ul>`
        )
        .close()

    report += new Card()
        .open(``, `Open Source?`, [], 'icon-open')
        .add(
            `
    <b>Page Auditor</b> is an open source project created by <a target="_new" href='https://www.linkedin.com/in/francofolini/'>Franco Folini</a>. 
    That means anybody is free to use, study, modify, and distribute this project for any purpose, within the limits set by the license.
    <br/><br/>
    <b>Page Auditor</b> is distributed with a <a target="_new" href='https://github.com/folini/Page-Auditor/blob/main/LICENSE.md'>BSD 3-Clause License</a>. 
    <br/><br/>
    The <b>Page Auditor</b> has been created using <a target="_new" href='https://www.typescriptlang.org/'>Typescript</a>. If you are not familiar with development, TypeScript is a superset of the famous JavaScript.
    The project has been developed <a href='https://code.visualstudio.com/'>Visual Studio Code</a> and extensively tested using the 
    <a target="_new" href='https://jestjs.io/'>JEST</a> testing tools.
    <br/><br/>
    You can access the source code on the <a target="_new" href='https://github.com/folini/Page-Auditor'>public project repository on GitHub</a>.`
        )
        .close()

    return report
}

export const actions: sectionActions = {
    injector: injector,
    reporter: reporter,
    eventManager: eventManager,
}
