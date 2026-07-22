import { useRef, useState } from "react";
import { CheckIcon, ChevronsUpDownIcon, LoaderCircleIcon } from "lucide-react";
import { cn } from "#/lib/utils";
import { Button } from "#/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "#/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#/components/ui/popover";

interface CommandItemFinderProps<T extends Record<string, unknown>> {
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
  searchPlaceholder?: string;
  noResultLabel?: string;
  keyValue?: string;
  labelValue?: string;
}

export function CommandItemFinder<T extends Record<string, unknown>>({
  useHook,
  dataKey,
  onChange,
  filter,
  placeholder = "Select item",
  searchPlaceholder = "Search...",
  noResultLabel = "No results",
  keyValue = "id",
  labelValue = "name",
}: CommandItemFinderProps<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [value, setValue] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const { data, loading } = useHook(1, search, 50);
  const raw: T[] = data?.[dataKey] ?? [];
  const items = filter ? raw.filter(filter) : raw;

  const selected = items.find((item) => String(item[keyValue]) === value);

  const handleSearchChange = (search: string) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(search), 300);
  };

  const handleSelect = (item: T) => {
    const itemValue = String(item[keyValue]);
    setValue(itemValue === value ? "" : itemValue);
    setOpen(false);
    onChange(item);
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className="w-full justify-between border-input bg-background px-3 font-normal outline-none outline-offset-0 hover:bg-background focus-visible:outline-[3px]"
          role="combobox"
          variant="outline"
        >
          <span
            className={cn("truncate", !selected && "text-muted-foreground")}
          >
            {selected ? String(selected[labelValue]) : placeholder}
          </span>
          <ChevronsUpDownIcon
            aria-hidden="true"
            className="shrink-0 text-muted-foreground/80"
            size={16}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0"
      >
        <Command shouldFilter={false}>
          <CommandInput
            onValueChange={handleSearchChange}
            placeholder={searchPlaceholder}
          />
          <CommandList>
            <CommandEmpty>
              {loading ? (
                <div className="flex justify-center py-2">
                  <LoaderCircleIcon className="size-4 animate-spin text-muted-foreground" />
                </div>
              ) : (
                noResultLabel
              )}
            </CommandEmpty>
            <CommandGroup>
              {items.map((item) => {
                const itemValue = String(item[keyValue]);
                return (
                  <CommandItem
                    key={itemValue}
                    onSelect={() => handleSelect(item)}
                    value={itemValue}
                  >
                    {String(item[labelValue])}
                    {value === itemValue && (
                      <CheckIcon className="ml-auto" size={16} />
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
