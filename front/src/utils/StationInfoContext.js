import React, { createContext, useContext, useState } from 'react';

const SelectedItemsContext = createContext();

export const SelectedItemsProvider = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState(null);

  const setSelectedItem = (selectItems) => {
    setSelectedItems(selectItems);
  };

  const getSelectedItem = () => {
    return selectedItems;
  };
  const getStatId = () => {
    return selectedItems ? selectedItems.statId : null;  
  };

  return (
    <SelectedItemsContext.Provider value={{ selectedItems, setSelectedItems, setSelectedItem, getStatId, getSelectedItem }}>
      {children}
    </SelectedItemsContext.Provider>
  );
};

export const useSelectedItems = () => {
  const context = useContext(SelectedItemsContext);
  if (context === undefined) {
      throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};