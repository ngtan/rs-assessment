import React, { useContext, useState } from 'react';
import { Station } from '../../types';

type WeekViewContextType = {
  selectedStation: Station | null;
  setSelectedStation: (value: Station) => void;
};

const WeekViewContext = React.createContext<WeekViewContextType | null>(null);

type WeekViewProviderProps = React.PropsWithChildren<{}>;

const WeekViewProvider = ({ children }: WeekViewProviderProps) => {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  const value = {
    selectedStation,
    setSelectedStation,
  };

  return (
    <WeekViewContext.Provider value={value}>
      {children}
    </WeekViewContext.Provider>
  );
};

export const useWeekView = () => {
  const ctx = useContext(WeekViewContext);

  if (!ctx) {
    throw new Error('WeekViewContext not found');
  }

  return ctx;
};

export default WeekViewProvider;
