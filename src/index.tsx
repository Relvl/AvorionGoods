import React, {useContext, useMemo, useState} from "react";
import ReactDOM from "react-dom";
import {Lang, LangManager, LangManagerContext, LangSwitch} from "src/app/lang";
import {GoodsDictionary, GoodsEntityClass, StationClass} from "src/app/GoodsDictionary";
import {CookieWarning} from "src/app/CookieWarning";

function Application() {
    const {selectedLocale} = useContext(LangManagerContext);
    const [filter, setFilter] = useState("");

    const goodsSortedAndFiltered = useMemo(() => {
        return GoodsDictionary.filter((e) => e.isFilterAccepts(filter.toLowerCase())).sort((a, b) =>
            a.getLocalizedName(selectedLocale).localeCompare(b.getLocalizedName(selectedLocale))
        );
    }, [selectedLocale, filter]);

    return (
        <LangManager>
            <div className="wrapper">
                <header className="flex-row-center">
                    <div>
                        <Lang>Goods list</Lang> - (1.3.8-beta)
                    </div>

                    <a href="https://github.com/Relvl/AvorionGoods" target="_blank">
                        Github repository - feel free to add PR
                    </a>

                    <LangSwitch />
                </header>

                <div className="flex-row-center">
                    <div>
                        <Lang>Filter</Lang>
                    </div>
                    <input type="text" value={filter} onChange={(e) => setFilter(e.target.value)} />
                </div>

                <table>
                    <thead>
                        <tr>
                            <td>
                                <Lang>Name</Lang>
                            </td>
                            <td>
                                <Lang>Consumers</Lang>
                            </td>
                            <td>
                                <Lang>Produces:</Lang>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {goodsSortedAndFiltered.map((e) => (
                            <GoodsEntity e={e} filter={filter} key={e.names.en} />
                        ))}
                    </tbody>
                </table>
            </div>
            <CookieWarning />
        </LangManager>
    );
}

function GoodsEntity({e, filter}: {e: GoodsEntityClass; filter: string}) {
    const {selectedLocale} = useContext(LangManagerContext);
    const localizedName = useMemo(() => e.getLocalizedName(selectedLocale), [e, selectedLocale]);
    const isFilterAccepts = useMemo(() => e.isFilterAccepts(filter, false), [filter, e]);

    return (
        <tr>
            <td className={isFilterAccepts ? undefined : "filter_exclude"}>{localizedName}</td>
            <td>
                {e.consumingStations.map((s, idx) => (
                    <StationEntity e={s} filter={filter} key={`${s.names.en}-${idx}`} />
                ))}
            </td>
            <td>
                {e.prodicingStations.map((s, idx) => (
                    <StationEntity e={s} filter={filter} key={`${s.names.en}-${idx}`} />
                ))}
            </td>
        </tr>
    );
}

function StationEntity({e, filter}: {e: StationClass; filter: string}) {
    const {selectedLocale} = useContext(LangManagerContext);
    const localizedName = useMemo(() => e.getLocalizedName(selectedLocale), [e, selectedLocale]);
    const isFilterAccepts = useMemo(() => e.isFilterAccepts(filter), [filter, e]);

    return <div className={isFilterAccepts ? undefined : "filter_exclude"}>{localizedName}</div>;
}

const rootNode = window.document.createElement("div");
rootNode.setAttribute("id", "root");
ReactDOM.render(<Application />, window.document.body.appendChild(rootNode));

console.log("Application started") /*FIXME Убрать!*/;
