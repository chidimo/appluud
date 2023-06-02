import type { ChangeEvent } from "react";
import { useState, useEffect } from "react";
import { useDebouncedSearch } from "~/hooks/use-debounced-search";
 
type Props = {
  label?: string;
  searchTerm?: string;
  placeholder?: string;
  onChange: (e: any) => void;
};

export const SearchBox = (props: Props) => {
  const { placeholder = "", searchTerm = "", label = "", onChange } = props;

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
    <div>
      <label htmlFor="search" className="text-blue-600 font-semibold">
        {label}
      </label>
      <input
        type="search"
        className="w-full p-2 rounded-xl my-2"
        value={search || ""}
        placeholder={placeholder}
        onChange={handleChange}
      />
    </div>
  );
};
