"use client";

import { useState } from "react";
import { useWalletStore } from "@/store/wallet";
import { WalletModal } from "@/components/WalletModal";

const truncate = (value: string) => value.length > 12 ? `${value.slice(0, 6)}…${value.slice(-4)}` : value;

export function ConnectWalletButton({ compact = false }: { compact?: boolean }) {
  const [modalOpen, setModalOpen] = useState(false);
  const { address, isConnected, isConnecting, networkMismatch, connect, disconnect } = useWalletStore();
  const classes = compact ? "rounded-lg border px-3 py-1.5 text-xs" : "rounded-lg border px-3 py-1.5 text-sm";
  return <>
    {isConnected && address ? <div className="flex items-center gap-2"><button type="button" onClick={disconnect} className={`${classes} border-vx-sage/40`} aria-label={`Disconnect wallet ${truncate(address)}`}>{truncate(address)}</button>{networkMismatch && <span role="alert" className="text-xs text-yellow-400">Wrong network</span>}</div> : <button type="button" onClick={() => setModalOpen(true)} disabled={isConnecting} className={`${classes} border-vx-border`}>{isConnecting ? "Connecting…" : "Connect wallet"}</button>}
    <WalletModal open={modalOpen} onClose={() => setModalOpen(false)} />
    {!isConnected && !isConnecting && <button type="button" className="sr-only" onClick={connect}>Connect selected wallet</button>}
  </>;
}
