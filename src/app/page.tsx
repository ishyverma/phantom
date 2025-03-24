"use client";

import MnemonicCard from "@/components/main/mnemonic-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { createMnemonic } from "@/lib/create-mnemonic";
import { createSeed } from "@/lib/create-seed";
import { createWallet } from "@/lib/create-wallet";
import { Eye, EyeOff, Trash } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";

type onBordingType = "mnemonic" | "walletType" | "wallets";
type walletProps = "ETH" | "SOL";

interface keyType {
  id: number;
  publicKey: string;
  privateKey: string;
  canSee: boolean;
}

export default function Home() {
  const [currentPath, setCurrentPath] = useState<onBordingType | null>();
  const [_, setWalletType] = useState<walletProps | "">("");
  const [mnemonics, setMnemonics] = useState<string[]>([]);
  const [isAcceptedTerm, setIsAcceptedTerms] = useState(false);
  const [keys, setKeys] = useState<keyType[] | []>([]);
  const count = useRef<number>(1)
  const [blockchain, setBlockchain] = useState("");

  useEffect(() => {
    const number = localStorage.getItem("accountNumber")
    if (!number) {
      localStorage.setItem("accountNumber", "1")
      count.current = 1
    } else {
      count.current = Number(number)
    }
  })

  useEffect(() => {
    const mnemonic = localStorage.getItem("mnemonic");
    const mnemo = createMnemonic();
    if (!mnemonic) {
      localStorage.setItem("mnemonic", mnemo.join(" "));
      setMnemonics(mnemo);
    } else {
      setMnemonics(mnemonic.split(" "));
    }
  }, []);

  const createMoreWallet = (blockchain: string, mnemonic: string) => {
    const seed = createSeed(mnemonic);
    count.current += 1;
    localStorage.setItem("accountNumber", String(count.current));
    const { publicKey: pubKey, privateKey: privKey } = createWallet(
      seed,
      blockchain,
      count.current.toString()
    );
    localStorage.setItem(
      "keys",
      JSON.stringify([
        ...keys,
        {
          id: count.current,
          publicKey: pubKey,
          privateKey: privKey,
          canSee: false,
        },
      ])
    );
    setKeys((prev) => [
      ...prev,
      {
        id: count.current,
        publicKey: pubKey,
        privateKey: privKey,
        canSee: false,
      },
    ]);
  };

  useEffect(() => {
    const path = localStorage.getItem("currentPath") as onBordingType;
    if (!path) {
      setCurrentPath("walletType");
      localStorage.setItem("currentPath", "walletType");
    }
    if (path) setCurrentPath(path);
  }, []);

  useEffect(() => {
    const keys = localStorage.getItem("keys");
    const blockchain = localStorage.getItem("blockchain");
    if (keys && blockchain) {
      setKeys(JSON.parse(keys));
      setBlockchain(blockchain === "SOL" ? "Solana" : "Etherium");
    }
  }, []);

  return (
    <div className="font-bold tracking-tight">
      {currentPath === "mnemonic" && (
        <div>
          <div className="text-5xl">Secret Recovery Phase</div>
          <div className="text-xl mt-2 text-zinc-400">
            Save this word in a safe place.
          </div>
          <MnemonicCard mnemonics={mnemonics} />
          <div className="flex gap-2 items-center mt-6">
            <Checkbox
              id="terms"
              onClick={() => setIsAcceptedTerms((prev) => !prev)}
            />
            <label
              htmlFor="terms"
              className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I saved my secret recovery phase
            </label>
          </div>
          <Button
            onClick={() => {
              localStorage.setItem("currentPath", "wallets");
              setCurrentPath("wallets");
              const mnemonic = localStorage.getItem("mnemonic") as string;
              const seed = createSeed(mnemonic);
              const walletType = localStorage.getItem("blockchain") as string;
              const { publicKey, privateKey } = createWallet(
                seed,
                walletType,
                count.current.toString()
              );
              localStorage.setItem(
                `keys`,
                JSON.stringify([
                  {
                    id: 1,
                    publicKey,
                    privateKey,
                    canSee: false,
                  },
                ])
              );
              setKeys([
                {
                  id: 1,
                  publicKey,
                  privateKey,
                  canSee: false,
                },
              ]);
            }}
            className="mt-4"
            disabled={isAcceptedTerm === false}
          >
            Next
          </Button>
        </div>
      )}

      {currentPath === "walletType" && (
        <>
          <div className="text-5xl">Choose a Blockchain to get started</div>
          <div className="flex items-center gap-2 mt-4">
            <Button
              onClick={() => {
                localStorage.setItem("currentPath", "mnemonic");
                localStorage.setItem("blockchain", "SOL");
                setBlockchain("Solana");
                setCurrentPath("mnemonic");
                setWalletType("SOL");
              }}
            >
              Solana
            </Button>
            <Button
              onClick={() => {
                localStorage.setItem("currentPath", "mnemonic");
                localStorage.setItem("blockchain", "ETH");
                setBlockchain("Etherium");
                setCurrentPath("mnemonic");
                setWalletType("ETH");
              }}
            >
              Ethereum
            </Button>
          </div>
        </>
      )}

      {currentPath === "wallets" && (
        <div>
          <div className="flex items-center justify-between">
            <div className="text-5xl tracking-tight font-sans">
              {blockchain} Wallet
            </div>
            <div className="space-x-2">
              <Button
                onClick={() => {
                  {
                    blockchain === "Solana"
                      ? createMoreWallet("SOL", mnemonics.join(" "))
                      : createMoreWallet("ETH", mnemonics.join(" "));
                  }
                }}
              >
                Add Wallet
              </Button>
              <Button variant="destructive">Clear Wallets</Button>
            </div>
          </div>
          <div className="mt-4 border rounded">
            {keys.map((key) => (
              <div key={key.id}>
                <div className="flex justify-between items-center py-5 px-8">
                  <div className="text-3xl tracking-tight font-sans">
                    Wallet {key.id}
                  </div>
                  <div className="text-destructive hover:bg-[#262626] py-3 px-4 rounded cursor-pointer transition-all">
                    <Trash className="w-4 h-4" />
                  </div>
                </div>
                <div className="rounded-t-xl bg-[#181818] px-8 py-3">
                  <div className="text-xl tracking-tight">Public Key</div>
                  <div
                    onClick={() => {
                      navigator.clipboard.writeText(key.publicKey);
                      toast.success("Copied to clipboard");
                    }}
                    className="text-[#CDCDCD] font-medium mt-2 cursor-pointer hover:text-white transition-all"
                  >
                    {key.publicKey}
                  </div>
                  <div className="text-xl tracking-tight mt-8">Private Key</div>
                  <div className="flex items-center justify-between">
                    <div
                      onClick={() => {
                        navigator.clipboard.writeText(key.privateKey);
                        toast.success("Copied to clipboard");
                      }}
                      className="text-[#CDCDCD] font-medium mt-2 cursor-pointer hover:text-white transition-all line-clamp-1"
                    >
                      {key.canSee
                        ? key.privateKey
                        : " • ".repeat(key.privateKey.length)}
                    </div>
                    <div
                      onClick={() => {
                        setKeys((prev) =>
                          prev
                            .filter((k) => k.id === key.id)
                            .map((k) => ({
                              ...k,
                              canSee: !k.canSee,
                            }))
                        );
                      }}
                      className="hover:bg-[#262626] py-3 px-4 rounded cursor-pointer transition-all"
                    >
                      {key.canSee ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
