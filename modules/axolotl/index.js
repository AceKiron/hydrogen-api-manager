const cp = require("child_process");
const fs = require("fs");
const axios = require("axios");

let VIDEO_ID;

let cooldown = Date.now();

async function updateVideoId(WARN) {
    const req = await axios({
        method: "GET",
        url: `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UCrhYiGXMwsfXB3QTCHmFQiQ&eventType=live&type=video&key=${process.env.GOOGLE_API_KEY}`
    });

    if (req.data.items.length == 0) WARN("Gary the Axolotl isn't live right now");
    else VIDEO_ID = req.data.items[0].id.videoId;
}

module.exports = async ({ router, INFO, WARN }) => {
    await updateVideoId(WARN);

    router.get("/garytheaxolotl", async (req, res) => {
        if (VIDEO_ID === undefined) {
            res.sendStatus(503);
            return await updateVideoId(WARN);
        }
        
        if (Date.now() >= cooldown + 10000) {
            // Fetch new image every 10 seconds
            cooldown = Date.now();
            cp.exec(`ffmpeg -i "$(yt-dlp -g ${VIDEO_ID} | head -n 1)" -vframes 1 last.jpg -y -v quiet`);
            INFO("Updating GaryTheAxolotl image");
        }
        
        res.setHeader("Content-type", "image/jpeg");
        res.send(fs.readFileSync("last.jpg"));
    });

    router.get("/garytheaxolotl/meta", async (req, res) => {
        if (VIDEO_ID === undefined) {
            res.sendStatus(503);
            return await updateVideoId(WARN);
        }

        res.send({ videoId: VIDEO_ID, channelId: "UCrhYiGXMwsfXB3QTCHmFQiQ" });
    });
}