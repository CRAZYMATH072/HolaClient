//
// Hola Client
// 
// ©️Hola LLC
//
"use strict";

// Load packages.
const chalk = require("chalk");
console.clear();
console.log(chalk.gray("+ ") + chalk.cyan("[") + chalk.white("HolaClient") + chalk.cyan("]") + chalk.white(" ------+ Loading Packages... "));
const fs = require("fs");
const fetch = require('node-fetch');
const log = require('./routes/handlers/log')
console.log(chalk.gray("+ ") + chalk.cyan("[") + chalk.white("HolaClient") + chalk.cyan("]") + chalk.white(" Packages Loaded ✔️ "));
console.log(" ");
const arciotext = require('./routes/handlers/arciotext')
global.Buffer = global.Buffer || require('buffer').Buffer;

if (typeof btoa === 'undefined') {
    global.btoa = function(str) {
        return new Buffer(str, 'binary').toString('base64');
    };
}
if (typeof atob === 'undefined') {
    global.atob = function(b64Encoded) {
        return new Buffer(b64Encoded, 'base64').toString('binary');
    };
}

// Load settings.
console.log(chalk.gray("+ ") + chalk.cyan("[") + chalk.white("HolaClient") + chalk.cyan("]") + chalk.white(" ------+ Loading Settings... "));
const settings = require("./settings.json");
console.log(chalk.gray("+ ") + chalk.cyan("[") + chalk.white("HolaClient") + chalk.cyan("]") + chalk.white(" Settings Loaded ✔️ "));
console.log(" ");
const defaultthemesettings = {
    index: "index.ejs",
    notfound: "index.ejs",
    redirect: {},
    pages: {},
    mustbeloggedin: [],
    mustbeadmin: [],
    variables: {}
};

module.exports.renderdataeval =
    `(async () => {
   let newsettings = JSON.parse(require("fs").readFileSync("./settings.json"));
	const JavaScriptObfuscator = require('javascript-obfuscator');

 
    let renderdata = {
      req: req,
      settings: newsettings,
      userinfo: req.session.userinfo,
      packagename: req.session.userinfo ? await db.get("package-" + req.session.userinfo.id) ? await db.get("package-" + req.session.userinfo.id) : newsettings.api.client.packages.default : null,
      extraresources: !req.session.userinfo ? null : (await db.get("extra-" + req.session.userinfo.id) ? await db.get("extra-" + req.session.userinfo.id) : {
        ram: 0,
        disk: 0,
        cpu: 0,
        servers: 0,
        backups: 0,
        allocations: 0,
        databases: 0
      }),
		packages: req.session.userinfo ? newsettings.api.client.packages.list[await db.get("package-" + req.session.userinfo.id) ? await db.get("package-" + req.session.userinfo.id) : newsettings.api.client.packages.default] : null,
      coins: newsettings.api.client.coins.enabled == true ? (req.session.userinfo ? (await db.get("coins-" + req.session.userinfo.id) ? await db.get("coins-" + req.session.userinfo.id) : 0) : null) : null,
      pterodactyl: req.session.pterodactyl,
      theme: theme.name,
      extra: theme.settings.variables,
	  db: db
    };
    if (newsettings.api.arcio.enabled == true && req.session.arcsessiontoken) {
      renderdata.arcioafktext = JavaScriptObfuscator.obfuscate(\`
        let token = "\${req.session.arcsessiontoken}";
        let everywhat = \${newsettings.api.arcio["afk page"].every};
        let gaincoins = \${newsettings.api.arcio["afk page"].coins};
        let arciopath = "\${newsettings.api.arcio["afk page"].path.replace(/\\\\/g, "\\\\\\\\").replace(/"/g, "\\\\\\"")}";

        \${arciotext}
      \`);
    };

    return renderdata;
  })();`;

// Load database
console.log(chalk.gray("+ ") + chalk.cyan("[") + chalk.white("HolaClient") + chalk.cyan("]") + chalk.white(" ------+ Loading Database... "));
const Keyv = require("keyv");
const db = new Keyv("sqlite://database/db.sqlite");

