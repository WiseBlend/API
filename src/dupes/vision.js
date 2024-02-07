const vision = require('../vision');
const storage = require('../storage');

const search = async (/** @type {string} */ url) => {
  const run = async (/** @type {number} */ attempts) => {
    let product = await search_(url);
    if (!product && attempts > 0) {
      console.debug('[DEBUG] Could not get product. Retrying...');
      product = await run(attempts - 1);
    }
    return product;
  };
  return await run(3);
};

const search_ = async (/** @type {string} */ url) => {
  let product = null;
  if (url) {
    const key = `wiseblend-${url}`;
    const cached = await storage.getItem(key);
    product = cached && JSON.parse(cached);

    if (product && !validate_(product)) {
      // In cases where invalid product data was previously stored.
      product = null;
    }

    if (!product) {
      try {
        const result = await vision.fetch(url);
        if (result && result.trim().startsWith('{')) {
          try {
            product = JSON.parse(result);

            product.product_name = product.product_name || product.productName;
            product.unit_size = product.unit_size || product.unitSize;

            product.price = formatPrice_(product.price);
            product.unit_size = formatUnitSize_(product.unit_size);
            if (product.price && product.unit_size) {
              product.unit_price = parseFloat(
                (product.price / parseFloat(product.unit_size)).toFixed(2)
              );
            }
          } catch (error) {
            console.error('[ERROR] Could not parse JSON:', error);
          }
        } else {
          console.error('[ERROR] Invalid JSON format:', result);
        }
      } catch (error) {
        console.error('[ERROR] Could not fetch URL:', error);
      }
    }
  } else {
    console.error('[ERROR] Invalid URL:', url);
  }

  if (validate_(product)) {
    await storage.setItem(key, JSON.stringify(product));
    return product;
  }

  return null;
};

const validate_ = (product) => {
  if (product) {
    const name = product.product_name && product.product_name.toLowerCase();
    if (!name || name === 'not available') {
      console.error('[ERROR] Invalid or empty product name:', product);
      return null;
    }
    if (isNaN(product.price)) {
      console.error('[ERROR] Invalid or empty product price:', product);
      return null;
    }
  }

  // console.debug('[DEBUG] Valid product:', product);
  return product;
};

const formatPrice_ = (/** @type {string|number} */ price) => {
  // "price": "8.90 USD",
  // "price": "$20.00",
  // "price": "$44.20"
  // "price": 12.00,
  return parseFloat(('' + price).replace(/[^0-9.]/g, ''));
};

const formatUnitSize_ = (/** @type {string|number} */ size) => {
  size = ('' + size).trim().toLowerCase();
  // ["3.4 Ounce",  "1.0 oz",  "1 oz / 30 mL", "30ml", "1 fl oz", "90ml", "50 ml / Net 1.76 oz"]
  const re = /^(\d+(\.\d+)?)\s*(\w+(\s\w+)?)/;
  const result = size.match(re) || [];

  let value = result[1];
  let units = result[3];

  if (value && units) {
    if (units === 'ounce' || units === 'fl oz') {
      units = 'oz';
    } else if (units === 'ml') {
      // 1 oz is 29.5735296875 ml
      value = value / 30;
      units = 'oz';
    }
    return parseFloat(value).toFixed(2) + ' ' + units;
  }

  return null;
};

module.exports = {search};
