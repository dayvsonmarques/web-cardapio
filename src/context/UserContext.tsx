"use client";

import type React from "react";
import { createContext, useState, useContext, useEffect } from "react";

export type Language = "en" | "pt";

type UserContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>("en");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("language") as Language | null;

    if (savedLanguage) {
      setLanguageState(savedLanguage);
    }

    setIsInitialized(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (isInitialized) {
      localStorage.setItem("language", lang);
    }
  };

  return (
    <UserContext.Provider value={{
      language,
      setLanguage,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};