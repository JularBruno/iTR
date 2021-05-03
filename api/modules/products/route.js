'use strict';

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
  module.router.post('/updatePrice',async  (req, res, next) => {

    const products = req.body.products
    const amount = req.body.amount
    let percentageToIncrement = 0;

    if(amount > 0) {
      let pre = '1.' + amount;
      percentageToIncrement = parseFloat(pre); //// TODO round this number
    } else {
      let pre = '0.' + (100 + parseInt(amount));
      percentageToIncrement = parseFloat(pre);
    }
    for (let index = 0; index < products.length; index++) {
      const element = products[index];
      await global.modules.subproducts.model.updateMany({ product: element }, { $mul: { price: percentageToIncrement } }).exec()
    }
    res.send({})
  });

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
