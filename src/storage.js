/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Storage
 * @see https://redis.io/docs/connect/clients/nodejs/
 */

const redis = require('redis');

const createClient = async () => {
  // return null;

  const client = redis.createClient({url: process.env.REDIS_URL});
  client.on('error', (err) => console.error('Redis Client Error:', err));
  await client.connect();
  return client;
};

/**
 * @param {string} keyName A string containing the name of the key you want to retrieve the value of.
 * @return {Promise<string | null>} A string containing the value of the key. If the key does not exist, `null` is returned.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem
 */
const getItem = async (keyName) => {
  const client = await createClient();
  if (client) return await client.get(keyName);

  console.debug('[DEBUG] storage.getItem is not implemented yet.');
  return null;
};

/**
 * @param {string} keyName A string containing the name of the key you want to create/update.
 * @param {string} keyValue A string containing the value you want to give the key you are creating/updating.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem
 */
const setItem = async (keyName, keyValue) => {
  const client = await createClient();
  if (client) return await client.set(keyName, keyValue);

  console.debug('[DEBUG] storage.setItem is not implemented yet.');
  return null;
};

/**
 * @param {string} keyName A string containing the name of the key you want to remove.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Storage/removeItem
 */
const removeItem = async (keyName) => {
  const client = await createClient();
  if (client) return await client.del(keyName);

  console.debug('[DEBUG] storage.removeItem is not implemented yet.');
  return null;
};

/**
 * When invoked, will empty all keys out of the storage.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Storage/clear
 */
const clear = () => {
  console.debug('[DEBUG] storage.clear is not implemented yet.');
};

module.exports = {getItem, setItem, removeItem, clear};
