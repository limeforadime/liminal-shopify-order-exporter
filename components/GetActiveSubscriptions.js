import React from 'react';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
import { Card, Button } from '@shopify/polaris';

const GET_ACTIVE_SUBSCRIPTIONS = gql`
  {
    currentAppInstallation {
      activeSubscriptions {
        id
        name
        status
      }
    }
  }
`;
export default function GetActiveSubscriptions() {
  const router = new useRouter();
  const { loading, error, data } = useQuery(GET_ACTIVE_SUBSCRIPTIONS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  console.log(data);

  return (
    <Card title="Getting current subscriptions" sectioned>
      <p>
        Check your console for current active app subscriptions. This is a temporary placeholder while
        subscription routing is being tested.
      </p>
      {/* <Query query={getActiveSubscriptions}>
                {({ loading, error, data }) => {
                  if (error) return <p>{error.message}</p>;
                  if (loading) return <p>Loading</p>;
                  console.log(data);
                  return (

                  );
                }}
              </Query> */}
      <br />
      <Button
        size="large"
        onClick={() => {
          router.push('/');
        }}
      >
        Home
      </Button>
    </Card>
  );
}
