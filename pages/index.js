import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Button, Card, Page, Layout, Stack, Icon, EmptyState, TextStyle } from '@shopify/polaris';
import { DeleteMajor, EditMajor } from '@shopify/polaris-icons';
import { useRouter } from 'next/router';
import { Redirect } from '@shopify/app-bridge/actions';
import { useAppBridge } from '@shopify/app-bridge-react';
import userLoggedInFetch from '../utils/userLoggedInFetch';
import { AppStateContext } from '../components/AppStateWrapper';

const Index = () => {
  const app = useAppBridge();
  const appState = useContext(AppStateContext);
  const redirect = Redirect.create(app);
  const router = useRouter();
  const { shop } = appState;
  const [profiles, setProfiles] = useState([]);

  const handleNewProfile = useCallback(() =>
    router.push({
      pathname: '/profileDetails',
      query: { isNewProfile: true, _id: '' },
    })
  );
  const handleEditProfile = useCallback(() => {});
  const handleDeleteProfile = useCallback(async (_id) => {
    try {
      const res = await userLoggedInFetch(app)(`${app.localOrigin}/api/profiles/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: _id }),
      });
      if (!res.ok) throw new Error('Problem deleting profile');
      const data = await res.json();
      console.log(data);
      setProfiles((prevProfiles) => prevProfiles.filter((profile) => profile._id !== _id));
    } catch (err) {
      console.error(err);
    }
  });

  // Check if user has active session
  useEffect(() => {
    const checkIfSessionActive = async () => {
      console.log('checking if session active...');
      const res = await userLoggedInFetch(app)('/api/isSessionActive');
      if (res.status != 200) {
        redirect.dispatch(Redirect.Action.REMOTE, `${app.localOrigin}/auth?shop=${shop}`);
      }
      console.log(`response status code: ${res.status}, Session is active!`);
    };
    if (shop) {
      checkIfSessionActive();
    }
  }, [shop]);

  // get export profiles from database
  useEffect(() => {
    if (!shop) return;
    const getProfiles = async () => {
      try {
        const res = await userLoggedInFetch(app)(`${app.localOrigin}/api/profiles?shop=${shop}`);
        if (res.status == 200) {
          const profiles = await res.json();
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

  const profilesMarkup = (
    <Card>
      {profiles.map(({ name, _id }, i) => {
        return (
          <Card.Section
            key={_id}
            actions={[
              {
                content: '',
                icon: <Icon source={EditMajor} color="warning" />,
                onAction: () => {
                  router.push({
                    pathname: '/profileDetails',
                    query: { isNewProfile: false, id: _id },
                  });
                },
              },
              {
                content: '',
                icon: <Icon source={DeleteMajor} color="critical" />,
                destructive: true,
                onAction: () => handleDeleteProfile(_id),
              },
            ]}
          >
            <Stack>
              <Stack.Item fill>
                <Button
                  plain
                  onClick={() =>
                    router.push({
                      pathname: '/profileDetails',
                      query: { isNewProfile: false, id: _id },
                    })
                  }
                >
                  {name}
                </Button>
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
          {profiles.length == 0 ? (
            <Card sectioned>
              <EmptyState
                heading="Get started by creating an export profile"
                action={{ content: 'Create new export profile', onAction: handleNewProfile }}
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              >
                {/* <TextStyle variation="">Click here to create an customize a new profile</TextStyle> */}
              </EmptyState>
            </Card>
          ) : (
            <Card
              sectioned
              primaryFooterAction={{
                content: 'Create new export profile',
                onAction: handleNewProfile,
              }}
            >
              <Card.Section>{profilesMarkup}</Card.Section>
            </Card>
          )}
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Index;
