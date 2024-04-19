//Module
const { ipcRenderer } = require("electron");
const items = require("./items");

//Dom Modals
let showModal = document.getElementById("show-modal"),
  closeModal = document.getElementById("close-modal"),
  modal = document.getElementById("modal");
itemUrl = document.getElementById("url");
addItem = document.getElementById("add-item");
search = document.getElementById("search");

//open Menu modal from menu,js
ipcRenderer.on("menu-show-modal", () => {
  showModal.click();
});
//Open the selected item from the menu.js
ipcRenderer.on("menu-item-open", () => {
  items.open();
});
//Focus the search input from the menu.js
ipcRenderer.on("menu-focus-search", () => {
  search.focus();
});
//Delete the selected Item from the Main.js
ipcRenderer.on("delete-menu-item", () => {
  let selectedItem = items.getSelectedItem();
  items.delete(selectedItem.index);
});
//open the selected item in the native browser
ipcRenderer.on("menu-open-item-native", () => {
  items.openNative();
});
//Filter item with search
search.addEventListener("keyup", (e) => {
  //Loop items
  Array.from(document.getElementsByClassName("read-item")).forEach((item) => {
    //hide items that dont match search items
    let hasMatch = item.innerText.toLowerCase().includes(search.value);
    item.style.display = hasMatch ? "flex" : "none";
  });
});

//Disable and enable modal Buttons
const toggleModalButtons = () => {
  if (addItem.disabled === true) {
    addItem.disabled = false;
    addItem.style.opacity = 1;
    addItem.innerText = "Add Item";
    closeModal.style.display = "inline";
  } else {
    addItem.disabled = true;
    addItem.style.opacity = 0.5;
    addItem.innerText = "Adding...";
    closeModal.style.display = "none";
  }
};

//show Modals
showModal.addEventListener("click", (e) => {
  modal.style.display = "flex";
  itemUrl.focus();
});
//Hide Modals
closeModal.addEventListener("click", (e) => {
  modal.style.display = "none";
});

//Handle New Item
addItem.addEventListener("click", (e) => {
  //check url is exist
  if (itemUrl.value) {
    //send the url to the main process
    ipcRenderer.send("new-item", itemUrl.value);
    //Disable Button
    toggleModalButtons();
  }
});

//Listen item from main process
ipcRenderer.on("new-item-success", (e, newItem) => {
  //Add new items into item node
  items.addItem(newItem, true);
  //Enable Button
  toggleModalButtons();
  //Hide modal and clear value
  modal.style.display = "none";
  itemUrl.value = "";
});

//Navigate item selection with UP/Down Arrows
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    items.changeSelection(e.key);
  }
});

//keyboard monitor submit
itemUrl.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    addItem.click();
  }
});
