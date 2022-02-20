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
  PageActions,
  TextField,
  TextStyle,
} from '@shopify/polaris';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Redirect } from '@shopify/app-bridge/actions';
import userLoggedInFetch from '../utils/client/userLoggedInFetch';
import { AppStateContext } from '../components/AppStateWrapper';
import Router, { useRouter } from 'next/router';
import jwtDecode from 'jwt-decode';
import { getSessionToken } from '@shopify/app-bridge-utils';
import { fieldsSourceData } from '../components/Fields/fieldsData';
import FilterCard from '../components/Filtering/FilterCard';
import FieldsCard from '../components/Fields/FieldsCard';
import FieldsStateWrapper from '../components/Fields/FieldsStateWrapper';
import { initialFieldsState } from '../components/Fields/initialFieldsState';

const ProfileDetails = () => {
  const appState = useContext(AppStateContext);
  const router = useRouter();
  const { shop } = appState;
  const app = useAppBridge();
  const redirect = Redirect.create(app);
  // TODO: error handling if router.query.isNewProfile is empty
  let { isNewProfile, id } = router.query;
  isNewProfile = JSON.parse(isNewProfile); // convert string to boolean
  // TODO handle checking id

  const [profileName, setProfileName] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDebugButtons, setShowDebugButtons] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]); // for Filtering
  const [isLoading, setIsLoading] = useState(true);
  const [fileName, setFileName] = useState('');

  /* Checked Fields State */
  const [checkedMainState, setCheckedMainState] = useState(initialFieldsState.main);
  const [checkedCustomerState, setCheckedCustomerState] = useState(initialFieldsState.customer);
  const [checkedLineItemsState, setCheckedLineItemsState] = useState(initialFieldsState.lineItems);
  const [checkedTransactionsState, setCheckedTransactionsState] = useState(initialFieldsState.transactions);
  const [checkedBillingAddressState, setCheckedBillingAddressState] = useState(initialFieldsState.billingAddress);
  const [checkedDiscountCodesState, setCheckedDiscountCodesState] = useState(initialFieldsState.discountCodes);
  const [checkedShippingAddressState, setCheckedShippingAddressState] = useState(
    initialFieldsState.shippingAddress
  );
  const [checkedShippingLinesState, setCheckedShippingLinesState] = useState(initialFieldsState.shippingLines);
  const [checkedTaxLinesState, setCheckedTaxLinesState] = useState(initialFieldsState.taxLines);
  const [checkedFulfillmentsState, setCheckedFulfillmentsState] = useState(initialFieldsState.fulfillments);
  const [checkedFulfillmentOrdersState, setCheckedFulfillmentOrdersState] = useState(
    initialFieldsState.fulfillmentOrders
  );

  const fieldsState = {
    checkedMainState,
    checkedCustomerState,
    checkedLineItemsState,
    checkedTransactionsState,
    checkedBillingAddressState,
    checkedDiscountCodesState,
    checkedShippingAddressState,
    checkedShippingLinesState,
    checkedTaxLinesState,
    checkedFulfillmentsState,
    checkedFulfillmentOrdersState,
    setCheckedMainState,
    setCheckedCustomerState,
    setCheckedLineItemsState,
    setCheckedTransactionsState,
    setCheckedBillingAddressState,
    setCheckedDiscountCodesState,
    setCheckedShippingAddressState,
    setCheckedShippingLinesState,
    setCheckedTaxLinesState,
    setCheckedFulfillmentsState,
    setCheckedFulfillmentOrdersState,
  };

  // if in edit mode (isNewProfile == false), get data from database for given ID
  useEffect(() => {
    const getData = async () => {
      try {
        if (!isNewProfile) {
          // fetch profile from the route using provided id
          const res = await userLoggedInFetch(app)(
            `${app.localOrigin}/api/profiles/${id}?` + new URLSearchParams({ shop })
          );
          if (res.status != 200) throw new Error('Unable to retrieve profile');

          const profile = await res.json();
          const { name } = profile;
          const { fields, selectedTags } = profile.settings;
          setProfileName(name);
          setSelectedTags([...selectedTags]);
          setCheckedMainState(fields.checkedMainState);
          setCheckedCustomerState(fields.checkedCustomerState);
          setCheckedLineItemsState(fields.checkedLineItemsState);
          setCheckedTransactionsState(fields.checkedTransactionsState);
          setCheckedBillingAddressState(fields.checkedBillingAddressState);
          setCheckedDiscountCodesState(fields.checkedDiscountCodesState);
          setCheckedShippingAddressState(fields.checkedShippingAddressState);
          setCheckedShippingLinesState(fields.checkedShippingLinesState);
          setCheckedTaxLinesState(fields.checkedTaxLinesState);
          setCheckedFulfillmentsState(fields.checkedFulfillmentsState);
          setCheckedFulfillmentOrdersState(fields.checkedFulfillmentOrdersState);
        }
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);

  const createFieldsQueryStringRefactorLater = async () => {
    // Goal: run through each field state. If true, lookup corresponding element from source data and get its name,
    // and then add it to a running query object to then convert into a URLSearchparams string.
    // Must run for each category, as some are handled differently (separate API calls).
    // DEFINITELY optimize this later -- especially consolidate all promises into promise.all
    const fieldsParams = { fields: [] };

    // build object for main
    if (checkedMainState.some((val) => val == true)) {
      // skips if none of these states are checked
      fieldsSourceData.main.forEach((val, index) => {
        if (checkedMainState[index] == true) fieldsParams.fields.push(val.value);
      });
    }

    // build object for customer
    if (checkedCustomerState.some((val) => val == true)) fieldParams.fields.push('customer');
    if (checkedLineItemsState.some((val) => val == true)) fieldParams.fields.push('line_items');
    try {
      if (checkedTransactionsState.some((val) => val == true)) {
        const res = await userLoggedInFetch(app)(`${app.localOrigin}/api/orders?fields=line_items`);
        if (res.ok) {
          await res.json();
        }
      }
    } catch (err) {
      console.log(err);
    }
    console.log(new URLSearchParams(fieldsParams).toString());
  };

  const handleProfileNameChange = useCallback((newValue) => setProfileName(newValue));
  const handleFileNameChange = useCallback((newValue) => setFileName(newValue));
  const handleDebugToggle = useCallback(() => setShowDebugButtons((prevState) => !prevState), []);
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
    } catch (err) {
      console.log(err);
    }
  });
  const handleOrderButton = useCallback(async () => {
    try {
      const res = await userLoggedInFetch(app)(
        '/api/orders?' +
          new URLSearchParams({
            created_at_max: '2021-07-27T03:25:40-04:00',
          })
      );
      if (res.status == 200) {
        const responseData = await res.json();
        console.log(responseData);
      } else {
        throw new Error("Couldn't fetch orders");
      }
    } catch (err) {
      console.error(err);
      setShowError(true);
      setErrorMessage('Sorry, need to refresh session');
      return;
    }
  });
  const handleOrderCountButton = useCallback(async () => {
    try {
      const res = await userLoggedInFetch(app)('/api/orderCount');
      if (res.status == 200) {
        const responseData = await res.json();
        console.log(responseData);
      } else {
        throw new Error("Couldn't fetch order count");
      }
    } catch (err) {
      console.error(err);
      setShowError(true);
      setErrorMessage('Sorry, need to refresh session');
      return;
    }
  });

  const handleAuthButton = useCallback(async () => {
    // redirect.dispatch(Redirect.Action.APP, `/auth?shop=${shop}`);
    redirect.dispatch(Redirect.Action.REMOTE, `${app.localOrigin}/auth?shop=${shop}`);
  });
  const handleRedirect = useCallback(async () => {
    setShowError(false);
    redirect.dispatch(Redirect.Action.REMOTE, `${app.localOrigin}/auth?shop=${shop}`);
    // redirect.dispatch(Redirect.Action.APP, `/auth?shop=${shop}`);
  });

  const handleCreateOrEditProfile = useCallback(async ({ isNew }) => {
    console.log('handling create or edit profile...');
    let route, method;
    if (isNew) {
      route = `${app.localOrigin}/api/profiles/create`;
      method = 'POST';
    } else {
      route = `${app.localOrigin}/api/profiles/edit`;
      method = 'PATCH';
    }
    try {
      let body = {
        profileName,
        selectedTags,
        fields: {
          checkedMainState,
          checkedCustomerState,
          checkedLineItemsState,
          checkedTransactionsState,
          checkedBillingAddressState,
          checkedDiscountCodesState,
          checkedShippingAddressState,
          checkedShippingLinesState,
          checkedTaxLinesState,
          checkedFulfillmentsState,
          checkedFulfillmentOrdersState,
        },
      };
      if (!isNew) body = { ...body, id };
      console.log('body:');
      console.log(body);
      console.log('JSON.stringifed:');
      console.log(JSON.stringify(body, null, '\t'));
      const res = await userLoggedInFetch(app)(route, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Problem creating or editing profile');

      const data = await res.json();
      console.log(data);
      router.push('/');
    } catch (err) {
      console.error(err);
    }
  });

  const handleDeleteProfile = useCallback(async () => {
    try {
      const res = await userLoggedInFetch(app)(`${app.localOrigin}/api/profiles/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Problem deleting profile');
      const data = await res.json();
      console.log(data);
      router.push('/');
    } catch (err) {
      console.error(err);
    }
  });
  return (
    <>
      {isLoading ? (
        <Page title="Loading Data..." />
      ) : (
        <Page
          title="Export profile options"
          subtitle="Customize your export profile"
          breadcrumbs={[{ content: 'Home', onAction: () => router.push('/') }]}
          primaryAction={
            isNewProfile
              ? {
                  content: 'Create export profile',
                  onAction: () => handleCreateOrEditProfile({ isNew: true }),
                }
              : {
                  content: 'Update export profile',
                  onAction: () => handleCreateOrEditProfile({ isNew: false }),
                }
          }
        >
          <Layout>
            <Layout.Section>
              {showError ? (
                <Frame>
                  <Toast content={errorMessage} error={true} duration={6000} onDismiss={handleRedirect} />
                </Frame>
              ) : null}
              <FilterCard {...{ selectedTags, setSelectedTags }} />
              <FieldsStateWrapper value={fieldsState}>
                <FieldsCard />
              </FieldsStateWrapper>
              <Card sectioned>
                <Stack vertical>
                  <Button
                    onClick={handleDebugToggle}
                    plain
                    destructive
                    ariaExpanded={showDebugButtons}
                    ariaControls="basic-collapsible"
                  >
                    Debug Buttons
                  </Button>
                  <Collapsible open={showDebugButtons} id="basic-collapsible" expandOnPrint>
                    <Button
                      onClick={() => {
                        redirect.dispatch(Redirect.Action.APP, `/routeTest?shop=${shop}&test=hey`);
                      }}
                    >
                      Go To Test Page
                    </Button>
                    <Button onClick={handleOrderButton}>Hit Orders Route</Button>
                    <Button onClick={handleOrderCountButton}>Order count</Button>
                    <Button onClick={handleAuthButton}>Auth</Button>
                    <Button onClick={handleSessionButton}>GetSession</Button>
                    <Button onClick={handleJWTButton}>Get JWT</Button>
                    <Button size="large" onClick={handleIsSessionActiveButton}>
                      IsSessionActive?
                    </Button>
                    <Button
                      size="large"
                      onClick={() => {
                        Router.events.emit('routeChangeError', () => console.log('emitting route change error'));
                      }}
                    >
                      TestError
                    </Button>
                    <Button size="large" onClick={createFieldsQueryStringRefactorLater}>
                      Fields State Query String
                    </Button>
                    {/* </Card> */}
                  </Collapsible>
                </Stack>
              </Card>
            </Layout.Section>
            <Layout.Section secondary>
              <Card title="Settings">
                <Card.Section>
                  <TextField
                    value={profileName}
                    label={<TextStyle variation="strong">Export profile name</TextStyle>}
                    onChange={handleProfileNameChange}
                  />
                </Card.Section>
                <Card.Section>
                  <TextField
                    value={fileName}
                    label={<TextStyle variation="strong">CSV file name</TextStyle>}
                    onChange={handleFileNameChange}
                  />
                </Card.Section>
              </Card>
            </Layout.Section>
          </Layout>
          <PageActions
            primaryAction={
              isNewProfile
                ? {
                    content: 'Create export profile',
                    onAction: () => handleCreateOrEditProfile({ isNew: true }),
                  }
                : {
                    content: 'Update export profile',
                    onAction: () => handleCreateOrEditProfile({ isNew: false }),
                  }
            }
            secondaryActions={
              isNewProfile
                ? undefined
                : [
                    {
                      content: 'Delete export profile',
                      onAction: handleDeleteProfile,
                      destructive: true,
                    },
                  ]
            }
          />
        </Page>
      )}
    </>
  );
};

export default ProfileDetails;
