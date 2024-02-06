const OPENAI_API_ORG = 'org-3mWcXhfgu5TEfkZ5XNqj4uN9'; // process.env['OPENAI_API_ORG'] ||
const OPENAI_API_KEY = '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'; // process.env['OPENAI_API_KEY'] ||

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
  USER_AGENTS,
  USER_AGENT,
  HTTP_REFERERS,
  HTTP_REFERER,
  HTTP_HEADERS,
};
