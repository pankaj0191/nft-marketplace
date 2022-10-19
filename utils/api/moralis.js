import Moralis from 'moralis/node'

export const initMoralis = async (options = {}) => {
    await Moralis.start({
        serverUrl: process.env.MORALIS_APP_URL,
        appId: process.env.MORALIS_APP_ID,
        masterKey: process.env.MORALIS_MASTER_KEY,
        ...options
    });

    return Moralis;
}

export const getMoralisClass = async (className) => {
    const moralis = await initMoralis();
    const _className = typeof className === "string" && className ? className.trim() : "";
    if(!_className) return false;
    return new moralis.Query(_className);
}

export const getLoginUser = async (request) => {
    const moralis = await initMoralis();
    const currentSession = request.cookies._hjSessionUser_1932330 || "";
    const session = new moralis.Session();
    return session;

}