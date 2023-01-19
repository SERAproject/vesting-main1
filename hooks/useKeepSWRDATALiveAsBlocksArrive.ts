import { useEffect, useRef } from "react";
import { SWRResponse } from "swr";
import { useBlockNumber } from "./useBlockNumber";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useKeepSWRDATALiveAsBlocksArrive(mutate: SWRResponse<any, any>["mutate"]): void {
  const mutateRef = useRef(mutate);
  useEffect(() => {
    mutateRef.current = mutate;
  });

  // then, whenever a new block arrives, trigger a mutation
  const { data } = useBlockNumber();
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    mutateRef.current();
  }, [data]);
}
