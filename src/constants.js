const OPENAI_API_ORG = process.env['OPENAI_API_ORG'];
const OPENAI_API_KEY = process.env['OPENAI_API_KEY'];

const SHEET_ID = '19dW9H-WGgy6ar51UH32dQrlJrQWX_0Wb00niW154gdY';
// "1odhMCRznRTtdCHE8FUpbodFpFmVo8_dO33-xP9mrc-U";
const SHEET_GID = 2110276714; //1004750025;
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?gid=${SHEET_GID}`;

const USER_AGENTS = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
];

const HTTP_REFERERS = [
  'https://www.google.com/',
  'https://duckduckgo.com/',
  'https://search.yahoo.com/',
  'https://www.bing.com/',
  'https://twitter.com/',
  'https://www.facebook.com/',
  'https://www.instagram.com/',
];

const HTTP_REFERER =
  HTTP_REFERERS[Math.floor(Math.random() * HTTP_REFERERS.length)];

const USER_AGENT = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

const HTTP_HEADERS = {
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
  Pragma: 'no-cache',
  Referer: HTTP_REFERER,
  'User-Agent': USER_AGENT,
  'Upgrade-Insecure-Requests': '1',
};

module.exports = {
  OPENAI_API_ORG,
  OPENAI_API_KEY,
  SHEET_URL,
  USER_AGENTS,
  USER_AGENT,
  HTTP_REFERERS,
  HTTP_REFERER,
  HTTP_HEADERS,
};
