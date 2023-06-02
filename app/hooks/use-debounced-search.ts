import { useCallback } from "react";
import _ from "underscore";

export const useDebouncedSearch = (onChange: any) => {
  const debouncedSearch = useCallback(
    _.debounce((inp: any) => {
      onChange(inp);
    }, 500),
    []
  );

  return { debouncedSearch };
};
