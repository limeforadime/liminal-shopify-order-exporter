import React, { useState, useEffect } from 'react';
import {
  Spinner,
  Toast,
  Frame,
  // Loading,
  SkeletonPage,
  Layout,
  Card,
  SkeletonBodyText,
  SkeletonDisplayText,
  TextContainer,
} from '@shopify/polaris';
import jwtDecode from 'jwt-decode';
import Router from 'next/router';
import { useAppBridge, Loading } from '@shopify/app-bridge-react';
import { getSessionToken } from '@shopify/app-bridge-utils';
import { Redirect } from '@shopify/app-bridge/actions';

export const AppStateContext = React.createContext('');

const AppStateWrapper = ({ children }) => {
  const app = useAppBridge();
  const redirect = Redirect.create(app);
  const [shop, setShop] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isLoadingBar, setIsLoadingBar] = useState(false);
  const [isToast, setIsToast] = useState(false);
  const [isToastError, setIsToastError] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  useEffect(() => {
    async function getShop() {
      try {
        console.log(`AppStateWrapper, getting shop:`);
        const res = await getSessionToken(app);
        const decoded = jwtDecode(res);
        setShop(decoded.dest.replace(/https:\/\//, ''));
        console.log(`JWT from useEffect(): `);
        console.log(decoded);
        console.log(`Shop successfully set as: ${decoded.dest.replace(/https:\/\//, '')}`);
      } catch (e) {
        console.log(e);
      }
    }
    getShop();
  }, []);

  Router.events.on('routeChangeStart', (url) => {
    setIsPageLoading(true);
  });
  Router.events.on('routeChangeComplete', (url) => {
    setIsPageLoading(false);
  });
  Router.events.on('routeChangeError', (err) => {
    console.error(err, 'Route Change Error');
    redirect.dispatch(Redirect.Action.APP, `/`);
    setIsPageLoading(false);
    showToast('Route error', true);
  });

  const showToast = (message, error = false) => {
    setToastMessage(message);
    setIsToastError(error);
    setIsToast(true);
  };
  const hideToast = () => {
    setIsToast(false);
    setToastMessage('');
  };

  const exposedData = {
    isPageLoading,
    setIsPageLoading,
    isLoadingBar,
    setIsLoadingBar,
    showToast,
    hideToast,
    shop,
  };

  // MINE
  // return (
  //   <AppStateContext.Provider value={exposedData}>
  //     <>
  //       {isPageLoading ? (
  //         <>
  //           <Frame>
  //             <Loading />
  //           </Frame>
  //           <div
  //             style={{
  //               width: '100%',
  //               height: '100vh',
  //               display: 'flex',
  //               justifyContent: 'center',
  //               alignItems: 'center',
  //               position: 'fixed',
  //               top: '0px',
  //               left: '0px',
  //             }}
  //           >
  //             <Spinner accessibilityLabel="Loading" size="large" color="teal" />
  //           </div>
  //         </>
  //       ) : (
  //         children
  //       )}
  //       {isToast ? (
  //         <Frame>
  //           <Toast content={toastMessage} error={isToastError} onDismiss={() => hideToast()} />
  //         </Frame>
  //       ) : null}
  //     </>
  //   </AppStateContext.Provider>
  // );

  // THEIRS
  const loadingPage = isPageLoading ? null : { display: 'none' };
  const mainPageDisplay = isPageLoading ? { display: 'none' } : null;
  return (
    <AppStateContext.Provider value={exposedData}>
      <React.Fragment>
        <div style={loadingPage}>
          <div>
            <SkeletonPage primaryAction secondaryActions={2}>
              <Layout>
                <Layout.Section>
                  <Card sectioned>
                    <SkeletonBodyText />
                  </Card>
                  <Card sectioned>
                    <TextContainer>
                      <SkeletonDisplayText size="large" />
                      <SkeletonBodyText />
                    </TextContainer>
                  </Card>
                  <Card sectioned>
                    <TextContainer>
                      <SkeletonDisplayText size="large" />
                      <SkeletonBodyText />
                    </TextContainer>
                  </Card>
                </Layout.Section>
                <Layout.Section secondary>
                  <Card>
                    <Card.Section>
                      <TextContainer>
                        <SkeletonDisplayText size="large" />
                        <SkeletonBodyText lines={2} />
                      </TextContainer>
                    </Card.Section>
                    <Card.Section>
                      <SkeletonBodyText lines={1} />
                    </Card.Section>
                  </Card>
                  <Card subdued>
                    <Card.Section>
                      <TextContainer>
                        <SkeletonDisplayText size="large" />
                        <SkeletonBodyText lines={2} />
                      </TextContainer>
                    </Card.Section>
                    <Card.Section>
                      <SkeletonBodyText lines={2} />
                    </Card.Section>
                  </Card>
                </Layout.Section>
              </Layout>
            </SkeletonPage>
          </div>
          {/* <Frame>{isPageLoading ? <Loading /> : null}</Frame>  */}
          {isPageLoading ? <Loading /> : null}
        </div>
        <div style={mainPageDisplay}>{children}</div>
        {/* <div>{children}</div> */}
        {isLoadingBar ? (
          <div>
            <Frame>
              <Loading />
            </Frame>
          </div>
        ) : null}

        {isToast ? (
          <Frame>
            <Toast content={toastMessage} error={isToastError} onDismiss={hideToast} />
          </Frame>
        ) : null}
      </React.Fragment>
    </AppStateContext.Provider>
  );
};

export default AppStateWrapper;
