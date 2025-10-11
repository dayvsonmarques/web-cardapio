"use client";"use client";"use client";



import { useState, useEffect } from "react";

import Link from "next/link";

import Image from "next/image";import { useState, useEffect } from "react";import { useState, useEffect } from "react";

import { useCart } from "@/context/CartContext";

import type { Product } from "@/types/product";import Link from "next/link";import Image from "next/image";



interface RelatedProductsCarouselProps {import Image from "next/image";import Link from "next/link";

  products: Product[];

}import { useCart } from "@/context/CartContext";import { Product } from "@/types/catalog";



const RelatedProductsCarousel = ({ products }: RelatedProductsCarouselProps) => {import type { Product } from "@/types/product";import { useCart } from "@/context/CartContext";

  const [currentSlide, setCurrentSlide] = useState(0);

  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const { addItem } = useCart();

interface RelatedProductsCarouselProps {interface RelatedProductsCarouselProps {

  // Initialize quantities

  useEffect(() => {  products: Product[];  products: Product[];

    const initialQuantities: { [key: string]: number } = {};

    products.forEach((product) => {}}

      initialQuantities[product.id] = 1;

    });

    setQuantities(initialQuantities);

  }, [products]);const RelatedProductsCarousel = ({ products }: RelatedProductsCarouselProps) => {const RelatedProductsCarousel = ({ products }: RelatedProductsCarouselProps) => {



  // Auto-slide every 5 seconds  const [currentSlide, setCurrentSlide] = useState(0);  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {

    if (products.length <= 1) return;  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});



    const interval = setInterval(() => {  const { addItem } = useCart();  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

      setCurrentSlide((prev) => (prev + 1) % products.length);

    }, 5000);  const { addItem } = useCart();



    return () => clearInterval(interval);  // Initialize quantities

  }, [products.length]);

  useEffect(() => {  // Auto-slide a cada 5 segundos (aumentado para dar tempo de interagir)

  const handlePrevSlide = () => {

    setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);    const initialQuantities: { [key: string]: number } = {};  useEffect(() => {

  };

    products.forEach((product) => {    if (products.length === 0) return;

  const handleNextSlide = () => {

    setCurrentSlide((prev) => (prev + 1) % products.length);      initialQuantities[product.id] = 1;

  };

    });    const interval = setInterval(() => {

  const handleQuantityChange = (productId: string, delta: number) => {

    setQuantities((prev) => {    setQuantities(initialQuantities);      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);

      const current = prev[productId] || 1;

      const newQuantity = Math.max(1, current + delta);  }, [products]);    }, 5000);

      return { ...prev, [productId]: newQuantity };

    });

  };

  // Auto-slide every 5 seconds    return () => clearInterval(interval);

  const handleAddToCart = (product: Product) => {

    const quantity = quantities[product.id] || 1;  useEffect(() => {  }, [products.length]);

    addItem(product, quantity);

    // Reset quantity to 1 after adding    if (products.length <= 1) return;

    setQuantities((prev) => ({ ...prev, [product.id]: 1 }));

  };  const handleImageError = (productId: string) => {



  const formatPrice = (price: number) => {    const interval = setInterval(() => {    setImageErrors((prev) => ({ ...prev, [productId]: true }));

    return new Intl.NumberFormat("pt-BR", {

      style: "currency",      setCurrentSlide((prev) => (prev + 1) % products.length);  };

      currency: "BRL",

    }).format(price);    }, 5000);

  };

  const handleQuantityChange = (productId: string, value: number) => {

  if (!products || products.length === 0) {

    return null;    return () => clearInterval(interval);    if (value >= 1 && value <= 99) {

  };

  }, [products.length]);      setQuantities((prev) => ({ ...prev, [productId]: value }));

  return (

    <div className="relative">    }

      <div className="overflow-hidden">

        <div  const handlePrevSlide = () => {  };

          className="flex transition-transform duration-500 ease-in-out"

          style={{ transform: `translateX(-${currentSlide * 100}%)` }}    setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);

        >

          {products.map((product) => (  };  const handleAddToCart = (product: Product, e: React.MouseEvent) => {

            <div

              key={product.id}    e.preventDefault();

              className="min-w-full"

              data-testid={`carousel-slide-${product.id}`}  const handleNextSlide = () => {    if (product.isAvailable) {

            >

              <div className="rounded-lg border border-stroke bg-white p-4 shadow-sm dark:border-strokedark dark:bg-boxdark">    setCurrentSlide((prev) => (prev + 1) % products.length);      const quantity = quantities[product.id] || 1;

                <Link

                  href={`/cardapio/produto/${product.id}`}  };      addItem(product, quantity);

                  className="block"

                  onClick={(e) => {      setQuantities((prev) => ({ ...prev, [product.id]: 1 }));

                    if (!product.isAvailable) {

                      e.preventDefault();  const handleQuantityChange = (productId: string, delta: number) => {    }

                    }

                  }}    setQuantities((prev) => {  };

                >

                  <div className="relative mb-4 aspect-square overflow-hidden rounded-lg">      const current = prev[productId] || 1;

                    <Image

                      src={product.image}      const newQuantity = Math.max(1, current + delta);  const getQuantity = (productId: string) => quantities[productId] || 1;

                      alt={product.name}

                      fill      return { ...prev, [productId]: newQuantity };

                      className="object-cover"

                      onError={(e) => {    });  const getVisibleProducts = () => {

                        const img = e.target as HTMLImageElement;

                        img.src = "/images/product/product-placeholder.png";  };    if (products.length === 0) return [];

                      }}

                    />    

                    {!product.isAvailable && (

                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">  const handleAddToCart = (product: Product) => {    const visible = [];

                        <span className="rounded-lg bg-danger px-3 py-1 text-sm font-semibold text-white">

                          Indisponível    const quantity = quantities[product.id] || 1;    for (let i = 0; i < 4; i++) {

                        </span>

                      </div>    addItem(product, quantity);      const index = (currentIndex + i) % products.length;

                    )}

                  </div>    // Reset quantity to 1 after adding      visible.push(products[index]);

                </Link>

    setQuantities((prev) => ({ ...prev, [product.id]: 1 }));    }

                <Link

                  href={`/cardapio/produto/${product.id}`}  };    return visible;

                  className="block hover:text-primary"

                >  };

                  <h3 className="mb-2 text-lg font-semibold text-dark dark:text-white">

                    {product.name}  const formatPrice = (price: number) => {

                  </h3>

                </Link>    return new Intl.NumberFormat("pt-BR", {  const handlePrev = () => {



                <p className="mb-4 text-xl font-bold text-primary">      style: "currency",    setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);

                  {formatPrice(product.price)}

                </p>      currency: "BRL",  };



                {product.isAvailable && (    }).format(price);

                  <div className="space-y-3">

                    <div className="flex items-center justify-center gap-3">  };  const handleNext = () => {

                      <button

                        type="button"    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);

                        onClick={() => handleQuantityChange(product.id, -1)}

                        disabled={quantities[product.id] <= 1}  if (!products || products.length === 0) {  };

                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-stroke bg-gray-2 text-lg font-semibold text-dark hover:bg-gray-3 disabled:opacity-50 dark:border-strokedark dark:bg-meta-4 dark:text-white"

                        aria-label="Diminuir quantidade"    return null;

                      >

                        -  }  const visibleProducts = getVisibleProducts();

                      </button>

                      <span

                        className="w-12 text-center text-lg font-semibold text-dark dark:text-white"

                        data-testid={`quantity-${product.id}`}  return (  if (products.length === 0) {

                      >

                        {quantities[product.id] || 1}    <div className="relative">    return null;

                      </span>

                      <button      <div className="overflow-hidden">  }

                        type="button"

                        onClick={() => handleQuantityChange(product.id, 1)}        <div

                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-stroke bg-gray-2 text-lg font-semibold text-dark hover:bg-gray-3 dark:border-strokedark dark:bg-meta-4 dark:text-white"

                        aria-label="Aumentar quantidade"          className="flex transition-transform duration-500 ease-in-out"  return (

                      >

                        +          style={{ transform: `translateX(-${currentSlide * 100}%)` }}    <div className="relative">

                      </button>

                    </div>        >      {/* Setas de Navegação */}



                    <button          {products.map((product) => (      <button

                      type="button"

                      onClick={(e) => {            <div        onClick={handlePrev}

                        e.preventDefault();

                        handleAddToCart(product);              key={product.id}        className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:bg-gray-2 dark:bg-gray-dark dark:hover:bg-gray-800"

                      }}

                      className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-all hover:bg-primary/90"              className="min-w-full"        aria-label="Produto anterior"

                      data-testid={`add-to-cart-${product.id}`}

                    >              data-testid={`carousel-slide-${product.id}`}      >

                      Adicionar

                    </button>            >        <svg

                  </div>

                )}              <div className="rounded-lg border border-stroke bg-white p-4 shadow-sm dark:border-strokedark dark:bg-boxdark">          className="h-6 w-6 text-dark dark:text-white"

              </div>

            </div>                <Link          fill="none"

          ))}

        </div>                  href={`/cardapio/produto/${product.id}`}          viewBox="0 0 24 24"

      </div>

                  className="block"          stroke="currentColor"

      {/* Navigation Arrows */}

      {products.length > 1 && (                  onClick={(e) => {        >

        <>

          <button                    if (!product.isAvailable) {          <path

            type="button"

            onClick={handlePrevSlide}                      e.preventDefault();            strokeLinecap="round"

            className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md transition-all hover:bg-white dark:bg-boxdark/90 dark:hover:bg-boxdark"

            aria-label="Slide anterior"                    }            strokeLinejoin="round"

          >

            <svg                  }}            strokeWidth={2}

              className="h-6 w-6 text-dark dark:text-white"

              fill="none"                >            d="M15 19l-7-7 7-7"

              stroke="currentColor"

              viewBox="0 0 24 24"                  <div className="relative mb-4 aspect-square overflow-hidden rounded-lg">          />

            >

              <path                    <Image        </svg>

                strokeLinecap="round"

                strokeLinejoin="round"                      src={product.image}      </button>

                strokeWidth={2}

                d="M15 19l-7-7 7-7"                      alt={product.name}

              />

            </svg>                      fill      <button

          </button>

                      className="object-cover"        onClick={handleNext}

          <button

            type="button"                      onError={(e) => {        className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:bg-gray-2 dark:bg-gray-dark dark:hover:bg-gray-800"

            onClick={handleNextSlide}

            className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md transition-all hover:bg-white dark:bg-boxdark/90 dark:hover:bg-boxdark"                        const img = e.target as HTMLImageElement;        aria-label="Próximo produto"

            aria-label="Próximo slide"

          >                        img.src = "/images/product/product-placeholder.png";      >

            <svg

              className="h-6 w-6 text-dark dark:text-white"                      }}        <svg

              fill="none"

              stroke="currentColor"                    />          className="h-6 w-6 text-dark dark:text-white"

              viewBox="0 0 24 24"

            >                    {!product.isAvailable && (          fill="none"

              <path

                strokeLinecap="round"                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">          viewBox="0 0 24 24"

                strokeLinejoin="round"

                strokeWidth={2}                        <span className="rounded-lg bg-danger px-3 py-1 text-sm font-semibold text-white">          stroke="currentColor"

                d="M9 5l7 7-7 7"

              />                          Indisponível        >

            </svg>

          </button>                        </span>          <path

        </>

      )}                      </div>            strokeLinecap="round"



      {/* Dot Indicators */}                    )}            strokeLinejoin="round"

      {products.length > 1 && (

        <div className="mt-4 flex justify-center gap-2">                  </div>            strokeWidth={2}

          {products.map((_, index) => (

            <button                </Link>            d="M9 5l7 7-7 7"

              key={index}

              type="button"          />

              onClick={() => setCurrentSlide(index)}

              className={`h-2 w-2 rounded-full transition-all ${                <Link        </svg>

                index === currentSlide

                  ? "w-8 bg-primary"                  href={`/cardapio/produto/${product.id}`}      </button>

                  : "bg-stroke dark:bg-strokedark"

              }`}                  className="block hover:text-primary"

              aria-label={`Ir para slide ${index + 1}`}

              data-testid={`indicator-${index}`}                >      <div className="overflow-hidden px-2">

            />

          ))}                  <h3 className="mb-2 text-lg font-semibold text-dark dark:text-white">        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 transition-all duration-500">

        </div>

      )}                    {product.name}          {visibleProducts.map((product) => (

    </div>

  );                  </h3>            <div

};

                </Link>              key={product.id}

export default RelatedProductsCarousel;

              className="group relative overflow-hidden rounded-lg border border-stroke bg-white shadow-sm transition-all hover:shadow-md dark:border-stroke-dark dark:bg-gray-dark"

                <p className="mb-4 text-xl font-bold text-primary">            >

                  {formatPrice(product.price)}              {/* Badge de Disponibilidade */}

                </p>              {!product.isAvailable && (

                <div className="absolute right-3 top-3 z-10 rounded-full bg-red px-3 py-1 text-sm font-medium text-white">

                {product.isAvailable && (                  Indisponível

                  <div className="space-y-3">                </div>

                    <div className="flex items-center justify-center gap-3">              )}

                      <button

                        type="button"              {/* Imagem - Clicável */}

                        onClick={() => handleQuantityChange(product.id, -1)}              <Link href={`/cardapio/produto/${product.id}`}>

                        disabled={quantities[product.id] <= 1}                <div className="relative h-48 w-full overflow-hidden bg-gray-2 dark:bg-gray-800 cursor-pointer">

                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-stroke bg-gray-2 text-lg font-semibold text-dark hover:bg-gray-3 disabled:opacity-50 dark:border-strokedark dark:bg-meta-4 dark:text-white"                  {!imageErrors[product.id] ? (

                        aria-label="Diminuir quantidade"                    <Image

                      >                      src={product.image}

                        -                      alt={product.name}

                      </button>                      fill

                      <span                      className="object-cover transition-transform duration-300 group-hover:scale-105"

                        className="w-12 text-center text-lg font-semibold text-dark dark:text-white"                      onError={() => handleImageError(product.id)}

                        data-testid={`quantity-${product.id}`}                    />

                      >                  ) : (

                        {quantities[product.id] || 1}                    <div className="flex h-full w-full items-center justify-center bg-gray-3 dark:bg-gray-800">

                      </span>                      <div className="text-center">

                      <button                        <svg

                        type="button"                          className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600"

                        onClick={() => handleQuantityChange(product.id, 1)}                          fill="none"

                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-stroke bg-gray-2 text-lg font-semibold text-dark hover:bg-gray-3 dark:border-strokedark dark:bg-meta-4 dark:text-white"                          viewBox="0 0 24 24"

                        aria-label="Aumentar quantidade"                          stroke="currentColor"

                      >                        >

                        +                          <path

                      </button>                            strokeLinecap="round"

                    </div>                            strokeLinejoin="round"

                            strokeWidth={2}

                    <button                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"

                      type="button"                          />

                      onClick={(e) => {                        </svg>

                        e.preventDefault();                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-600">

                        handleAddToCart(product);                          Imagem não disponível

                      }}                        </p>

                      className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-all hover:bg-primary/90"                      </div>

                      data-testid={`add-to-cart-${product.id}`}                    </div>

                    >                  )}

                      Adicionar                </div>

                    </button>              </Link>

                  </div>

                )}              {/* Conteúdo */}

              </div>              <div className="p-4">

            </div>                {/* Nome e Preço - Clicável */}

          ))}                <Link href={`/cardapio/produto/${product.id}`}>

        </div>                  <div className="mb-3 flex items-start justify-between gap-2 cursor-pointer">

      </div>                    <h3 className="text-lg font-semibold text-dark dark:text-white line-clamp-2 hover:text-primary transition-colors">

                      {product.name}

      {/* Navigation Arrows */}                    </h3>

      {products.length > 1 && (                    <span className="whitespace-nowrap text-lg font-bold text-primary">

        <>                      R$ {product.price.toFixed(2).replace(".", ",")}

          <button                    </span>

            type="button"                  </div>

            onClick={handlePrevSlide}                </Link>

            className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md transition-all hover:bg-white dark:bg-boxdark/90 dark:hover:bg-boxdark"

            aria-label="Slide anterior"                {/* Quantidade e Adicionar ao Carrinho */}

          >                {product.isAvailable && (

            <svg                  <div className="space-y-2">

              className="h-6 w-6 text-dark dark:text-white"                    <div className="flex items-center justify-center gap-2">

              fill="none"                      <button

              stroke="currentColor"                        onClick={(e) => {

              viewBox="0 0 24 24"                          e.preventDefault();

            >                          handleQuantityChange(product.id, Math.max(1, getQuantity(product.id) - 1));

              <path                        }}

                strokeLinecap="round"                        className="flex h-8 w-8 items-center justify-center rounded border border-stroke text-body hover:bg-gray-2 dark:border-stroke-dark dark:text-gray-5 dark:hover:bg-gray-800"

                strokeLinejoin="round"                      >

                strokeWidth={2}                        -

                d="M15 19l-7-7 7-7"                      </button>

              />                      <span className="w-12 text-center text-sm font-medium text-dark dark:text-white">

            </svg>                        {getQuantity(product.id)}

          </button>                      </span>

                      <button

          <button                        onClick={(e) => {

            type="button"                          e.preventDefault();

            onClick={handleNextSlide}                          handleQuantityChange(product.id, Math.min(99, getQuantity(product.id) + 1));

            className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md transition-all hover:bg-white dark:bg-boxdark/90 dark:hover:bg-boxdark"                        }}

            aria-label="Próximo slide"                        className="flex h-8 w-8 items-center justify-center rounded border border-stroke text-body hover:bg-gray-2 dark:border-stroke-dark dark:text-gray-5 dark:hover:bg-gray-800"

          >                      >

            <svg                        +

              className="h-6 w-6 text-dark dark:text-white"                      </button>

              fill="none"                    </div>

              stroke="currentColor"                    <button

              viewBox="0 0 24 24"                      onClick={(e) => handleAddToCart(product, e)}

            >                      className="w-full rounded-lg border-2 border-primary bg-primary px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-primary/90 hover:shadow-md"

              <path                    >

                strokeLinecap="round"                      Adicionar

                strokeLinejoin="round"                    </button>

                strokeWidth={2}                  </div>

                d="M9 5l7 7-7 7"                )}

              />              </div>

            </svg>            </div>

          </button>          ))}

        </>        </div>

      )}      </div>



      {/* Dot Indicators */}      {/* Indicadores */}

      {products.length > 1 && (      <div className="mt-6 flex justify-center gap-2">

        <div className="mt-4 flex justify-center gap-2">        {products.map((_, index) => (

          {products.map((_, index) => (          <button

            <button            key={index}

              key={index}            onClick={() => setCurrentIndex(index)}

              type="button"            className={`h-2 rounded-full transition-all ${

              onClick={() => setCurrentSlide(index)}              index === currentIndex

              className={`h-2 w-2 rounded-full transition-all ${                ? "w-8 bg-primary"

                index === currentSlide                : "w-2 bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-500"

                  ? "w-8 bg-primary"            }`}

                  : "bg-stroke dark:bg-strokedark"            aria-label={`Ir para slide ${index + 1}`}

              }`}          />

              aria-label={`Ir para slide ${index + 1}`}        ))}

              data-testid={`indicator-${index}`}      </div>

            />    </div>

          ))}  );

        </div>};

      )}

    </div>export default RelatedProductsCarousel;

  );
};

export default RelatedProductsCarousel;
