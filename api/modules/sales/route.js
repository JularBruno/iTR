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
      .then(result => res.send(result)
      )
      .catch(next);
  });
  module.router.get('/totalSales', global.helpers.security.auth(['administrator', 'user']), (req, res, next) => {
    global.helpers.database.find(req, res, module.model)
      .then(result => {
        let count = 0
        for (let index = 0; index < result.data.length; index++) {
          const element = result.data[index];
          count += element.total
        }
        res.send({ data: { totalSales: count } })
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

  module.router.post('/createSale', (req, res, next) => {
    global.helpers.database.create(req, res, module.model)
      .then(async (result) => {
        console.log("created sale: ", result)
        let total = result.data.total - result.data.discount
        for (let index = 0; index < result.data.products.length; index++) {
          const element = result.data.products[index];
          let transaction = { sold: true }
          await global.modules.transactions.model.findByIdAndUpdate(element.id, transaction).exec()
          let update = { $inc: { stock: -1 } }
          await global.modules.subproducts.model.findByIdAndUpdate(element.subproduct.id, update).exec()
        }
        await global.modules.customers.model.findByIdAndUpdate(result.data.client, { $inc: { spent: total } }).exec()
        res.send(result);
      })
      .catch(next);
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
      .then(async result => {
        console.log(result, "resultado de eliminacion")
        for (let index = 0; index < result.data.products.length; index++) {
          var element = result.data.products[index];
          await global.modules.transactions.model.findByIdAndUpdate(element.id, { sold: false }).catch(e => { console.log(e, "error") })
          await global.modules.subproducts.model.findByIdAndUpdate(element.subproduct.id, { $inc: { stock: 1 } }).catch(e => { console.log(e, "error") })

        }


        res.send(result)
      })
      .catch(next);
  });

};
