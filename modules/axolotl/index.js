const cp = require("child_process");
const fs = require("fs");

const VIDEO_ID = "vKVBgsOj2pc";

module.exports = ({ router, WARN }) => {
    router.get("/garytheaxolotl", (req, res) => {
        const x = cp.execSync(`yt-dlp -g ${VIDEO_ID} | head -n 1`).toString().replace("\n", "");
        const y = cp.execSync(`ffmpeg -i "${x}" -vframes 1 last.jpg -y`).toString();
        
        res.setHeader("Content-type", "image/jpeg");
        res.send(fs.readFileSync("last.jpg"));
    });
}