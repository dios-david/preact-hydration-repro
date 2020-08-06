import React from 'react';
import { useQuery } from '@urql/preact';
import gql from 'graphql-tag';

export const FetchingComponent = () => {
  const [{ data, error, fetching }] = useQuery({
    query: gql`
      {
        country(code: "HU") {
          name
        }
      }
    `
  });

  if (fetching) {
    return <span>Loading...</span>;
  }

  console.log(data);

  return (
    <pre
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2)
      }}
    />
  );
}