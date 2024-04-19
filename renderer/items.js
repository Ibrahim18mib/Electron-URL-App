//Modules
const { shell } = require("electron");
const fs = require("fs");
//DOM nodes
let items = document.getElementById("items");
//Get readerJs content
let readerJS;
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
  readerJS = data.toString();
});

//Listen for "done" message from the reader window
window.addEventListener("message", (e) => {
  console.log("Listening from reader", e.data);
  if (e.data.action === "delete-reader-item") {
    //delete item at the given Index
    this.delete(e.data.itemIndex);
    //close the reader window
    e.source.close();
  }
});
//Delete Item Function
exports.delete = (itemIndex) => {
  //remove item from DOM
  items.removeChild(items.childNodes[itemIndex]);
  //remove item from storage
  this.storage.splice(itemIndex, 1);
  //persist storage
  this.save();
  //select previous item or new top item
  if (this.storage.length) {
    //get new selected item Index
    let = newSelectedItemIndex = itemIndex === 0 ? 0 : itemIndex - 1;
    //select item at new Index
    document
      .getElementsByClassName("read-item")
      [newSelectedItemIndex].classList.add("selected");
  }
};

//get selected item index
exports.getSelectedItem = () => {
  //get selected node
  let currentItem = document.getElementsByClassName("read-item selected")[0];

  //get Item Index
  let itemIndex = 0;
  let child = currentItem;
  while ((child = child.previousElementSibling) != null) itemIndex++;
  //return selected item and Index
  return { node: currentItem, index: itemIndex };
};

//track items in storage
exports.storage = JSON.parse(localStorage.getItem("readit-items")) || [];

//Persist storage
exports.save = () => {
  localStorage.setItem("readit-items", JSON.stringify(this.storage));
};

//Move with arrow to newly selected Items
exports.changeSelection = (direction) => {
  //get seledcted item
  let currentItem = this.getSelectedItem();

  //Handle up/Down arrows
  if (direction === "ArrowUp" && currentItem.node.previousElementSibling) {
    currentItem.node.classList.remove("selected");
    currentItem.node.previousElementSibling.classList.add("selected");
  } else if (direction === "ArrowDown" && currentItem.node.nextElementSibling) {
    currentItem.node.classList.remove("selected");
    currentItem.node.nextElementSibling.classList.add("selected");
  }
};

//open the selected Item in the native browser
exports.openNative = () => {
  //Only if we have items  (in case of menu open)
  if (!this.storage.length) return;
  //Get selected item
  let selectedItem = this.getSelectedItem();
  //Get item url
  let contentURL = selectedItem.node.dataset.url;
  //open in users default system browser
  shell.openExternal(contentURL);
};

//open Selected Items
exports.open = () => {
  //Only if we have items  (in case of menu open)
  if (!this.storage.length) return;
  //Get selected item
  let selectedItem = this.getSelectedItem();
  //Get item url
  let contentURL = selectedItem.node.dataset.url;
  //open item in proxy browser window
  let readerWin = window.open(
    contentURL,
    "",
    `
  maxWidth = 2000,
  maxHeight = 2000,
  width = 1000,
  height  = 600,
  backgroundcolor = #DEDEDE,
  nodeIntegration = 0,
  contextIsolation = 1
  `
  );
  //Inject Javascript with specific itemIndex {selectedItem.index}
  readerWin.eval(readerJS.replace("{{index}}", selectedItem.index));
};

//set items as selected
exports.select = (e) => {
  //remove currently selected item classs
  this.getSelectedItem().node.classList.remove("selected");
  //Add to clicked Item
  e.currentTarget.classList.add("selected");
};

//Add neew Item
exports.addItem = (item, isNew = false) => {
  //Create a new DOM node
  let itemNode = document.createElement("div");
  //Assign read-item class
  itemNode.setAttribute("class", "read-item");
  //setting item url as an Sata attribute
  itemNode.setAttribute("data-url", item.url);
  //Add innerHTML text
  itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`;
  //Append new node to item
  items.appendChild(itemNode);
  //Attach click handler to select
  itemNode.addEventListener("click", this.select);
  //attach double click handler to open
  itemNode.addEventListener("dblclick", this.open);

  //if this is the first item, select it

  if (document.getElementsByClassName("read-item").length === 1) {
    itemNode.classList.add("selected");
  }

  //Add item to storage and persist storage
  if (isNew) {
    this.storage.push(item);
    this.save();
  }
};

//Add items from storage when App Loads
this.storage.forEach((item) => {
  this.addItem(item);
});
