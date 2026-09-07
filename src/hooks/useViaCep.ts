import { useState } from 'react';

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

interface AddressData {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

export const useViaCep = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCep = async (cep: string): Promise<AddressData | null> => {
    // Remove caracteres não numéricos
    const cleanCep = cep.replace(/\D/g, '');

    if (cleanCep.length !== 8) {
      setError('CEP deve conter 8 dígitos');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data: ViaCepResponse = await response.json();

      if (data.erro) {
        setError('CEP não encontrado');
        return null;
      }

      return {
        street: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
      };
    } catch (err) {
      setError('Erro ao buscar CEP. Tente novamente.');
      console.error('Erro ao buscar CEP:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const formatCep = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 5) {
      return cleaned;
    }
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
  };

  return { searchCep, loading, error, formatCep };
};
