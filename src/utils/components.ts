import {browser, by, element, ElementArrayFinder, ElementFinder, ExpectedConditions, Key, Locator} from "protractor";
import {format} from "./format";

export namespace Component {
    export class Base {

        get alias(): string {
            const componentName = format.plainText(this.constructor.name);
            const fullAlias = componentName !== "base" ?
                this.shortAlias ? `"${this.shortAlias}" ${componentName}` : componentName
                :  this.shortAlias || this.locator.toString();

            return this.parentComponent
                ? `${this.parentComponent.alias} >> ${fullAlias}`
                : fullAlias;
        }

        parentComponent?: Component.Base;

        protected timeoutOfWait = 5 * 1000;

        constructor(public locator: Locator, private shortAlias?: string) {}

        new<T extends Component.Base, S extends any[]>(componentClass: (new(...args: S) => T), ...componentArgs: S): T {
            const newComponent = new componentClass(...componentArgs);
            newComponent.parentComponent = this;
            return newComponent;
        }

        async click(): Promise<void> {
            await this.intoView();
            await this.getElementFinder().click();
        }

        async sendKeys(...keys: string[]): Promise<void>  {
            await this.intoView();
            await this.getElementFinder().sendKeys(...keys);
        }

        async isPresent(): Promise<boolean>  {
            return await this.getElementFinder().isPresent();
        }

        async isDisplayed(): Promise<boolean> {
            return await this.getElementFinder().isDisplayed();
        }

        async getText(): Promise<string> {
            await this.intoView();
            return await this.getElementFinder().getText();
        }

        async waitPresent(timeout: number = this.timeoutOfWait): Promise<void> {
            await browser.wait(
                ExpectedConditions.presenceOf(this.getElementFinder()),
                timeout,
                `Waited [${this.alias}] to be present.`
            );
        }

        async waitDisplayed(timeout: number = this.timeoutOfWait): Promise<void> {
            await browser.wait(
                ExpectedConditions.visibilityOf(this.getElementFinder()),
                timeout,
                `Waited [${this.alias}] to be displayed.`
            );
        }

        protected async intoView(): Promise<void> {
            await this.waitDisplayed();
            const elementLocation = await this.getElementFinder().getLocation();
            await browser.executeScript(`window.scrollTo(200, ${elementLocation.y - 500});`);
        }

        protected async getClasses(): Promise<string> {
            await this.waitPresent();
            return await this.getElementFinder().getAttribute("class");
        }

        protected getElementFinder(): ElementFinder {
            return this.parentComponent ?
                this.parentComponent.getElementFinder().element(this.locator)
                : element(this.locator);
        }
        protected getElementArrayFinder(): ElementArrayFinder {
            return this.parentComponent ?
                this.parentComponent.getElementFinder().all(this.locator)
                : element.all(this.locator);
        }
    }

    export class Link extends Component.Base {
        async getHref(): Promise<string> {
            return await this.getElementFinder().getAttribute("href");
        }
    }

    export class FormInput extends Component.Base {
        get formGroup(): Component.Base {
            return this.new(Base, by.xpath('ancestor::div[contains(@class, "label")][1]'), "form group");
        }

        async getValue(): Promise<string> {
            return this.getElementFinder().getAttribute("value");
        }
    }

    export class Field extends Component.FormInput {
        get fieldMessage(): Component.Base {
            return this.formGroup.new(Component.Base, by.css(".field-message"), "field message");
        }

        async setValue(value: string): Promise<void> {
            await this.sendKeys(Key.chord(Key.CONTROL, "a"), value);
        }
    }

    export class Button extends Component.FormInput {
    }

    export class Image extends Component.Base {
        async getSrc(): Promise<string> {
            return await this.getElementFinder().getAttribute("src");
        }

        async getAlt(): Promise<string> {
            return await this.getElementFinder().getAttribute("alt");
        }
    }
}
