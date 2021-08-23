import React, { useContext, useCallback } from 'react';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
import {
  Card,
  Button,
  SkeletonBodyText,
  SkeletonDisplayText,
  TextContainer,
  Toast,
  Frame,
} from '@shopify/polaris';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Redirect } from '@shopify/app-bridge/actions';
import { AppStateContext } from '../components/AppStateWrapper';
import { Loading } from '@shopify/app-bridge-react';

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
  const app = useAppBridge();
  const router = useRouter();
  const appState = useContext(AppStateContext);
  const { shop } = appState;
  console.log(`ActiveWebhookSubscription's shop value: ${shop}`);
  const redirect = Redirect.create(app);

  const handleRedirect = useCallback(async () => {
    // redirect.dispatch(Redirect.Action.APP, `/auth?shop=${shop}`);
    redirect.dispatch(Redirect.Action.APP, `/`);
    // router.reload();
  });

  const { loading, error, data } = useQuery(GET_ACTIVE_WEBHOOKS);
  if (loading) {
    return (
      <>
        <Loading />
        <Card subdued>
          <Card.Section>
            <TextContainer>
              <SkeletonDisplayText size="large" />
              <SkeletonBodyText lines={2} />
            </TextContainer>
          </Card.Section>
        </Card>
      </>
    );
  }
  if (error) {
    console.error(`Error type: ${error.name}`);
    console.error(error);
    return (
      <Frame>
        <Toast
          content={'Sorry, need to refresh session'}
          error={true}
          duration={6000}
          onDismiss={handleRedirect}
        />
      </Frame>
    );
  }
  console.log(data);

  return (
    <Card title="Getting current webhook subscriptions" sectioned>
      <p>
        Check your console for current active webhook subscriptions. This is a temporary placeholder while
        subscription routing is being tested.
      </p>
      <br />
      <Button
        size="large"
        onClick={() => {
          router.push('/');
        }}
      >
        Home
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
  );
}
