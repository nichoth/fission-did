// import * as utils from "keystore-idb/utils.js"
import { BASE58_DID_PREFIX, magicBytes } from "./util"
import { KeyType } from "./types"
import * as uint8arrays from "uint8arrays"

function strToArrBuf(str, charSize) {
    var view = charSize === 8 ?
        new Uint8Array(str.length) :
        new Uint16Array(str.length);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        view[i] = str.charCodeAt(i);
    }
    return view.buffer;
}

var utils = {
    joinBufs: function joinBufs(fst: ArrayBuffer, snd: ArrayBuffer): ArrayBuffer {
        const view1 = new Uint8Array(fst)
        const view2 = new Uint8Array(snd)
        const joined = new Uint8Array(view1.length + view2.length)
        joined.set(view1)
        joined.set(view2, view1.length)
        return joined.buffer
    },

    base64ToArrBuf: function base64ToArrBuf (base64: string): ArrayBuffer {
        var str = Buffer.from(base64, 'base64').toString('binary')
        return strToArrBuf(str, 8);
    }
}


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
