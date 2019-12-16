export namespace Type {
    export type Product = "cleanmymac" | "cleanmydrive" | "gemini";

    export interface Email {
        from: string;
        subject: string;
        content: string;
        getButtonLinkUrl(): string;
    }
}
