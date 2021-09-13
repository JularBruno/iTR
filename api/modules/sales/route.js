'use strict';

// Define module
module.exports = (module) => {

  // /**
  //  * Find
  //  *
  //  * @param {Object} req - Request
  //  * @param {Object} res - Response
  //  * @param {Object} next - Next
  //  * @return {void}
  //  */
  // module.router.get('/', global.helpers.security.auth(['administrator', 'user']), (req, res, next) => {
  //   global.helpers.database.find(req, res, module.model)
  //     .then(result => res.send(result)
  //     )
  //     .catch(next);
  // });

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
      .then(result => {
        result = JSON.parse(JSON.stringify(result))
        if (result.data.length == 0) return res.send(result)
        for (let index = 0; index < result.data.length; index++) {
          var element = result.data[index];
          let earningsUSD = 0
          let earningsARS = 0
          let preUSD = element.totalCost - element.paidUSD
          if (preUSD > 0) {
            //500 - 300 = 200
            let costARS = preUSD * element.dolar
            //200 * 100 = 20000
            if (element.paidARS > costARS) earningsARS = element.paidARS - costARS
            //25000 - 20000 = 5000
          } else if (preUSD <= 0) {
            // 500 - 600 = -100
            if (preUSD < 0) earningsUSD = Math.abs(preUSD)
            earningsARS = element.paidARS
          }
          element.earningsARS = earningsARS
          element.earningsUSD = earningsUSD
        }

        res.send(result)

      })
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
  module.router.get('/totalSales', global.helpers.security.auth(['administrator', 'user']), (req, res, next) => {
    global.helpers.database.find(req, res, module.model)
      .then(result => {
        let paidARS = 0
        let paidUSD = 0
        let earnUSD = 0
        let earnARS = 0
        let earningsARS = 0
        let earningsUSD = 0
        let totalCost = 0
        if (result.data.length == 0) return res.send(result)
        for (let index = 0; index < result.data.length; index++) {
          console.log("recorrrido ", index)
          var element = result.data[index];
          let preUSD = element.totalCost - element.paidUSD
          if (preUSD > 0) {
            //500 - 300 = 200
            let costARS = preUSD * element.dolar
            //200 * 100 = 20000
            if (element.paidARS > costARS) earningsARS = element.paidARS - costARS
            //25000 - 20000 = 5000
          } else if (preUSD <= 0) {
            // 500 - 600 = -100
            if (preUSD < 0) earningsUSD = Math.abs(preUSD)
            earningsARS = element.paidARS
          }
          earnARS += earningsARS
          earnUSD += earningsUSD
          paidUSD += element.paidUSD
          paidARS += element.paidARS
          totalCost += element.totalCost
        }
        res.send({ paidARS, paidUSD, earnARS, earnUSD, totalCost })
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
