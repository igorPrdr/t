import {Component} from "../utils/components";
import {by} from "protractor";
import {Type} from "../types";
import {map} from "../utils/maps";

export namespace Item {
    export class Product extends Component.Link {
        image: Component.Image;

        constructor(product: Type.Product) {
            super(by.css(`[data-qa="${map.productDataAttr(product)}-in-menu"]`), map.productName(product));

            this.image = this.new(Component.Image, by.css("img"));
        }
    }
}
