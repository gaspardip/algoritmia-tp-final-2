import { Button } from "./components/ui/button";

import { Check, ChevronsUpDown, RepeatIcon } from "lucide-react";

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
import { memo, useState } from "react";
import type { Pattern } from "./types";

interface PatternProps {
  disabled: boolean;
  onPatternClick: (pattern: Pattern) => void;
  onValueChange: (value: string) => void;
  value: string;
}

export const PatternsCombobox = memo(({
  disabled,
  value,
  onValueChange,
  onPatternClick,
}: PatternProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);

  return (
    <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            aria-expanded={open}
            className="w-60 justify-between truncate"
            disabled={disabled}
            // biome-ignore lint/a11y/useSemanticElements: the button is used as a combobox trigger
            role="combobox"
            variant="outline"
          >
            {value
              ? patterns.find(({ name }) => name === value)?.name
              : "Insertar Patrón..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 p-0">
          <Command>
            <CommandInput
              placeholder="Buscar patrón..."
              className="h-9"
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList className="no-scrollbar">
              <CommandEmpty>No se encontró ningun patrón.</CommandEmpty>
              <CommandGroup>
                {patterns.map(({ name, pattern }) => (
                  <CommandItem
                    key={name}
                    value={name}
                    onSelect={(currentValue) => {
                      const newValue = currentValue === value ? "" : currentValue;
                      onValueChange(newValue);
                      setOpen(false);
                      if (newValue) {
                        setSelectedPattern(pattern);
                        onPatternClick(pattern);
                      }
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
      <Button
        className="flex-1"
        disabled={!selectedPattern}
        onClick={() => {
          if (selectedPattern) {
            onPatternClick(selectedPattern);
          }
        }}
        size="icon"
        variant="outline"
      >
        <RepeatIcon />
      </Button>
    </div>

  );
});

PatternsCombobox.displayName = "PatternsCombobox";