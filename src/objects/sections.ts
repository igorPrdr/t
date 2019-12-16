import {Component} from "../utils/components";
import {by} from "protractor";
import {Type} from "../types";
import {Item} from "./items";
import {map} from "../utils/maps";

export namespace Section {
    export class Menu extends Component.Base {
        productsMenu: Section.ProductMenu;
        openCloseBtn: Component.Button;

        constructor() {
            super(by.css(".nav"));

            this.productsMenu = this.new(Section.ProductMenu);
            this.openCloseBtn = this.new(Component.Button, by.css(".humb"), "Open/Close");
        }

        async isOpened(): Promise<boolean>  {
            await this.waitDisplayed();
            return await this.productsMenu.isPresent() && await this.productsMenu.isDisplayed();
        }

        async open(): Promise<void> {
            if (!await this.isOpened()) {
                await this.openCloseBtn.click();
            }
        }

        async close(): Promise<void> {
            if (await this.isOpened()) {
                await this.openCloseBtn.click();
            }
        }
    }

    export class ProductMenu extends Component.Base {
        constructor() {
            super(by.css(".nav-products"));
        }

        getItem(product: Type.Product): Item.Product {
            return this.new(Item.Product, product);
        }
    }

    export class ProductTopper extends Component.Base {
        freeDownloadBtn: Component.Button;

        constructor() {
            super(by.css(".topper"));

            this.freeDownloadBtn = this.new(Component.Button, by.css("[data-qa=\"FreeDownloadBtn\"]"), "free download");
        }
    }

    export class DownloadModal extends Component.Base {
        subscriptionSuccess:    Section.SubscriptionSuccess;
        emailFld:               Component.Field;
        subscribeBtn:           Component.Button;

        constructor(product: Type.Product) {
            super(by.css(`[data-modal="download_modal"][data-product="${map.productDataAttr(product)}"]`));

            this.subscriptionSuccess =  this.new(Section.SubscriptionSuccess);
            this.emailFld =             this.new(Component.Field, by.css("[name=\"email\"]"), "email");
            this.subscribeBtn =         this.new(Component.Button, by.css("[data-qa=\"subscribeBtn\"]"), "subscribe");
        }
    }

    export class SubscriptionSuccess extends Component.Base {
        header:     Component.Base;
        message:    Component.Base;

        constructor() {
            super(by.css(".subscribe-success"));

            this.header =   this.new(Component.Base, by.css("h5"), "header");
            this.message =  this.new(Component.Base, by.css("p"), "message");
        }
    }
}
