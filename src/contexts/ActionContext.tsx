"use client";

import React from "react";

interface ActionContextType {
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  onSearchClick?: () => void;
  onCartClick?: () => void;
  onProfileClick?: () => void;
}

const defaultActions: ActionContextType = {
  onLoginClick: () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("login-clicked"));
    }
  },
  onLogoutClick: () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("logout-clicked"));
    }
  },
  onSearchClick: () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("search-clicked"));
    }
  },
  onCartClick: () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("cart-clicked"));
    }
  },
  onProfileClick: () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("profile-clicked"));
    }
  },
};

const ActionContext = React.createContext<ActionContextType>(defaultActions);

interface ActionProviderProps {
  children: React.ReactNode;
  actions?: Partial<ActionContextType>;
}

export const ActionProvider: React.FC<ActionProviderProps> = ({
  children,
  actions = {},
}) => {
  const mergedActions = { ...defaultActions, ...actions };
  return (
    <ActionContext.Provider value={mergedActions}>
      {children}
    </ActionContext.Provider>
  );
};

export const useAction = () => {
  const context = React.useContext(ActionContext);
  if (!context) {
    throw new Error("useAction must be used within an ActionProvider");
  }
  return context;
};

export default ActionContext;
