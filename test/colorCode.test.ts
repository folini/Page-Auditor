// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {codeColor, Mode} from '../src/colorCode'
import {htmlEncode} from 'js-htmlencode'

// Jest imports
import 'jest-get-type'
import 'html-validate/jest'
import 'jest-chain'
import 'jest-extended'
import {html_beautify, js_beautify} from 'js-beautify'

const htmlString = html_beautify(`
<!DOCTYPE html>
<html>
    <body>
        <h1>My First Heading</h1>
        <p>My first paragraph.</p>
    </body>
</html>`)
    .split('\n')
    .map(line => htmlEncode(line))
    .join('</br>')
    .replace(/\s/g, '&nbsp;')

const jsString = js_beautify(`;
(function() {
    var buildInfo = {
        date: "2021-09-29T17:03:08Z",
        version: "1.5.43-3890+master",
        branch: "master",
        commit: "d1478078d343151ad9f389d3cfa9511a32071584",
        build: "42268",
        env: "prod"
    };
    var desktopEditor = window.Grammarly && window.Grammarly.desktopEditor || undefined;
    var appConfig = {};
    window.Grammarly = {
        denali: {
            buildInfo: buildInfo
        }
    };
    if (appConfig) window.Grammarly.denali.appConfig = appConfig
    if (desktopEditor) window.Grammarly.desktopEditor = desktopEditor
}());`)
    .split('\n')
    .join('</br>')
    .replace(/\s/g, '&nbsp;')

