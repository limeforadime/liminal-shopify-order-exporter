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
  Heading,
  Icon,
  List,
  TextField,
  FormLayout,
} from '@shopify/polaris';
import { DeleteMajor, EditMajor } from '@shopify/polaris-icons';
import Router, { useRouter } from 'next/router';
import { useAppBridge } from '@shopify/app-bridge-react';
import userLoggedInFetch from '../utils/client/userLoggedInFetch';
import { AppStateContext } from '../components/AppStateWrapper';

const Index = () => {
  const app = useAppBridge();
  const appState = useContext(AppStateContext);
  const router = useRouter();
  const { shop } = appState;
  const [profiles, setProfiles] = useState([]);
  const [profileInput, setProfileInput] = useState('');

  // get export profiles from database
  useEffect(() => {
    if (!shop) return;
    const getProfiles = async () => {
      try {
        const res = await userLoggedInFetch(app)(`${app.localOrigin}/api/profiles?shop=${shop}`);
        if (res.status == 200) {
          const profiles = await res.json();
          console.log(profiles.profiles);
          setProfiles(profiles.profiles);
        } else {
          throw new Error("Couldn't fetch orders");
        }
      } catch (err) {
        console.log(err);
      }
    };
    getProfiles();
  }, [shop]);

  const handleInputChange = useCallback((newValue) => {
    setProfileInput(newValue);
  });

  const handleInputSend = useCallback(async () => {
    try {
      const res = await userLoggedInFetch(app)(`/api/profiles/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileName: profileInput,
        }),
      });
      if (!res.ok) {
        throw new Error('Problem sending POST to /api/profiles/create');
      }
    } catch (err) {
      console.error(err);
    }
  });

  const profilesMarkup = (
    <Card title="Export profiles">
      {profiles.map(({ name, _id }, i) => {
        return (
          <Card.Section
            key={_id}
            actions={[
              {
                content: '',
                icon: <Icon source={EditMajor} color="warning" />,
                onAction: () => {
                  console.log(`hit edit button, with id of: ${_id}. Going to try to redirect.`);
                  router.push(`/profileDetails?id=${_id}`);
                },
              },
              {
                content: '',
                icon: <Icon source={DeleteMajor} color="critical" />,
                destructive: true,
                onAction: () => console.log('hit delete button'),
              },
            ]}
          >
            <Stack>
              <Stack.Item fill>
                <Button plain>{name}</Button>
              </Stack.Item>
            </Stack>
          </Card.Section>
        );
      })}
    </Card>
  );

  return (
    <Page title="Export Profiles">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Card.Section subdued>
              <Heading>🚧🚨 Under Construction 🚨🚧</Heading>
            </Card.Section>
            <Card.Section>{profiles.length > 0 && profilesMarkup}</Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Index;
