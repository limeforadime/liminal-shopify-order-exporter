import React from 'react';
import { Page, Layout } from '@shopify/polaris';
import GetActiveWebhookSubscriptions from '../components/GetActiveWebhookSubscriptions';

const ActiveSubscriptions = () => {
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <GetActiveWebhookSubscriptions />
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default ActiveSubscriptions;
