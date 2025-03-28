"use client";

import * as React from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { useCompanySearch } from "@/hooks/use-company-search";
import { Loader2 } from "lucide-react";

interface CompanySearchProps {
  value: string;
  logoUrl?: string;
  onChange: (value: { name: string; logo?: string }) => void;
}

export function CompanySearch({ value, logoUrl, onChange }: CompanySearchProps) {
  const [open, setOpen] = React.useState(false);
  const [customLogo, setCustomLogo] = React.useState(logoUrl || "");
  const { companies, isLoading, searchCompanies } = useCompanySearch();

  // Mettre à jour le logo personnalisé lorsque logoUrl change
  React.useEffect(() => {
    setCustomLogo(logoUrl || "");
  }, [logoUrl]);

  const handleCompanySelect = (name: string, logo?: string) => {
    onChange({ name, logo });
    setCustomLogo(logo || "");
    setOpen(false);
  };

  const handleSearch = (search: string) => {
    if (search.length >= 2) {
      searchCompanies(search);
    } else {
      // Réinitialiser le logo si la recherche est vide ou trop courte
      onChange({ name: search, logo: "" });
      setCustomLogo("");
    }
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-background hover:bg-background"
          >
            <span className={cn("truncate", !value && "text-muted-foreground")}>
              {value || "Sélectionner une entreprise..."}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full min-w-[var(--radix-popper-anchor-width)] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput 
              placeholder="Rechercher une entreprise..." 
              onValueChange={handleSearch}
            />
            <CommandList>
              {isLoading && (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              <CommandEmpty>
                <div className="p-4 text-sm text-muted-foreground">
                  Aucune suggestion trouvée.
                  <Button
                    variant="ghost"
                    className="w-full mt-2"
                    onClick={(e) => {
                      const input = e.currentTarget.closest(".cmd-input")?.querySelector("input");
                      if (input) {
                        handleCompanySelect(input.value, "");
                      }
                    }}
                  >
                    Utiliser ce nom
                  </Button>
                </div>
              </CommandEmpty>
              <CommandGroup>
                {companies.map((company) => (
                  <CommandItem
                    key={company.domain}
                    value={company.name}
                    onSelect={() => handleCompanySelect(company.name, company.logo)}
                  >
                    <div className="flex items-center gap-2">
                      {company.logo && (
                        <img
                          src={company.logo}
                          alt={`Logo ${company.name}`}
                          className="h-4 w-4 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <span>{company.name}</span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === company.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Input
        type="url"
        placeholder="URL du logo (optionnel)"
        value={customLogo}
        onChange={(e) => {
          setCustomLogo(e.target.value);
          onChange({ name: value, logo: e.target.value });
        }}
      />
    </div>
  );
} 