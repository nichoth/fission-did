# fission did

What is UCAN?

'User Controlled Authorization Networks'

see
* [blog](https://fission.codes/blog/auth-without-backend/)
* https://talk.fission.codes/t/user-controlled-authorization-networks-ucan-resources/1122
* [the fission guide](https://guide.fission.codes/ucan)
* [whitepaper](https://whitepaper.fission.codes/authorization/id-overview)

> Everything that a users is allowed to do is captured directly in a key or token, and can be sent to anyone that knows how to interpret this format.


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


