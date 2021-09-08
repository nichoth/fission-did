import { KeyType } from "./types"

export const EDWARDS_DID_PREFIX = new Uint8Array([ 0xed, 0x01 ])
export const BLS_DID_PREFIX = new Uint8Array([ 0xea, 0x01 ])
export const RSA_DID_PREFIX = new Uint8Array([ 0x00, 0xf5, 0x02 ])
export const BASE58_DID_PREFIX = "did:key:z"

export function magicBytes(keyType: KeyType): Uint8Array | null {
    switch (keyType) {
        case KeyType.Edwards: return EDWARDS_DID_PREFIX
        case KeyType.RSA: return RSA_DID_PREFIX
        case KeyType.BLS: return BLS_DID_PREFIX
        default: return null
    }
}
