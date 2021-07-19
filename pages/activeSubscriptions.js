import React from 'react';
import { Page, Layout } from '@shopify/polaris';
import GetActiveSubscriptions from '../components/GetActiveSubscriptions';
import GetActiveWebhookSubscriptions from '../components/GetActiveWebhookSubscriptions';
// import gql from 'graphql-tag';
// import { gql, useQuery } from '@apollo/client';
// import { Query } from 'react-apollo';

const ActiveSubscriptions = () => {
  return (
    <React.Fragment>
      <Page>
        <Layout>
          <Layout.Section>
            <GetActiveSubscriptions />
          </Layout.Section>
          <Layout.Section>
            <GetActiveWebhookSubscriptions />
          </Layout.Section>
        </Layout>
      </Page>
    </React.Fragment>
  );
};

export default ActiveSubscriptions;
