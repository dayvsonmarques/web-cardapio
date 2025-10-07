import Link from "next/link";

const CardapioFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Informações */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
              Sobre Nós
            </h3>
            <p className="text-base text-body dark:text-gray-5">
              Cardápio digital moderno e intuitivo para seu restaurante.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
              Links Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/cardapio"
                  className="text-base text-body transition-colors hover:text-primary dark:text-gray-5 dark:hover:text-primary"
                >
                  Cardápio
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/signin"
                  className="text-base text-body transition-colors hover:text-primary dark:text-gray-5 dark:hover:text-primary"
                >
                  Área do Cliente
                </Link>
              </li>
              <li>
                <Link
                  href="/#contato"
                  className="text-base text-body transition-colors hover:text-primary dark:text-gray-5 dark:hover:text-primary"
                >
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
              Contato
            </h3>
            <ul className="space-y-2 text-base text-body dark:text-gray-5">
              <li>WhatsApp: (11) 99999-9999</li>
              <li>Email: contato@cardapio.com</li>
              <li>Seg - Sáb: 11:00 - 23:00</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-stroke pt-8 text-center dark:border-stroke-dark">
          <p className="text-base text-body dark:text-gray-5">
            &copy; {currentYear} Cardápio Digital. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default CardapioFooter;
