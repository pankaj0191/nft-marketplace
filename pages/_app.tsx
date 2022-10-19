import App from 'next/app'
import Router from 'next/router';
import nprogress from 'nprogress/nprogress.js';

import { SECRET } from 'utils';
import Common from 'context/Common';
import { getTokenData, getUserById } from 'services';

import type { AppProps } from 'next/app'

import 'styles/dark.css';
import 'styles/globals.css';
import 'styles/nprogress.css';
import 'tailwindcss/tailwind.css';
import { getCookie } from 'cookies-next';

Router.events.on('routeChangeStart', nprogress.start);
Router.events.on('routeChangeError', nprogress.done);
Router.events.on('routeChangeComplete', nprogress.done);

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Common.provider pageProps={pageProps}>
      <Component {...pageProps} />
    </Common.provider>
  )
}

MyApp.getStaticProps = async (appContext: any) => {
  const appProps: any = await App.getInitialProps(appContext);
  const context = appContext.ctx;
  const token = context?.req ? context.req?.cookies?.[SECRET] || "" : getCookie(SECRET);;
  const data: any = getTokenData(token);
  if(data) {
    const loginUser = await getUserById(data.user.id);
    appProps.pageProps = {
      token: data.token,
      user: loginUser
    };
  }
  appProps.pageProps.isAuthenticated = data ? true : false;

  return { ...appProps }
}
