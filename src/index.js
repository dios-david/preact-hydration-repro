const http = require('http');
const moduleAlias = require('module-alias');

// Alias react to preact
moduleAlias.addAliases({
  react: 'preact/compat/dist/compat',
  'react-dom': 'preact/compat/dist/compat'
});

let app = require('./server').default;

const server = http.createServer(app);

let currentApp = app;

server
  .listen(process.env.PORT || 3000, () => {
    console.log('🚀 started');
  })
  .on('error', error => {
    console.log(error);
  });

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!');

  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`...');

    try {
      app = require('./server').default;
      server.removeListener('request', currentApp);
      server.on('request', app);
      currentApp = app;
    } catch (error) {
      console.error(error);
    }
  });
}
