// import * as wn from "webnative"
// Browser/UMD build
const wn = window.webnative

console.log('wn', wn)

// DIDs
// const ourDID = await wn.did.ucan()
wn.did.ucan()
    .then(ourDID => {
        console.log('our did', ourDID)

        /**
         * The UCAN, encoded as a string.
         */
        wn.ucan.build({
            audience: otherDID,
            issuer: ourDID,
            lifetimeInSeconds: 60 * 60 * 24, // UCAN expires in 24 hours
            proof: possibleProof
        })
            .then((ucan) => {
                console.log('got ucan', ucan)
            })
    })

const otherDID = "did:key:EXAMPLE"

/**
 * This can be another UCAN which has a bigger, or equal,
 * set of permissions than the UCAN we're building later.
 */
const possibleProof = null // or, other UCAN.
