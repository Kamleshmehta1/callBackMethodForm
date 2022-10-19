class Form {
  constructor(formContainerId, formData) {
    // Pass formContainerId to append form element inside of HTML DIV element
    this.globalObject = {};
    // Pass formContainerId to append form element inside of HTML DIV element
    this.label;
    this.inputTag;
    this.globalObject;
    this.formData = formData;
    this.mainContainer;
    this.leftContainer;
    this.rightContainer;
    this.uniqueId;
    this.currentDate;
    this.formData = formData;
    this.formContainerId = formContainerId;
    this.newSubmittedData = []
    // this.formMethod();
  }
  // create methods/event to create form/ reset form/ submit form, etc

  // create form
  isValidElement(input) {
    return (
      document.createElement(input).toString() != "[object HTMLUnknownElement]");
  }
  createElement(element) {
    this.inputTag = document.createElement(
      `${`${this.isValidElement(element) ? element : "input"}`}`
    );
    return this.inputTag;
  }

  containerMethod() {
    this.leftContainer = document.createElement("div");
    this.rightContainer = document.createElement("div");
    this.mainContainer = document.createElement("div");
  }

  appendChildMethod(Obj, errorMessage) {
    // tag classLists
    this.leftContainer.classList = "left";
    this.rightContainer.classList = "right";
    // appending tags to the container tags
    if (Obj.type != "hidden" && Obj.type != "submit" && Obj.type != "reset") {
      this.leftContainer.appendChild(this.label);
    }
    this.mainContainer.appendChild(this.leftContainer);

    if (Obj.type != "radio" && Obj.type != "checkbox") {
      this.rightContainer.appendChild(this.inputTag);
      if (Obj.type === "submit") {
        let buttonUpdate = document.createElement("button");
        // buttonUpdate.setAttribute("type", "button");
        buttonUpdate.innerText = "Update";
        buttonUpdate.classList = "updateButton";
        this.rightContainer.appendChild(buttonUpdate);
      }
      errorMessage.classList = "errorMessage";
      this.mainContainer.appendChild(this.rightContainer);
      this.mainContainer.appendChild(errorMessage);
    }
    this.formContainerId.appendChild(this.mainContainer);
  }

  formMethod(cb) {
    this.formData.forEach((Obj) => {
      // tags initialization
      if (Obj.type != "hidden" && Obj.type != "submit" && Obj.type != "reset") {
        this.label = this.createElement("label");
        this.label.innerText = Obj.label;
      }
      this.createElement(Obj.type);


      // if (Obj.type === "select") {
      //   this.inputTag.setAttribute("multiple", true)
      // }

      let errorMessage = document.createElement("div");
      // container method
      this.containerMethod();
      // recursive call
      typeof Obj === "object" && Obj.type != "radio" && Obj.type != "checkbox"
        ? this.recursiveFlattering(Obj, Obj.key, errorMessage, cb)
        : "";

      // appending method
      this.appendChildMethod(Obj, errorMessage);

      // handleIteration
      if (Obj.options) {
        this.handleIteration(Obj, Obj.key, errorMessage);
      }
    });
  }

  millisecondsToTime(ms) {
    const date = new Date(ms);
    let currDate = date.toString();
    return currDate.slice(0, 24);
  }

  recursiveFlattering(Obj, eleKey, errorMessage, cb) {
    for (let key in Obj) {
      switch (typeof Obj[key]) {
        case "function": //function event
          this.inputTag[`${key}`] = (event) => {
            event.preventDefault();
            Obj.value === "Submit"
              ? this.handleSubmit(cb)
              : this.handleEvent(event, eleKey, errorMessage);
          };
          break;
        case "object": // object
          this.recursiveFlattering(Obj[key], eleKey, errorMessage, cb);
          break;
        default: //default case to set attributes of elements
          key === "id" && Obj.value !== "Submit" && Obj.value != "Reset"
            ? this.label.setAttribute("for", Obj[key])
            : "";
          key === "className"
            ? (this.inputTag.classList = Obj[key])
            : key === "innerText"
              ? (this.inputTag.innerText = Obj[key])
              : this.inputTag.setAttribute(key, Obj[key]);
          break;
      }
    }
  }

  handleIteration(Obj, eleKey, errorMessage, cb) {
    let rightElement = this.inputTag;
    Obj.options.forEach((ele) => {
      if (Obj.type === "select") {
        //handle select tag
        this.inputTag = this.createElement("option");
        this.recursiveFlattering(ele, eleKey, errorMessage, cb);
        rightElement.appendChild(this.inputTag);
      } else {
        let div = document.createElement("div"); //handle checkbox && radio
        Obj.type === "checkbox"
          ? (div.id = "handleCheck")
          : (div.id = "handleRadio");
        this.label = document.createElement("label");
        this.label.innerText = ele.innerText;
        this.inputTag = this.createElement(Obj.type);
        this.recursiveFlattering(Obj, eleKey, errorMessage, cb);
        this.recursiveFlattering(ele, eleKey, errorMessage, cb);
        div.appendChild(this.inputTag);
        div.appendChild(this.label);
        this.formContainerId.appendChild(div);
      }
    });
  }

  handleSubmit(cb) {
    this.handleUserId();
    this.handleCreatedAt();
    // this.newSubmittedData.push(this.globalObject)
    cb(this.globalObject)
    this.uniqueId = null;
    this.currentDate = null;
  }



  handleMessage(msg, color, errorMessage) {
    errorMessage.innerText = msg;
    errorMessage.style.color = color;
    errorMessage.style.textAlign = "center";
    setTimeout(() => {
      errorMessage.innerText = "";
    }, 2000);
  }

  handleUserId() {
    let ObjId = this.formData.find((Obj) => Obj.type === "hidden");
    this.uniqueId = this.uniqueId || ObjId.getValue();
    this.globalObject[ObjId.key] = this.uniqueId;
  }

  handleCreatedAt() {
    let Obj = this.formData.find(
      (Obj) => Obj.type === "hidden" && Obj.label !== "User Id"
    );
    this.currentDate = this.currentDate || this.millisecondsToTime(Obj.getValue());
    this.globalObject[Obj.key] = this.currentDate;
  }

  handleEvent(e, eleKey, errorMessage) {
    e.target.setAttribute("value", e.target.value);

    if (e.target.getAttribute("type") === "tel") {
      e.target.value.length === 10
        ? ""
        : this.handleMessage("Invalid number", "red", errorMessage);
    }

    if (e.target.value.slice(0, 1) === " ") {
      e.target.style.boxShadow = "0 0 10px red";
      e.target.focus();
      e.target.value = "";
      this.handleMessage("Invalid input", "red", errorMessage);
      return;
    }
    for (let x in e.target.validity) {
      if (!e.target.validity.valid && e.target.tagName != "SELECT") {
        e.target.style.boxShadow = "0 0 10px red";
        e.target.focus();
        this.handleMessage(
          `ERROR: ${x === "valid" ? "invalid input value for email" : x}`,
          "red",
          errorMessage
        );
        return;
      }
    }
    e.target.style.boxShadow = "none";

    let localArr = [];
    this.formData;

    this.handleUserId();

    this.handleCreatedAt();

    if (e.target.parentNode.id === "handleCheck") {
      let nodeList = Array.from(e.target.parentNode.parentNode.childNodes);
      nodeList.forEach((ele) => {
        if (
          ele.firstChild.checked &&
          (ele.firstChild.getAttribute("label") === "Hobbies" ||
            ele.firstChild.getAttribute("key") === "hobbies")
        ) {
          localArr.push(ele.firstChild.value);
        }
      });
      this.globalObject[eleKey] = localArr;
    } else this.globalObject[eleKey] = e.target.value;
  }
}