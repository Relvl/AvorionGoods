import React, {HTMLProps, useState} from "react";
import {localisationRaw} from "src/app/generated/localisationRaw";

const selectedLocale = "ru";

type LangContext = {
    selectedLocale: string;
};
const DefaultContext: LangContext = {
    selectedLocale: "ru",
};

export const LangManagerContext = React.createContext<LangContext>(DefaultContext);

export function LangManager(props: HTMLProps<any>) {
    const [selectedLocale, setSelectedLocale] = useState(DefaultContext.selectedLocale);
    return <LangManagerContext.Provider value={{selectedLocale}}>{props.children}</LangManagerContext.Provider>;
}

export function lang(text: string) {
    return localisationRaw?.[selectedLocale]?.[text] || text;
}
