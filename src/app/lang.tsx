import React, {HTMLAttributes, HTMLProps, useContext, useMemo, useState} from "react";
import {localisationRaw} from "src/app/generated/localisationRaw";
import {LocalStorage} from "src/app/LocalStorage";

type LangContext = {
    selectedLocale: string;
    setSelectedLocale: (locale: string) => void;
};
const DefaultContext: LangContext = {
    selectedLocale: LocalStorage.load<string>("locale") || "en",
    setSelectedLocale: () => {},
};

export const LangManagerContext = React.createContext<LangContext>(DefaultContext);

export function LangManager(props: HTMLProps<any>) {
    const [selectedLocale, setSelectedLocale] = useState(DefaultContext.selectedLocale);
    const selSelectedLocaleWrapper = (locale: string) => {
        LocalStorage.store("locale", locale);
        setSelectedLocale(locale);
    };
    return <LangManagerContext.Provider value={{selectedLocale, setSelectedLocale: selSelectedLocaleWrapper}}>{props.children}</LangManagerContext.Provider>;
}

export function Lang(props: HTMLAttributes<any>) {
    const {selectedLocale} = useContext(LangManagerContext);
    const out = useMemo(() => localisationRaw?.[selectedLocale]?.[props.children as string] || props.children, [selectedLocale, props.children]);
    return <>{out}</>;
}

export function LangSwitch() {
    const {selectedLocale, setSelectedLocale} = useContext(LangManagerContext);
    const locales = useMemo(() => ["en", ...Object.keys(localisationRaw)], []);

    return (
        <div className="locale-switch">
            {locales.map((l) => (
                <div className={l == selectedLocale ? "selected" : undefined} onClick={() => setSelectedLocale(l)} key={l}>
                    {l.toUpperCase().substr(0, 2)}
                </div>
            ))}
        </div>
    );
}
