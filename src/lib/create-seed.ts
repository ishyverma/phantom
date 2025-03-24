import { mnemonicToSeedSync } from "bip39"

export const createSeed = (mnemonic: string) => {
    const seed = mnemonicToSeedSync(mnemonic)
    return seed
}
