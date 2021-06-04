export class LocalStorage {
    static acceptKey = "cookie-accepted";

    static isCookieAccepted = (): boolean => !!LocalStorage.load(LocalStorage.acceptKey);

    static store = (key: string, payload: any) => {
        if (LocalStorage.isCookieAccepted() || key == LocalStorage.acceptKey) {
            window.localStorage.setItem(key, JSON.stringify(payload));
        }
    };

    static remove = (key: string) => {
        window.localStorage.removeItem(key);
    };

    static load = <T = any>(key: string): T => {
        return JSON.parse(window.localStorage.getItem(key) || '""') as T;
    };

    static acceptCookie = () => LocalStorage.store(LocalStorage.acceptKey, true);
}
