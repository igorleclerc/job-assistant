import { useState } from "react";

interface Company {
  name: string;
  domain: string;
  logo: string;
}

export function useCompanySearch() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchCompanies = async (query: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      // Ajouter l'entreprise saisie comme première option si elle n'existe pas dans les résultats
      const exactMatch = data.find((company: Company) => 
        company.name.toLowerCase() === query.toLowerCase()
      );

      if (!exactMatch) {
        data.unshift({
          name: query,
          domain: query.toLowerCase().replace(/\s+/g, ''),
          logo: "", // Pas de logo pour l'entreprise saisie manuellement
        });
      }

      // Mapper les résultats avec les logos
      const mappedCompanies = data.map((company: Company, index: number) => ({
        ...company,
        // Ne générer l'URL du logo que pour les entreprises de l'API (pas pour l'entreprise saisie)
        logo: index === 0 && !exactMatch ? "" : `https://logo.clearbit.com/${company.domain}`,
      }));

      setCompanies(mappedCompanies);
    } catch (error) {
      console.error("Erreur lors de la recherche d'entreprises:", error);
      // En cas d'erreur, ajouter l'entreprise saisie comme seule option sans logo
      setCompanies([{
        name: query,
        domain: query.toLowerCase().replace(/\s+/g, ''),
        logo: "", // Pas de logo en cas d'erreur
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    companies,
    isLoading,
    searchCompanies,
  };
} 