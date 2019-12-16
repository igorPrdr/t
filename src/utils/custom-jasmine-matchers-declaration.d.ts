export {};

declare global {
    namespace jasmine {
        interface Matchers<T> {
            toBePresent(): Promise<void>;

            toBeDisplayed(): Promise<void>;

            toHaveText(expected: string): Promise<void>;

            toHaveValue(expected: string): Promise<void>;

            toHaveSelectedValue(expected: boolean): Promise<void>;

            toBeOpened(): Promise<void>;

            toHaveMailSender(expected: string): Promise<void>;

            toHaveMailSubject(expected: string): Promise<void>;

            toContainInMailText(expected: string): Promise<void>;
        }
    }
}
