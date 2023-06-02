import type { ChangeEvent } from "react";
import { useState, useEffect } from "react";
import { useDebouncedSearch } from "~/hooks/use-debounced-search";
import { FormField } from "./form-field";

type Props = {
  searchTerm?: string;
  placeholder?: string;
  onChange: (e: any) => void;
};

export const SearchBox = (props: Props) => {
  const { placeholder = "", searchTerm = "", onChange } = props;

  const [search, setSearch] = useState("");
  const { debouncedSearch } = useDebouncedSearch(onChange);

  useEffect(() => {
    setSearch(searchTerm);
  }, [searchTerm]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearch(value);
    debouncedSearch(value);
  };

  return (
    <FormField
      label=""
      type="search"
      htmlFor="search"
      value={search || ""}
      placeholder={placeholder}
      onChange={handleChange}
    />
  );
};
