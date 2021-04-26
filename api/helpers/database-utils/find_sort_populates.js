'use strict';

// Define module
module.exports = (helper) => {

  /**
   * Find
   *
   * @param {Object} params - Parameters
   * @param {Object} model - Model
   * @return {Promise}
   */
  return (params, model) => {
    return new Promise((resolve, reject) => {
      try {

        let itemsPerPage = helper.settings.database.itemsPerPage;
        let page = 0;

        if (params.page && params.page > 0) {
          page = parseInt(params.page) - 1;
        } else {
          itemsPerPage = 0;
        }
        model
        .find(params.query || {}, params.projection || [])
        // .collation({locale: "es", strength: 1})
        .select(params.select || {})
        .populate(params.populates || [])
        .sort(params.sort || {})
        .limit(itemsPerPage)
        .skip(itemsPerPage * page)
        .then(async (data) => {
          if (params.sortPopulates.populated && params.sortPopulates.orderby) {
              data.sort((a, b) => {
                if (a[params.sortPopulates.populated][params.sortPopulates.orderby] > b[params.sortPopulates.populated][params.sortPopulates.orderby]) {
                  if (params.sortPopulates.order) return 1;
                  else return -1
                }
                if (a[params.sortPopulates.populated][params.sortPopulates.orderby] < b[params.sortPopulates.populated][params.sortPopulates.orderby]) {
                  if (!params.sortPopulates.order) return 1;
                  else return -1
                }
                return 0;
              })
            }
            const count = await model.countDocuments(params.query);
            const result = {
              data: data,
              count: count,
              page: page + 1,
              pages: itemsPerPage == 0 ? 1 : Math.ceil(count / itemsPerPage),
              itemsPerPage: itemsPerPage == 0 ? count : itemsPerPage
            };
            resolve(result);
          })
          .catch(error => {
            console.log(error);
            reject(helper.lib.dbError(error.code || -1000, error.message || 'Ocurrio un error inesperado'));
          });

      } catch (error) {
        console.error('Helper "databaseUtils.find" response error');
        reject(error);
      }
    });
  };
};
