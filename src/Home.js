import React from 'react';
import { FetchingComponent } from './FetchingComponent';

export const Home = () => {
  console.log('a');

  return (
    <React.Fragment>
      <h1
        sx={{
          color: 'red'
        }}
      >
        Hello world
      </h1>

      <FetchingComponent />
    </React.Fragment>
  )
}

