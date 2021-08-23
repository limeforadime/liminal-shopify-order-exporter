import React, { useContext } from 'react';
import { AppStateContext } from '../components/AppStateWrapper';
const Test = () => {
  const appState = useContext(AppStateContext);
  console.log(`In Test: appstate.shop: ${appState.shop}`);
  return <h1>Hey wuddup, testing</h1>;
};

export default Test;
