const fs = require('fs');
const puppeteer = require('puppeteer');
const {OpenAI} = require('openai');
const {HTTP_HEADERS, USER_AGENT} = require('./constants');

const OPENAI_PROMPT =
  'What is the product name, price and unit size of the product in the screenshot provided? ' +
  'Provide the result as a JSON object containing only 3 properties and without any markdown wrappers.';

const SCREENSHOT_RAND = Math.random().toString(36).slice(-5);
const SCREENSHOT_PATH = __filename + '.' + SCREENSHOT_RAND + '.jpg';
const SCREENSHOT_TYPE = 'data:image/jpg;base64,';
const DEFAULT_VIEWPORT = {width: 1920, height: 1080};

const fetch = (params) => {
  const {url, image} = params;
  if (url && /^https?:\/\//.test(url)) {
    return new Promise((resolve, reject) => {
      screenshot_(url, () => vision_(resolve, reject));
    });
  } else if (image && /^image/.test(image.mimetype)) {
    return new Promise((resolve, reject) => {
      image.mv(SCREENSHOT_PATH, (err) => vision_(resolve, reject));
    });
  } else {
    return null;
  }
};

const screenshot_ = (
  /** @type {string} */ url,
  /** @type {Function} */ callback
) => {
  puppeteer
    .launch({
      headless: 'new',
      defaultViewport: DEFAULT_VIEWPORT,
      args: ['--no-sandbox'],
    })
    .then(async (browser) => {
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(0);
      await page.setUserAgent(USER_AGENT);
      await page.setExtraHTTPHeaders(HTTP_HEADERS);
      await page.goto(url, {waitUntil: 'networkidle2', timeout: 0});
      await page.evaluate(() => {
        document.querySelectorAll('iframe, header').forEach((element) => {
          try {
            element.remove();
          } catch (ex) {}
        });
      });
      await page.screenshot({path: SCREENSHOT_PATH});
      await browser.close();
      callback && callback();
    });
};

/**
 * @see https://platform.openai.com/docs/guides/vision
 */
const vision_ = (
  /** @type {Function} */ resolve,
  /** @type {Function} */ reject
) => {
  const image = SCREENSHOT_TYPE + fs.readFileSync(SCREENSHOT_PATH, 'base64');

  const content = [
    {type: 'text', text: OPENAI_PROMPT},
    {type: 'image_url', image_url: {url: image}},
  ];

  const openai = new OpenAI({
    organization: process.env.OPENAI_API_ORG,
    apiKey: process.env.OPENAI_API_KEY,
  });

  openai.chat.completions
    .create({
      model: 'gpt-5', // 'gpt-4-vision-preview', //'gpt-3.5-turbo', // model: 'gpt-4',
      messages: [{role: 'user', content}],
      max_tokens: 300,
    })
    .then((result) => {
      const message = result.choices[0].message.content;
      console.debug('[DEBUG] response message:', message);
      cleanup_();
      resolve && resolve(message);
    })
    .catch((error) => {
      console.error('[ERROR] Could not complete chat completion:', error);
      cleanup_();
      reject && reject(error);
    });
};

const cleanup_ = () => {
  // return;
  try {
    fs.rmSync(SCREENSHOT_PATH, {force: true});
  } catch (error) {
    console.error('[ERROR] Could not delete file:', SCREENSHOT_PATH, error);
  }
};

const test = () => {
  const urls = [
    // 'https://www.ballagrio.com/products/hanskin-collagen-peptide-hydra-ampoule-90ml',
    // 'https://www.dior.com/en_us/beauty/products/capture-totale-le-serum-Y0997044.html',
    // 'https://www.target.com/p/the-ordinary-azelaic-acid-suspension-10-1-fl-oz-ulta-beauty/-/A-82541250',
    // 'https://www.walmart.com/ip/CeraVe-Hydrating-Hyaluronic-Acid-Face-Serum-1-fl-oz/887176969',
    // 'https://www.theinkeylist.com/products/hyaluronic-acid-serum?currency=USD&variant=35432168161443',
    'https://theordinary.com/en-us/hyaluronic-acid-2-b5-serum-100425.html',
    // 'https://www.sephora.com/product/sephora-collection-hydrating-serum-P504429',
    // 'https://www.ulta.com/p/super-peptide-serum-pimprod2027915',
    // 'https://www.amazon.com/Olay-Regenerist-Micro-Sculpting-Cream/dp/B096L5V7HH',
  ].forEach((url) => {
    // screenshot_(url);
    // screenshot_(url, vision_);
    // vision_();
    fetch(url)
      .then((message) => console.log('message: ', message))
      .catch((error) => console.error('error:', error));
  });
};

// test();

module.exports = {fetch};
