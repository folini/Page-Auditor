// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card} from '../card'
import {sectionActions, ReportGeneratorFunc, DisplayCardFunc, CodeInjectorFunc} from '../main'

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

const codeInjector: CodeInjectorFunc = () => undefined

const reportGenerator: ReportGeneratorFunc = (tabUrl: string, data: any, renderCard: DisplayCardFunc): void => {
    renderCard(
        Promise.resolve(
            new Card()
                .open(``, `Page Auditor for Technical SEO`, [], 'icon-fc')
                .add(
                    `
                <div class='credits'><b>Page Auditor for Technical SEO</b> is a free Google Chrome Extension created by <a href='https://www.linkedin.com/in/francofolini/' target='_new'>Franco Folini</a>.
                The purpose of <i>Page Auditor for Technical SEO</i> is to show, in a way that is simple and easy to understand, all the tracking technologies implemented by a website or single webpage.
                <br/><br/>
                While teaching the <a href='https://bootcamp.berkeley.edu/digitalmarketing/' target='+new'>Digital Marketing Bootcamp</a> for UC Berkeley Extension, my students' questions inspired this project.
                    <div class='support-form'>
                        <form action="https://www.paypal.com/donate" method="post" target="_new">
                            <input type="hidden" name="business" value="UZ2HN43RZVJGA" />
                            <input type="hidden" name="no_recurring" value="0" />
                            <input type="hidden" name="item_name" value="Support the development and maintenance of the free 'Page Auditor' Chrome Extension." />
                            <input type="hidden" name="currency_code" value="USD" />
                            <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
                        </form>
                    </div>
                </div>`
                )
                .close()
        )
    )

    renderCard(
        Promise.resolve(
            new Card()
                .open(``, `About the Author`, [], 'icon-franco-avatar')
                .add(
                    `<b>Franco Folini</b> is a Digital Marketer with a passion for Web Development, and a Web Developer with a passion for Digital Marketing.` +
                        `You can check Franco work and contact him on the following platforms:` +
                        `<ul class='pointers'>` +
                        bioLinks
                            .map(
                                link =>
                                    `<li class='credits-pointer ${link.class}'><a href='${link.url}' target='_new'>${link.label}</a></li>`
                            )
                            .join('') +
                        `</ul>`
                )
                .close()
        )
    )
}

export const actions: sectionActions = {
    codeInjector: codeInjector,
    reportGenerator: reportGenerator,
}
