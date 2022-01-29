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
  List,
  TextField,
  FormLayout,
} from '@shopify/polaris';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Redirect } from '@shopify/app-bridge/actions';
import userLoggedInFetch from '../utils/client/userLoggedInFetch';
import { AppStateContext } from '../components/AppStateWrapper';

const MappingSelection = () => {
  const app = useAppBridge();
  const appState = useContext(AppStateContext);
  const { shop } = appState;
  const [mappingInput, setMappingInput] = useState('');

  const handleInputChange = useCallback((newValue) => {
    setMappingInput(newValue);
  });

  const handleInputSend = useCallback(async () => {
    try {
      const res = await userLoggedInFetch(app)(`/api/mappings/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mappingName: mappingInput,
        }),
      });
      if (!res.ok) {
        throw new Error('Problem sending POST to /api/mappings/create');
      }
    } catch (err) {
      console.error(err);
    }
  });

  return (
    <Page title="Mapping Profiles">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Card.Section subdued>
              <Heading>🚧🚨 Under Construction 🚨🚧</Heading>
            </Card.Section>
            <Card.Section>
              <FormLayout>
                <TextField
                  label="New Mapping Name"
                  value={mappingInput}
                  onChange={handleInputChange}
                  autoComplete="off"
                />
                <Button onClick={handleInputSend}>New mapping name</Button>
              </FormLayout>
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default MappingSelection;
