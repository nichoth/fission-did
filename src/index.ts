import * as utils from "keystore-idb/utils.js"
import { BASE58_DID_PREFIX, magicBytes } from "./util"
import { KeyType } from "./types"
import * as uint8arrays from "uint8arrays"

export function publicKeyToDid(publicKey: string, type: KeyType): string {
    const pubKeyBuf = utils.base64ToArrBuf(publicKey)

    // Prefix public-write key
    const prefix = magicBytes(type)
    if (prefix === null) {
        throw new Error(`Key type '${type}' not supported`)
    }

    const prefixedBuf = utils.joinBufs(prefix, pubKeyBuf)

    // Encode prefixed
    return BASE58_DID_PREFIX + uint8arrays.toString(
        new Uint8Array(prefixedBuf), "base58btc")
}
