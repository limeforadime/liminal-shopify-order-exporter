import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  Frame,
  Toast,
  Collapsible,
  Page,
  Layout,
  Stack,
  List,
  Heading,
} from '@shopify/polaris';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Redirect } from '@shopify/app-bridge/actions';
import { AppStateContext } from '../components/AppStateWrapper';
import Router, { useRouter } from 'next/router';

const RouteTest = () => {
  const app = useAppBridge();
  const redirect = Redirect.create(app);
  const router = useRouter();
  const { shop, test } = router.query;
  return (
    <Page title="Route test">
      <Layout sectioned>
        <Card sectioned>
          <h2>Parameters passed in: </h2>
          <h3>
            {test} <br />
            and <br />
            {shop}
          </h3>
          <Button
            onClick={() => {
              // redirect.dispatch(Redirect.Action.APP, '/');
              router.push('/');
            }}
          >
            Back to home
          </Button>
        </Card>
      </Layout>
    </Page>
  );
};

export default RouteTest;
