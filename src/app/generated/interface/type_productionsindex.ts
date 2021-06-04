export type type_productionsindex = Array<type_production>;

export type type_production = {
    factory: string;
    factoryStyle: string;
    ingredients: Array<type_production_item>;
    results: Array<type_production_item>;
    garbages: Array<type_production_item>;
};

export type type_production_item = {
    optional?: number;
    name: string;
    amount: number;
};
