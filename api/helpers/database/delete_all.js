'use strict';

// Define module
module.exports = (helper) => {

  /**
   * Select
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} model - Model
   * @return {Promise}
   */
  return (req, res, model) => {
    return new Promise( (resolve, reject) => {
      try {

        const _id = req.params.id || '';
        // model.findOneAndRemove({_id})
        model.remove()
          .then(data => {
              resolve({data});
          })
          .catch(error => {
            reject(helper.lib.httpError(400, error.message || 'Ocurrio un error inesperado'));
          });

      } catch(error) {
        console.error('Helper "database.deleteAll" response error');
        console.error(error);
        reject(error);
      }
    });
  };
};
