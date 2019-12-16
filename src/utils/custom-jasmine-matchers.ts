import {Component} from "./components";
import {browser} from "protractor";
import {URL} from "../assets";
import {Page} from "../objects/pages";
import {format} from "./format";
import {Type} from "../types";
import CustomMatcherFactories = jasmine.CustomMatcherFactories;

export const initCustomJasmineMatchers = () => {
    beforeAll(() => {
        const customMatchers = {
            toBePresent() {
                return {
                    compare(component: Component.Base, expected: string) {
                        const result = {
                            pass: (async () => {
                                const passed = await component.isPresent();

                                result.message = `Expected [${component.alias}]${passed ? ` NOT` : ``} to be present`;

                                return passed;
                            })(),
                            message: ""
                        };
                        return result;
                    }
                };
            },
            toBeDisplayed() {
                return {
                    compare(component: Component.Base, expected: string) {
                        const result = {
                            pass: (async () => {
                                const passed = await component.isDisplayed();

                                result.message = `Expected [${component.alias}]${passed ? ` NOT` : ``} to be displayed`;

                                return passed;
                            })(),
                            message: ""
                        };
                        return result;
                    }
                };
            },
            toHaveText() {
                return {
                    compare(component: Component.Base, expected: string) {
                        const result =  {
                            pass: (async () => {
                                const text = await component.getText();
                                const passed = format.noNewLines(text) === expected;

                                result.message = `Expected [${component.alias}]${passed ? ` NOT` : ``} to have text "${expected}" (actual text is "${format.noNewLines(text)}")`;

                                return passed;
                            })(),
                            message: ""
                        };
                        return result;
                    }
                };
            },
            toHaveValue() {
                return {
                    compare(input: Component.FormInput, expected: string) {
                        const result =  {
                            pass: (async () => {
                                const value = await input.getValue();
                                const passed = value === expected;

                                result.message = `Expected [${input.alias}]${passed ? ` NOT` : ``} to have value "${expected}" (actual value is "${value}")`;

                                return passed;
                            })(),
                            message: ""
                        };
                        return result;
                    }
                };
            },
            toBeOpened() {
                return {
                    compare(page: Page.Base) {
                        const result =  {
                            pass: (async () => {
                                const currentUrl = await browser.getCurrentUrl();
                                const expectedUrl = `${URL.BASE}${page.path}`;
                                const passed = currentUrl === expectedUrl;

                                result.message = `Expected ${page.alias}${passed ? ` NOT` : ``} to be opened`;

                                return passed;
                            })(),
                            message: ""
                        };
                        return result;
                    }
                };
            },
            toHaveMailSender() {
                return {
                    compare(email: Type.Email, expected: string) {
                        const result = {} as any;
                        result.pass = (async () => {
                                const passed = email.from === expected;

                                result.message = `Expected the mail ${passed ? ` NOT` : ``} to have sender "${expected}" (actual sender is "${email.from}")`;

                                return passed;
                            })();
                        return result;
                    }
                };
            },
            toHaveMailSubject() {
                return {
                    compare(email: Type.Email, expected: string) {
                        const result = {} as any;
                        result.pass = (async () => {
                            const passed = email.subject === expected;

                            result.message = `Expected the mail ${passed ? ` NOT` : ``} to have subject "${expected}" (actual subject is "${email.subject}")`;

                            return passed;
                        })();
                        return result;
                    }
                };
            },
            toContainInMailText() {
                return {
                    compare(email: Type.Email, expected: string) {
                        const result = {} as any;
                        result.pass = (async () => {
                            const passed = email.content.includes(expected);

                            result.message = `Expected the mail content ${passed ? ` NOT` : ``} to contain "${expected}" (actual content is "${email.content}")`;

                            return passed;
                        })();
                        return result;
                    }
                };
            },
        };

        jasmine.addMatchers(customMatchers as unknown as CustomMatcherFactories);
    });
};
