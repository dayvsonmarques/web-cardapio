"use client";

import React, { useState, useEffect } from "react";
import { DeliverySettings, DeliveryType, deliveryTypeLabels, DistanceRange } from "@/types/delivery";
import { useViaCep } from "@/hooks/useViaCep";
import { usePageTitle } from "@/hooks/usePageTitle";
import { DistanceRangeManager } from "@/components/delivery/DistanceRangeManager";
import toast from "react-hot-toast";

const EntregasPage = () => {
  usePageTitle("Configurações de Entrega");
  
  const [settings, setSettings] = useState<DeliverySettings | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { searchCep, loading: cepLoading, error: cepError, formatCep } = useViaCep();

  const [formData, setFormData] = useState({
    storeStreet: "",
    storeNumber: "",
    storeComplement: "",
    storeNeighborhood: "",
    storeCity: "",
    storeState: "",
    storeZipCode: "",
    deliveryType: DeliveryType.FIXED,
    fixedCost: 0,
    costPerKm: 0,
    freeDeliveryMinValue: 0,
    hasDeliveryLimit: false,
    maxDeliveryDistance: 0,
    allowPickup: true,
    isActive: true,
    distanceRanges: [] as DistanceRange[],
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/delivery-settings");
      const data = await response.json();
      
      console.log("Dados recebidos da API:", data);
      
      if (data && data.id) {
        setSettings(data);
        setFormData({
          storeStreet: data.storeStreet || "",
          storeNumber: data.storeNumber || "",
          storeComplement: data.storeComplement || "",
          storeNeighborhood: data.storeNeighborhood || "",
          storeCity: data.storeCity || "",
          storeState: data.storeState || "",
          storeZipCode: data.storeZipCode || "",
          deliveryType: data.deliveryType || DeliveryType.FIXED,
          fixedCost: data.fixedCost || 0,
          costPerKm: data.costPerKm || 0,
          freeDeliveryMinValue: data.freeDeliveryMinValue || 0,
          hasDeliveryLimit: data.hasDeliveryLimit ?? false,
          maxDeliveryDistance: data.maxDeliveryDistance || 0,
          allowPickup: data.allowPickup ?? true,
          isActive: data.isActive ?? true,
          distanceRanges: data.distanceRanges || [],
        });
        setIsEditing(false);
      } else {
        console.log("Nenhuma configuração encontrada, entrando em modo de edição");
        setSettings(null);
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
      setSettings(null);
      setIsEditing(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      console.log("Enviando dados:", formData);
      
      const response = await fetch("/api/delivery-settings", {
        method: settings ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro da API:", errorData);
        throw new Error(errorData.error || "Erro ao salvar configurações");
      }

      await loadSettings();
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro ao salvar configurações. Tente novamente.";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value);
    setFormData((prev) => ({ ...prev, storeZipCode: formatted }));

    // Busca automaticamente quando CEP estiver completo
    const cleanCep = formatted.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      const addressData = await searchCep(formatted);
      if (addressData) {
        setFormData((prev) => ({
          ...prev,
          storeStreet: addressData.street || prev.storeStreet,
          storeNeighborhood: addressData.neighborhood || prev.storeNeighborhood,
          storeCity: addressData.city || prev.storeCity,
          storeState: addressData.state || prev.storeState,
        }));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          Configurações de Entrega
        </h2>
        <nav className="mt-2 flex text-sm">
          <span className="text-body">Admin</span>
          <span className="mx-2 text-body">/</span>
          <span className="text-dark dark:text-white">Entregas</span>
        </nav>
      </div>

      {/* Header com botão */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-body">
            Configure o endereço da loja e as opções de entrega para seus clientes
          </p>
        </div>
        {!isEditing && settings && (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-lg bg-brand-500 px-6 py-3 font-semibold text-white hover:bg-brand-600 transition-colors"
          >
            Editar Configurações
          </button>
        )}
      </div>

      {settings && !isEditing ? (
        // View Mode
        <div className="space-y-6">
          {/* Endereço da Loja */}
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-boxdark">
            <h3 className="mb-6 text-xl font-bold text-dark dark:text-white">
              Endereço da Loja
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-1 text-sm font-medium text-body">Rua</p>
                <p className="text-base font-semibold text-dark dark:text-white">
                  {settings.storeStreet}
                </p>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-body">Número</p>
                <p className="text-base font-semibold text-dark dark:text-white">
                  {settings.storeNumber}
                </p>
              </div>
              {settings.storeComplement && (
                <div>
                  <p className="mb-1 text-sm font-medium text-body">Complemento</p>
                  <p className="text-base font-semibold text-dark dark:text-white">
                    {settings.storeComplement}
                  </p>
                </div>
              )}
              <div>
                <p className="mb-1 text-sm font-medium text-body">Bairro</p>
                <p className="text-base font-semibold text-dark dark:text-white">
                  {settings.storeNeighborhood}
                </p>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-body">Cidade</p>
                <p className="text-base font-semibold text-dark dark:text-white">
                  {settings.storeCity}
                </p>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-body">Estado</p>
                <p className="text-base font-semibold text-dark dark:text-white">
                  {settings.storeState}
                </p>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-body">CEP</p>
                <p className="text-base font-semibold text-dark dark:text-white">
                  {settings.storeZipCode}
                </p>
              </div>
            </div>
          </div>

          {/* Configuração de Entrega */}
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-boxdark">
            <h3 className="mb-6 text-xl font-bold text-dark dark:text-white">
              Configuração de Entrega
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-1 text-sm font-medium text-body">Tipo de Entrega</p>
                <p className="text-base font-semibold text-dark dark:text-white">
                  {deliveryTypeLabels[settings.deliveryType]}
                </p>
              </div>
              
              {settings.deliveryType === DeliveryType.FIXED && (
                <div>
                  <p className="mb-1 text-sm font-medium text-body">Custo Fixo</p>
                  <p className="text-base font-semibold text-dark dark:text-white">
                    R$ {settings.fixedCost.toFixed(2)}
                  </p>
                </div>
              )}
              
              {settings.deliveryType === DeliveryType.VARIABLE && (
                <div>
                  <p className="mb-1 text-sm font-medium text-body">Custo por KM</p>
                  <p className="text-base font-semibold text-dark dark:text-white">
                    R$ {settings.costPerKm.toFixed(2)}/km
                  </p>
                </div>
              )}
              
              {settings.deliveryType === DeliveryType.FIXED_PLUS_KM && (
                <>
                  <div>
                    <p className="mb-1 text-sm font-medium text-body">Custo Fixo</p>
                    <p className="text-base font-semibold text-dark dark:text-white">
                      R$ {settings.fixedCost.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-medium text-body">Custo por KM</p>
                    <p className="text-base font-semibold text-dark dark:text-white">
                      R$ {settings.costPerKm.toFixed(2)}/km
                    </p>
                  </div>
                </>
              )}
              
              {settings.deliveryType === DeliveryType.FREE_ABOVE_VALUE && settings.freeDeliveryMinValue && (
                <div>
                  <p className="mb-1 text-sm font-medium text-body">Frete Grátis Acima de</p>
                  <p className="text-base font-semibold text-dark dark:text-white">
                    R$ {settings.freeDeliveryMinValue.toFixed(2)}
                  </p>
                </div>
              )}

              {/* Faixas de Distância */}
              {settings.deliveryType === DeliveryType.RANGE_BASED && settings.distanceRanges && settings.distanceRanges.length > 0 && (
                <div className="md:col-span-2">
                  <p className="mb-3 text-sm font-medium text-body">Faixas de Distância</p>
                  <div className="space-y-2">
                    {settings.distanceRanges.map((range, index) => (
                      <div
                        key={range.id || index}
                        className="flex items-center justify-between rounded-lg border border-stroke bg-gray-2 px-4 py-3 dark:border-strokedark dark:bg-meta-4"
                      >
                        <span className="text-sm text-dark dark:text-white">
                          {range.minDistance.toFixed(1)} km - {range.maxDistance.toFixed(1)} km
                        </span>
                        <span className={`text-sm font-semibold ${range.isFree ? 'text-success' : 'text-dark dark:text-white'}`}>
                          {range.isFree ? 'Frete Grátis' : `R$ ${range.cost.toFixed(2)}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <p className="mb-1 text-sm font-medium text-body">Limite de Entrega</p>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                    settings.hasDeliveryLimit
                      ? "bg-warning/10 text-warning"
                      : "bg-bodydark2/10 text-bodydark2"
                  }`}
                >
                  {settings.hasDeliveryLimit ? "Sim" : "Não"}
                </span>
              </div>

              {settings.hasDeliveryLimit && settings.maxDeliveryDistance && (
                <div>
                  <p className="mb-1 text-sm font-medium text-body">Distância Máxima</p>
                  <p className="text-base font-semibold text-dark dark:text-white">
                    {settings.maxDeliveryDistance.toFixed(1)} km
                  </p>
                </div>
              )}
              
              <div>
                <p className="mb-1 text-sm font-medium text-body">Permite Retirada</p>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                    settings.allowPickup
                      ? "bg-success/10 text-success"
                      : "bg-danger/10 text-danger"
                  }`}
                >
                  {settings.allowPickup ? "Sim" : "Não"}
                </span>
              </div>
              
              <div>
                <p className="mb-1 text-sm font-medium text-body">Status</p>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                    settings.isActive
                      ? "bg-success/10 text-success"
                      : "bg-danger/10 text-danger"
                  }`}
                >
                  {settings.isActive ? "Ativo" : "Inativo"}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Edit/Create Mode
        <form onSubmit={handleSubmit} className="space-y-6">
          {!settings && (
            <div className="rounded-lg bg-brand-50 p-4 mb-6 dark:bg-brand-500/10">
              <p className="text-sm text-brand-600 font-medium dark:text-brand-400">
                ℹ️ Nenhuma configuração de entrega encontrada. Preencha o formulário abaixo para criar a primeira configuração.
              </p>
            </div>
          )}
          
          {/* Endereço da Loja */}
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-boxdark">
            <h3 className="mb-6 text-xl font-bold text-dark dark:text-white">
              Endereço da Loja
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-1">
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  CEP *
                </label>
                <input
                  type="text"
                  name="storeZipCode"
                  value={formData.storeZipCode}
                  onChange={handleCepChange}
                  placeholder="00000-000"
                  maxLength={9}
                  required
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none focus:border-brand-500 dark:border-strokedark dark:text-white"
                />
                {cepLoading && (
                  <p className="mt-1 text-sm text-body">Buscando CEP...</p>
                )}
                {cepError && (
                  <p className="mt-1 text-sm text-danger">{cepError}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Rua *
                </label>
                <input
                  type="text"
                  name="storeStreet"
                  value={formData.storeStreet}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none focus:border-brand-500 dark:border-strokedark dark:text-white"
                />
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Número *
                </label>
                <input
                  type="text"
                  name="storeNumber"
                  value={formData.storeNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none focus:border-brand-500 dark:border-strokedark dark:text-white"
                />
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Complemento
                </label>
                <input
                  type="text"
                  name="storeComplement"
                  value={formData.storeComplement}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none focus:border-brand-500 dark:border-strokedark dark:text-white"
                />
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Bairro *
                </label>
                <input
                  type="text"
                  name="storeNeighborhood"
                  value={formData.storeNeighborhood}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none focus:border-brand-500 dark:border-strokedark dark:text-white"
                />
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Cidade *
                </label>
                <input
                  type="text"
                  name="storeCity"
                  value={formData.storeCity}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none focus:border-brand-500 dark:border-strokedark dark:text-white"
                />
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Estado *
                </label>
                <input
                  type="text"
                  name="storeState"
                  value={formData.storeState}
                  onChange={handleInputChange}
                  required
                  maxLength={2}
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none focus:border-brand-500 dark:border-strokedark dark:text-white uppercase"
                />
              </div>
            </div>
          </div>

          {/* Configuração de Entrega */}
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-boxdark">
            <h3 className="mb-6 text-xl font-bold text-dark dark:text-white">
              Configuração de Entrega
            </h3>
            <div className="grid gap-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Tipo de Entrega *
                </label>
                <select
                  name="deliveryType"
                  value={formData.deliveryType}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none focus:border-brand-500 dark:border-strokedark dark:text-white"
                >
                  {Object.entries(deliveryTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {(formData.deliveryType === DeliveryType.FIXED || 
                  formData.deliveryType === DeliveryType.FIXED_PLUS_KM) && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                      Custo Fixo (R$) *
                    </label>
                    <input
                      type="number"
                      name="fixedCost"
                      value={formData.fixedCost}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      required
                      className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none focus:border-brand-500 dark:border-strokedark dark:text-white"
                    />
                  </div>
                )}

                {(formData.deliveryType === DeliveryType.VARIABLE || 
                  formData.deliveryType === DeliveryType.FIXED_PLUS_KM) && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                      Custo por KM (R$) *
                    </label>
                    <input
                      type="number"
                      name="costPerKm"
                      value={formData.costPerKm}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      required
                      className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none focus:border-brand-500 dark:border-strokedark dark:text-white"
                    />
                  </div>
                )}

                {formData.deliveryType === DeliveryType.FREE_ABOVE_VALUE && (
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                      Valor Mínimo para Frete Grátis (R$) *
                    </label>
                    <input
                      type="number"
                      name="freeDeliveryMinValue"
                      value={formData.freeDeliveryMinValue}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      required
                      className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none focus:border-brand-500 dark:border-strokedark dark:text-white"
                    />
                  </div>
                )}
              </div>

              {/* Faixas de Distância */}
              {formData.deliveryType === DeliveryType.RANGE_BASED && (
                <div className="border-t border-stroke pt-6 dark:border-strokedark">
                  <DistanceRangeManager
                    ranges={formData.distanceRanges}
                    onChange={(ranges) =>
                      setFormData((prev) => ({ ...prev, distanceRanges: ranges }))
                    }
                  />
                </div>
              )}

              {/* Limite de Entrega */}
              <div className="flex flex-col gap-4 border-t border-stroke pt-6 dark:border-strokedark">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasDeliveryLimit"
                    id="hasDeliveryLimit"
                    checked={formData.hasDeliveryLimit}
                    onChange={handleInputChange}
                    className="h-5 w-5 rounded border-stroke text-primary focus:ring-2 focus:ring-primary dark:border-strokedark"
                  />
                  <label
                    htmlFor="hasDeliveryLimit"
                    className="ml-3 text-sm font-medium text-dark dark:text-white"
                  >
                    Limite de entrega (km)
                  </label>
                </div>

                {formData.hasDeliveryLimit && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                      Distância máxima para entrega (km)
                    </label>
                    <input
                      type="number"
                      name="maxDeliveryDistance"
                      value={formData.maxDeliveryDistance}
                      onChange={handleInputChange}
                      step="0.1"
                      min="0"
                      required
                      placeholder="Ex: 10"
                      className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none focus:border-brand-500 dark:border-strokedark dark:text-white"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Pedidos além desta distância serão recusados automaticamente
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4 border-t border-stroke pt-6 dark:border-strokedark">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="allowPickup"
                    id="allowPickup"
                    checked={formData.allowPickup}
                    onChange={handleInputChange}
                    className="h-5 w-5 rounded border-stroke text-primary focus:ring-2 focus:ring-primary dark:border-strokedark"
                  />
                  <label
                    htmlFor="allowPickup"
                    className="ml-3 text-sm font-medium text-dark dark:text-white"
                  >
                    Permitir Retirada no Local
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-5 w-5 rounded border-stroke text-primary focus:ring-2 focus:ring-primary dark:border-strokedark"
                  />
                  <label
                    htmlFor="isActive"
                    className="ml-3 text-sm font-medium text-dark dark:text-white"
                  >
                    Ativo
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            {settings && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  loadSettings();
                }}
                className="rounded-lg border-2 border-stroke px-6 py-3 font-semibold text-dark hover:bg-gray-2 dark:border-strokedark dark:text-white dark:hover:bg-meta-4 transition-colors"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-brand-500 px-8 py-3 font-semibold text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? "Salvando..." : "Salvar Configurações"}
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default EntregasPage;
