import { createContext, PropsWithChildren } from 'react';
import useGrid from './useGrid';

interface GridContextProps {
  gridContextObject: ReturnType<typeof useGrid>;
}

export const GridContext = createContext<ReturnType<typeof useGrid>>(
<<<<<<< HEAD
  /* we'er not going to use the default value but one needs to be set
    thus we use null (or empty object) and cast it to the correct type
   */
  null as unknown as ReturnType<typeof useGrid>,
=======
  /* we don't want to use the default value, it will be set in the provider
    thus we use an empty object and cast it to the correct type
   */
  {} as ReturnType<typeof useGrid>,
>>>>>>> 3326e81c0a1aef9d8ba71d5e278d3874a7b5531c
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
