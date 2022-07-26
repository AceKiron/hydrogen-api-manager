const VERSION = "1.0.0";

require("dotenv").config();

const chalk = require("chalk");

let latestLogs = [];
let maxLatestLogsLength = 32;

function INFO(msg) {
    console.log(`[${chalk.gray(new Date())}] [${chalk.gray("INFO")}] ${msg}`);
    latestLogs.push(`[${new Date()}] [INFO] ${msg}`);
    if (latestLogs.length == maxLatestLogsLength) latestLogs.shift();
}

function OK(msg) {
    console.log(`[${chalk.green(new Date())}] [${chalk.green("OK")}] ${msg}`);
    latestLogs.push(`[${new Date()}] [OK] ${msg}`);
    if (latestLogs.length == maxLatestLogsLength) latestLogs.shift();
}

function WARN(msg) {
    console.log(`[${chalk.yellow(new Date())}] [${chalk.yellow("WARN")}] ${msg}`);
    latestLogs.push(`[${new Date()}] [WARN] ${msg}`);
    if (latestLogs.length == maxLatestLogsLength) latestLogs.shift();
}

function ERROR(msg) {
    console.log(`[${chalk.red(new Date())}] [${chalk.red("ERROR")}] ${msg}`);
    latestLogs.push(`[${new Date()}] [ERROR] ${msg}`);
    if (latestLogs.length == maxLatestLogsLength) latestLogs.shift();
}

function FATAL(msg, errorcode=-1) { console.log(chalk.bgRed(`[${new Date()}] [FATAL] ${msg}`)); process.exit(errorcode); }

const express = require("express");
const app = express();

const fs = require("fs");

for (const modName of fs.readdirSync("./modules")) {
    const router = express.Router();

    try {
        const mod = require(`./modules/${modName}`);
        mod({ router, INFO, OK, WARN, ERROR, FATAL}).then(() => {
            OK(`Module ${modName} loaded`);
            app.use(`/${modName}`, router);
        });
    } catch (e) {
        WARN(`Failed to load module ${modName}`)
        ERROR(e);
    }
}

app.get("/", (req, res) => {
    res.setHeader("Content-type", "text/plain");
    res.send(`Hydrogen API Manager v${VERSION}

Logs:
${latestLogs.join("\n")}`);
});

app.listen(process.env.PORT || 3157, () => {
    OK(`Listening on port ${process.env.PORT || 3157}`);
});