//Modules
const { BrowserWindow } = require("electron");

//offscreen browserwindow
let offscreenWindow;

//Exported readItem Function
module.exports = (url, callback) => {
  //create Offscreen Window
  offscreenWindow = new BrowserWindow({
    width: 500,
    height: 500,
    show: false,
    webPreferences: {
      offscreen: true,
    },
  });

  //load the Item url
  offscreenWindow.loadURL(url);
  //wait for content to finish loading
  offscreenWindow.webContents.on("did-finish-load", (e) => {
    //get page title
    let title = offscreenWindow.getTitle();
    //get Screenshot(thumbnail)
    offscreenWindow.webContents.capturePage().then((image) => {
      //get Image as a dataUrl
      let screenshot = image.toDataURL();

      //execute callback with new item object
      callback({ title, screenshot, url });
      //cleanup
      offscreenWindow.close();
      offscreenWindow = null;
    });
  });
};
