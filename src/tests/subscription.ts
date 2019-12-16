import {Page} from "../objects/pages";
import {User} from "../utils/user";
import {TEXT} from "../assets";
import {Type} from "../types";
import {browser} from "protractor";

describe("Subscription", () => {
    let user: User;

    const product: Type.Product = "cleanmymac";

    const homePg =                  new Page.Home();
    const productPg =               new Page.Product("cleanmymac");
    const subscriptionThanksPg =    new Page.SubscriptionThanks();

    beforeAll(async () => {
        user = await User.init();

        await homePg.open();
    });

    it("should open Product page", async () => {
        await homePg.menu.open();
        await homePg.menu.productsMenu.getItem(product).click();
        await productPg.waitOpened();
    });

    it("should open Download modal", async () => {
        await productPg.topper.freeDownloadBtn.click();
        await productPg.downloadModal.waitDisplayed();
    });

    it("should subscribe", async () => {
        const modal = productPg.downloadModal;

        await modal.emailFld.setValue(user.emailAddress);
        await modal.subscribeBtn.click();
        await modal.subscriptionSuccess.waitDisplayed();
    });

    it("should send confirmation email", async () => {
        let lastMessage: Type.Email;

        /* Gives some time to message processing.*/
        await browser.sleep(1000);
        await user.refreshEmailInbox();

        lastMessage = user.getLastEmailInboxMessage();

        await expect(lastMessage).toHaveMailSender(`${TEXT.SUPPORT_MAIL_NAME} <${TEXT.SUPPORT_MAIL_ADDRESS}>`);
        await expect(lastMessage).toHaveMailSubject(TEXT.SUBSCRIPTION_CONFIRMATION_MAIL_SUBJECT);
        await expect(lastMessage).toContainInMailText(TEXT.SUBSCRIPTION_CONFIRMATION_MAIL_MESSAGE);
        await expect(lastMessage).toContainInMailText(TEXT.SUBSCRIPTION_CONFIRMATION_MAIL_LINK_TEXT);
    });

    it("should route to Thank For Subscription page", async () => {
        const successSection = subscriptionThanksPg.success;

        await browser.get(user.getLastEmailInboxMessage().getButtonLinkUrl());

        await subscriptionThanksPg.waitOpened();
        await successSection.waitDisplayed();

        await expect(successSection.header).toHaveText(TEXT.SUBSCRIPTION_SUCCESS_HEADER);
        await expect(successSection.message).toHaveText(TEXT.SUBSCRIPTION_SUCCESS_MESSAGE);
    });
});
