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

        let prefix = '';
        if (req.originalUrl) {
          let p = req.originalUrl.split('/');
          if (p.length >= 3) {
            prefix = p[1] + '_';
          }
        }

        if (req.files && req.files.file) {
          const file = req.files.file;
          const tmp = file.type.split('/');
          if (tmp.length == 2) {
            const newFileName = prefix + helper.lib.uuid.v4() + '.' + tmp[1];

            helper.lib.fs.rename(file.path, helper.settings.files.path + "/" + newFileName, (error) => {
              if (error) {
                reject(helper.lib.httpError(400, error.message || 'No se pudo renombrar la imagen'));
              } else {
                resolve({data:{file: newFileName}});
              }
            });
          } else {
            reject(helper.lib.httpError(400, 'No se pudo subir el archivo'));
          }
        } else {
          reject(helper.lib.httpError(400, 'No hay archivo para subir'));
        }

      } catch(error) {
        console.error('Helper "files.upload" response error');
        console.error(error);
        reject(error);
      }
    });
  };
};