db.on('error', err => {
    console.log(chalk.red("[DATABASE] An error has occured when attempting to access the database."))
});

module.exports.db = db;
console.log(chalk.gray("+ ") + chalk.cyan("[") + chalk.white("HolaClient") + chalk.cyan("]") + chalk.white(" Database Loaded ✔️ "));
console.log(" ");

// Load websites.
console.log(chalk.gray("+ ") + chalk.cyan("[") + chalk.white("HolaClient") + chalk.cyan("]") + chalk.white(" ------+ Loading Web Files... "));
const express = require("express");
const app = express();
require('express-ws')(app);
console.log(chalk.gray("+ ") + chalk.cyan("[") + chalk.white("HolaClient") + chalk.cyan("]") + chalk.white(" WebFiles Loaded ✔️ "));
console.log(" ");

// Load express addons.
console.log(chalk.gray("+ ") + chalk.cyan("[") + chalk.white("HolaClient") + chalk.cyan("]") + chalk.white(" ------+ Loading Addons... "));
const ejs = require("ejs");
const session = require("express-session");
const indexjs = require("./index.js");
console.log(chalk.gray("+ ") + chalk.cyan("[") + chalk.white("HolaClient") + chalk.cyan("]") + chalk.white(" Addons   Loaded ✔️ "));
console.log(" ");



// Load the website.
console.log(chalk.gray("+ ") + chalk.cyan("[") + chalk.white("HolaClient") + chalk.cyan("]") + chalk.white(" ------+ Loading Website... "));
module.exports.app = app;

app.use(session({
    secret: settings.website.secret,
    resave: false,
    saveUninitialized: false
}));

app.use(express.json({
    inflate: true,
    limit: '500kb',
    reviver: null,
    strict: true,
    type: 'application/json',
    verify: undefined
}));
console.log(chalk.gray("+ ") + chalk.cyan("[") + chalk.white("HolaClient") + chalk.cyan("]") + chalk.white(" Web View Loaded ✔️ "));
// Load the API files.
console.log(" ");
console.log(chalk.gray("+ ") + chalk.cyan("[") + chalk.white("HolaClient") + chalk.cyan("]") + chalk.white(" ------+ Loading APIs... "));
const apifiles = fs.readdirSync('./routes').filter(file => file.endsWith('.js'));

apifiles.forEach(file => {
    const apifile = require(`./routes/${file}`);
    if (typeof apifile.load === 'function') {
        apifile.load(app, db);
    } else {
        const apifiles1 = fs.readdirSync('./routes').filter(file1 => file.endsWith('.js'));
        console.error(`'load' function not found in ${file}`);
    }
});
const adminfiles = fs.readdirSync('./routes/admin').filter(file => file.endsWith('.js'));

adminfiles.forEach(file => {
    const adminfiles = require(`./routes/admin/${file}`);
    if (typeof adminfiles.load === 'function') {
        adminfiles.load(app, db);
    } else {
        const adminfiles1 = fs.readdirSync('./routes/admin').filter(file1 => file.endsWith('.js'));
        console.error(`'load' function not found in ${file}`);
    }
});
const authfiles = fs.readdirSync('./routes/authentication').filter(file => file.endsWith('.js'));

authfiles.forEach(file => {
    const authfiles = require(`./routes/authentication/${file}`);
    if (typeof authfiles.load === 'function') {
        authfiles.load(app, db);
    } else {
        const authfiles1 = fs.readdirSync('./routes/authentication').filter(file1 => file.endsWith('.js'));
        console.error(`'load' function not found in ${file}`);
    }
});

const earnfiles = fs.readdirSync('./routes/earn').filter(file => file.endsWith('.js'));

earnfiles.forEach(file => {
    const earnfiles = require(`./routes/earn/${file}`);
    if (typeof earnfiles.load === 'function') {
        earnfiles.load(app, db);
    } else {
        const earnfiles1 = fs.readdirSync('./routes/earn').filter(file1 => file.endsWith('.js'));
        console.error(`'load' function not found in ${file}`);
    }
});
const structurefiles = fs.readdirSync('./routes/structures').filter(file => file.endsWith('.js'));

