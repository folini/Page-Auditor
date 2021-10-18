// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Report} from '../report'
import {Card} from '../card'
import {sectionActions, ReportGeneratorFunc} from '../main'

const bioLinks = [
    {
        label: 'LinkedIn',
        url: 'https://www.linkedin.com/in/francofolini/',
        class: 'icon-linkedin',
    },
    {
        label: 'Medium',
        url: 'https://folini.medium.com/',
        class: 'icon-medium',
    },
    {
        label: 'Personal Blog',
        url: 'https://francofolini.com/',
        class: 'icon-wordpress',
    },
    {
        label: 'GIT',
        url: 'https://github.com/folini',
        class: 'icon-git',
    },
    {
        label: 'eMail',
        url: 'mailto:folini@gmail.com',
        class: 'icon-gmail',
    },
]

const reportGenerator: ReportGeneratorFunc = (tabUrl: string, data: any, report: Report): void => {
    report.addCard(
        new Card()
            .open(``, `Page Auditor for Technical SEO`, [], 'icon-fc')
            .addParagraph(
                `<div class='credits'><b>Page Auditor for Technical SEO</b> is a free Google Chrome Extension created by <a href='https://www.linkedin.com/in/francofolini/' target='_new'>Franco Folini</a>.
                <br><br>The purpose of <i>Page Auditor for Technical SEO</i> is to analyze and show, in a way that is simple and easy to understand, all SEO factors that5 can affect the SEO performance of a website or single webpage.
                <br><br>When possible, <i>Page Auditor</i> also provides suggestions on how to improve the page SEO and to fix a diagnosed problem.`

            )
            .add(
                `<div class='support-form'>
                                <form action="https://www.paypal.com/donate" method="post" target="_new" style="margin-bottom:0">
                                    <input type="hidden" name="business" value="UZ2HN43RZVJGA" />
                                    <input type="hidden" name="no_recurring" value="0" />
                                    <input type="hidden" name="item_name" value="Support the development and maintenance of the free 'Page Auditor' Chrome Extension." />
                                    <input type="hidden" name="currency_code" value="USD" />
                                    <input type="submit" name="submit" class='large-btn' value="Donate" border="0" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
                                </form>
                            </div>
                        </div>`
            )
            .setPreTitle('Credits')
    )

    report.addCard(
        new Card()
            .open(``, `About the Author`, [], 'icon-franco-avatar')
            .addParagraph(
                `<b>Franco Folini</b> has a passion for Web Development and Digital Marketing.` +
                    `<br><br>Franco teaches the <a href='https://bootcamp.berkeley.edu/digitalmarketing/' target='+new'>Digital Marketing Bootcamp</a> for UC Berkeley Extension, and this project was inspired by his students.` +
                    `<br><br>Check out Franco's work and contacts on the following platforms:` +
                    `<ul class='pointers'>` +
                    bioLinks
                        .map(
                            link =>
                                `<li class='credits-pointer ${link.class}'><a href='${link.url}' target='_new'>${link.label}</a></li>`
                        )
                        .join('') +
                    `</ul>`
            )
            .setPreTitle('Credits')
    )
}

export const actions: sectionActions = {
    reportGenerator: reportGenerator,
}
