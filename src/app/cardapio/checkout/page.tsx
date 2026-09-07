"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useDelivery } from "@/context/DeliveryContext";
import { useViaCep } from "@/hooks/useViaCep";
import { useDeliveryCalculator } from "@/hooks/useDeliveryCalculator";
import { formatPhone, isValidMobilePhone } from "@/lib/utils";
import CardapioHeader from "@/components/cardapio/CardapioHeader";
import LoadingOverlay from "@/components/cardapio/LoadingOverlay";

interface ResolvedAddress {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

const inputClass =
  "w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white";
const lockedInputClass =
  "w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400";
const labelClass =
  "mb-1 block text-base font-medium text-gray-700 dark:text-gray-300";

const CheckoutPage = () => {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const delivery = useDelivery();
  const { formatCep } = useViaCep();
  const { calculateDelivery, loading: deliveryLoading } = useDeliveryCalculator();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    cep: delivery.address?.cep ?? "",
    numero: "",
    complement: "",
    paymentMethod: "pix",
    notes: "",
  });
  const [resolvedAddress, setResolvedAddress] = useState<ResolvedAddress | null>(
    delivery.address
      ? {
          street: delivery.address.street,
          neighborhood: delivery.address.neighborhood,
          city: delivery.address.city,
          state: delivery.address.state,
        }
      : null
  );
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);

  const phoneRef = useRef<HTMLInputElement>(null);
  const cepRef = useRef<HTMLInputElement>(null);
  const numeroRef = useRef<HTMLInputElement>(null);
  const lookedUpCep = useRef<string>(
    delivery.address ? delivery.address.cep.replace(/\D/g, "") : ""
  );

  // Dados do usuário logado — apenas nome/telefone/e-mail. O endereço vem do CEP.
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name,
        phone: formatPhone(user.phone),
        email: user.email,
      }));
    }
  }, [user]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);

  const lookupCep = async (cleanCep: string) => {
    lookedUpCep.current = cleanCep;
    const result = await calculateDelivery(cleanCep, getTotalPrice());

    if (result.success && result.data.address) {
      const { address } = result.data;
      setResolvedAddress(address);
      setAddressError(null);
      delivery.setDelivery({
        address: { ...address, cep: formatCep(cleanCep) },
        distanceKm: result.data.distance ?? null,
        cost: result.data.cost,
        isFree: result.data.isFree,
      });
    } else {
      setResolvedAddress(null);
      setAddressError(
        result.success
          ? "Não foi possível obter o endereço deste CEP. Confira o número."
          : result.error
      );
      lookedUpCep.current = ""; // permite nova tentativa com o mesmo CEP
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "phone") {
      setFormData((prev) => ({ ...prev, phone: formatPhone(value) }));
      if (phoneError) setPhoneError(null);
      return;
    }

    if (name === "cep") {
      const formatted = formatCep(value);
      const cleanCep = formatted.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, cep: formatted }));
      setAddressError(null);

      if (cleanCep.length < 8 && resolvedAddress) {
        setResolvedAddress(null);
        lookedUpCep.current = "";
      }
      if (cleanCep.length === 8 && cleanCep !== lookedUpCep.current) {
        void lookupCep(cleanCep);
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "numero" && addressError) setAddressError(null);
  };

  const handlePhoneBlur = () => {
    if (formData.phone && !isValidMobilePhone(formData.phone)) {
      setPhoneError("Informe um celular válido com DDD, ex.: (11) 91234-5678");
    } else {
      setPhoneError(null);
    }
  };

  const handleCepBlur = () => {
    const cleanCep = formData.cep.replace(/\D/g, "");
    if (cleanCep.length === 8 && cleanCep !== lookedUpCep.current) {
      void lookupCep(cleanCep);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidMobilePhone(formData.phone)) {
      setPhoneError("Informe um celular válido com DDD, ex.: (11) 91234-5678");
      phoneRef.current?.focus();
      return;
    }

    if (!resolvedAddress) {
      setAddressError("Informe o CEP de entrega.");
      cepRef.current?.focus();
      return;
    }

    if (!formData.numero.trim()) {
      setAddressError("Informe o número do endereço.");
      numeroRef.current?.focus();
      return;
    }

    const fullAddress = `${resolvedAddress.street}, ${formData.numero}${
      formData.complement ? ` - ${formData.complement}` : ""
    } — ${resolvedAddress.neighborhood}, ${resolvedAddress.city}/${
      resolvedAddress.state
    } — CEP ${formData.cep}`;

    // Aqui entraria a chamada de criação do pedido
    void {
      items,
      customer: {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
      },
      address: fullAddress,
      paymentMethod: formData.paymentMethod,
      notes: formData.notes,
      shipping: delivery.cost ?? 0,
      total: getTotalPrice() + (delivery.cost ?? 0),
    };

    clearCart();
    delivery.clearDelivery();
    alert("Pedido realizado com sucesso!");
    router.push("/cardapio");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <CardapioHeader />
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Seu carrinho está vazio
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Adicione produtos ao carrinho antes de finalizar o pedido.
          </p>
          <button
            onClick={() => router.push("/cardapio")}
            className="mt-6 rounded-xl border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-900 transition-all hover:bg-gray-100 hover:shadow-md dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            Voltar para Cardápio
          </button>
        </div>
      </div>
    );
  }

  const shippingCost = delivery.cost ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <LoadingOverlay show={deliveryLoading} message="Calculando frete..." />
      <CardapioHeader />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
          Finalizar Pedido
        </h1>

        {/* Banner de Login */}
        {!user && (
          <div className="mb-6 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Já tem uma conta?
                </h3>
                <p className="text-base text-gray-700 dark:text-gray-400">
                  Faça login para preencher automaticamente seus dados e acompanhar seus pedidos.
                </p>
              </div>
              <Link
                href="/cardapio/login?redirect=/cardapio/checkout"
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-900 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
              >
                Fazer Login
              </Link>
            </div>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados Pessoais */}
              <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Dados Pessoais
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Nome completo *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Telefone *</label>
                      <input
                        ref={phoneRef}
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handlePhoneBlur}
                        required
                        inputMode="numeric"
                        maxLength={15}
                        placeholder="(11) 91234-5678"
                        aria-invalid={phoneError ? true : undefined}
                        aria-describedby={phoneError ? "phone-error" : undefined}
                        className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white ${
                          phoneError
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500"
                            : "border-gray-300 focus:border-primary focus:ring-primary/20 dark:border-gray-600"
                        }`}
                      />
                      {phoneError && (
                        <p
                          id="phone-error"
                          className="mt-1 text-base text-red-600 dark:text-red-400"
                        >
                          {phoneError}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>E-mail</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Endereço de Entrega */}
              <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Endereço de Entrega
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>CEP *</label>
                    <input
                      ref={cepRef}
                      type="text"
                      name="cep"
                      value={formData.cep}
                      onChange={handleChange}
                      onBlur={handleCepBlur}
                      required
                      inputMode="numeric"
                      maxLength={9}
                      placeholder="00000-000"
                      aria-invalid={addressError ? true : undefined}
                      aria-describedby={addressError ? "address-error" : undefined}
                      className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white sm:max-w-[12rem] ${
                        addressError
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500"
                          : "border-gray-300 focus:border-primary focus:ring-primary/20 dark:border-gray-600"
                      }`}
                    />
                    {addressError && (
                      <p
                        id="address-error"
                        className="mt-1 text-base text-red-600 dark:text-red-400"
                      >
                        {addressError}
                      </p>
                    )}
                    {!resolvedAddress && !addressError && (
                      <p className="mt-1 text-base text-gray-500 dark:text-gray-400">
                        Informe o CEP para carregarmos o endereço de entrega.
                      </p>
                    )}
                  </div>

                  {resolvedAddress && (
                    <>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className={labelClass}>Rua</label>
                          <input
                            type="text"
                            value={resolvedAddress.street}
                            readOnly
                            className={lockedInputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Bairro</label>
                          <input
                            type="text"
                            value={resolvedAddress.neighborhood}
                            readOnly
                            className={lockedInputClass}
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className={labelClass}>Cidade</label>
                          <input
                            type="text"
                            value={resolvedAddress.city}
                            readOnly
                            className={lockedInputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>UF</label>
                          <input
                            type="text"
                            value={resolvedAddress.state}
                            readOnly
                            className={lockedInputClass}
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className={labelClass}>Número *</label>
                          <input
                            ref={numeroRef}
                            type="text"
                            name="numero"
                            value={formData.numero}
                            onChange={handleChange}
                            required
                            inputMode="numeric"
                            placeholder="123"
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Complemento</label>
                          <input
                            type="text"
                            name="complement"
                            value={formData.complement}
                            onChange={handleChange}
                            placeholder="Apartamento, bloco, etc."
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Pagamento */}
              <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Forma de Pagamento
                </h2>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="pix">PIX</option>
                  <option value="credit">Cartão de Crédito</option>
                  <option value="debit">Cartão de Débito</option>
                  <option value="cash">Dinheiro</option>
                </select>
              </div>

              {/* Observações */}
              <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Observações
                </h2>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Alguma observação sobre o pedido?"
                  className={inputClass}
                />
              </div>
            </form>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Resumo do Pedido
              </h2>

              <div className="mb-4 space-y-3">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between text-base"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {item.product.name}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {item.quantity}x {formatPrice(item.product.price)}
                      </p>
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-gray-200 pt-4 dark:border-gray-700">
                <div className="flex justify-between text-base">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>

                {delivery.cost !== null && (
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600 dark:text-gray-400">Frete</span>
                    <span
                      className={`font-medium ${
                        delivery.cost === 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {delivery.cost === 0 ? "GRÁTIS" : formatPrice(delivery.cost)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between pt-2 text-xl font-bold text-gray-900 dark:text-white">
                  <span>Total:</span>
                  <span>{formatPrice(getTotalPrice() + shippingCost)}</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleSubmit}
                  className="mb-3 w-full rounded-xl border-2 border-gray-300 bg-white py-3 text-center font-semibold text-gray-900 transition-all hover:bg-gray-100 hover:shadow-md dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                >
                  Confirmar Pedido
                </button>

                <button
                  onClick={() => router.back()}
                  className="w-full rounded-lg border-2 border-gray-300 bg-white py-3 text-center font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Voltar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
