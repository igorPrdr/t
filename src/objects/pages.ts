import {Section} from "./sections";
import {Component} from "../utils/components";
import {browser, by, ExpectedConditions} from "protractor";
import {format} from "../utils/format";
import {Type} from "../types";

export namespace Page {
    export class Base {
        alias: string;

        private readonly _timeoutForWait = 3000;

        constructor(public readonly path: string, alias?: string) {
            this.alias = `"${alias || format.plainText(this.constructor.name)}" page`;
        }

        get menu(): Section.Menu {
            return this.new(Section.Menu);
        }

        async open(): Promise<void> {
            await browser.get(this.path);
        }

        async waitOpened(timeout: number = this._timeoutForWait): Promise<void> {
            await browser.wait(
                ExpectedConditions.urlContains(this.path),
                timeout,
                `Waited [${this.alias}] to be opened.`
            );
        }

        new<T extends Component.Base, S extends any[]>(componentClass: (new(...args: S) => T), ...componentArgs: S): T {
            const pageComponent = new Component.Base(by.css("body"), this.alias);
            return pageComponent.new(componentClass, ...componentArgs);
        }
    }

    export class Home extends Page.Base {
        constructor() {
            super("/");
        }
    }

    export class Product extends Page.Base {
        topper: Section.ProductTopper;
        downloadModal: Section.DownloadModal;

        constructor(product: Type.Product) {
            super(`/${product}`);

            this.topper = this.new(Section.ProductTopper);
            this.downloadModal = this.new(Section.DownloadModal, product);
        }
    }

    export class SubscriptionThanks extends Page.Base {
        success: Section.SubscriptionSuccess;

        constructor() {
            super("/subscribe/thank-you");

            this.success = this.new(Section.SubscriptionSuccess);
        }
    }
}
