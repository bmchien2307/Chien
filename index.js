const { spawn } = require("child_process");
const { readFileSync } = require("fs-extra");
const http = require("http");
const axios = require("axios");
const semver = require("semver");
const logger = require("./utils/log");


/////////////////////////////////////////////
//========= Check node.js version =========//
/////////////////////////////////////////////

const nodeVersion = semver.parse(process.version);
if (nodeVersion.major < 13) {
    logger(`Node.js hiện tại của bạn ${process.version} không được hỗ trợ, cần Node.js 13 trở lên để có thể  khởi chạy bot!`, "error");
    return process.exit(1);
};

///////////////////////////////////////////////////////////
//========= Create website for dashboard/uptime =========//
///////////////////////////////////////////////////////////

if (process.env.API_SERVER_EXTERNAL == 'https://api.glitch.com') {
    const dashboard = http.createServer(function (_req, res) {
        res.writeHead(200, "OK", { "Content-Type": "text/plain" });
        res.write("HI! THIS BOT WAS MADE BY ME(CATALIZCS) AND MY BROTHER SPERMLORD - DO NOT STEAL MY CODE (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯");
        res.end();
    });

    dashboard.listen(process.env.port || 0);

    logger("Đã mở server website...", "[ Starting ]");
}

////////////////////////////////////////////////
//========= Check update from Github =========//
////////////////////////////////////////////////

axios.get('https://raw.githubusercontent.com/miraipr0ject/miraiv2/master/package.json').then((res) => {
    logger("Đang kiểm tra cập nhật...", "[ CHECK UPDATE ]");
    const local = JSON.parse(readFileSync('./package.json')).version;
    if (semver.lt(local, res.data.version)) {
        logger(`Đã có phiên bản ${res.data.version}, tiến hành cập nhật source code!`, "[ CHECK UPDATE ]");
        const child = spawn("node", ["update.js"], {
            cwd: __dirname,
            stdio: "inherit",
            shell: true
        });

        child.on("error", function (error) {
            logger("Đã xảy ra lỗi: " + JSON.stringify(error), "[ CHECK UPDATE ]");
        });
    }
    else logger('Bạn đang sử dụng bản mới nhất!', "[ CHECK UPDATE ]");
}).catch(err => logger("Đã có lỗi xảy ra khi đang kiểm tra cập nhật cho bạn!", "[ CHECK UPDATE ]"));

/////////////////////////////////////////////////////////
//========= Create start bot and make it loop =========//
/////////////////////////////////////////////////////////

function startBot(message) {
    (message) ? logger(message, "[ Starting ]") : "";

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "mirai.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    child.on("close", (codeExit) => {
        if (codeExit != 0) {
            startBot("Đang khởi động lại...");
            return;
        } else return;
    });

    child.on("error", function (error) {
        logger("Đã xảy ra lỗi: " + JSON.stringify(error), "[ Starting ]");
    });
};

startBot();

//THIZ BOT WAS MADE BY ME(CATALIZCS) AND MY BROTHER SPERMLORD - DO NOT STEAL MY CODE (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