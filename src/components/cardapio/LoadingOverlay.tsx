"use client";

interface LoadingOverlayProps {
  show: boolean;
  message?: string;
}

/**
 * Overlay de tela cheia com spinner. Usado enquanto o cálculo de frete
 * (busca de CEP + distância) está em andamento.
 */
const LoadingOverlay = ({ show, message = "Carregando..." }: LoadingOverlayProps) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4 rounded-xl bg-white px-8 py-6 shadow-xl dark:bg-gray-800">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary dark:border-gray-600 dark:border-t-primary" />
        <p className="text-base font-medium text-gray-700 dark:text-gray-200">{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
