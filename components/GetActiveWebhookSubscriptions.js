import React from 'react';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
import { Card, Button } from '@shopify/polaris';

const GET_ACTIVE_WEBHOOKS = gql`
  {
    webhookSubscriptions(first: 50) {
      edges {
        node {
          topic
        }
      }
    }
  }
`;
export default function GetActiveWebhookSubscriptions() {
  const router = new useRouter();
  const { loading, error, data } = useQuery(GET_ACTIVE_WEBHOOKS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  console.log(data);

  return (
    <Card title="Getting current webhook subscriptions" sectioned>
      <p>
        Check your console for current active webhook subscriptions. This is a temporary placeholder while
        subscription routing is being tested.
      </p>
      {/* <Card title="Getting current webhooks" sectioned>
              <Query query={getActiveWebhooks}>
                {({ loading, error, data }) => {
                  if (error) return <p>{error.message}</p>;
                  if (loading) return <p>Loading</p>;
                  console.log(data);
                  return <p>Check your console for current active webhook subscriptions</p>;
                }}
              </Query>
              <br />
            </Card> */}
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
