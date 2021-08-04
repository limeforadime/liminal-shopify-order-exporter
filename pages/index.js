import React, { useCallback } from 'react';
import { useRouter } from 'next/router';
import { EmptyState, Button, Card } from '@shopify/polaris';
import { useAppBridge } from '@shopify/app-bridge-react';
import { getSessionToken } from '@shopify/app-bridge-utils';
import { Redirect } from '@shopify/app-bridge/actions';
import userLoggedInFetch from '../utils/userLoggedInFetch';

const Index = ({ shop }) => {
  const app = useAppBridge();
  const redirect = Redirect.create(app);

  const handleButton = useCallback(async () => {
    // try out authenticatedFetch
    // const sessionToken = await getSessionToken(app);
    // const res = await fetch('/api/orders?q=heywuddup&b=bitches', {
    //   headers: {
    //     Authorization: `Bearer ${sessionToken}`,
    //   },
    // });
    const res = await userLoggedInFetch(app, shop)('/api/orders?created_at_max=2021-07-27T03:25:40-04:00');

    const responseData = await res.json();
    console.log(responseData);
  });
  const handleAuthButton = useCallback(async () => {
    redirect.dispatch(Redirect.Action.APP, `/auth?shop=${shop}`);
  });
  return (
    <Card sectioned>
      <Button onClick={handleButton}>Hit Orders Route</Button>
      <Button onClick={handleAuthButton}>Auth</Button>
    </Card>
  );
};

export default Index;
