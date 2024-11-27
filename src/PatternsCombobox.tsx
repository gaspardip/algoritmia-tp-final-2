import { Button } from "./components/ui/button";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { patterns } from "@/data/patterns";
import { useState } from "react";
import type { Pattern } from "./types";

interface PatternProps {
  disabled: boolean;
  onPatternClick: (pattern: Pattern) => void;
}

export function PatternsCombobox({ disabled, onPatternClick }: PatternProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className="w-full justify-between truncate"
          disabled={disabled}
          role="combobox"
          variant="outline"
        >
          {value
            ? patterns.find(({ name }) => name === value)?.name
            : "Insertar Patrón..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Buscar patrón..." className="h-9" />
          <CommandList>
            <CommandEmpty>No se encontró ningun patrón.</CommandEmpty>
            <CommandGroup>
              {patterns.map(({ name, pattern }) => (
                <CommandItem
                  key={name}
                  value={name}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    onPatternClick(pattern);
                  }}
                >
                  {name}
                  <Check
                    className={cn(
                      "ml-auto",
                      name === value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
