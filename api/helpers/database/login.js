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
    return new Promise((resolve, reject) => {
      try {

        const params = req.body;

        if (!params.username) {
          reject(helper.lib.httpError(401, 'Falta parametro'));
          return;
        }

        model
          .findOne({ username: params.username })
          .then((result) => {
            if (result) {
              if (!params.password || !helper.lib.bcrypt.compareSync(params.password, result.password)) {
                reject(helper.lib.httpError(401, 'Password incorrecto'));
              } 
              else {
                let data = result.toJSON();
                if(data.type) {
                  if(data.type != params.type){
                    reject(helper.lib.httpError(400, 'Tipo incorrecto'));
                  }
                  else{
                    data.token = helper.lib.jsonwebtoken.sign(data, helper.settings.token.secret);
                    resolve({ data });
                  }
                }
                else{
                  data.token = helper.lib.jsonwebtoken.sign(data, helper.settings.token.secret);
                  resolve({ data });
                }
              }
            } else {
              reject(helper.lib.httpError(401, "Usuario no existe"));
            }
          })
          .catch(error => {
            reject(helper.lib.httpError(401, error.message || 'Ocurrio un error inesperado'));
          });

      } catch (error) {
        console.error('Helper "database.login" response error');
        console.error(error);
        reject(error);
      }
    });
  };
};
