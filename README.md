# fission did

--------------------------------------------

DID is *who you are*. UCAN is *what you can do*.


**how do you create/store DIDs for users?** Maybe a metamask-like extension for key mgmt.

> The idea is to avoid needing an external wallet

https://whitepaper.fission.codes/authorization/did-doc

The DID here is stored by the webnative library. (It will return the same value in any window that calls it). Even more than you might want it to -- the keys are the same in 'incognito' windows and regular windows.

Create a DID from a public key:
```js
publicKeyToDid(publicKey: string, type: KeyType): string

wn.did.publicKeyToDid(state.alicePK.n, "rsa"))}
```

```js
const wn = window.webnative
var ourDID = await wn.did.ucan()

/**
* This can be another UCAN which has a bigger, or equal,
* set of permissions than the UCAN we're building.
*/
const possibleProof = null // or, other UCAN.

// how to get a new DID for testing? The scope of the DID is so global
// i'm not sure how to make a new one
const otherDID = "did:key:EXAMPLE"

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
```


So what about temporary browsers? The use case where you are in a public library and you want to login with a computer that you do not own.

> it's so unlikely that you won't have your phone with you that we've put that out of scope for now. You'd link from your phone to the library computer, and log out (delete the local WebCrypto key & wipe indexedDB) afterwards


----------------------------------------------


**How do you associate it with a username?** Any number of ways to do this. 

The public key can be a key in a DB for a user record, because it is universally unique.

```js
var pk = wn.did.didToPublicKey(ourDID)
// =>
// {
//    "publicKey": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqT8Zp028N0MQxNVs77P/4cgIjGZdrZSn5hd1lkvFpxooSKDgTeBRoC6nVyyJW6aPJUqkXSJhXWN6V1ftFwPhzL+6aOP/8yRatZ9rmDC8GRv08PD+uvQEInEuJ0/TpI6pKB+qwW+JgdyErk8MRDBJ/JQ58XI/wnzFpgVsEti8Ql8t2XK6ol+CBoZIFHTIM8avbGu7hJX0uHNA8dEfk/fQhM2k3VnnHtS2/cgM6EVO7pp6nDkxW7JqU5LpiPj27uPm/UPOhF4jv9QnYmHUC/P8jF7E0FuFtRfENM09i8eGVl7nZwzB0KToQ1DWtwpZEK6LNc1xMCMvv9mLoSYiEFr6XQIDAQAB",
//    "type": "rsa"
// }
```


-------------------------------------------


**How do you set the permissions in a UCAN appropriately for different sessions?**

