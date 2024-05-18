import { createContext, PropsWithChildren } from 'react';
import useGrid from './useGrid';

interface GridContextProps {
  gridContextObject: ReturnType<typeof useGrid>;
}

export const GridContext = createContext<ReturnType<typeof useGrid>>(
  /* we'er not going to use the default value but one needs to be set
    thus we use null (or empty object) and cast it to the correct type
   */
  null as unknown as ReturnType<typeof useGrid>,
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
