import React, {useContext, useMemo, useState} from "react";
import ReactDOM from "react-dom";
import {lang, LangManager, LangManagerContext} from "src/app/lang";
import {GoodsDictionary, GoodsEntityClass, StationClass} from "src/app/GoodsDictionary";

function Application() {
    const {selectedLocale} = useContext(LangManagerContext);
    const [filter, setFilter] = useState("");

    const goodsSortedAndFiltered = useMemo(() => {
        return GoodsDictionary.filter((e) => e.isFilterAccepts(filter.toLowerCase()));
    }, [selectedLocale, filter]);

    return (
        <LangManager>
            <div className="wrapper">
                <header>{lang("Goods list")}</header>

                <div className="flex-row-center">
                    <div>{lang("Filter")}</div>
                    <input type="text" value={filter} onChange={(e) => setFilter(e.target.value)} />
                </div>

                <table>
                    <thead>
                    <tr>
                        <td>{lang("Name")}</td>
                        <td>{lang("Consumers")}</td>
                        <td>{lang("Produces:")}</td>
                    </tr>
                    </thead>
                    <tbody>
                    {goodsSortedAndFiltered.map((e) => (
                        <GoodsEntity e={e} filter={filter} key={e.names.en} />
                    ))}
                    </tbody>
                </table>

                <a href="https://github.com/Relvl/AvorionGoods">Github repository - feel free to add PR</a>
            </div>
        </LangManager>
    );
}

function GoodsEntity({e, filter}: {e: GoodsEntityClass; filter: string}) {
    const {selectedLocale} = useContext(LangManagerContext);
    const localizedName = useMemo(() => e.getLocalizedName(selectedLocale), [e]);
    const isFilterAccepts = useMemo(() => e.isFilterAccepts(filter, false), [filter, e]);

    return (
        <tr>
            <td className={isFilterAccepts ? undefined : "filter_exclude"}>{localizedName}</td>
            <td>
                {e.consumingStations.map((s) => (
                    <StationEntity e={s} filter={filter} key={s.names.en} />
                ))}
            </td>
            <td>
                {e.prodicingStations.map((s) => (
                    <StationEntity e={s} filter={filter} key={s.names.en} />
                ))}
            </td>
        </tr>
    );
}

function StationEntity({e, filter}: {e: StationClass; filter: string}) {
    const {selectedLocale} = useContext(LangManagerContext);
    const localizedName = useMemo(() => e.getLocalizedName(selectedLocale), [e]);
    const isFilterAccepts = useMemo(() => e.isFilterAccepts(filter), [filter, e]);

    return <div className={isFilterAccepts ? undefined : "filter_exclude"}>{localizedName}</div>;
}

const rootNode = window.document.createElement("div");
rootNode.setAttribute("id", "root");
ReactDOM.render(<Application />, window.document.body.appendChild(rootNode));

console.log("Application started") /*FIXME Убрать!*/;
