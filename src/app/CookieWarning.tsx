import React, {useState} from "react";
import {LocalStorage} from "src/app/LocalStorage";

export function CookieWarning() {
    const [accepted, setAccepted] = useState(LocalStorage.isCookieAccepted());

    if (accepted) {
        return null;
    }

    const onAcceptClick = (e: React.MouseEvent) => {
        LocalStorage.acceptCookie();
        setAccepted(true);
        e.preventDefault();
    };

    return (
        <div className="cookie-warning">
            This site uses{" "}
            <a href="https://en.wikipedia.org/wiki/Web_storage#Local_and_session_storage" target="_blank">
                cookie or local storage
            </a>
            . Please{" "}
            <a href="#" onClick={onAcceptClick}>
                accept it
            </a>{" "}
            for better experience! :)
        </div>
    );
}
