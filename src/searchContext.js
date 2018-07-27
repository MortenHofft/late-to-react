import React from 'react';
export const SearchContext = React.createContext({
  filter: {},
  updateFilter: () => {},
  updateWidgets: () => {}
});