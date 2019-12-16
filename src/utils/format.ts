export const format = {
    plainText(input: string): string {
        return input.replace( /([A-Z])/g, " $1" ).trim().toLowerCase();
    },
    noNewLines(input: string): string {
        return input.replace(/(\r\n|\n|\r)/gm, " ");
    }
};
