import { useSearchParams } from "@remix-run/react";
import { SearchBox } from "./search-box";
import { SelectBox } from "./select-box";
import { sortOptions } from "~/utils/constants";

export function SearchKudos() {
  let [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className="flex ">
      <SearchBox
        searchTerm={searchParams.get("filter") ?? ""}
        placeholder="Search a message or name"
        onChange={(filter) => setSearchParams({ filter })}
      />

      <SelectBox
        className="w-full rounded-xl px-3 py-2 text-gray-400"
        containerClassName="w-40"
        name="sort"
        value={searchParams.get("sort")}
        onChange={(evt) => setSearchParams({ sort: evt.target.value })}
        options={sortOptions}
      />
    </div>
  );
}
