const cp = require("child_process");
const fs = require("fs");
const axios = require("axios");

let VIDEO_ID;
let VIDEO_DATA;

let cooldown = Date.now();

async function updateVideoId(INFO, WARN) {
    const req = await axios({
        method: "GET",
        url: `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UCrhYiGXMwsfXB3QTCHmFQiQ&eventType=live&type=video&key=${process.env.GOOGLE_API_KEY}`
    });

    let items = req.data.items.filter((item) => item.snippet.title === "Axolotl Live 24/7 With Gary The Axolotl");

    if (items.length == 0) WARN("Gary the Axolotl isn't live right now");
    else {
        VIDEO_DATA = items[0];
        INFO(JSON.stringify(VIDEO_DATA, null, 2));
    }
}

module.exports = async ({ router, INFO, WARN }) => {
    await updateVideoId(INFO, WARN);

    router.get("/garytheaxolotl", async (req, res) => {
        if (VIDEO_DATA === undefined) {
            res.sendStatus(503);
            return await updateVideoId(INFO, WARN);
        }
        
        if (Date.now() >= cooldown + 10000) {
            // Fetch new image every 10 seconds
            cooldown = Date.now();
            cp.exec(`ffmpeg -i "$(yt-dlp -g ${VIDEO_DATA.id.videoId} | head -n 1)" -vframes 1 last.jpg -y -v quiet`);
            INFO("Updating GaryTheAxolotl image");
        }
        
        res.setHeader("Content-type", "image/jpeg");
        res.send(fs.readFileSync("last.jpg"));
    });

    router.get("/garytheaxolotl/meta", async (req, res) => {
        if (VIDEO_DATA === undefined) {
            res.sendStatus(503);
            return await updateVideoId(INFO, WARN);
        }

        res.send({
            liveVideoId: VIDEO_DATA.id.videoId,
            liveSince: new Date(VIDEO_DATA.snippet.publishTime).toUTCString(),
            channelId: "UCrhYiGXMwsfXB3QTCHmFQiQ"
        });
    });
}