/* spell-checker: disable */
const jsonString = js_beautify(`{
    "env": "prod",
    "logLevel": "INFO",
    "accumulateCrashLogLevel": "DEBUG",
    "sendCrashOnLogLevel": "ERROR",
    "collectLogs": true,
    "collectCrashLogs": true,
    "copyLogsToConsole": false,
    "crashLogsCacheSize": 100,
    "debugLogsCacheSize": 100,
    "tracking": {
        "state": "enabled"
    },
    "alertCache": {
        "prefix": "editorTsAlertCache",
        "version": "4"
    },
    "mutedCategoriesCache": {
        "prefix": "mutedCategoriesCache",
        "version": "0"
    },
    "outcomeScoreCache": {
        "prefix": "scoreCache",
        "version": "0"
    },
    "userSettingsPrefix": "userSettings",
    "userSettingsVersion": "1",
    "defaultDialect": "american",
    "notificationShowTimeMs": 7000,
    "maxNotificationsOnTheScreen": 3,
    "selfUpdate": {
        "versionCheckInterval": 3540000,
        "selfUpdateDelay": 43200000,
        "canReloadCheckInterval": 5000,
        "blockingModalAutoReloadDelay": 60000,
        "retryFailedVersionCheckInterval": 300000,
        "retryFailedVersionCheckLimit": 20,
        "debugBuildVersion": "auto",
        "versionFilePath": "/version.json"
    },
    "pingMaybeGnarDelay": 3600000,
    "domains": {
        "cookie": ".grammarly.com",
        "localServer": "denali-local.grammarly.com"
    },
    "api": {
        "authUrl": "https://auth.grammarly.com/v3",
        "institutionUrl": "https://institution.grammarly.com/api/institution",
        "snippetsUrl": "https://institution.ppgr.io/api/snippets",
        "clientControlsUrl": "https://goldengate.grammarly.com/client-controls",
        "institutionAdminUrl": "https://institution.grammarly.com/api/institution/admin",
        "institutionStyleGuideUrl": "https://institution.grammarly.com/public/api/styleguides",
        "institutionGroupsUrl": "https://goldengate.grammarly.com/institution/api/groups",
        "institutionUserUrl": "https://institution.grammarly.com/public/api/user",
        "analyticsUrl": "https://goldengate.grammarly.com/analytics/api/institution/statistics",
        "institutionAnalyticsUrl": "https://institution.grammarly.com/public/api/institution/statistics",
        "institutionSuggestionsUrl": "https://institution.grammarly.com/api/institution/settings/suggestions",
        "institutionTonesUrl": "https://institution.grammarly.com/api/institution/settings/tones",
        "tonesUrl": "https://institution.ppgr.io/api/tones",
        "dapiUrl": "https://data.grammarly.com",
        "doxUrl": "https://dox.grammarly.com",
        "irbisUrl": "https://irbis.grammarly.com",
        "subscriptionUrl": "https://subscription.grammarly.com/api/v1",
        "discountUrl": "https://irbis.grammarly.com/api/discounts",
        "capiWsUrl": "wss://capi.grammarly.com/freews",
        "capiApiUrl": "https://capi.grammarly.com/api",
        "gnarApi": {
            "url": "https://gnar.grammarly.com"
        },
        "felogUrl": "https://f-log-editor.grammarly.io",
        "felogDebugUrl": "https://f-log-editor-debug.grammarly.io",
        "sumoUrl": "https://endpoint2.collection.us2.sumologic.com/receiver/v1/http/ZaVnC4dhaV0Bxac28IqT2frgzsjX7HEotu8EZEZr07YE9RWLCzrOMGwzO9aL6c_iSiidkEplFOod2igKIxz_7s2CHlXc2u-XuLpetEBK1fV6xjfN2Sw2gA==",
        "crashLogUrl": "https://f-log-editor.grammarly.io/crash",
        "onlineTestUrl": "/online-test.json",
        "wsTest": "wss://wstest.grammarly.com",
        "proofitResultUrl": "https://dox.grammarly.com/documents/_docId_/proofread",
        "redirect": "https://redirect.grammarly.com/redirect",
        "mailApiUrl": "https://g-mail.grammarly.com",
        "ssoUrl": "https://sso.grammarly.com",
        "scimUrl": "https://goldengate.grammarly.com/auth/api/token/scim",
        "workspaceUrl": "https://goldengate.grammarly.com/workspace",
        "voxWorkspaceUrl": "https://goldengate.grammarly.com/vox/v1/workspace",
        "voxInstitutionUrl": "https://goldengate.grammarly.com/vox/v1/institution",
        "writingStylesUrl": "https://goldengate.grammarly.com/writingstyle"
    },
    "app": {
        "nameWeb": "editor",
        "nameDesktop": "desktopEditor"
    },
    "urls": {
        "free": "/free",
        "account": "https://account.grammarly.com"
    },
    "onlineEditor": {
        "docId": "https://app.grammarly.com/ddocs/"
    },
    "funnel": {
        "base": "https://www.grammarly.com",
        "resetPassword": "https://www.grammarly.com/resetpassword",
        "accountDeleted": "https://www.grammarly.com/account-deleted",
        "businessLanding": "https://www.grammarly.com/business/e",
        "businessStyleguideLanding": "https://www.grammarly.com/business/styleguide",
        "businessUpgradeLanding": "https://www.grammarly.com/upgrade/business/try",
        "subscribe": "https://www.grammarly.com/subscribe",
        "upgrade": "https://www.grammarly.com/upgrade",
        "plans": "https://www.grammarly.com/plans",
        "signin": "https://www.grammarly.com/signin",
        "socialSignin": "https://www.grammarly.com/signin/app/desktop-editor",
        "signup": "https://www.grammarly.com/signup",
        "mainPage": "https://www.grammarly.com/",
        "deleteSocialAccount": "https://www.grammarly.com/social/delete-account",
        "subscriptionCancellationSurvey": "https://www.grammarly.com/subscription-cancellation-survey",
        "keyboardInstall": "https://www.grammarly.com/keyboard",
        "desktopAppInstall": "https://www.grammarly.com/native",
        "claimedUserJoinFallback": "https://redirect.grammarly.com/redirect?business_join=1"
    },
    "officeAddin": {
        "installURL": "https://download-office.grammarly.com/latest/GrammarlyAddInSetup.exe",
        "infoURL": "https://www.grammarly.com/office-addin/windows"
    },
    "crossPlatformOfficeAddin": {
        "installURL": "https://appsource.microsoft.com/en-us/product/office/WA200001011?tab=Overview",
        "infoURL": "https://www.grammarly.com/office-addin/mac"
    },
    "desktop": {
        "windows": {
            "installURL": "https://download-editor.grammarly.com/windows/GrammarlySetup.exe",
            "infoURL": "https://www.grammarly.com/native/windows"
        },
        "mac": {
            "installURL": "https://download-editor.grammarly.com/osx/Grammarly.dmg",
            "infoURL": "https://www.grammarly.com/native/mac"
        }
    },
    "extension": {
        "chrome": {
            "installURL": "https://chrome.google.com/webstore/detail/kbfnbcaeplbcioakkpcpgfkobkghlhen",
            "infoURL": "https://chrome.google.com/webstore/detail/grammarly-spell-checker-g/kbfnbcaeplbcioakkpcpgfkobkghlhen?hl=en"
        },
        "firefox": {
            "installURL": "https://addons.mozilla.org/firefox/downloads/latest/566314/addon-566314-latest.xpi",
            "iconURL": "https://addons.cdn.mozilla.net/user-media/addon_icons/566/566314-32.png",
            "infoURL": "https://addons.mozilla.org/en-US/firefox/addon/grammarly-1/"
        },
        "safari": {
            "installURL": "https://apps.apple.com/us/app/grammarly-for-safari/id1462114288?ls=1&mt=12"
        },
        "edge": {
            "installURL": "ms-windows-store://pdp?ProductId=9p59wxtbhzzm",
            "infoURL": "https://www.microsoft.com/en-us/store/p/grammarly-for-microsoft-edge/9p59wxtbhzzm?rtc=1"
        },
        "edgeChromium": {
            "installURL": "https://microsoftedge.microsoft.com/addons/detail/grammarly-for-microsoft-e/cnlefmmeadmemmdciolhbnfeacpdfbkd"
        }
    },
    "edu": {
        "adminPanelURL": "https://account.grammarly.com/admin"
    },
    "support": {
        "login": "https://support.grammarly.com/login",
        "email": "support@grammarly.com",
        "mainPage": "https://support.grammarly.com/",
        "newRequest": "https://support.grammarly.com/hc/en-us/requests/new",
        "contact": "https://www.grammarly.com/contact",
        "connectionTroubleshooting": "https://support.grammarly.com/hc/en-us/articles/115000090271-Network-configuration-blocks-Grammarly-services",
        "emailExistsKBUrl": "https://support.grammarly.com/hc/en-us/articles/115000090791-Changing-your-email-to-an-email-that-already-exists",
        "safariDownloadFilesKBUrl": "https://support.grammarly.com/hc/en-us/articles/360001105952",
        "rtfCompatibilityUrl": "https://support.grammarly.com/hc/en-us/articles/115000091512-Preserve-text-formatting",
        "diagnosticTestPath": "/diagnostic-test?origin=editor",
        "documentAcceptTrackedChanges": "https://support.office.com/en-us/article/Accept-tracked-changes-4838d24c-d5d1-4c6c-8e39-78b44bd2b4cc"
    },
    "privacyPolicy": "https://www.grammarly.com/privacy-policy",
    "termsOfService": "https://www.grammarly.com/terms",
    "account": {
        "customize": "https://redirect.grammarly.com/redirect?profile_dictionary=1",
        "subscription": "https://account.grammarly.com/subscription",
        "adminSubscription": "https://account.grammarly.com/admin/subscription",
        "members": "https://account.grammarly.com/admin/members",
        "styleGuide": "https://account.grammarly.com/admin/style-guide",
        "suggestions": "https://redirect.grammarly.com/redirect?profile_suggestions=1"
    },
    "preconnectLinks": ["https://data.grammarly.com", "https://gnar.grammarly.com", "https://subscription.grammarly.com", "https://auth.grammarly.com", "https://f-log-editor.grammarly.com", "https://static.institution.grammarly.com"],
    "ideas": {
        "galleryURL": "https://app.grammarly.com/ideas/sales"
    }
}`)
    .split('\n')
    .join('</br>')
    .replace(/\s/g, '&nbsp;')

const _sep =`\n-----------------------------------------------------------------\n`
/* spell-checker: enable */

test('colorCode() with valid HTML', () => {
    const data = codeColor(htmlString, Mode.html)
    expect(data).toBeString().toHTMLValidate()
})

test('colorCode() with valid JavaScript', () => {
    const data = codeColor(jsString, Mode.js)
    expect(data).toBeString()
})

test('colorCode() with valid JSON', () => {
    const data = codeColor(jsonString, Mode.js)
    expect(data).toBeString()
})
