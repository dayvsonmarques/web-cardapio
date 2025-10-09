"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import CardapioHeader from "@/components/cardapio/CardapioHeader";

type TabType = "dados" | "enderecos" | "pedidos";

interface Order {
  id: string;
  date: string;
  total: number;
  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled";
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

const AreaClientePage = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout, updateUser, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("dados");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [addressForm, setAddressForm] = useState({
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
    isDefault: false,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Aguarda um momento para carregar o estado de autenticação
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.push("/cardapio/login?redirect=/cardapio/area-cliente");
      } else {
        setIsLoading(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name,
        email: user.email,
        phone: user.phone,
      });

      // Carregar pedidos do localStorage
      const userOrders = localStorage.getItem(`orders_${user.id}`);
      if (userOrders) {
        setOrders(JSON.parse(userOrders));
      }
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push("/cardapio");
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(profileForm);
    setIsEditingProfile(false);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddressId) {
      updateAddress(editingAddressId, addressForm);
      setEditingAddressId(null);
    } else {
      addAddress(addressForm);
    }
    setIsAddingAddress(false);
    setAddressForm({
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",
      isDefault: false,
    });
  };

  const handleEditAddress = (id: string) => {
    const address = user?.addresses.find((addr) => addr.id === id);
    if (address) {
      setAddressForm({
        street: address.street,
        number: address.number,
        complement: address.complement || "",
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        isDefault: address.isDefault,
      });
      setEditingAddressId(id);
      setIsAddingAddress(true);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusText = (status: Order["status"]) => {
    const statusMap = {
      pending: "Pendente",
      preparing: "Em Preparo",
      ready: "Pronto",
      delivered: "Entregue",
      cancelled: "Cancelado",
    };
    return statusMap[status];
  };

  const getStatusColor = (status: Order["status"]) => {
    const colorMap = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      preparing: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      ready: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      delivered: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    };
    return colorMap[status];
  };

  // Mostra loading enquanto verifica autenticação
  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <CardapioHeader />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CardapioHeader />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Área do Cliente
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Bem-vindo, {user.name}!
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Sair
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("dados")}
              className={`border-b-2 pb-4 text-sm font-medium transition-colors ${
                activeTab === "dados"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Meus Dados
            </button>
            <button
              onClick={() => setActiveTab("enderecos")}
              className={`border-b-2 pb-4 text-sm font-medium transition-colors ${
                activeTab === "enderecos"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Endereços
            </button>
            <button
              onClick={() => setActiveTab("pedidos")}
              className={`border-b-2 pb-4 text-sm font-medium transition-colors ${
                activeTab === "pedidos"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Meus Pedidos
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          {/* Meus Dados */}
          {activeTab === "dados" && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Dados Pessoais
                </h2>
                {!isEditingProfile && (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-primary/90"
                  >
                    Editar
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nome completo
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, name: e.target.value })
                      }
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, email: e.target.value })
                      }
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, phone: e.target.value })
                      }
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="rounded-xl border-2 border-primary bg-primary px-6 py-2 font-semibold text-black transition-all hover:bg-primary/90 hover:shadow-md"
                    >
                      Salvar
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="rounded-lg border-2 border-gray-300 bg-white px-6 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Nome</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">E-mail</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {user.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Telefone</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {user.phone}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Endereços */}
          {activeTab === "enderecos" && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Meus Endereços
                </h2>
                {!isAddingAddress && (
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-primary/90"
                  >
                    Adicionar Endereço
                  </button>
                )}
              </div>

              {isAddingAddress ? (
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        CEP
                      </label>
                      <input
                        type="text"
                        value={addressForm.zipCode}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, zipCode: e.target.value })
                        }
                        required
                        placeholder="00000-000"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Rua
                      </label>
                      <input
                        type="text"
                        value={addressForm.street}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, street: e.target.value })
                        }
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Número
                      </label>
                      <input
                        type="text"
                        value={addressForm.number}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, number: e.target.value })
                        }
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Complemento
                    </label>
                    <input
                      type="text"
                      value={addressForm.complement}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, complement: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Bairro
                      </label>
                      <input
                        type="text"
                        value={addressForm.neighborhood}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            neighborhood: e.target.value,
                          })
                        }
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Cidade
                      </label>
                      <input
                        type="text"
                        value={addressForm.city}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, city: e.target.value })
                        }
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Estado
                      </label>
                      <input
                        type="text"
                        value={addressForm.state}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, state: e.target.value })
                        }
                        required
                        maxLength={2}
                        placeholder="UF"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={addressForm.isDefault}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          isDefault: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label
                      htmlFor="isDefault"
                      className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      Definir como endereço padrão
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="rounded-xl border-2 border-primary bg-primary px-6 py-2 font-semibold text-black transition-all hover:bg-primary/90 hover:shadow-md"
                    >
                      {editingAddressId ? "Salvar" : "Adicionar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingAddress(false);
                        setEditingAddressId(null);
                        setAddressForm({
                          street: "",
                          number: "",
                          complement: "",
                          neighborhood: "",
                          city: "",
                          state: "",
                          zipCode: "",
                          isDefault: false,
                        });
                      }}
                      className="rounded-lg border-2 border-gray-300 bg-white px-6 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  {user.addresses.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400">
                      Nenhum endereço cadastrado
                    </p>
                  ) : (
                    user.addresses.map((address) => (
                      <div
                        key={address.id}
                        className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {address.isDefault && (
                              <span className="mb-2 inline-block rounded bg-primary px-2 py-1 text-xs font-medium text-black">
                                Padrão
                              </span>
                            )}
                            <p className="font-medium text-gray-900 dark:text-white">
                              {address.street}, {address.number}
                            </p>
                            {address.complement && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {address.complement}
                              </p>
                            )}
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {address.neighborhood}, {address.city} - {address.state}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              CEP: {address.zipCode}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {!address.isDefault && (
                              <button
                                onClick={() => setDefaultAddress(address.id)}
                                className="text-sm text-primary hover:underline"
                              >
                                Tornar padrão
                              </button>
                            )}
                            <button
                              onClick={() => handleEditAddress(address.id)}
                              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => deleteAddress(address.id)}
                              className="text-sm text-red-600 hover:text-red-800"
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Meus Pedidos */}
          {activeTab === "pedidos" && (
            <div>
              <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                Meus Pedidos
              </h2>

              {orders.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Você ainda não fez nenhum pedido
                </p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Pedido #{order.id}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(order.date)}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(order.status)}`}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </div>

                      <div className="mb-3 space-y-2">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-700 dark:text-gray-300">
                              {item.quantity}x {item.name}
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
                        <span className="font-medium text-gray-900 dark:text-white">
                          Total
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AreaClientePage;
