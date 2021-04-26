'use strict';

// Define module
module.exports = (helper) => {

  /**
   * Create opentok session
   *
   * @param {Object} model - Model
   * @return {Promise}
   */
  return (params, model) => {
    return new Promise( (resolve, reject) => {
      try {

        global.modules.videoCalls.model.findOne(params)
          .then((result) => {
            let data = result.toJSON();
            data.apiKey = helper.settings.opentok.apiKey;
            resolve(data);
          })
          .catch((error) => {
            reject(helper.lib.dbError(404, error.message || 'Ocurrio un error inesperado'));
          });

      } catch(error) {
        console.error('Helper "opentok.createSession" response error');
        console.error(error);
        reject(error);
      }
    });
  };
};
