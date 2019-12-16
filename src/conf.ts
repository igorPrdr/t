import {browser, Config} from "protractor";
import {initCustomJasmineMatchers} from "./utils/custom-jasmine-matchers";
import {initReporters} from "./utils/reporters";
import {URL} from "./assets";

export const config: Config = {
    framework: "jasmine2",

    capabilities: {
        browserName: process.env.BROWSER_NAME && process.env.BROWSER_NAME.trim() || "chrome",
        shardTestFiles: !!process.env.PARALLEL,
        maxInstances: 3

    },

    directConnect: true,

    allScriptsTimeout: 30000,

    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000,
        // tslint:disable-next-line:no-empty
        print: () => {}
    },

    SELENIUM_PROMISE_MANAGER: false,

    async onPrepare() {
        initReporters();
        initCustomJasmineMatchers();

        browser.baseUrl = URL.BASE;
        await browser.waitForAngularEnabled(false);
    },

    specs: ["tests/*.js"]
};
