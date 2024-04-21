//Electron updater Module
const { dialog } = require("electron");
const { autoUpdater } = require("electron-updater");

///configure log for updater debugging
autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "info";

//disable auto updater downloading..
autoUpdater.autoDownload = false;

//Single export to check for and apply any avaulable updates

module.exports = () => {
  // check for update GH release
  autoUpdater.checkForUpdates();

  // Listen for update found
  autoUpdater.on("update-available", () => {
    //Prompt user to start download
    dialog
      .showMessageBox({
        type: "info",
        title: "Update Available",
        message:
          "A new version of Readit Available.Do you want to update now ?",
        buttons: ["Update", "No"],
      })
      .then((result) => {
        let buttonIndex = result.response;

        //if button is 0(update), start the downloading
        if (buttonIndex === 0) autoUpdater.downloadUpdate();
      });
  });

  //Listen for update Downloaded
  autoUpdater.on("update-downloaded", () => {
    //prompt the user to install the update

    dialog
      .showMessageBox({
        type: "info",
        title: "Update Ready",
        message: "Install and Restart now ?",
        buttons: ["Yes", "Later"],
      })
      .then((result) => {
        let buttonIndex = result.response;

        //if button is 0(install), Install and restart
        if (buttonIndex === 0) autoUpdater.quitAndInstall(false, true);
      });
  });
};
