import App from './App';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import { hydrate } from 'react-dom';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/core';
import {
  cacheExchange,
  createClient,
  dedupExchange,
  fetchExchange,
  ssrExchange,
} from '@urql/preact';

const emotionCache = createCache();

const urqlClient = createClient({
  url: 'https://countries.trevorblades.com',
  exchanges: [
    dedupExchange,
    cacheExchange,
    ssrExchange({
      isClient: true,
      initialState: window.__URQL__,
    }),
    fetchExchange,
  ].filter(Boolean)
});

hydrate(
  <CacheProvider value={emotionCache}>
    <BrowserRouter>
      <App urqlClient={urqlClient} />
    </BrowserRouter>
  </CacheProvider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
