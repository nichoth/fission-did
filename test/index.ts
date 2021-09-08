// var test = require('tape')
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
