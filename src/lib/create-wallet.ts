import { Keypair } from "@solana/web3.js";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import bs58 from "bs58"
import { HDNodeWallet, Wallet } from "ethers";

export const createWallet = (
  seed: Buffer,
  coin_type: string,
  account: string
) => {
  const coin = coin_type === "SOL" ? "501" : "60";
  const derivationPath = `m/44'/${coin}'/${account}'/0'`;
  if (coin_type === "SOL") {
    const derivedSeed = derivePath(derivationPath, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const publicKey = Keypair.fromSecretKey(secret).publicKey.toBase58()
    const privateKey = bs58.encode(secret)
    
    return {
      publicKey,
      privateKey
    }
  }
  else {
    const hdNode = HDNodeWallet.fromSeed(seed)
    const child = hdNode.derivePath(derivationPath)
    const derivedSeed = derivePath(derivationPath, seed.toString("hex"))

    return {
      publicKey: new Wallet(child.privateKey).address,
      privateKey: Buffer.from(derivedSeed.key).toString("hex")
    }
  }
};
