'use strict';

// Define module
module.exports = (helper) => {

  return (roles = ['anonymous']) => {
    return (req, res, next) => {
      try {

        // Define context user
        let user = null;

        // Define token
        let token = req.body.token || req.query.token || req.headers['x-access-token'] || null;
        if (token) {
          try {
            user = helper.lib.jsonwebtoken.verify(token, helper.settings.token.secret);
          } catch(error) {
            let message = "Token inválido";
            if (error.message) message = error.message;
            return next(helper.lib.httpError(401, message));
          }
        } else {
          return next(helper.lib.httpError(401, "No se encuentra token"));
        }

        // Verify roles
        let userRoles = [...user.roles || []];
        userRoles.push('anonymous');
        if(!roles.some(r=> userRoles.includes(r))) {
          return next(helper.lib.httpError(401, 'Acceso inválido'));
        }

        // Define user
        if(user) req.user = user;

        // Return result
        next();
      } catch(error) {
        console.error('Helper "security.auth" response error');
        console.error(error);
        next(error);
      }
    };
  };
};
