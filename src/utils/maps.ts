import {Type} from "../types";

export const map = {
    productName(product: Type.Product): string {
        const names = {
            "cleanmymac":   "CleanMyMac X",
            "cleanmydrive": "CleanMyDrive 2",
            "gemini":       "Gemini 2"
        };
        return names[product];
    },
    productDataAttr(product: Type.Product): string {
        const dataAttrs = {
            "cleanmymac":   "cleanmymac-x",
            "cleanmydrive": "cleanmydrive",
            "gemini":       "gemini"
        };
        return dataAttrs[product];
    },
};
