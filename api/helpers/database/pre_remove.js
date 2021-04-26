'use strict';

// Define module
module.exports = (helper) => {

    /**
     * PRE REMOVE
     *
     * 
     * @param {MongooseSchema} model - modelo a borrar 
     * @param {Object} condition - condicion de find
     */
  return (model, condition = {}) => {
    return new Promise( (resolve, reject) => {
      try {

        model.find(condition)
   		    .then(data => {
  	        if (data) data.forEach( item => { item.remove() } );
            resolve(data);
  		    }); 
      } catch(error) {
        console.error('Helper "database.pre_remove" response error');
        reject(error);
      }
    });
  };
};
