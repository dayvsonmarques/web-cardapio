import { useUser } from "@/context/UserContext";

export const translations = {
  en: {
    editProfile: "Edit profile",
    accountSettings: "Account settings",
    support: "Support",
    signOut: "Sign out",
    lightMode: "Light mode",
    darkMode: "Dark mode",
    language: "Language",
    portuguese: "Portuguese",
    english: "English",
  },
  pt: {
    editProfile: "Editar perfil",
    accountSettings: "Configurações da conta",
    support: "Suporte",
    signOut: "Sair",
    lightMode: "Modo claro",
    darkMode: "Modo escuro",
    language: "Idioma",
    portuguese: "Português",
    english: "Inglês",
  },
};

export const useTranslations = () => {
  const { language } = useUser();
  
  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key];
  };

  return { t, language };
};