const VERSION = "1.0.0";

require("dotenv").config();

const chalk = require("chalk");

function INFO(msg) { console.log(`[${chalk.gray(new Date())}] [${chalk.gray("INFO")}] ${msg}`); }
function OK(msg) { console.log(`[${chalk.green(new Date())}] [${chalk.green("OK")}] ${msg}`); }
function WARN(msg) { console.log(`[${chalk.yellow(new Date())}] [${chalk.yellow("WARN")}] ${msg}`); }
function ERROR(msg) { console.log(`[${chalk.red(new Date())}] [${chalk.red("ERROR")}] ${msg}`); }
function FATAL(msg, errorcode=-1) { console.log(chalk.bgRed(`[${new Date()}] [FATAL] ${msg}`)); process.exit(errorcode); }

const express = require("express");
const app = express();

const fs = require("fs");

for (const modName of fs.readdirSync("./modules")) {
    const router = express.Router();

    try {
        const mod = require(`./modules/${modName}`);
        mod({ router, INFO, OK, WARN, ERROR, FATAL});
        OK(`Module ${modName} loaded`);
    } catch (e) {
        WARN(`Failed to load module ${modName}`)
        ERROR(e);
    }

    app.use(`/${modName}`, router);
}

app.get("/", (req, res) => {
    res.setHeader("Content-type", "text/plain");
    res.send(`Hydrogen API Manager v${VERSION}`);
});

app.listen(process.env.PORT || 3157, () => {
    OK(`Listening on port ${process.env.PORT || 3157}`);
})