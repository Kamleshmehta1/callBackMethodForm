class Store {
  constructor(storageId) {
    this.eventsArr = ["set_data", "update_data", "delete_data", "get_data"];
    // Pass storageId to save json string data after each operation in localStorage
    // local storageId is important to retrieve old saved data
    this.handleEvents = {
      updateEvent: [],
      createEvent: [],
      deleteEvent: [],
    }
    this.globalArr = [];
    this.storageId = storageId;
  }

  updateStorage(dataObj, id) {
    const dataArr = this.getLocalStorage();
    const index = dataArr.findIndex((ele) => ele.id === id)
    dataArr[index] = dataObj;
    this.setLocalStorage(dataArr);
  }



  setItem(arr) {
    localStorage.setItem(this.storageId, JSON.stringify(arr));
  }

  deleteStorage(data, id) {
    let filteredData = data.filter((ele) => ele.id != id);
    return filteredData;
  }


  getLocalStorage() {
    return JSON.parse(localStorage.getItem(this.storageId));
  }

  setLocalStorage(setArr, cb) {
    localStorage.setItem(this.storageId, JSON.stringify(setArr));
    cb(this.getLocalStorage());
  }

  // create methods to perform operations like save/edit/delete/add data
  createStorage(obj, cb) {
    let newObj = { ...obj };
    this.globalArr = this.getLocalStorage(this.storageId) || this.globalArr;
    this.globalArr.push(newObj);
    cb(this.globalArr);
    // cb(this.getLocalStorage());
  }

  setStorage(obj, cb) {
    let newObj = { ...obj };
    let storageArr = [];

    storageArr.push(newObj);
    cb(this.getLocalStorage());
  }
}