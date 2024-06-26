//module
const { Menu, shell, ipcRenderer, Accelerator } = require("electron");

//Module function to create app Menu
module.exports = (appWin) => {
  console.log("menu fetching...");
  //menu template
  let template = [
    {
      label: "Items",
      submenu: [
        {
          label: "Add New",
          accelerator: "CmdOrCtrl+O",
          click: () => {
            appWin.send("menu-show-modal");
          },
        },
        {
          label: "Read Item",
          accelerator: "CmdOrCtrl+Enter",
          click: () => {
            appWin.send("menu-item-open");
          },
        },
        {
          label: "Search-Items",
          accelerator: "CmdOrCtrl+S",
          click: () => {
            appWin.send("menu-focus-search");
          },
        },
        {
          label: "Delete",
          accelerator: "CmdOrCtrl+Backspace",
          click: () => {
            appWin.send("delete-menu-item");
          },
        },
        {
          label: "Open in Browser",
          accelerator: "CmdOrCtrl+Shift+Enter",
          click: () => {
            appWin.send("menu-open-item-native");
          },
        },
      ],
    },
    {
      role: "editMenu",
    },
    {
      role: "windowMenu",
    },
    {
      role: "help",
      submenu: [
        {
          label: "Learn More",
          click: () => {
            shell.openExternal(
              "https://github.com/Ibrahim18mib/Electron-URL-App"
            );
          },
        },
      ],
    },
  ];

  ///create MAC App menu
  if (process.platform === "darwin") template.unshift({ role: "appMenu" });

  //build menu
  let menu = Menu.buildFromTemplate(template);

  //set as main app menu
  Menu.setApplicationMenu(menu);
};
