"use client";
import React, { createContext, useState, ReactNode, useContext, useEffect } from "react";
import { Contexts } from "../entities/contexts.entitie";

export const ContextApp = createContext<Contexts.AppProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<Record<string, string>>({
    Nome: "",
    Email: "",
    WhatsApp: "",
    "Estado Civil": "",
    CPF: "",
    "Valor do imóvel": "",
    "Quanto você precisa?": "",
    "Prazo (em meses): {value}": "12",
    "Em quanto tempo pretende realizar a operação?": "",
    "CEP do imóvel em garantia": "",
    Profissão: "",
    "Renda bruta mensal": "",
    "Possui automóvel?": "",
    "Qual o tipo de Imóvel?": "",
    "Imóvel dentro de condomínio?": "",
    "Possui matrícula do bem?": "",
    "Imóvel próprio, de um familiar ou de terceiros?": "",
    "O imóvel está quitado?": "",
  });

  const contextValue: Contexts.AppProps = {
    formData,
    setFormData,
  };

  return <ContextApp.Provider value={contextValue}>{children}</ContextApp.Provider>;
};

export const useApp = () => {
  const context = useContext(ContextApp);
  if (!context) {
    throw new Error("useApp must be used within a AppProvider");
  }
  return context;
};
