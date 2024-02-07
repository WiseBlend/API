const vision = require('../vision');
const storage = require('../storage');

const search = async (/** @type {string} */ url) => {
  let product = null;
  if (url) {
    const cached = await storage.getItem(url);
    product = cached && JSON.parse(cached);

    if (!product) {
      try {
        const result = await vision.fetch(url);
        if (result && result.trim().startsWith('{')) {
          try {
            product = JSON.parse(result);
            product.price = formatPrice_(product.price);
            product.unit_size = formatUnitSize_(product.unit_size);
            if (product.price && product.unit_size) {
              product.unit_price = parseFloat(
                (product.price / parseFloat(product.unit_size)).toFixed(2)
              );
            }
            await storage.setItem(url, JSON.stringify(product));
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
    console.error('[ERROR] Invalidh URL:', url);
  }

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
