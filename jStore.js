(function( window ) {
  var
    isSizeLimitException,
    clone,
    createStoreObject,
    isActiveStore,
    getStoreContent,
    getStoreData,
    setStoreData,
    updateStoreData,
    deleteStoreData,
    clearStoreData,
    getAllStoreItems,
    evictLeastRecentlyUsed
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
      data: payload
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
  getStoreContent = function(id){
    var storeObject = JSON.parse(localStorage.getItem(id));
    return storeObject ? storeObject : null;
  };


 /**
  * Retrieve store data for given
  * id. Return null if id not found.
  *
  * @param {String} id Store object id
  */
  getStoreData = function(id){
    var storeObject = getStoreContent(id);
    return storeObject['data'] ? storeObject['data'] : null;
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
      localStorage.setItem(id, JSON.stringify(clone(storeObject)));
    } catch(e) {
      if (isSizeLimitException(e)) {
        evictLeastRecentlyUsed();
        setStoreData(id, data);
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
  
  /**
   * Retrieve all local store
   * items in id keyed map
   * 
   */
  getAllStoreItems = function(){
    var items = {};
    var ids = Object.keys(localStorage);
    for(var i = 0; i < keys.length; i++){
      items[keys[i]] = localStorage.getItem(getStoreData(keys[i]));
    }
    return items;
  };
  
  /**
   * Evict store item based on LRU
   * policy
   * 
   */
  evictLeastRecentlyUsed = function(){
    var items = {};
    var ids = Object.keys(localStorage);
    var latestId = null;
    var latestTime = Number.MAX_SAFE_INTEGER;
    for(var i = 0; i < keys.length; i++){
      var content = getStoreContent(keys[i]);
      if(content['lastUpdate'] < latestTime){
        latestTime = content['lastUpdate'];
        latestID = keys[i];
      }
    }
    if(latestID !== null)
      deleteStoreData(latestID);
  };
  
  
window.jStore = {
    isActiveStore: isActiveStore,
    getStoreData: getStoreData,
    setStoreData: setStoreData, 
    updateStoreData: updateStoreData,
    deleteStoreData: deleteStoreData,
    getAllStoreItems: getAllStoreItems
  }
}( window ));
