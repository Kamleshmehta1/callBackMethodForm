// formData is accessible here as we have global variable in formData.js
class Main {
  constructor(formContainerId, formData, storageID, tableId) {
    // start code to init and link form.js, storage.js, table.js
    // const frm = new Form(formContainerId) // form js class to create form and access its methods

    this.tableId = tableId;
    this.formData = formData;
    this.storageID = storageID;
    this.formContainerId = formContainerId;
    this.init();
  }

  init() {
    const formInstance = new Form(this.formContainerId, this.formData);
    const storageInstance = new Store(this.storageID); // storage class to access storage methods
    const tableInstance = new Table(this.tableId, this.storageID, this.formContainerId) // table js class to create table and access its methods

    tableInstance.renderTable(storageInstance.getLocalStorage(), () => {
      console.log("TABLE RENDERED");
    }); //render table data on-load


    // ---------------------------------------------------------------------------------------------------------------------------------
    // SUBMIT DATA AND SET IN STORAGE
    // ---------------------------------------------------------------------------------------------------------------------------------
    formInstance.formMethod((dataObj) => {
      storageInstance.createStorage(dataObj, (submittedArr) => {
        storageInstance.setLocalStorage(submittedArr, (getData) => {
          tableInstance.renderTable(getData, (updateArr) => {
            storageInstance.setLocalStorage(updateArr, (getData) => {
              tableInstance.renderTable(getData, (updatedObj) => {
              });
            })
          })
        });
      });
    });
    // ---------------------------------------------------------------------------------------------------------------------------------
  }
}
//formContainerId: HTML Div element id inside of which you want to create form4
// formContainerId -> #employeeForm of current index.html

// storageId: localStorage key for saving json  string data init
// storageId -> 'employeeData' simple string to selected as key of localStorage

// tableContainerId: HTML Div element id inside of which you want to create table
// tableContainerId -> #tableDiv of current index.html
const main = new Main(document.getElementById("employeeForm"),
  formData,
  "mainData",
  document.getElementById("tableDiv"));