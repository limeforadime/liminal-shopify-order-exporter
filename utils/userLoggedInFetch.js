import { authenticatedFetch, getSessionToken } from '@shopify/app-bridge-utils';

function userLoggedInFetch(app) {
  return async (uri, options) => {
    // this line needed in order to "freshen" the current JWT before using it for request
    await getSessionToken(app);
    const fetchFunction = authenticatedFetch(app);
    const response = await fetchFunction(uri, options);

    if (
      response.headers.get('X-Shopify-API-Request-Failure-Reauthorize') === '1'
      // response.status === 401 // <-- added this, but it might not be needed
    ) {
      // const authUrlHeader = response.headers.get('X-Shopify-API-Request-Failure-Reauthorize-Url');
      // const redirect = Redirect.create(app);
      // redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth?shop=${shop}`);

      // TODO!
      // For WAY better UX, show a temporary popup first before this forceful
      // redirect starts. It's kind of jarring.
      // redirect.dispatch(Redirect.Action.APP, `/auth?shop=${shop}`); // prev way
      throw new Error('Error: Unauthorized');
      // return null;
    }

    return response;
  };
}

export default userLoggedInFetch;
