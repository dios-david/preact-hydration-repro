import App from './App';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import express from 'express';
import renderToString from 'preact-render-to-string';
import ssrPrepass from 'preact-ssr-prepass';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/core';
import createEmotionServer from 'create-emotion-server';
import fetch from 'node-fetch';
import {
  cacheExchange,
  createClient,
  dedupExchange,
  fetchExchange,
  ssrExchange,
} from '@urql/preact';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const emotionCache = createCache();
const { extractCritical } = createEmotionServer(emotionCache);

const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', async (req, res) => {
    const ssrCache = ssrExchange({ isClient: false });
    const urqlClient = createClient({
      url: 'https://countries.trevorblades.com',
      fetch,
      suspense: true,
      exchanges: [
        dedupExchange,
        cacheExchange,
        ssrCache,
        fetchExchange,
      ]
    });
    const context = {};
    const appToRender = (
      <StaticRouter context={context} location={req.url}>
        <App urqlClient={urqlClient} />
      </StaticRouter>
    )

    // Prepass
    await ssrPrepass(appToRender);

    // Render
    const {html, css, ids} = extractCritical(renderToString(
      <CacheProvider value={emotionCache}>
        {appToRender}
      </CacheProvider>
    ));

    if (context.url) {
      res.redirect(context.url);
    } else {
      res.status(200).send(
        `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8" />
        <title>Welcome to Razzle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${
          process.env.NODE_ENV === 'production'
            ? `<script src="${assets.client.js}" defer></script>`
            : `<script src="${assets.client.js}" defer crossorigin></script>`
        }
        <style data-emotion-css="${ids.join(' ')}">${css}</style>
    </head>
    <body>
        <div id="root">${html}</div>
        <script>
          window.__URQL__ = JSON.parse(${JSON.stringify(JSON.stringify(ssrCache.extractData()))});
        </script>
    </body>
</html>`
      );
    }
  });

export default server;
