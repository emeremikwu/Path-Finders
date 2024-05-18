import { createContext, PropsWithChildren } from 'react';
import useGrid from './useGrid';

interface GridContextProps {
  gridContextObject: ReturnType<typeof useGrid>;
}

export const GridContext = createContext<ReturnType<typeof useGrid>>(
  /* we don't want to use the default value, it will be set in the provider
    thus we use an empty object and cast it to the correct type
   */
  {} as ReturnType<typeof useGrid>,
);

function GridProvider({ gridContextObject, children }: PropsWithChildren<GridContextProps>) {
  if (!gridContextObject) {
    throw new Error('GridContext is null');
  }

  return (
    <GridContext.Provider value={gridContextObject}>
      {children}
    </GridContext.Provider>
  );
}

export default GridProvider;
