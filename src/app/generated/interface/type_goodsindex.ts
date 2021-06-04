export type type_goodsindex = {
    [good: string]: type_goods_entity;
};

export type type_goods_entity = {
    description: string;
    tags: {[tag: string]: boolean};
    price: number;
    chains: {[tag: string]: boolean};
    illegal: boolean;
    dangerous: boolean;
    name: string;
    importance: number;
    plural: string;
    level?: number;
    icon: string;
    size: number;
};
