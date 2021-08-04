import React from 'react';
import Head from 'next/head';
import '@shopify/polaris/dist/styles.css';
import translations from '@shopify/polaris/locales/en.json';
import { AppProvider as PolarisProvider } from '@shopify/polaris';
import { Provider as AppBridgeProvider, useAppBridge } from '@shopify/app-bridge-react';

import { ApolloProvider, ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import ClientRouter from '../components/ClientRouter.js';
import userLoggedInFetch from '../utils/userLoggedInFetch.js';

function MyProvider(props) {
  const app = useAppBridge();

  const client = new ApolloClient({
    link: createHttpLink({
      fetch: userLoggedInFetch(app),
      credentials: 'include',
    }),
    cache: new InMemoryCache({}),
  });
  const Component = props.Component;

  return (
    <ApolloProvider client={client}>
      <Component {...props} />
    </ApolloProvider>
  );
}

const MyApp = ({ Component, pageProps, host, shop }) => {
  return (
    <React.Fragment>
      <Head>
        <title>Sample App</title>
        <meta charSet="utf-8" />
      </Head>
      <PolarisProvider i18n={translations}>
        <AppBridgeProvider
          config={{
            apiKey: API_KEY,
            host: host,
            forceRedirect: true,
          }}
        >
          <ClientRouter />
          <MyProvider Component={Component} {...pageProps} shop={shop} />
        </AppBridgeProvider>
      </PolarisProvider>
    </React.Fragment>
  );
};

MyApp.getInitialProps = async ({ ctx }) => {
  return {
    host: ctx.query.host,
    shop: ctx.query.shop,
  };
};

export default MyApp;
