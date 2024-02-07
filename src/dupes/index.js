const vision = require('./vision');
const products = require('./products');

const search = async (
  /** @type {Request} */ req,
  /** @type {Response} */ res
) => {
  const params = {
    url: (req.query.url || '').toLowerCase(),
    image: req.files && req.files.image,
  };

  const product = await vision.search(params);
  if (product) {
    const dupes = await products.search(product.product_name);
    const data = {product, dupes: format_(dupes)};
    res
      .type('application/json')
      .status(200)
      .send(JSON.stringify(data, null, 2).toString('utf8'));
  } else {
    const data = {error: 'The product could not be found at the specified URL'};
    res
      .type('application/json')
      .status(400)
      .send(JSON.stringify(data, null, 2).toString('utf8'));
  }
};

const format_ = (dupes) =>
  dupes.map((product) => {
    return {
      id: product.dupe_product_id,
      name: product.dupe_product,
      description: product.dupe_product_description,
      image: product.dupe_product_image,
      brand: product.brand_name,
      price: product.dupe_price_in_dollar,
      size: product.dupe_size_without_unit,
      units: product.dupe_unit_of_size,
      link: product.dupe_shopping_link,
      ingredients: product.key_ingredient_benefits,
      videos: [
        product.dupe_video_reference_link_1,
        product.dupe_video_reference_link_2,
        product.dupe_video_reference_link_3,
      ],
      justification: product.dupe_justification,
    };
  });

module.exports = {search};
