import React, { useCallback, useContext, useEffect, useState } from 'react';
import { EmptyState, Button, Card, Frame, Toast, Heading } from '@shopify/polaris';
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

  useEffect(() => {
    const checkIfSessionActive = async () => {
      console.log('checking if session active...');
      const res = await userLoggedInFetch(app)('/api/isSessionActive');
      console.log(`response status code: ${res.status}`);
      if (res.status != 200) {
        redirect.dispatch(Redirect.Action.APP, `/auth?shop=${shop}`);
      }
    };
    if (shop) {
      checkIfSessionActive();
    }
  }, [shop]);

  //! Leaving this off just for testing

  // Shopify session tokens expire after 1 day. This code will check if the user has
  // visited the app within 12 hours (to be safe) and preemptively force a new Oauth handshake
  // and give a fresh token, instead of checking only when shop data is requested from
  // Shopify (which if not valid for any reason will THEN force Oauth while the
  // user is in the middle of something which in my opinion is bad UX)

  // useEffect(() => {
  //   if (shop) {
  //     console.log('okay shop is defined now');
  //     // 12 hour time limit, picked on a whim. Anything less than 24 hours (Shopify session token lifespan)
  //     const timeLimit = 1000 * 60 * 60 * 12;
  //     const hasVisited = localStorage.getItem('hasVisited') === 'true';
  //     const expiryTime = localStorage.getItem('expiryTime');
  //     if (hasVisited && expiryTime) {
  //       if (Date.now() >= expiryTime) {
  //         // set expiryTime in localStorage to 12 hours from current time (1000 * 60 * 60 * 12)
  //         localStorage.setItem('expiryTime', Date.now() + timeLimit);
  //         // force Oauth
  //         redirect.dispatch(Redirect.Action.APP, `/auth?shop=${shop}`);
  //       } else {
  //         localStorage.setItem('expiryTime', Date.now() + timeLimit);
  //       }
  //     } else {
  //       // runs on first visit to the app
  //       localStorage.setItem('hasVisited', true);
  //       localStorage.setItem('expiryTime', Date.now() + timeLimit);
  //       redirect.dispatch(Redirect.Action.APP, `/auth?shop=${shop}`);
  //     }
  //   } else {
  //     console.log('shop is undefined! Thats ok well just wait for the next render');
  //   }
  // }, [shop]);

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
  const handleIsSessionActiveButton = useCallback(async () => {
    try {
      console.log('checking if session active...');
      const res = await userLoggedInFetch(app)('/api/isSessionActive');
      console.log(`response status code: ${res.status}`);
      // if (res.status)
    } catch (err) {
      console.log(err);
    }
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
        <Button size="large" onClick={handleIsSessionActiveButton}>
          IsSessionActive?
        </Button>
      </Card>
    </>
  );
};

export default Index;
