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
  return (filter, model) => {
    return new Promise( (resolve, reject) => {
      try {

        let password = helper.lib.passwordGenerator();
        let transporter = helper.lib.nodemailer.createTransport(global.helpers.database.settings.nodemailer.transporter);

        model.findOne(filter).then(result => {
          if (result){
            result.password = helper.lib.bcrypt.hashSync(password, helper.settings.crypto.saltRounds);
            result.update(result)
              .then(updated => {

                let mailOptions = {
                  text: "Su nueva contraseña es: " + password,
                  to: result.emailAddress
                };

                mailOptions.from = global.helpers.database.settings.nodemailer.mailOptions.from;
                mailOptions.subject = global.helpers.database.settings.nodemailer.mailOptions.subject;
                transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                      reject(error);
                    } else {
                      resolve({message: "Se ha enviado la nueva contraseña a su mail satisfactoriamente"});
                  }
              });
            });
          } else {
            reject({message:"Usuario no existe"});
          }
        });
      } catch(error) {
        console.error('Helper "database.recoveryPassword" response error');
        console.error(error);
        reject(error);
      }
    });
  };
};
