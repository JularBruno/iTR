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
  * add Stock and update supplier
  *
  * @param {Object} req - Request
  * @param {Object} res - Response
  * @param {Object} next - Next
  * @return {void}
  */
  //receives 
  //  Stock
  //  amount
  //  supplier
  //  subproduct
  module.router.post('/addStock', (req, res, next) => {
    global.helpers.database.create(req, res, global.modules.transactions.model).then(async response => {
      let updateSubproduct = {
        $inc: { stock: 1 }
      }
      let subproduct = await module.model.findByIdAndUpdate(response.data.subproduct, updateSubproduct).exec()

      res.send(subproduct)
    })
  });
  /**
* remove stock Stock and update supplier
*
* @param {Object} req - Request
* @param {Object} res - Response
* @param {Object} next - Next
* @return {void}
*/
  //receives 
  //  Stock
  //  amount
  //  supplier
  //  subproduct
  module.router.post('/substractStock/:id', (req, res, next) => {
    global.helpers.database.delete(req, res, global.modules.transactions.model).then(async response => {
      console.log(response, "respuesta")
      if(response.data.sold == true) return res.send({})
      let updateSubproduct = {
        $inc: { stock: -1 }
      }
      await module.model.findByIdAndUpdate(response.data.subproduct, updateSubproduct).exec()
      res.send({})
    })
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
