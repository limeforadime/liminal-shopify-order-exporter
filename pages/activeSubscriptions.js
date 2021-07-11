import React from 'react';
import { Page, Card, Layout, Button } from '@shopify/polaris';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { useRouter } from 'next/router';

const ActiveSubscriptions = () => {
  const router = new useRouter();
  const getActiveSubscriptions = gql`
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
  const getActiveWebhooks = gql`
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

  return (
    <React.Fragment>
      <Page>
        <Layout>
          <Layout.Section>
            <Card title="Getting current subscriptions" sectioned>
              <Query query={getActiveSubscriptions}>
                {({ loading, error, data }) => {
                  if (error) return <p>{error.message}</p>;
                  if (loading) return <p>Loading</p>;
                  console.log(data);
                  return (
                    <p>
                      Check your console for current active app subscriptions. This is a temporary placeholder
                      while subscription routing is being tested.
                    </p>
                  );
                }}
              </Query>
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
          </Layout.Section>
          <Layout.Section>
            <Card title="Getting current webhooks" sectioned>
              <Query query={getActiveWebhooks}>
                {({ loading, error, data }) => {
                  if (error) return <p>{error.message}</p>;
                  if (loading) return <p>Loading</p>;
                  console.log(data);
                  return <p>Check your console for current active webhook subscriptions</p>;
                }}
              </Query>
              <br />
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </React.Fragment>
  );
};

export default ActiveSubscriptions;
