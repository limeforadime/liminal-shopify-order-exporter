import React, { useState, useEffect } from 'react';
const FieldsStateContext = React.createContext('');
const FieldsStateWrapper = ({ value, children }) => {
  return <FieldsStateContext.Provider value={value}>{children}</FieldsStateContext.Provider>;
};

export { FieldsStateContext };
export default FieldsStateWrapper;
