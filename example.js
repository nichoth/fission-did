// Browser/UMD build
const wn = window.webnative
// import * as wn from 'webnative'

console.log('wn', wn)

wn.did.ucan()
    .then(async ourDID => {
        console.log('our did again', ourDID)
        var pk = wn.did.didToPublicKey(ourDID)
        console.log('pk again', pk)
    })

// DIDs
// const ourDID = await wn.did.ucan()
wn.did.ucan()
    .then(async ourDID => {
        console.log('our did', ourDID)

        var pk = wn.did.didToPublicKey(ourDID)
        console.log('pk', pk)

        /**
         * This can be another UCAN which has a bigger, or equal,
         * set of permissions than the UCAN we're building.
         */
        const possibleProof = null // or, other UCAN.

        const otherDID = "did:key:EXAMPLE"
        // const otherDID = await wn.did.ucan()
        console.log('other', otherDID)




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
                    .then(val => console.log('**is valid**', val))

                // var enc = wn.ucan.encode(ucan)
                // console.log('enc', enc)

                // try {
                //     var dec = wn.ucan.decode(enc)
                //     console.log('dec', dec)
                // } catch (err) {
                //     console.log('errrrrr', err)
                // }

                wn.ucan.sign(ucan.header, ucan.payload)
                    .then((res) => {
                        console.log('**sign**', res)
                    })
            })
    })
