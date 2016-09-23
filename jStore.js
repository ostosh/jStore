(function( window ) {
  var
    isSizeLimitException,
    createStoreObject,
    isActiveStore,
    getStoreData,
    setStoreData,
    updateStoreData,
    deleteStoreData,
    clearStoreData
  ;
  
  /**
  * Detects browser specific
  * implementation of local store size
  * limitation exception
  *
  * @param {exception} e The exception thrown
  */
  isSizeLimitException = function(e){
    var quotaExceeded = false;
    if (e) {
      if (e.code === 22)//Default
        return true;
      else if(e.code === 1014 && e.name === 'NS_ERROR_DOM_QUOTA_REACHED')//Firefox
        return true;
      else if(e.number === -2147024882)//IE 8
        return true;
    }
    return false;
  }

  /**
  * Creates local store object
  * for given content
  *
  * @param {} content The store object
  * data to be stored
  */
  createStoreObject = function(content){
    var payload;
    if(content instanceof Array)
      payload = $.extend(true, [], content);
    else if(typeof content === 'object')
      payload = $.extend(true, {}, content);
    else
      payload = content;
    return {
      lastUpdate: new Date().getTime(),
      content: payload
    };
  };	
  
  /**
  * Tests if given id is currently
  * stored
  *
  * @param {String} id Store object id
  */
  isActiveStore = function(id){
    var storeObject = localStorage.getItem(id);
    return storeObject ? true : false; 
  };
  
    
  /**
  * Retrieve store object for given
  * id. Return null if id not found.
  *
  * @param {String} id Store object id
  */
  getStoreData = function(id){
    var storeObject = JSON.parse(localStorage.getItem(id));
    return storeObject['content'] ? storeObject['content'] : null;
  };

  /**
  * Create and store object for given
  * id and data.
  *
  * @param {String} id Store object id
  * @param {} data Store object data
  */
  setStoreData = function(id, data){
    var storeObject = createStoreObject(data);
    try {
      localStorage.setItem(id, JSON.stringify(storeObject));
    } catch(e) {
      if (isSizeLimitException(e)) {
        clearStoreData();
      }
    } 
  };
  
  /**
  * Update store object for given
  * id and data.
  *
  * @param {String} id Store object id
  * @param {} data Store object data
  */
  updateStoreData = function(id, data){
    deleteStoreData(id);
    setStoreData(id, data);
  };
  
  /**
  * Delete store object for given
  * id.
  *
  * @param {String} id Store object id
  */
  deleteStoreData = function(id){
     localStorage.removeItem(id);
  };
  
  /**
  * Clear user localstore.
  * 
  */
  clearStoreData = function(id){
    localStorage.clear();
  };
  
window.jStore = {
    isActiveStore: isActiveStore,
    getStoreData: getStoreData,
    setStoreData: setStoreData, 
    updateStoreData: updateStoreData,
    deleteStoreData: deleteStoreData
  }
}( window ));
