const {OpenAI} = require('openai');

const {
  USER_AGENT,
  OPENAI_API_ORG,
  OPENAI_API_KEY,
  SHEET_URL,
} = require('../constants');
const storage = require('../storage');

const search = async (/** @type {string}  */ target) => {
  const list = await loadDupesData_();
  const type = await findProductSerumType_(list, target);

  const filtered = list.filter((item) => {
    const serumType = item.dupe_serum_type || item.serum_type || '';
    return type === serumType.trim().toLowerCase();
  });

  // Getting 3 random dupes from a filtered array of the same serum type
  // const dupes = filtered.sort(() => 0.5 - Math.random()).slice(0, 3);

  const swaps = await findProductSmartSwaps_(filtered, target);
  const names = swaps.map((item) => item.smart_swap_name.toLowerCase());
  const dupes = list.filter((item) => {
    const name = (item.dupe_product || '').trim().toLowerCase();
    if (names.includes(name)) {
      item.dupe_justification = swaps
        .filter((dupe) => name === dupe.smart_swap_name.toLowerCase())
        .map((dupe) => dupe.justification)
        .join('; ');
      return true;
    }
    return false;
  });

  return dupes;
};

const loadDupesData_ = async () => {
  let list = [];
  try {
    const result = await fetch(SHEET_URL, {
      headers: {'User-Agent': USER_AGENT},
    });
    let text = await result.text();
    // google.visualization.Query.setResponse({data});
    const splitter = 'google.visualization.Query.setResponse(';
    text = (text.split(splitter)[1] || '').slice(0, -2);
    try {
      const data = JSON.parse(text);
      list = formatSheetData_(data);
    } catch (error) {
      console.error('[ERROR] Could not parse dupes text', error);
    }
  } catch (error) {
    console.error('[ERROR] Could not load dupes list', error);
  }
  return list;
};

const formatSheetData_ = (data) => {
  const result = [];
  if (data && data.table && data.table.cols && data.table.rows) {
    const cols = data.table.cols;
    data.table.rows.forEach((row) => {
      const obj = {};
      row.c.forEach((col, index) => {
        const key = cols[index].label;
        if (key) {
          obj[key.trim().toLowerCase().replace(/\s/g, '_')] = col && col.v;
        }
      });
      result.push(obj);
    });
  }
  return result;
};

const findProductSerumType_ = async (
  /** @type {Array} */ list,
  /** @type {string} */ product
) => {
  const types = new Set();
  for (let i = 0; i < list.length; ++i) {
    const item = list[i];
    types.add((item.dupe_serum_type || item.serum_type || '').trim());
  }

  const re = /\W+/g;
  const key = (product + '-' + Array.from(types).join('-')).replace(re, '-');
  const cached = await storage.getItem(key);
  let type = cached && JSON.parse(cached);

  if (!type) {
    const message =
      'Based on the active and functional ingredients ' +
      `of this "${product}", which serum_type does it belong to? ` +
      'The serum types are: ' +
      Array.from(types).join(', ') +
      '.\r\nAnswer serum type only, one of the list above, no explanation';

    const data = await askAssistant_(message);
    if (data && data.message) {
      type = (data.message || '').toLowerCase().replace(/\.$/, '');
      await storage.setItem(key, JSON.stringify(type));
    }
  }

  return type;
};

const findProductSmartSwaps_ = async (
  /** @type {Array} */ list,
  /** @type {string} */ product
) => {
  const key = 'dupes-for-' + product.toLowerCase().replace(/\W+/g, '-');
  const cached = await storage.getItem(key);
  let result = cached && JSON.parse(cached);

  if (!result) {
    const rowSeparator = '\r\n---------\r\n';
    const colSeparator = ' | ';
    const message =
      rowSeparator +
      ['dupe_product', 'active_ingredients', 'functional_ingredients'].join(
        colSeparator
      ) +
      rowSeparator +
      list
        .map((item) => {
          return [
            item.dupe_product,
            item.active_ingredients,
            item.functional_ingredients,
          ].join(colSeparator);
        })
        .join(rowSeparator) +
      rowSeparator +
      '\r\n' +
      'Based on ingredients and functions of the serums in the table ' +
      'above, find three smart swaps in the table above for this target ' +
      `product: "${product}".\r\n` +
      'Generate two columns: 1) smart_swap_name 2) justification ' +
      '(why this is a good cheaper alternative to the target product).' +
      // 'Provide product names only from the table above, separated by ' +
      // 'commas, no wrappers, no explanation. Just comma-separated values.' +
      'Provide the result in JSON format as array of objects.';

    const data = await askAssistant_(message);
    if (data && data.message) {
      result = data.message;
      await storage.setItem(key, JSON.stringify(result));
    }
  }

  if (typeof result === 'string') {
    result = JSON.parse(result); // For backward compatibility.
  }

  return result;
};

const askAssistant_ = async (/** @type {string} */ message) => {
  console.debug('[DEBUG] Request message:', message);
  const openai = new OpenAI({
    organization: OPENAI_API_ORG,
    apiKey: OPENAI_API_KEY,
  });

  try {
    const result = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      // model: 'gpt-4',
      messages: [{role: 'user', content: message}],
    });
    const content = result.choices[0].message.content;
    console.debug('[DEBUG] Response message:', content);
    return {message: content};
  } catch (error) {
    console.error('[ERROR] Could not complete chat completion:', error);
  }
  return null;
};

module.exports = {search};