Use [wn.ucan.build](https://webnative.fission.app/modules/ucan.html#build) to
create a new UCAN that can be used just for a session. Add the originating
UCAN as the `proof` field in the call to `wn.ucan.build`. This can be another
UCAN which has a bigger, or equal, set of permissions than the UCAN we're
building.

You can set an expiration for a UCAN also. This is an absolute timestamp --
`wn.ucan.build({ expiration: timestamp })`

Or set `lifetimeInSeconds: 60 * 60 * 24, // UCAN expires in 24 hours`, for a relative expiration.


-----------------------------------------------


## permissions

https://fission.codes/blog/auth-without-backend/

> What if you want to grant another user or service the ability to perform some action on your behalf? As long as they have a valid UCAN, they can wrap it in another with equal or lesser rights and include the original in the prf field.

'equal or lesser rights' in this context means that your application would need to read both UCANs, and would interpret the 'potency' field and see if a things are allowed according to your own application logic.

----------------------------------------------------------------

## facts

https://webnative.fission.app/modules/ucan.html#build

> The facts field gives a UCAN the ability to embed arbitrary data. The only purpose of this data is to be signed with the UCAN chain. This does the authentication of "a user that can do X, Y, and Z is signing this data". You can use it for really any signing purpose, including signing challenge text, hash preimages, associating URLs, and so on


In the tests it says 'session key fact' -- https://github.com/fission-suite/webnative/blob/ce2b50fb70a31db1081d8f1655f02b251164c826/tests/ucan/ucan.browser.test.ts#L64

What is a session key?

> When we do device linking, we bootstrap a secure authenticated session over WebSockets. The session key is the symmetric key that gets negotiated in the handshake, and we need to authenticate the source of that key. We include it in the facts section of a UCAN (which delegates no permissions) to prove that you have the capabilities of that the linking device wants, and that the symmetric key originated with you. This is all happening inside messages encrypted with that key. Here's the full protocol if you're interested: https://whitepaper.fission.codes/accounts/login/awake





---------------------------------------------------



## pubicKeyToDID
Create a DID from a given public key

This is a typescript file

```
$ npm test

  public key to DID

    ✔ should create a did from a public key
    ✔ should create the right did


  total:     2
  passing:   2
  duration:  4.4s
```

```ts
import * as tape from 'tape'
import { KeyType } from '../src/types'
import { publicKeyToDid } from '../src'

var pk = 'w9uL--6pG7GsOGiNF_OE7lulZUn6UJN0j6n4m1V3e12_-vtWE6RW3xPNECkUGy0SI4TYOtxLQA7fO6wgEGKpw1YqmxoAIEGp3CUUNcAEnHIyy7dOyroT0qqjSRHZtkiS3LmJEgggSsWGa7G66t9ahBBZF99giuVEowpu7Lr8fPRTlZrrs06R_Xlp1aM2EN-bSkhW1BAWXpvBJ97ng3_CnseLSxJv98bSI_XbCZdrlVKSSW891wTRzQLHcx3v1AsKp3OTzq-5g4pi7T9Otk_N1gklp1t8uEsg3UInO8kjNu2hTsUNQ6l8vE2OKe7jNH752sqz6sCUcrXEH7DwjcU9nQ'

tape('public key to DID', function (t: tape.Test) {
    var did = publicKeyToDid(pk, KeyType.RSA)
    t.ok(did, 'should create a public key')
    t.equal(did, 'did:key:z14ocYEZPM1ghUVA9SvBRLc2YLnA44wy1k3ExUVwkNSKFSG3FLCf9Fu3fNEZNRdp721h17sxkBagDLUv9u3nbsHhv69mha1zMd857HM5bDh1VdrhDQ1tGmRx7xhCg7pWY1FUQcVWg424emLKVtYt54PGBSvGzcunG4QnWUKcVhgnCD8fUGyc3pZYh4BhCTYJnkAXvikDmQafioqBymXWZ24GnMaWQaCb1o88XBNDrEt1yu6Jh7Qvo5TKJn42VYBEbWMGnumqGHMA9G89yR43sifPsmbtfV1517biu29N7Hskta4WshQ78XEaRMkAcQsV8MVmD9aXHzZfA9nrCMzeJHmYUHP6exfGUXn',
        'should create the right did')
    // console.log('did', did)
    t.end()
})
```


-------------------------------------------------------
## make a UCAN
'User Controlled Authorization Networks'

We are using the pre-built JS file from fission:

```html
<script src="https://unpkg.com/webnative@0.26.1/dist/index.umd.min.js"></script>
```

In our application code, we want to create a UCAN token:
```js
const wn = window.webnative

wn.did.ucan()
    .then(ourDID => {
    })
```

This UCAN/DID is your identity. It is created with the webCrypto API, which
means that the public key is visible to us, but we have no way to access the 
related private key. You can sign and verify messages by using an API.

The DID is an easy to serialize string so it can be moved easily to 
different backends.

## sign messages with the DID
To sign or verify messages, you can use the keystore API. This uses the same
key pair that was created for the UCAN above. It is the same keypair used
in your DID.

```js
wn.keystore.create()
    .then(async ks => {
        // this is the same public key that is used in your DID
        const writeKey = await ks.publicWriteKey()

        var sig = await ks.sign('my message')

        // ks.verify requires a public key and a signature to tell if
        // a given signature is valid for a given message
        var isValid = await ks.verify('my message', sig, writeKey)
        console.log('is valid signature?', isValid)
    })
```

--------------------------------

At this point you have an identity (a public/private key pair), and you
can use your ID to sign messages. That's everything you need to create
a signed merkle list, for example.



-------------------------------------------------------



## vvvvv some notes vvv

What is UCAN?

'User Controlled Authorization Networks'

see
* [blog](https://fission.codes/blog/auth-without-backend/)
* [https://talk.fission.codes/](https://talk.fission.codes/t/user-controlled-authorization-networks-ucan-resources/1122)
* [the fission guide](https://guide.fission.codes/ucan)
* [whitepaper](https://whitepaper.fission.codes/authorization/id-overview)
* [API docs](https://webnative.fission.app/)
* [w3c did:key method](https://w3c-ccg.github.io/did-method-key/)
* [w3c did docs](https://www.w3.org/TR/did-core/)
* [fission webnative repo](https://github.com/fission-suite/webnative)
* [Lightweight Credentials for Offers with UCAN](https://fission.codes/blog/lightweight-credentials-ucan/)
* [UCAN (do) secure key management in the browser, with Ben Bollen](https://talk.fission.codes/t/ucan-do-secure-key-management-in-the-browser-with-ben-bollen/1214)
* [AWAKE](https://whitepaper.fission.codes/accounts/login/awake)

--------------------------------

> What is the API for working with the private key (as opposed to the UCAN API)?
There's the WebCrypto API (which is a standard browser API). We also have a wrapper for key management called keystore-idb.

------------------------------------------

> Everything that a users is allowed to do is captured directly in a key or token, and can be sent to anyone that knows how to interpret this format.

## start
This will use budo/browserify to build a local JS file, and it links via `<script>` tag to the `webnative` library.
```
$ npm start
```

Visit the web page on **localhost**, not the given IP address. It's necessary to use localhost for the webCrypto API.

## rollup

```
$ npm run roll

[!] Error: 'CryptoSystem' is not exported by node_modules/keystore-idb/types.js, imported by node_modules/webnative/lib/keystore.js
```


----------------------------------------------------


## using <script> in html

**this one seems to work**

public/index.html
```
<script src="https://unpkg.com/webnative@0.26.1/dist/index.umd.min.js"></script>
```

`/example.js`
```
const wn = window.webnative
```

Start a local server
```
$ npm start
```


-------------------------------------------------------


## browserify

```
$ npm run build-js-br

SyntaxError: /Users/nick/code/fission-did/node_modules/webnative/lib/index.js: Export namespace should be first transformed by `@babel/plugin-proposal-export-namespace-from`.
  132 | export * from "./common/version.js";
  133 | export const fs = FileSystem;
> 134 | export * as apps from "./apps/index.js";
      |        ^^^^^^^^^

```

But we already are using `@babel/plugin-proposal-export-namespace-from`


----------------------------------------------------------
