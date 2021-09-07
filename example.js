import { render } from 'preact'
import { useState } from 'preact/hooks'
import { html } from 'htm/preact'
var xtend = require('xtend')

const wn = window.webnative
// import * as wn from 'webnative'

// const UCANS_STORAGE_KEY = 'webnative.auth_ucans'

console.log('wn', wn)

console.log('**crypt**', crypto.subtle)
var subtle = crypto.subtle

function Demonstration () {
    var [state, setState] = useState({ idOne: null, idTwo: null })

    console.log('**state**', state)

    if (!state.idOne) {
        subtle.generateKey({
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: 2048,
            publicExponent: new Uint8Array([ 0x01, 0x00, 0x01 ]),
            hash: "SHA-256"
        }, false, ['sign', 'verify'])
            .then(keyPair => {
                setState(xtend(state, { idOne: keyPair }))
            })
    }

    if (!state.idTwo) {
        wn.did.ucan().then(did => setState(xtend(state, { idTwo: did })))
    }


    return html`<div class="the-ui">
        <ul class="msgs1"></ul>
        <ul class="msgs2"></ul>
        <div class="id1">
            <h2>id one</h2>
            <pre>${JSON.stringify(state.id)}</pre>
        </div>
        <div class="id2">
            <h2>id two</h2>
        </div>
    </div>`

}

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

        var pk = wn.did.didToPublicKey(ourDID)
        console.log('pk', pk)



        // var storeB = wn.keystore.create({ storeName: 'b' })
        // // console.log('sb', storeB)
        // const storeA = wn.keystore.create({ storeName: 'a' })

        // await wn.keystore.set(storeB)
        // const issB = await wn.did.ucan()
        // console.log('b', issB)

        // await wn.keystore.set(storeA)
        // const issA = await wn.did.ucan()
        // console.log('a', issA)

        // const prf = await wn.ucan.build({
        //     audience: issB,
        //     issuer: issA
        // })

        // console.log('prf', prf)




        wn.keystore.create()
            .then(async ks => {
                // console.log('ks', ks)

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
            lifetimeInSeconds: 60 * 60 * 24, // UCAN expires in 24 hours
            potency: 'APPEND_ONLY',
            proof: possibleProof
        })
            .then((ucan) => {
                console.log('**got ucan**', ucan)

                wn.ucan.isValid(ucan)
                    .then(val => console.log('**is valid ucan**', val))

                // var enc = wn.ucan.encode(ucan)
                // console.log('enc', enc)

                // try {
                //     var dec = wn.ucan.decode(enc)
                //     console.log('dec', dec)
                // } catch (err) {
                //     console.log('errrrrr', err)
                // }

                wn.ucan.sign(ucan.header, ucan.payload)
                    .then((sig) => {
                        console.log('**sign**', !!sig)
                    })
            })
    })
