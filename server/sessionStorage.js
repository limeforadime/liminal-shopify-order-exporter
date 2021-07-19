/**
 * Based on the Redis example from shopify-node-api [Accessed: May 19, 2021]
 * https://github.com/Shopify/shopify-node-api/blob/main/docs/usage/customsessions.md
 */

import SessionModel from '../models/SessionModel';
import Shopify from '@shopify/shopify-api';
import Cryptr from 'cryptr';
const cryption = new Cryptr(process.env.ENCRYPTION_STRING);

const storeCallback = async (session) => {
  try {
    const result = await SessionModel.findOne({ id: session.id });
    if (result === null) {
      console.log(`in #storeCallback(): creating session with id: ${session.id} and shop: ${session.shop}`);
      await SessionModel.create({
        id: session.id,
        content: cryption.encrypt(JSON.stringify(session)),
        shop: session.shop,
      });
    } else {
      console.log(`in #storeCallback(): updating session with id: ${session.id} and shop ${session.shop}`);
      await SessionModel.findOneAndUpdate(
        { id: session.id },
        {
          content: cryption.encrypt(JSON.stringify(session)),
          shop: session.shop,
        }
      );
    }
  } catch (e) {
    console.log(e);
  }
  return true;
};

const loadCallback = async (id) => {
  console.log('in #loadCallback(): finding session');
  try {
    const sessionResult = await SessionModel.findOne({ id });
    if (sessionResult.content.length > 0) {
      return JSON.parse(cryption.decrypt(sessionResult.content));
    }
  } catch (e) {
    console.log(e);
  }
  return undefined;
};

const deleteCallback = async (id) => {
  console.log('in #deleteCallback(): deleting session');
  try {
    await SessionModel.deleteOne({ id });
  } catch (e) {
    console.log(e);
  }
  return true;
};

const sessionStorage = new Shopify.Session.CustomSessionStorage(storeCallback, loadCallback, deleteCallback);

export default sessionStorage;