structurefiles.forEach(file => {
    const structurefiles = require(`./routes/structures/${file}`);
    if (typeof structurefiles.load === 'function') {
        structurefiles.load(app, db);
    } else {
        const structurefiles1 = fs.readdirSync('./routes/structures').filter(file1 => file.endsWith('.js'));
        console.error(`'load' function not found in ${file}`);
    }
});
const controller = fs.readdirSync('./routes/controller').filter(file => file.endsWith('.js'));

controller.forEach(file => {
    const controller = require(`./routes/controller/${file}`);
    if (typeof controller.load === 'function') {
        controller.load(app, db);
    } else {
        const controller1 = fs.readdirSync('./routes/controller').filter(file1 => file.endsWith('.js'));
        console.error(`'load' function not found in ${file}`);
    }
});
const userfiles = fs.readdirSync('./routes/users').filter(file => file.endsWith('.js'));

userfiles.forEach(file => {
    const userfiles = require(`./routes/users/${file}`);
    if (typeof userfiles.load === 'function') {
        userfiles.load(app, db);
    } else {
        const userfiles1 = fs.readdirSync('./routes/users').filter(file1 => file.endsWith('.js'));
        console.error(`'load' function not found in ${file}`);
    }
});
console.log(" ");
console.log(chalk.gray("+ ") + chalk.cyan("[") + chalk.white("HolaClient") + chalk.cyan("]") + chalk.white(" ------+ Finalizing... "));
const listener = app.listen(settings.website.port, function() {
    console.clear();
    console.log(chalk.gray("  "));
    console.log("  _    _       _        _____ _ _            _   ");
    console.log(" | |  | |     | |      / ____| (_)          | |  ");
    console.log(" | |__| | ___ | | __ _| |    | |_  ___ _ __ | |_ ");
    console.log(" |  __  |/ _ \\| |/ _` | |    | | |/ _ \\ '_ \\| __|");
    console.log(" | |  | | (_) | | (_| | |____| | |  __/ | | | |_ ");
    console.log(" |_|  |_|\\___/|_|\\__,_|\\_____|_|_|\\___|_| |_|\\__|");
    console.log(chalk.white(" "))
    console.log(chalk.white("=====================SOCIAL======================"));
    console.log(chalk.gray("[+] ") + chalk.white("[") + chalk.cyan("Discord") + chalk.white("]") + chalk.white(" https://discord.gg/CvqRH9TrYK "));
    console.log(chalk.gray("[+] ") + chalk.white("[") + chalk.cyan("Github ") + chalk.white("]") + chalk.white(" https://github.com/CR072/HolaClient "));
    console.log(chalk.gray("[+] ") + chalk.white("[") + chalk.cyan("Holasmp") + chalk.white("]") + chalk.white(" https://discord.gg/Dms5dsmVAs "));
    console.log(chalk.white("================================================="));
    console.log(" ");
    console.log(chalk.gray("🔗") + chalk.cyan("[") + chalk.white("HolaClient") + chalk.cyan("]") + chalk.white(" Successfully loaded HolaClient at ") + chalk.cyan(settings.api.client.oauth2.link + "/"));
    console.log(" ");

});

const newCode = `
<footer style="background-color: rgba(0,0,0,.2);" class="footer">
   <div style="display: flex; justify-content: space-between; align-items: center;">
      <div style="display: flex; align-items: center;">
         <small style="color: white; font-weight: 100; font-size: 14px;">
            &copy; <script>document.write(new Date().getFullYear());</script> <a style="color: aquamarine; font-weight: 100; font-size: 14px;" href="<%= settings.discord %>"><%= settings.name %></a>
            | Powered by <a style="color: aquamarine; font-weight: 100; font-size: 14px;" href="https://github.com/CR072/holaclient">HolaClient v<%= settings.version %></a>
         </small>
      </div>
      <div>
         <a href="./tos">
         <button style="color: aquamarine; background-color: transparent; border: none; cursor: pointer; font-size: 14px;">Terms of Service</button>
         </a>
         <a href="./pp">
         <button style="color: aquamarine; background-color: transparent; border: none; cursor: pointer; font-size: 14px;">Privacy Policy</button>
         </a>
      </div>
   </div>
</footer>
`;

