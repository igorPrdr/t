import request from "then-request";
import {Type} from "../types";
import crypto = require("crypto");
import cheerio = require("cheerio");

export class User {
    static async init(rapidTempMailApiHost?: string, rapidTempMailApiKey?: string): Promise<User> {
        const user = new User();
        user._mailClient = await TempMailClient.init(rapidTempMailApiHost, rapidTempMailApiKey);
        user.emailAddress = user._mailClient.address;
        return user;
    }

    emailAddress: string;
    emailInbox: Type.Email[];

    private _mailClient: TempMailClient;

    async refreshEmailInbox(): Promise<void> {
        this.emailInbox = await this._mailClient.fetchMessages();
    }

    getLastEmailInboxMessage(): Type.Email {
        return [...this.emailInbox].pop();
    }
}

/* API being used- https://rapidapi.com/Privatix/api */
class TempMailClient {
    static async init(
        rapidApiHost: string = "privatix-temp-mail-v1.p.rapidapi.com",
        rapidApiKey: string =  "76afdf1390mshed046b6ed45fb42p15321fjsna585df3f0b69"
    ): Promise<TempMailClient> {
        const mailClient = new TempMailClient();
        mailClient._rapidApiHost = rapidApiHost;
        mailClient._rapidApiKey = rapidApiKey;
        const domains = await mailClient._get("/domains/");
        mailClient._address = `test${Math.round(Math.random() * 1000000)}${domains.pop()}`;
        mailClient._addressHash = crypto.createHash("md5").update(mailClient._address).digest("hex");
        return mailClient;
    }

    private _address: string;
    private _addressHash: string;
    private _rapidApiHost: string;
    private _rapidApiKey: string;

    get address(): string {
        return this._address;
    }

    async fetchMessages(): Promise<Type.Email[]> {
        const rawMails = await this._get(`/mail/id/${this._addressHash}/`);
        return rawMails.map((rawMail: any) => {
            return {
                from: rawMail.mail_from,
                subject: rawMail.mail_subject,
                content: rawMail.mail_text_only,
                getButtonLinkUrl(): string {
                    return cheerio.load(this.content)("a.btn").attr("href");
                }
            } as Type.Email;
        });
    }

    private async _get(path: string): Promise<any> {
        const client = this;
        const url = `https://${client._rapidApiHost}/request${path}`;
        const headers = {
            "x-rapidapi-host": client._rapidApiHost,
            "x-rapidapi-key": client._rapidApiKey
        };

        try {
            return JSON.parse((await request("GET", url, { headers })).getBody().toString());
        } catch (e) {
            e.message = `On GET ${url}: ${e.message}`;
            throw e;
        }

    }
}
