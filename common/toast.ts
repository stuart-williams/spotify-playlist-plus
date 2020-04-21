import React from "react";
import { IToastProps } from "@blueprintjs/core";

export interface Toast {
  showPending(props: Pick<IToastProps, "icon">): void;
  showSuccess(props: Pick<IToastProps, "message">): void;
  showError(props: Pick<IToastProps, "message">): void;
  clear(): void;
}

const ToastContext = React.createContext<Toast | null>(null);

export const ToastProvider = ToastContext.Provider;
export const ToastConsumer = ToastContext.Consumer;

export const useToast = () => React.useContext(ToastContext);
