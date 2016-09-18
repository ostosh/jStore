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
  
  isActiveStore = function(id){
    var storeObject = localStorage.getItem(id);
    return storeObject ? true : false; 
  };
  	
  getStoreData = function(id){
    var storeObject = JSON.parse(localStorage.getItem(id));
    return storeObject['content'] ? storeObject['content'] : null;
  };

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
  
  updateStoreData = function(id, data){
    deleteStoreData(id);
    setStoreData(id, data);
  };
  
  deleteStoreData = function(id){
     localStorage.removeItem(id);
  };
  
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
