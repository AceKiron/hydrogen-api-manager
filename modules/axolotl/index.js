const cp = require("child_process");
const fs = require("fs");

const VIDEO_ID = "vKVBgsOj2pc";

let cooldown = Date.now();

module.exports = ({ router, INFO }) => {
    router.get("/garytheaxolotl", (req, res) => {
        INFO(`${Date.now() - cooldown - 30000}`);
        
        if (Date.now() >= cooldown + 30000) {
            // Fetch new image every 30 seconds
            cooldown = Date.now();
            cp.exec(`ffmpeg -i "$(yt-dlp -g ${VIDEO_ID} | head -n 1)" -vframes 1 last.jpg -y`);
        }
        
        res.setHeader("Content-type", "image/jpeg");
        res.send(fs.readFileSync("last.jpg"));
    });
}