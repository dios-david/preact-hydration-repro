import React from 'react';
import { ThemeProvider } from '@theme-ui/core';
import { Route, Switch } from 'react-router-dom';
import { Home } from './Home';
import { Provider as UrqlProvider } from '@urql/preact';

const customTheme = {

};

const App = ({
  urqlClient
}) => (
  <UrqlProvider value={urqlClient}>
    <ThemeProvider value={customTheme}>
      <Switch>
        <Route exact path="/" component={Home} />
      </Switch>
    </ThemeProvider>
  </UrqlProvider>
);

export default App;
