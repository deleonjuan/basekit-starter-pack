/* eslint-disable */
import { Input } from "@/components/ui/input";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";
// import pkg from "lodash";

// const { debounce } = pkg;

interface SearchBarProps {
  search?: string;
  setSearch?: (search: string) => void;
  classNames?: {
    container?: string;
    input?: string;
    icon?: string;
  };
}

const SearchBar = ({ setSearch = () => {}, classNames }: SearchBarProps) => {
  const { search } = useSearch({ strict: false });
  const navigate = useNavigate();

  const onValueChangeHandler = (e: any) => {
    setSearch(e.target.value);
    navigate({
      to: ".",
      search: (params) => ({ ...params, search: e.target.value }),
    });
  };

  return (
    <div className={`relative w-1/3 ${classNames?.container || ""}`}>
      <Input
        className={`peer ps-9 bg-background ${classNames?.input || ""}`}
        placeholder="Buscar"
        onChange={onValueChangeHandler}
        defaultValue={search}
        type="search"
      />
      <div
        className={`text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50 ${classNames?.icon || ""}`}
      >
        <SearchIcon size={16} aria-hidden="true" />
      </div>
    </div>
  );
};

export default SearchBar;
