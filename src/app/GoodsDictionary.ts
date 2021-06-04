import {goodsindex} from "src/app/generated/goodsindex";
import {localisationRaw} from "src/app/generated/localisationRaw";
import {type_goods_entity} from "src/app/generated/interface/type_goodsindex";
import {productionsindex} from "src/app/generated/productionsindex";
import {type_production} from "src/app/generated/interface/type_productionsindex";

abstract class EntityBase {
    readonly names: {[lang: string]: string} = {};
    getLocalizedName = (locale: string) => this.names[locale] || this.names.en;
}

export class GoodsEntityClass extends EntityBase {
    readonly prodicingStations: Array<StationClass> = [];
    readonly consumingStations: Array<StationClass> = [];

    constructor(goods: type_goods_entity) {
        super();
        this.names.en = goods.name;
        // names locale
        Object.entries(localisationRaw).forEach((e) => {
            const [locale, obj] = e;
            this.names[locale] = obj[goods.name] || goods.name;
        });
    }

    isFilterAccepts = (filter: string, incStations: boolean = true) => {
        if (!filter) {
            return true;
        }
        if (Object.values(this.names).some((n) => n.toLowerCase().includes(filter))) {
            return true;
        }
        return incStations ? this.prodicingStations.some((s) => s.isFilterAccepts(filter)) || this.consumingStations.some((s) => s.isFilterAccepts(filter)) : false;
    };
}

export class StationClass extends EntityBase {
    readonly ingredients: Array<GoodsEntityClass> = [];
    readonly results: Array<GoodsEntityClass> = [];
    readonly garbages: Array<GoodsEntityClass> = [];

    constructor(station: type_production) {
        super();
        this.ingredients = station.ingredients.map((i) => GoodsDictionary.find((g) => g.names.en == i.name)).filter((g) => !!g) as Array<GoodsEntityClass>;
        this.results = station.results.map((i) => GoodsDictionary.find((g) => g.names.en == i.name)).filter((g) => !!g) as Array<GoodsEntityClass>;
        this.garbages = station.garbages.map((i) => GoodsDictionary.find((g) => g.names.en == i.name)).filter((g) => !!g) as Array<GoodsEntityClass>;

        const mainProduct = this.results[0] || this.garbages[0];

        // names locale
        Object.entries(localisationRaw).forEach((e) => {
            const [locale, obj] = e;
            this.names[locale] = (obj[station.factory] || station.factory) //
                .replace("${size}", "")
                .replace("${good}", mainProduct.names[locale])
                .trim();
        });
    }

    isFilterAccepts = (filter: string) => {
        if (!filter) {
            return true;
        }
        if (Object.values(this.names).some((n) => n.toLowerCase().includes(filter))) {
            return true;
        }
        return false;
    };
}

export const GoodsDictionary: Array<GoodsEntityClass> = Object.values(goodsindex).map((v) => new GoodsEntityClass(v));
export const StationsDictionary = productionsindex.map((s) => new StationClass(s));

GoodsDictionary.forEach((g) => {
    g.prodicingStations.push(...StationsDictionary.filter((s) => s.results.includes(g) || s.garbages.includes(g)));
    g.consumingStations.push(...StationsDictionary.filter((s) => s.ingredients.includes(g)));
});
