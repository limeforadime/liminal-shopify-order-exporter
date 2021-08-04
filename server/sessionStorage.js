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
      await SessionModel.create({
        id: session.id,
        content: cryption.encrypt(JSON.stringify(session)),
        shop: session.shop,
      });
    } else {
      await SessionModel.findOneAndUpdate(
        { id: session.id },
        {
          content: cryption.encrypt(JSON.stringify(session)),
          shop: session.shop,
        }
      );
    }
  } catch (e) {
    throw new Error(e);
  }
  return true;
};

const loadCallback = async (id) => {
  try {
    const sessionResult = await SessionModel.findOne({ id });
    if (sessionResult) {
      return JSON.parse(cryption.decrypt(sessionResult.content));
    } else {
      return undefined;
    }
  } catch (e) {
    throw new Error(e);
  }
};

const deleteCallback = async (id) => {
  try {
    await SessionModel.deleteOne({ id });
  } catch (e) {
    console.log(e);
  }
  return true;
};

const sessionStorage = new Shopify.Session.CustomSessionStorage(storeCallback, loadCallback, deleteCallback);

/* Returned session takes the form of:
{
┃   id: 'asdfasdf234.myshopify.com_54655436453',
┃   shop: 'asdfasdf234.myshopify.com',
┃   state: '90723846879236487',
┃   scope: 'write_products,write_customers,read_orders',
┃   expires: 2021-02-03T02:42:38.058Z,
┃   isOnline: true,
┃   accessToken: 'fakefake_fakeadsfsa78876f87a6sd6dfddd876asdf876',
┃   onlineAccessInfo: {
┃     expires_in: 86398,
┃     associated_user_scope: 'write_products,write_customers,read_orders',
┃     session: '98f98h29fh93h9adsf97a685a76s8df57as8df5s7ad68f5',
┃     account_number: 0,
┃     associated_user: {
┃       id: 12823489762384,
┃       first_name: 'Jim',
┃       last_name: 'Schmiff',
┃       email: 'asdf@yahoo.com',
┃       account_owner: true,
┃       locale: 'en-US',
┃       collaborator: false,
┃       email_verified: true
┃     }
┃   }
┃ }
*/
export default sessionStorage;
