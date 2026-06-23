import { useRef, useState } from "react";
import { LoaderCircleIcon } from "lucide-react";
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
} from "#/components/ui/combobox";

type ComboboxOption = { value: string; label: string };

interface ItemFinderProps<T extends Record<string, unknown>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useHook: (
    page: number,
    search: string,
    limit: number,
  ) => { data: any; loading: boolean };
  dataKey: string;
  onChange: (item: T) => void;
  filter?: (item: T) => boolean;
  placeholder?: string;
  noResultLabel?: string;
  keyValue?: string;
  labelValue?: string;
}

export function ItemFinder<T extends Record<string, unknown>>({
  useHook,
  dataKey,
  onChange,
  filter,
  placeholder,
  noResultLabel = "No results",
  keyValue = "id",
  labelValue = "name",
}: ItemFinderProps<T>) {
  const [search, setSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const { data, loading } = useHook(1, search, 50);
  const raw: T[] = data?.[dataKey] ?? [];
  const items = filter ? raw.filter(filter) : raw;

  const options: ComboboxOption[] = items.map((item) => ({
    value: String(item[keyValue]),
    label: String(item[labelValue]),
  }));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(value), 300);
  };

  const handleValueChange = (selected: ComboboxOption | null) => {
    if (!selected) return;
    const item = items.find((i) => String(i[keyValue]) === selected.value);
    if (item) onChange(item);
  };

  return (
    <Combobox items={options} onValueChange={handleValueChange as never}>
      <ComboboxInput placeholder={placeholder} onChange={handleInputChange} />
      <ComboboxPopup>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
        <ComboboxEmpty>
          {loading ? (
            <div className="flex justify-center py-2">
              <LoaderCircleIcon className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            noResultLabel
          )}
        </ComboboxEmpty>
      </ComboboxPopup>
    </Combobox>
  );
}
