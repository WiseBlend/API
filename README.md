# WiseBlend API

## Endpoints

- URI: `/dupes/search`
- Params:
  - `url` - target product URL
- Returns:

```json
{
  "product": {
    "product_name": "string",
    "price": "number",
    "unit_price": "number",
    "unit_size": "number"
  },
  "dupes": [
    {
      "id": "number",
      "name": "string",
      "description": "string",
      "image": "string",
      "brand": "string",
      "price": "number",
      "size": "number",
      "units": "string",
      "link": "string",
      "ingredients": "string",
      "videos": ["string", "string"],
      "justification": "string"
    }
  ]
}
```

## Local Development

Create the `.env.development` file with the following variables:

- TZ=America/Los_Angeles
- REDIS_URL=redis://ADD_REDIS_URL_HERE

Run `npm run dev` command to start the server.
