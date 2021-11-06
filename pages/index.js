import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  EmptyState,
  Button,
  Card,
  Frame,
  Toast,
  Collapsible,
  Page,
  Layout,
  Stack,
  DatePicker,
  List,
  Tag,
  Subheading,
} from '@shopify/polaris';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Redirect } from '@shopify/app-bridge/actions';
import userLoggedInFetch from '../utils/userLoggedInFetch';
import { AppStateContext } from '../components/AppStateWrapper';
import { useRouter } from 'next/router';
// debug vvv
import jwtDecode from 'jwt-decode';
import { getSessionToken } from '@shopify/app-bridge-utils';
import FilterCard from '../components/Filtering/FilterCard';

const Index = () => {
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openDebugButtons, setOpenDebugButtons] = useState(false);

  const appState = useContext(AppStateContext);
  const { shop } = appState;
  const router = useRouter();
  const app = useAppBridge();
  const redirect = Redirect.create(app);

  // 10/28/2021 - Will use, but for now this isn't important
  //
  // useEffect(() => {
  //   const checkIfSessionActive = async () => {
  //     console.log('checking if session active...');
  //     const res = await userLoggedInFetch(app)('/api/isSessionActive');
  //     console.log(`response status code: ${res.status}`);
  //     if (res.status != 200) {
  //       redirect.dispatch(Redirect.Action.APP, `/auth?shop=${shop}`);
  //     }
  //   };
  //   if (shop) {
  //     checkIfSessionActive();
  //   }
  // }, [shop]);

  const handleDebugToggle = useCallback(
    () => setOpenDebugButtons((openDebugButtons) => !openDebugButtons),
    []
  );
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
    <Page title="Main Page" subtitle="Here's where the magic happens">
      <Layout>
        <Layout.Section>
          {showError ? (
            <Frame>
              <Toast content={errorMessage} error={true} duration={6000} onDismiss={handleRedirect} />
            </Frame>
          ) : null}
          <FilterCard />
          <Card title="Select Fields To Export" sectioned>
            <Card.Section>
              <Subheading>🚧🚨 Coming Soon~ 🚧🚨</Subheading>
            </Card.Section>
          </Card>
          <Card sectioned>
            <Stack vertical>
              <Button
                onClick={handleDebugToggle}
                plain
                destructive
                ariaExpanded={openDebugButtons}
                ariaControls="basic-collapsible"
              >
                Debug Buttons
              </Button>
              <Collapsible open={openDebugButtons} id="basic-collapsible" expandOnPrint>
                {/* <Card sectioned subdued> */}
                <Button onClick={handleOrderButton}>Hit Orders Route</Button>
                <Button onClick={handleAuthButton}>Auth</Button>
                <Button onClick={handleSessionButton}>GetSession</Button>
                <Button onClick={handleJWTButton}>Get JWT</Button>
                <Button size="large" onClick={handleIsSessionActiveButton}>
                  IsSessionActive?
                </Button>
                {/* </Card> */}
              </Collapsible>
            </Stack>
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <Card title="Settings">
            <Card.Header title="hey wuddup" />
            <Card.Section title="yo wuddup">
              <p>Here's some text hey wuddup</p>
            </Card.Section>
            <Card.Section title="Address Information" actions={[{ content: 'Edit' }]}>
              1234 Main Street, Main, CA 90111
            </Card.Section>
            <Card.Section title="Customer Information" actions={[{ content: 'Edit' }]}>
              <List>
                <List.Item>Jon Smith</List.Item>
                <List.Item>123 Some Text</List.Item>
              </List>
            </Card.Section>
            <Card.Section title="Misc Information" actions={[{ content: 'Edit' }]}>
              1234 Main Street, Main, CA 90111
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Index;
