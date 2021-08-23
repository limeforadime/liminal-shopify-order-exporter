/**
 * Enable client side routing
 */

import { withRouter } from 'next/router';
import { ClientRouter as AppBridgeClientRouter } from '@shopify/app-bridge-react';

function ClientRouter({ router }) {
  return <AppBridgeClientRouter history={router} />;
}

export default withRouter(ClientRouter);
