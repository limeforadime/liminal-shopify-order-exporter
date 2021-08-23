import React, { useCallback, useContext, useEffect, useState } from 'react';
import { EmptyState, Button, Card, Frame, Toast } from '@shopify/polaris';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Redirect } from '@shopify/app-bridge/actions';
import userLoggedInFetch from '../utils/userLoggedInFetch';
import { AppStateContext } from '../components/AppStateWrapper';
import { useRouter } from 'next/router';
// debug vvv
import jwtDecode from 'jwt-decode';
import { getSessionToken } from '@shopify/app-bridge-utils';

const Index = () => {
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const appState = useContext(AppStateContext);
  const { shop } = appState;
  const router = useRouter();
  const app = useAppBridge();
  const redirect = Redirect.create(app);

  const handleSessionButton = useCallback(() => {
    console.log(`In Index, getting appStateWrapper's shop: ${shop}`);
  });
  const handleJWTButton = useCallback(async () => {
    console.log(`JWT: `);
    const res = await getSessionToken(app);
    const decoded = jwtDecode(res);
    console.log(res);
    console.log(decoded);
  });
  const handleOrderButton = useCallback(async () => {
    // try out authenticatedFetch
    // const sessionToken = await getSessionToken(app);
    // const res = await fetch('/api/orders?q=heywuddup&b=bitches', {
    //   headers: {
    //     Authorization: `Bearer ${sessionToken}`,
    //   },
    // });
    try {
      const res = await userLoggedInFetch(app)('/api/orders?created_at_max=2021-07-27T03:25:40-04:00');
      const responseData = await res.json();
      console.log(responseData);
    } catch (e) {
      console.error(e);
      setShowError(true);
      setErrorMessage('Sorry, need to refresh session');
      return;
    }
  });
  const handleAuthButton = useCallback(async () => {
    redirect.dispatch(Redirect.Action.APP, `/auth?shop=${shop}`);
  });

  const handleRedirect = useCallback(async () => {
    setShowError(false);
    // redirect.dispatch(Redirect.Action.APP, `/auth?shop=${shop}`);
  });

  return (
    <>
      {showError ? (
        <Frame>
          <Toast content={errorMessage} error={true} duration={6000} onDismiss={handleRedirect} />
        </Frame>
      ) : null}
      <Card sectioned>
        <Button onClick={handleOrderButton}>Hit Orders Route</Button>
        <Button onClick={handleAuthButton}>Auth</Button>
        <Button onClick={handleSessionButton}>GetSession</Button>
        <Button onClick={handleJWTButton}>Get JWT</Button>
        <Button
          size="large"
          onClick={() => {
            router.push('/test');
          }}
        >
          Go To Test Page
        </Button>
        <Button
          size="large"
          onClick={() => {
            router.push('/activeSubscriptions');
          }}
        >
          Go To ACTIVE SUBSCRIPTIONS
        </Button>
        <Button
          size="large"
          onClick={() => {
            console.log('reloading...');
            router.reload();
          }}
        >
          Reload
        </Button>
      </Card>
    </>
  );
};

export default Index;
