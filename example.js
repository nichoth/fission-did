import { render } from 'preact'
import { useState } from 'preact/hooks'
import { html } from 'htm/preact'
var xtend = require('xtend')
const wn = window.webnative
// import * as wn from 'webnative'

// const UCANS_STORAGE_KEY = 'webnative.auth_ucans'

console.log('wn', wn)

var subtle = crypto.subtle

function Demonstration () {
    var [state, setState] = useState({
        alice: null,
        me: null,
        aliceMsgs: []
        // bob: null
    })

    if (!state.alice) {
        subtle.generateKey({
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: 2048,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: "SHA-256"
        }, false, ["sign", "verify"])
            .then(async alice => {
                const alicePK = await subtle.exportKey("jwk", alice.publicKey)
                // console.log('alice pk', alicePK.n)
                setState(xtend(state, { alice: alice, alicePK: alicePK }))
            })

        return null
    }

    if (!state.me) {
        wn.did.ucan().then(did => {
            setState(xtend(state, { me: did }))
        })

        return null
    }

    // if (!state.bob) {
    //     subtle.generateKey({
    //         name: "RSASSA-PKCS1-v1_5",
    //         modulusLength: 2048,
    //         publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
    //         hash: "SHA-256"
    //     }, false, ["sign", "verify"])
    //         .then(async bob => {
    //             const bobPK = await subtle.exportKey("jwk", bob.publicKey)
    //             // console.log('bob pk', bobPK.n)
    //             setState(xtend(state, { bob: bob, bobPK: bobPK }))
    //         })

    //     return null
    // }

    console.log('**state**', state)

    function postAlice (ev) {
        ev.preventDefault()
        var content = ev.target.elements.content.value
        var msg = { content }
        console.log('content', content)
        var buf = normalizeUnicodeToBuf(JSON.stringify(msg))
        subtle.sign('RSASSA-PKCS1-v1_5', state.alice.privateKey, buf)
            .then(sig => {
                console.log('sig', sig)
                setState(xtend(state, {
                    aliceMsgs: state.aliceMsgs.concat([{
                        signature: sig,
                        content: msg
                    }])
                }))
            })
        // const sig = subtle.sign(algorithm, key, msg);
    }

    return html`<div class="the-ui">
        <ul class="msgs1"></ul>
        <ul class="msgs2"></ul>
        <div class="people">
            <div class="alice">
                <h2>alice</h2>
                <pre>
                    ${JSON.stringify(
                        wn.did.publicKeyToDid(state.alicePK.n, "rsa"))}
                </pre>

                <form class="new-msg" onSubmit=${postAlice}>
                    <label for="content">Content</label>
                    <textarea id="content" name="content"></textarea>
                    <div class="form-controls">
                        <button type="submit">new post</button>
                    </div>
                </form>
            </div>

            <div class="me">
                <h2>me</h2>
                <pre>${JSON.stringify(state.me)}</pre>

                <h2>messages from alice</h2>
                <ul>${state.aliceMsgs.map(msg => {
                    return html`<li>${JSON.stringify(msg)}</li>`
                })}</ul>
            </div>

        </div>
    </div>`

}

function arrBufToStr (buf, charSize) {
    charSize = charSize || 16
    const arr = charSize === 8 ? new Uint8Array(buf) : new Uint16Array(buf)
    return Array.from(arr)
        .map(b => String.fromCharCode(b))
        .join('')
}

function normalizeUnicodeToBuf (msg) {
    return normalizeUtf16ToBuf(msg)
}

function normalizeUtf16ToBuf (msg) {
    return normalizeToBuf(msg, (str) => strToArrBuf(str))
}

function strToArrBuf (str) {
    const view = new Uint16Array(str.length)
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      view[i] = str.charCodeAt(i)
    }
    return view.buffer
}


function normalizeToBuf (msg, strConv) {
    if (typeof msg === 'string') {
        return strConv(msg)
    } else if (typeof msg === 'object' && msg.byteLength !== undefined) {
        // this is the best runtime check I could find for ArrayBuffer/Uint8Array
        const temp = new Uint8Array(msg)
        return temp.buffer
    } else {
        throw new Error("Improper value. Must be a string, ArrayBuffer, Uint8Array")
    }
}


// <!-- <div class="bob">
//     <h2>bob</h2>
//     <pre>
//         ${JSON.stringify(
//             wn.did.publicKeyToDid(state.bobPK.n, "rsa"))}
//     </pre>
// </div> -->

render(html`<${Demonstration} />`, document.getElementById('content'))

// this returns the same value because the DID is a global variable
// wn.did.ucan()
//     .then(ourDID => {
//         console.log('our did again', ourDID)
//         var pk = wn.did.didToPublicKey(ourDID)
//         console.log('pk again', pk)
//     })


// DIDs
wn.did.ucan()
    .then(async ourDID => {
        // the public key used in the DID is saved in storage. This means
        // that `wn.did.ucan()` will return the same DID no whenever you
        // call it. (The DID is a global value). This is true if you call
        // it in new windows or even 'incognito' windows too.

        // note that the related private key is not exposed in any way.
        // It can't be stolen b/c it is not readable.
        // console.log('our did', ourDID)

        console.log('our did', ourDID)
        var pk = wn.did.didToPublicKey(ourDID)
        console.log('pk', pk)

        // var ks1 = await wn.keystore.get()
        // console.log('ks1', ks1)

        wn.keystore.get()
            .then(async ks => {
                console.log('ks', ks)

                const writeKey1 = await ks.publicWriteKey()
                console.log('is equal?', pk.publicKey === writeKey1)

                var sig = await ks.sign('my message')
                // console.log('the signature', sig)

                var isValid = await ks.verify('my message', sig, writeKey1)
                console.log('is valid signature?', isValid)
            })


        /**
         * This can be another UCAN which has a bigger, or equal,
         * set of permissions than the UCAN we're building.
         */
        const possibleProof = null // or, other UCAN.

        // how to get a new DID for testing? The scope of the DID is so global
        // i'm not sure how to make a new one
        const otherDID = "did:key:EXAMPLE"


        // https://webnative.fission.app/modules/ucan.html#sign


        /**
         * The UCAN, encoded as a string.
         */
        wn.ucan.build({
            // audience should be a DID
            // (audience is a publicKey)
            audience: otherDID,
            issuer: ourDID,
            // facts: [],
            lifetimeInSeconds: 60 * 60 * 24, // UCAN expires in 24 hours
            potency: 'APPEND_ONLY',
            proof: possibleProof
        })
            .then((ucan) => {
                console.log('**got ucan**', ucan)

                wn.ucan.isValid(ucan)
                    .then(val => console.log('**is valid ucan**', val))

                var enc = wn.ucan.encode(ucan)
                console.log('enc', enc)

                try {
                    var dec = wn.ucan.decode(enc)
                    console.log('dec', dec)
                } catch (err) {
                    console.log('errrrrr', err)
                }

                wn.ucan.sign(ucan.header, ucan.payload)
                    .then((sig) => {
                        console.log('**sign**', !!sig)
                    })
            })
    })
