const { imagesToIco } = require("png-to-ico");
const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "assets", "icon.png");
const dest = path.join(__dirname, "assets", "icon.ico");

imagesToIco([src])
  .then((buf) => {
    fs.writeFileSync(dest, buf);
    console.log("icon.ico created at:", dest, `(${buf.length} bytes)`);
  })
  .catch((err) => {
    console.error("Failed:", err);
    process.exit(1);
  });
