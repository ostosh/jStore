(function( window ) {
  var
    isSizeLimitException,
    clone,
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
  * Deep clone given object
  *
  * @param {Object} content The object
  * to be cloned
  */
  clone = function(content) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == content || 'object' !== typeof content) 
      return content;

    // clone Date
    if (content instanceof Date) {
        copy = new Date();
        copy.setTime(content.getTime());
        return copy;
    }

    // clone Array
    if (content instanceof Array) {
        copy = [];
        for (var i = 0, len = content.length; i < len; i++) {
            copy[i] = clone(content[i]);
        }
        return copy;
    }

    // clone Object
    if (content instanceof Object) {
        copy = {};
        for (var attr in content) {
            if (content.hasOwnProperty(attr)) 
              copy[attr] = clone(content[attr]);
        }
        return copy;
    }
  };

  /**
  * Creates local store object
  * for given content
  *
  * @param {Object} content The store object
  * data to be stored
  */
  createStoreObject = function(content){
    var payload;
    if('object' === typeof content)
      payload = clone(content);
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
  * @param {Object} data Store object data
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
  * @param {Object} data Store object data
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
  clearStoreData = function(){
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
