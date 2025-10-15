"use client";

import React from "react";
import { DistanceRange } from "@/types/delivery";

interface DistanceRangeManagerProps {
  ranges: DistanceRange[];
  onChange: (ranges: DistanceRange[]) => void;
}

export const DistanceRangeManager: React.FC<DistanceRangeManagerProps> = ({
  ranges,
  onChange,
}) => {
  const handleAddRange = () => {
    const lastRange = ranges[ranges.length - 1];
    const newMinDistance = lastRange ? lastRange.maxDistance : 0;
    
    const newRange: DistanceRange = {
      minDistance: newMinDistance,
      maxDistance: newMinDistance + 2,
      cost: 0,
      isFree: false,
    };
    
    onChange([...ranges, newRange]);
  };

  const handleRemoveRange = (index: number) => {
    const newRanges = ranges.filter((_, i) => i !== index);
    onChange(newRanges);
  };

  const handleRangeChange = (
    index: number,
    field: keyof DistanceRange,
    value: number | boolean
  ) => {
    const newRanges = [...ranges];
    newRanges[index] = { ...newRanges[index], [field]: value };
    onChange(newRanges);
  };

  const handleCheckboxChange = (index: number, checked: boolean) => {
    const newRanges = [...ranges];
    newRanges[index] = { 
      ...newRanges[index], 
      isFree: checked,
      cost: checked ? 0 : newRanges[index].cost
    };
    onChange(newRanges);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-dark dark:text-white">
          Faixas de Distância
        </h4>
        <button
          type="button"
          onClick={handleAddRange}
          className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
        >
          <span className="text-lg">+</span>
          Adicionar Faixa
        </button>
      </div>

      {ranges.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-stroke p-8 text-center dark:border-strokedark">
          <p className="text-sm text-body">
            Nenhuma faixa de distância configurada. Clique em &quot;Adicionar Faixa&quot; para começar.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {ranges.map((range, index) => (
          <div
            key={index}
            className="rounded-lg border border-stroke bg-gray-2 p-4 dark:border-strokedark dark:bg-meta-4"
          >
            <div className="grid gap-4 md:grid-cols-12 items-end">
              {/* Distância Mínima */}
              <div className="md:col-span-3">
                <label className="mb-2 block text-xs font-medium text-dark dark:text-white">
                  De (km)
                </label>
                <input
                  type="number"
                  value={range.minDistance}
                  onChange={(e) =>
                    handleRangeChange(
                      index,
                      "minDistance",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  step="0.1"
                  min="0"
                  className="w-full rounded-lg border border-stroke bg-white px-3 py-2 text-sm text-dark outline-none focus:border-brand-500 dark:border-strokedark dark:bg-boxdark dark:text-white"
                />
              </div>

              {/* Distância Máxima */}
              <div className="md:col-span-3">
                <label className="mb-2 block text-xs font-medium text-dark dark:text-white">
                  Até (km)
                </label>
                <input
                  type="number"
                  value={range.maxDistance}
                  onChange={(e) =>
                    handleRangeChange(
                      index,
                      "maxDistance",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  step="0.1"
                  min={range.minDistance}
                  className="w-full rounded-lg border border-stroke bg-white px-3 py-2 text-sm text-dark outline-none focus:border-brand-500 dark:border-strokedark dark:bg-boxdark dark:text-white"
                />
              </div>

              {/* Custo */}
              <div className="md:col-span-3">
                <label className="mb-2 block text-xs font-medium text-dark dark:text-white">
                  Custo (R$)
                </label>
                <input
                  type="number"
                  value={range.cost}
                  onChange={(e) =>
                    handleRangeChange(
                      index,
                      "cost",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  step="0.01"
                  min="0"
                  disabled={range.isFree}
                  className="w-full rounded-lg border border-stroke bg-white px-3 py-2 text-sm text-dark outline-none focus:border-brand-500 disabled:bg-gray-100 disabled:text-gray-400 dark:border-strokedark dark:bg-boxdark dark:text-white dark:disabled:bg-meta-4"
                />
              </div>

              {/* Grátis Checkbox */}
              <div className="md:col-span-2 flex items-center justify-center">
                <div 
                  className="flex items-center gap-2 cursor-pointer select-none rounded px-2 py-1 hover:bg-gray-100 dark:hover:bg-meta-4/50"
                  onClick={() => handleCheckboxChange(index, !range.isFree)}
                >
                  <input
                    type="checkbox"
                    checked={range.isFree}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleCheckboxChange(index, e.target.checked);
                    }}
                    className="h-5 w-5 cursor-pointer rounded border-2 border-stroke bg-white text-success accent-success focus:ring-2 focus:ring-success focus:ring-offset-0 dark:border-strokedark dark:bg-boxdark"
                  />
                  <span className="text-xs font-medium text-dark dark:text-white whitespace-nowrap pointer-events-none">
                    Grátis
                  </span>
                </div>
              </div>

              {/* Botão Remover */}
              <div className="md:col-span-1 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => handleRemoveRange(index)}
                  className="rounded-lg bg-danger p-2 text-white hover:bg-danger/90 transition-colors"
                  title="Remover faixa"
                >
                  <span className="text-lg">🗑️</span>
                </button>
              </div>
            </div>

            {/* Preview da faixa */}
            <div className="mt-3 rounded-md bg-white p-2 text-xs text-body dark:bg-boxdark">
              <strong>Preview:</strong>{" "}
              {range.minDistance.toFixed(1)} km a {range.maxDistance.toFixed(1)} km:{" "}
              {range.isFree ? (
                <span className="font-semibold text-success">Frete Grátis</span>
              ) : (
                <span className="font-semibold text-dark dark:text-white">
                  R$ {range.cost.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {ranges.length > 0 && (
        <div className="rounded-lg bg-brand-50 p-4 dark:bg-brand-500/10">
          <p className="text-xs text-brand-600 dark:text-brand-400">
            <strong>💡 Dica:</strong> Configure faixas sequenciais para cobrir toda a área de entrega.
            A distância mínima de cada faixa deve ser igual à distância máxima da faixa anterior.
          </p>
        </div>
      )}
    </div>
  );
};
