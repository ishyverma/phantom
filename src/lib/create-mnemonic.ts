import { generateMnemonic } from "bip39"

export const createMnemonic = () => {
    const mnemonic = generateMnemonic()
    return mnemonic.split(" ")
}