const cp = require("child_process");
const fs = require("fs");
const axios = require("axios");

let VIDEO_ID;

let cooldown = Date.now();

module.exports = async ({ router, INFO, WARN }) => {
    const req = await axios({
        method: "GET",
        url: `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UCrhYiGXMwsfXB3QTCHmFQiQ&eventType=live&type=video&key=${process.env.GOOGLE_API_KEY}`
    });

    if (req.data.items.length == 0) WARN("Gary the Axolotl isn't live right now");
    else VIDEO_ID = req.data.items[0].videoId;

    router.get("/garytheaxolotl", (req, res) => {
        if (VIDEO_ID === undefined) return res.sendStatus(503);
        
        if (Date.now() >= cooldown + 30000) {
            // Fetch new image every 30 seconds
            cooldown = Date.now();
            cp.execSync(`ffmpeg -i "$(yt-dlp -g ${VIDEO_ID} | head -n 1)" -vframes 1 last.jpg -y`);
        }
        
        res.setHeader("Content-type", "image/jpeg");
        res.send(fs.readFileSync("last.jpg"));
    });
}