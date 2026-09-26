import { freighterAdapter } from "./freighterAdapter";
import { albedoAdapter } from "./albedoAdapter";
import { xBullAdapter } from "./xbullAdapter";
import type { WalletAdapter } from "./types";

export type { WalletAdapter, WalletCapability } from "./types";
export { WalletAdapterError } from "./types";
export { freighterAdapter } from "./freighterAdapter";
export { albedoAdapter } from "./albedoAdapter";
export { xBullAdapter } from "./xbullAdapter";

export type WalletOption = {
  id: string;
  name: string;
  adapter: WalletAdapter;
  installUrl: string;
};

export const walletOptions: readonly WalletOption[] = [
  { id: "freighter", name: "Freighter", adapter: freighterAdapter, installUrl: "https://www.freighter.app/" },
  { id: "albedo", name: "Albedo", adapter: albedoAdapter, installUrl: "https://albedo.link/" },
  { id: "xbull", name: "xBull", adapter: xBullAdapter, installUrl: "https://xbullwallet.com/" },
];

const STORAGE_KEY = "vortex-wallet-adapter";
let activeWalletId = "freighter";
if (typeof window !== "undefined") {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && walletOptions.some((wallet) => wallet.id === stored)) activeWalletId = stored;
}

export function getActiveWalletId(): string { return activeWalletId; }
export function setActiveWallet(id: string): WalletAdapter {
  const option = walletOptions.find((wallet) => wallet.id === id) ?? walletOptions[0];
  activeWalletId = option.id;
  if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, activeWalletId);
  return option.adapter;
}
export function getActiveWalletAdapter(): WalletAdapter {
  return walletOptions.find((wallet) => wallet.id === activeWalletId)?.adapter ?? freighterAdapter;
}

/** Stable facade retained for existing hooks; calls the selected adapter. */
export const walletAdapter: WalletAdapter = {
  isConnected: () => getActiveWalletAdapter().isConnected(),
  isAllowed: () => getActiveWalletAdapter().isAllowed(),
  connect: () => getActiveWalletAdapter().connect(),
  disconnect: () => getActiveWalletAdapter().disconnect(),
  getPublicKey: () => getActiveWalletAdapter().getPublicKey(),
  getNetwork: () => getActiveWalletAdapter().getNetwork(),
  signTransaction: (xdr, opts) => getActiveWalletAdapter().signTransaction(xdr, opts),
};
