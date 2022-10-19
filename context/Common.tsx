import React, { useContext } from 'react'

import { Metamask } from '.'
import { useLocalStorage } from 'components/miscellaneous/hooks'

export const CommonContext = React.createContext({});

function CommonProvider({ children, pageProps }: any) {
    const { user, isAuthenticated }: any = pageProps;
    const theme = isAuthenticated && user?.theme ? user.theme : "light";
    const [userTheme, setUserTheme] = useLocalStorage('userTheme', theme);

    return (
        <div>
            <Metamask.provider pageProps={pageProps}>
                <CommonContext.Provider value={{
                    userTheme, setUserTheme
                }} >
                    {children}
                </CommonContext.Provider>
            </Metamask.provider>
        </div>
    )
}

export function useCommonContext() {
    return useContext(CommonContext);
}

export default {
    provider: CommonProvider,
    context: CommonContext,
    useContext: useCommonContext
};