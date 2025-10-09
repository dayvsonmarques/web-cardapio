'use client';

import { useState, useEffect } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

type StoreType = 'DELIVERY_ONLY' | 'DINE_IN_ONLY' | 'HYBRID';

interface OperatingHours {
  monday: { open: string; close: string; closed: boolean };
  tuesday: { open: string; close: string; closed: boolean };
  wednesday: { open: string; close: string; closed: boolean };
  thursday: { open: string; close: string; closed: boolean };
  friday: { open: string; close: string; closed: boolean };
  saturday: { open: string; close: string; closed: boolean };
  sunday: { open: string; close: string; closed: boolean };
}

interface RestaurantSettings {
  id: string;
  name: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  storeType: StoreType;
  operatingHours: OperatingHours;
  phone: string | null;
  email: string | null;
  deliveryFee: number;
  minDeliveryValue: number;
  serviceFeePercent: number;
}

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Segunda-feira' },
  { key: 'tuesday', label: 'Terça-feira' },
  { key: 'wednesday', label: 'Quarta-feira' },
  { key: 'thursday', label: 'Quinta-feira' },
  { key: 'friday', label: 'Sexta-feira' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
] as const;

const STORE_TYPE_LABELS = {
  DELIVERY_ONLY: 'Apenas Delivery',
  DINE_IN_ONLY: 'Apenas Presencial',
  HYBRID: 'Híbrido (Delivery + Presencial)',
};

export default function RestaurantePage() {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/restaurant/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      setMessage({ type: 'error', text: 'Erro ao carregar configurações' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/restaurant/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' });
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Erro ao salvar configurações' });
    } finally {
      setSaving(false);
    }
  };

  const updateField = <K extends keyof RestaurantSettings>(field: K, value: RestaurantSettings[K]) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const updateOperatingHours = (day: keyof OperatingHours, field: 'open' | 'close' | 'closed', value: string | boolean) => {
    if (!settings) return;
    setSettings({
      ...settings,
      operatingHours: {
        ...settings.operatingHours,
        [day]: {
          ...settings.operatingHours[day],
          [field]: value,
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-red-500">Erro ao carregar configurações</div>
      </div>
    );
  }

  return (
    <>
      <PageBreadcrumb pageTitle="Configurações do Restaurante" />

      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
          <h3 className="font-medium text-dark dark:text-white">
            Informações do Restaurante
          </h3>
        </div>

        {message && (
          <div className={`mx-7 mt-4 rounded-lg p-4 ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-7">
          {/* Nome e Tipo de Loja */}
          <div className="mb-5.5 grid grid-cols-1 gap-5.5 sm:grid-cols-2">
            <div>
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                Nome do Restaurante <span className="text-red">*</span>
              </label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => updateField('name', e.target.value)}
                required
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                Tipo de Loja <span className="text-red">*</span>
              </label>
              <select
                value={settings.storeType}
                onChange={(e) => updateField('storeType', e.target.value as StoreType)}
                required
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              >
                {Object.entries(STORE_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Endereço */}
          <div className="mb-5.5">
            <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">
              Endereço
            </h4>
            
            <div className="grid grid-cols-1 gap-5.5 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  Rua <span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  value={settings.street}
                  onChange={(e) => updateField('street', e.target.value)}
                  required
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  Número <span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  value={settings.number}
                  onChange={(e) => updateField('number', e.target.value)}
                  required
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>

            <div className="mt-5.5 grid grid-cols-1 gap-5.5 sm:grid-cols-3">
              <div>
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  Complemento
                </label>
                <input
                  type="text"
                  value={settings.complement || ''}
                  onChange={(e) => updateField('complement', e.target.value || null)}
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  Bairro <span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  value={settings.neighborhood}
                  onChange={(e) => updateField('neighborhood', e.target.value)}
                  required
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  CEP <span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  value={settings.zipCode}
                  onChange={(e) => updateField('zipCode', e.target.value)}
                  required
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>

            <div className="mt-5.5 grid grid-cols-1 gap-5.5 sm:grid-cols-2">
              <div>
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  Cidade <span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  value={settings.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  required
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  Estado <span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  value={settings.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  required
                  maxLength={2}
                  placeholder="SP"
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Contato */}
          <div className="mb-5.5">
            <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">
              Contato
            </h4>
            
            <div className="grid grid-cols-1 gap-5.5 sm:grid-cols-2">
              <div>
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={settings.phone || ''}
                  onChange={(e) => updateField('phone', e.target.value || null)}
                  placeholder="(11) 3456-7890"
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  E-mail
                </label>
                <input
                  type="email"
                  value={settings.email || ''}
                  onChange={(e) => updateField('email', e.target.value || null)}
                  placeholder="contato@restaurante.com"
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Configurações de Delivery */}
          {(settings.storeType === 'DELIVERY_ONLY' || settings.storeType === 'HYBRID') && (
            <div className="mb-5.5">
              <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">
                Configurações de Delivery
              </h4>
              
              <div className="grid grid-cols-1 gap-5.5 sm:grid-cols-2">
                <div>
                  <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                    Taxa de Entrega (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={settings.deliveryFee}
                    onChange={(e) => updateField('deliveryFee', parseFloat(e.target.value) || 0)}
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                    Pedido Mínimo (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={settings.minDeliveryValue}
                    onChange={(e) => updateField('minDeliveryValue', parseFloat(e.target.value) || 0)}
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Configurações de Atendimento Presencial */}
          {(settings.storeType === 'DINE_IN_ONLY' || settings.storeType === 'HYBRID') && (
            <div className="mb-5.5">
              <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">
                Configurações de Atendimento Presencial
              </h4>
              
              <div>
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  Taxa de Serviço (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={settings.serviceFeePercent}
                  onChange={(e) => updateField('serviceFeePercent', parseFloat(e.target.value) || 0)}
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary sm:w-1/2"
                />
                <p className="mt-2 text-sm text-body dark:text-dark-6">
                  Taxa de serviço aplicada em pedidos no restaurante (geralmente 10%)
                </p>
              </div>
            </div>
          )}

          {/* Horário de Funcionamento */}
          <div className="mb-5.5">
            <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">
              Horário de Funcionamento
            </h4>
            
            <div className="space-y-3">
              {DAYS_OF_WEEK.map(({ key, label }) => (
                <div key={key} className="grid grid-cols-1 items-center gap-3 sm:grid-cols-4">
                  <div className="font-medium text-dark dark:text-white">
                    {label}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!settings.operatingHours[key].closed}
                      onChange={(e) => updateOperatingHours(key, 'closed', !e.target.checked)}
                      className="h-5 w-5 rounded border-stroke dark:border-dark-3"
                    />
                    <span className="text-sm text-body dark:text-dark-6">Aberto</span>
                  </div>
                  
                  {!settings.operatingHours[key].closed && (
                    <>
                      <div>
                        <input
                          type="time"
                          value={settings.operatingHours[key].open}
                          onChange={(e) => updateOperatingHours(key, 'open', e.target.value)}
                          className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-3 py-2 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                        />
                      </div>
                      
                      <div>
                        <input
                          type="time"
                          value={settings.operatingHours[key].close}
                          onChange={(e) => updateOperatingHours(key, 'close', e.target.value)}
                          className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-3 py-2 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={loadSettings}
              className="rounded-[7px] border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-[7px] bg-primary px-6 py-[7px] font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-50"
            >
              {saving ? 'Salvando...' : 'Salvar Configurações'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
