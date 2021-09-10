// Modules to control application life and create native browser window
const {app, Tray, Menu, Notification} = require('electron');
const path = require('path');
const Store = require('electron-store');

let tray;
let notificationInterval;

//Allow only one instance of the app
const isFirstInstance = app.requestSingleInstanceLock();
if (!isFirstInstance) {
    app.quit();
}

app.whenReady().then(() => {
   //  app.dock.hide();

    firstRunCheck();
    initTrayMenu();

    const notificationIntervalTime = 1000 * 60 * 30 ; // 30 mins
    notificationInterval = setInterval(() => {
        sendNotification();
    }, notificationIntervalTime);
});


app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
});

app.on("quit", () => {
    clearInterval(notificationInterval);
});



const initTrayMenu = () => {
    tray = new Tray(path.join(__dirname, '/assets/icon.png'));

    const contextMenu = Menu.buildFromTemplate([
        {
            label: "Open at startup",
            type: 'checkbox',
            checked: app.getLoginItemSettings().openAtLogin,
            click: toggleStartupRun
        },
        {
            label: 'Quit',
            click: () => app.quit()
        },
        {
            label: 'Pause',
            click: pause
        },
        {
            label: 'Start',
            click: start
        },
	{
            label: 'Test',
            click: test
        }
    ]);

    tray.setToolTip('Break Notifer');
    tray.setContextMenu(contextMenu);
};

const sendNotification = () => {
    if (!Notification.isSupported()) return;


    const notification = new Notification({
        title: "STANDUP OR GO FOR A WALK",
        subtitle: 'you\'ve sitting for 30mins ',
        icon: path.join(__dirname, '/assets/tumb.png'),
        body: "30-Mins Reminder",
    });

    notification.show();
};

const firstRunCheck = () => {
    const store = new Store();
    const runBefore = store.get('runBefore');
    if (!runBefore) {
        app.setLoginItemSettings({openAtLogin: true});
        store.set('runBefore', true);
    }
};

const toggleStartupRun = () => {
    const openAtLogin = !app.getLoginItemSettings().openAtLogin;
    app.setLoginItemSettings({openAtLogin});
};

const randomNumber = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};


const pause = () => {
    clearInterval(notificationInterval);

};



const start= () => {
    const notificationIntervalTime = 1000 * 60 * 30; // One hour* 60 * 60
    notificationInterval = setInterval(() => {
        sendNotification();
    }, notificationIntervalTime);

};


const test = () => {
    sendNotification();

};


