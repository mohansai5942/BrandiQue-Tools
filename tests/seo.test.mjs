import test from 'node:test';
import assert from 'node:assert/strict';
import {siteOrigin,previousOrigin,futureOrigin} from '../src/site.mjs';
test('SEO migration accepts the two real origins and strips a trailing slash',()=>{assert.equal(siteOrigin(previousOrigin+'/'),previousOrigin);assert.equal(siteOrigin(futureOrigin),futureOrigin)});
test('SEO migration rejects paths, credentials, queries, insecure and unrelated origins',()=>{for(const url of ['http://tools.brandique.in','https://tools.brandique.in/path','https://tools.brandique.in?x=1','https://tools.brandique.in#x','https://user@tools.brandique.in','https://example.com'])assert.throws(()=>siteOrigin(url))});
