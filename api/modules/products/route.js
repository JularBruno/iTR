'use strict';

const { query } = require("express");

// Define module
module.exports = (module) => {

  /**
   * Find
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.get('/', global.helpers.security.auth(['administrator', 'user']), (req, res, next) => {
    global.helpers.database.find(req, res, module.model)
      .then(result => res.send(result))
      .catch(next);
  });
  /**
   * Find
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.get('/subproducts', global.helpers.security.auth(['administrator', 'user']), (req, res, next) => {
    const urlParts = module.lib.url.parse(req.url, true);
    const queryParams = urlParts.query;
    let stock
    let sort = {}
    if (queryParams._sort) {
      sort = JSON.parse(queryParams._sort);
      if (sort.stock) stock = sort.stock
    }
    global.helpers.database.find(req, res, module.model)
      .then(async result => {

        for (let index = 0; index < result.data.length; index++) {
          var element = result.data[index];
          let subproducts = await global.modules.subproducts.model.find({ product: element._id })
          for (let index = 0; index < subproducts.length; index++) {
            const subproduct = subproducts[index];
            element.stock = element.stock + subproduct.stock
          }
        }
        if (stock) result.data.sort((a, b) => (a.stock > b.stock) ? stock : ((b.stock > a.last_nom) ? -stock : 0))

        console.log(result, "rsultado")
        res.send(result)
      })
      .catch(next);
  });
  /**
   * FindById
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.get('/:id', global.helpers.security.auth(['administrator', 'user']), (req, res, next) => {
    global.helpers.database.findById(req, res, module.model)
      .then(result => res.send(result))
      .catch(next);
  });

  /**
   * Create
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.post('/', (req, res, next) => {
    global.helpers.database.create(req, res, module.model)
      .then(result => {
        res.send(result);
      })
      .catch(next);
  });

  /**
   * Upate price of subproducts
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.post('/updatePrice', async (req, res, next) => {

    const products = req.body.products
    const amount = req.body.amount
    let subproducts = []
    for (let index = 0; index < products.length; index++) {
      const element = products[index];
      subproducts = await global.modules.subproducts.model.find({ product: element })
      if (products.length == 0) continue

      for (let index = 0; index < subproducts.length; index++) {
        const subproduct = subproducts[index];
        // let result = subproduct.price + subproduct.price * (amount/100);
        // subproduct.price = result.toFixed(2)

        subproduct.price = parseInt(subproduct.price) + parseInt(amount);
        subproduct.cost = parseInt(subproduct.cost) + parseInt(amount);

        await global.modules.subproducts.model.findByIdAndUpdate(subproduct._id, subproduct, { useFindAndModify: false }).exec();
      }
    }

    res.send({})
  });
  // module.router.post('/updatePrice', async (req, res, next) => {

  //   const products = req.body.products
  //   const amount = req.body.amount
  //   let subproducts = []
  //   let value = 1 + amount / 100
  //   for (let index = 0; index < products.length; index++) {
  //     const element = products[index];
  //     subproducts = await global.modules.subproducts.model.find({ product: element })
  //     if (products.length == 0) continue
  //     for (let index = 0; index < subproducts.length; index++) {
  //       const subproduct = subproducts[index];
  //       console.log('price ', subproduct.price);
  //       console.log('value ', value);
  //       subproduct.price = subproduct.price * value
  //       subproduct.price.toFixed(2)
  //       console.log('price ', subproduct.price);
  //       await global.modules.subproducts.model.findByIdAndUpdate(subproduct.id, subproduct).exec()
  //     }
  //   }
  //   res.send({})
  // });

  /**
   * Update
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.put('/:id', global.helpers.security.auth(['administrator']), (req, res, next) => {
    global.helpers.database.update(req, res, module.model)
      .then(result => res.send(result))
      .catch(next);
  });

  /**
   * Delete
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.delete('/:id', global.helpers.security.auth(['administrator']), (req, res, next) => {
    global.helpers.database.delete(req, res, module.model)
      .then(result => res.send(result))
      .catch(next);
  });

};
