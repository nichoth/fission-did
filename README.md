# fission did

--------------------------------------------

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
means that the public key is visible to us, but we have to way to access the 
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

Visit the web page on localhost, not the given IP address. It's necessary to use localhost for the webCrypto API.

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
