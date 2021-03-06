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
import flatten from 'flat';
import papa from 'papaparse';
import convertTagsToQueryString from '../utils/convertTagsToQueryString';
import moment from 'moment';
import { allStatusChoices } from '../components/Filtering/data/allStatusChoicesData';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Redirect } from '@shopify/app-bridge/actions';
import userLoggedInFetch from '../utils/userLoggedInFetch';
import { AppStateContext } from '../components/AppStateWrapper';
import Router, { useRouter } from 'next/router';
import jwtDecode from 'jwt-decode';
import { getSessionToken } from '@shopify/app-bridge-utils';
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
  // TODO handle checking if id exists and is valid

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
  const [checkedLineItemsState, setCheckedLineItemsState] = useState(initialFieldsState.line_items);
  const [checkedTransactionsState, setCheckedTransactionsState] = useState(initialFieldsState.transactions);
  const [checkedBillingAddressState, setCheckedBillingAddressState] = useState(initialFieldsState.billing_address);
  const [checkedDiscountCodesState, setCheckedDiscountCodesState] = useState(initialFieldsState.discount_codes);
  const [checkedShippingAddressState, setCheckedShippingAddressState] = useState(
    initialFieldsState.shipping_address
  );
  const [checkedShippingLinesState, setCheckedShippingLinesState] = useState(initialFieldsState.shipping_lines);
  const [checkedTaxLinesState, setCheckedTaxLinesState] = useState(initialFieldsState.tax_lines);
  const [checkedFulfillmentsState, setCheckedFulfillmentsState] = useState(initialFieldsState.fulfillments);
  const [checkedFulfillmentOrdersState, setCheckedFulfillmentOrdersState] = useState(
    initialFieldsState.fulfillment_orders
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
      const formattedSelectTags = convertTagsToQueryString(selectedTags, moment, allStatusChoices);
      // const url =
      //   '/api/orders' +
      //   formattedSelectedTags +
      //   new URLSearchParams({
      //     shop,
      //     fields,
      //   });
      const res = await userLoggedInFetch(app)(
        '/api/orders?' +
          formattedSelectTags +
          new URLSearchParams({
            fields: ['id', 'name', 'customer'],
            shop,
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
        global: {},
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

  const pagePrimaryAction = isNewProfile
    ? {
        content: 'Create export profile',
        onAction: () => handleCreateOrEditProfile({ isNew: true }),
      }
    : {
        content: 'Update export profile',
        onAction: () => handleCreateOrEditProfile({ isNew: false }),
      };
  const pageSecondaryAction = isNewProfile
    ? undefined
    : [
        {
          content: 'Delete export profile',
          onAction: handleDeleteProfile,
          destructive: true,
        },
      ];
  return (
    <>
      {isLoading ? (
        <Page title="Loading Data..." />
      ) : (
        <Page
          title="Export profile options"
          subtitle="Customize your export profile"
          breadcrumbs={[{ content: 'Home', onAction: () => router.push('/') }]}
          primaryAction={pagePrimaryAction}
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
                    {/* <Button size="large" onClick={appendDataToOrders}>
                      ORDERS DEBUG BUTTON
                    </Button> */}
                    <Button
                      onClick={() => {
                        let data = JSON.parse(`{
                          "id": 4201397452954,
                          "buyer_accepts_marketing": false,
                          "closed_at": null,
                          "currency": "USD",
                          "email": "",
                          "financial_status": "paid",
                          "fulfillment_status": "fulfilled",
                          "location_id": 47856484506,
                          "name": "#1008",
                          "note": null,
                          "note_attributes": [],
                          "phone": null,
                          "processed_at": "2021-10-28T06:11:56-04:00",
                          "referring_site": null,
                          "tags": "",
                          "taxes_included": false,
                          "total_discounts": "0.00",
                          "total_tax": "0.00",
                          "total_weight": 0,
                          "transactions": [
                            {
                              "id": 5169197514906,
                              "order_id": 4201397452954,
                              "kind": "sale",
                              "gateway": "manual",
                              "status": "pending",
                              "message": "Pending the manual payment from the buyer",
                              "created_at": "2021-10-28T06:11:56-04:00",
                              "test": false,
                              "authorization": null,
                              "location_id": null,
                              "user_id": null,
                              "parent_id": null,
                              "processed_at": "2021-10-28T06:11:56-04:00",
                              "device_id": null,
                              "error_code": null,
                              "source_name": "1830279",
                              "receipt": {},
                              "amount": "7.00",
                              "currency": "USD",
                              "admin_graphql_api_id": "gid://shopify/OrderTransaction/5169197514906"
                            },
                            {
                              "id": 5169202528410,
                              "order_id": 4201397452954,
                              "kind": "sale",
                              "gateway": "manual",
                              "status": "success",
                              "message": "Marked the manual payment as received",
                              "created_at": "2021-10-28T06:15:58-04:00",
                              "test": false,
                              "authorization": null,
                              "location_id": null,
                              "user_id": null,
                              "parent_id": 5169197514906,
                              "processed_at": "2021-10-28T06:15:58-04:00",
                              "device_id": null,
                              "error_code": null,
                              "source_name": "1830279",
                              "receipt": {},
                              "amount": "7.00",
                              "currency": "USD",
                              "admin_graphql_api_id": "gid://shopify/OrderTransaction/5169202528410"
                            }
                          ],
                          "fulfillments": [
                            {
                              "id": 3689810493594,
                              "order_id": 4201397452954,
                              "status": "success",
                              "created_at": "2021-10-28T06:15:47-04:00",
                              "service": "manual",
                              "updated_at": "2021-10-28T06:15:47-04:00",
                              "tracking_company": null,
                              "shipment_status": null,
                              "location_id": 47856484506,
                              "origin_address": null,
                              "tracking_number": null,
                              "tracking_numbers": [],
                              "tracking_url": null,
                              "tracking_urls": [],
                              "receipt": {},
                              "name": "#1008.1",
                              "admin_graphql_api_id": "gid://shopify/Fulfillment/3689810493594"
                            }
                          ],
                          "filfillmentOrders": []
                        }`);
                        console.log(flatten(data, { delimiter: '/' }));
                      }}
                    >
                      Test flatten
                    </Button>
                    <Button
                      size="large"
                      onClick={async () => {
                        try {
                          console.log(`id: ${id}`);
                          const res = await userLoggedInFetch(app)('/api/saveExportToDB', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ id }),
                          });
                          if (!res.ok) {
                            throw new Error('Problem with saveExportToDB');
                          }
                          const orders = await res.json();
                          console.log(orders);
                        } catch (err) {
                          console.log(err);
                        }
                      }}
                    >
                      TEST SENDING ID
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
          <PageActions primaryAction={pagePrimaryAction} secondaryActions={pageSecondaryAction} />
        </Page>
      )}
    </>
  );
};

export default ProfileDetails;