const filePath = "./views/default/parts/footer.ejs";
fs.writeFile(filePath, newCode, (err) => {
    if (err) {
        console.error('An error occured while checking HolaClient files!');
    } else {
        console.log('Finished checking HolaClient files.')
    }
});

var cache = false;
app.use(function(req, res, next) {
    let manager = (JSON.parse(fs.readFileSync("./settings.json").toString())).api.client.ratelimits;
    if (manager[req._parsedUrl.pathname]) {
        if (cache == true) {
            setTimeout(async () => {
                let allqueries = Object.entries(req.query);
                let querystring = "";
                for (let query of allqueries) {
                    querystring = querystring + "&" + query[0] + "=" + query[1];
                }
                querystring = "?" + querystring.slice(1);
                res.redirect((req._parsedUrl.pathname.slice(0, 1) == "/" ? req._parsedUrl.pathname : "/" + req._parsedUrl.pathname) + querystring);
            }, 1000);
            return;
        } else {
            cache = true;
            setTimeout(async () => {
                cache = false;
            }, 1000 * manager[req._parsedUrl.pathname]);
        }
    };
    next();
});

app.all("*", async (req, res) => {
    if (req.session.pterodactyl)
        if (req.session.pterodactyl.id !== await db.get("users-" + req.session.userinfo.id)) return res.redirect("/login?prompt=none");
    let theme = indexjs.get(req);
    let newsettings = JSON.parse(require("fs").readFileSync("./settings.json"));
    if (newsettings.api.arcio.enabled == true) req.session.arcsessiontoken = Math.random().toString(36).substring(2, 15);
    if (theme.settings.mustbeloggedin.includes(req._parsedUrl.pathname))
        if (!req.session.userinfo || !req.session.pterodactyl) return res.redirect("/auth");
    if (theme.settings.mustbeadmin.includes(req._parsedUrl.pathname)) {
        ejs.renderFile(
            `./views/${theme.name}/${theme.settings.unauthorized}`,
            await eval(indexjs.renderdataeval),
            null,
            async function(err, str) {
                delete req.session.newaccount;
                delete req.session.password;
                if (!req.session.userinfo || !req.session.pterodactyl) {
                    if (err) {
                        console.log(chalk.red(`[WEB SERVER] An error has occured on path ${req._parsedUrl.pathname}:`));
                        console.log(err);
                        return res.send(`
    <head>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/nanobar/0.4.2/nanobar.js"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,800,900" rel="stylesheet">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <title>Hola Client</title>
    </head>
<style>
    body {
      background-image: url('https://c4.wallpaperflare.com/wallpaper/707/220/899/gradient-blue-pink-abstract-art-wallpaper-preview.jpg');
      background-repeat: no-repeat;
      background-attachment: fixed;
      background-size: 100% 100%;
    }
    </style>
    <body style="font-family: poppins">
    <center>
      <br><br><br>
      <h1 style="color: white">Well, This Is Awkward</h1>
      <h2 style="color: #ffffff">Hola Client Has Unexpectedly Crashed!</h2><br><br><br><br>
      <div><bold><strong>If You're An User</strong></bold><br/><br>Try to contact this host's staff <br/><br>This issue may fixed soon!
        <br/> </div><div></div>
<div><bold style="color:red"><strong>If You're An Admin</strong></bold>
    <br/> <br>
    Try to understand the console error<br/><br>
    Check our FAQ <br>
    Feel free to <a style="color:aqua" href="https://discord.gg/CvqRH9TrYK">contact us!</a>
    
</div>
    </center>
    
<style>
.loadingbar .bar {
        background: #007fcc;
        border-radius: 4px;
        height: 2px;
        box-shadow: 0 0 10px #007fcc;
}
</style>
<style>
    div {
    display: inline-block; 
    width:200px; 
    border:0px solid; 
    color:white;
    vertical-align:top
}
</style>
    </body>
    `)
                    };
                    res.status(200);
                    return res.send(str);
                };

                let cacheaccount = await fetch(
                    settings.pterodactyl.domain + "/api/application/users/" + (await db.get("users-" + req.session.userinfo.id)) + "?include=servers", {
                        method: "get",
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": `Bearer ${settings.pterodactyl.key}`
                        }
                    }
                );
                if (await cacheaccount.statusText == "Not Found") {
                    if (err) {
                        console.log(chalk.red(`[WEB SERVER] An error has occured on path ${req._parsedUrl.pathname}:`));
                        console.log(err);
                        return res.send(`
    <head>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/nanobar/0.4.2/nanobar.js"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,800,900" rel="stylesheet">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <title>Hola Client</title>
    </head>
<style>
    body {
      background-image: url('https://c4.wallpaperflare.com/wallpaper/707/220/899/gradient-blue-pink-abstract-art-wallpaper-preview.jpg');
      background-repeat: no-repeat;
      background-attachment: fixed;
      background-size: 100% 100%;
    }
    </style>
    <body style="font-family: poppins">
    <center>
      <br><br><br>
      <h1 style="color: white">Well, This Is Awkward</h1>
      <h2 style="color: #ffffff">Hola Client Has Unexpectedly Crashed!</h2><br><br><br><br>
      <div><bold><strong>If You're An User</strong></bold><br/><br>Try to contact this host's staff <br/><br>This issue may fixed soon!
        <br/> </div><div></div>
<div><bold style="color:red"><strong>If You're An Admin</strong></bold>
    <br/> <br>
    Try to understand the console error<br/><br>
    Check our FAQ <br>
    Feel free to <a style="color:aqua" href="https://discord.gg/CvqRH9TrYK">contact us!</a>
    
</div>
    </center>
    
<style>
.loadingbar .bar {
        background: #007fcc;
        border-radius: 4px;
        height: 2px;
        box-shadow: 0 0 10px #007fcc;
}
</style>
<style>
    div {
    display: inline-block; 
    width:200px; 
    border:0px solid; 
    color:white;
    vertical-align:top
}
</style>
    </body>
    `)
                    };
                    return res.send(str);
                };
                let cacheaccountinfo = JSON.parse(await cacheaccount.text());

                req.session.pterodactyl = cacheaccountinfo.attributes;
                if (cacheaccountinfo.attributes.root_admin !== true) {
                    if (err) {
                        console.log(chalk.red(`[WEB SERVER] An error has occured on path ${req._parsedUrl.pathname}:`));
                        console.log(err);
                        return res.send(`
    <head>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/nanobar/0.4.2/nanobar.js"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,800,900" rel="stylesheet">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <title>Hola Client</title>
    </head>
<style>
    body {
      background-image: url('https://c4.wallpaperflare.com/wallpaper/707/220/899/gradient-blue-pink-abstract-art-wallpaper-preview.jpg');
      background-repeat: no-repeat;
      background-attachment: fixed;
      background-size: 100% 100%;
    }
    </style>
    <body style="font-family: poppins">
    <center>
      <br><br><br>
      <h1 style="color: white">Well, This Is Awkward</h1>
      <h2 style="color: #ffffff">Hola Client Has Unexpectedly Crashed!</h2><br><br><br><br>
      <div><bold><strong>If You're An User</strong></bold><br/><br>Try to contact this host's staff <br/><br>This issue may fixed soon!
        <br/> </div><div></div>
<div><bold style="color:red"><strong>If You're An Admin</strong></bold>
    <br/> <br>
    Try to understand the console error<br/><br>
    Check our FAQ <br>
    Feel free to <a style="color:aqua" href="https://discord.gg/CvqRH9TrYK">contact us!</a>
    
</div>
    </center>
    
<style>
.loadingbar .bar {
        background: #007fcc;
        border-radius: 4px;
        height: 2px;
        box-shadow: 0 0 10px #007fcc;
}
</style>
<style>
    div {
    display: inline-block; 
    width:200px; 
    border:0px solid; 
    color:white;
    vertical-align:top
}
</style>
    </body>
    `)
                    };
                    return res.send(str);
                };

                ejs.renderFile(
                    `./views/${theme.name}/${theme.settings.pages[req._parsedUrl.pathname.slice(1)] ? theme.settings.pages[req._parsedUrl.pathname.slice(1)] : theme.settings.notfound}`,
                    await eval(indexjs.renderdataeval),
                    null,
                    function(err, str) {
                        delete req.session.newaccount;
                        delete req.session.password;
                        if (err) {
                            console.log(`[WEB SERVER] An error has occured on path ${req._parsedUrl.pathname}:`);
                            console.log(err);
                            return res.send("<center>Well, This is awkward. Hola Client has crashed</center>");
                        };
                        res.status(200);
                        res.send(str);
                    });
            });
        return;
    };
    const data = await eval(indexjs.renderdataeval)
    ejs.renderFile(
        `./views/${theme.name}/${theme.settings.pages[req._parsedUrl.pathname.slice(1)] ? theme.settings.pages[req._parsedUrl.pathname.slice(1)] : theme.settings.notfound}`,
        data,
        null,
        function(err, str) {
            delete req.session.newaccount;
            delete req.session.password;
            if (err) {
                console.log(chalk.red(`[WEB SERVER] An error has occured on path ${req._parsedUrl.pathname}:`));
                console.log(err);
                return res.send(`
    <head>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/nanobar/0.4.2/nanobar.js"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,800,900" rel="stylesheet">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <title>Hola Client</title>
    </head>
<style>
    body {
      background-image: url('https://c4.wallpaperflare.com/wallpaper/707/220/899/gradient-blue-pink-abstract-art-wallpaper-preview.jpg');
      background-repeat: no-repeat;
      background-attachment: fixed;
      background-size: 100% 100%;
    }
    </style>
    <body style="font-family: poppins">
    <center>
      <br><br><br>
      <h1 style="color: white">Well, This Is Awkward</h1>
      <h2 style="color: #ffffff">Hola Client Has Unexpectedly Crashed!</h2><br><br><br><br>
      <div><bold><strong>If You're An User</strong></bold><br/><br>Try to contact this host's staff <br/><br>This issue may fixed soon!
        <br/> </div><div></div>
<div><bold style="color:red"><strong>If You're An Admin</strong></bold>
    <br/> <br>
    Try to understand the console error<br/><br>
    Check our FAQ <br>
    Feel free to <a style="color:aqua" href="https://discord.gg/CvqRH9TrYK">contact us!</a>
    
</div>
    </center>
    
<style>
.loadingbar .bar {
        background: #007fcc;
        border-radius: 4px;
        height: 2px;
        box-shadow: 0 0 10px #007fcc;
}
</style>
<style>
    div {
    display: inline-block; 
    width:200px; 
    border:0px solid; 
    color:white;
    vertical-align:top
}
</style>
    </body>
    `)
            };
            res.status(200);
            res.send(str);
        });
});

module.exports.get = function(req) {
    let defaulttheme = JSON.parse(fs.readFileSync("./settings.json")).defaulttheme;
    let tname = encodeURIComponent(getCookie(req, "theme"));
    let name = (
        tname ?
        fs.existsSync(`./views/${tname}`) ?
        tname :
        defaulttheme :
        defaulttheme
    )
    return {
        settings: (
            fs.existsSync(`./views/${name}/pages.json`) ?
            JSON.parse(fs.readFileSync(`./views/${name}/pages.json`).toString()) :
            defaultthemesettings
        ),
        name: name
    };
};
log('status', `Successfully loaded HolaClient at ${settings.api.client.oauth2.link}/`)
module.exports.islimited = async function() {
    return cache == true ? false : true;
}

module.exports.ratelimits = async function(length) {
    if (cache == true) return setTimeout(
        indexjs.ratelimits, 1
    );
    cache = true;
    setTimeout(
        async function() {
            cache = false;
        }, length * 1000
    )
}

// Get a cookie.
function getCookie(req, cname) {
    let cookies = req.headers.cookie;
    if (!cookies) return null;
    let name = cname + "=";
    let ca = cookies.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return decodeURIComponent(c.substring(name.length, c.length));
        }
    }
    return "";
}