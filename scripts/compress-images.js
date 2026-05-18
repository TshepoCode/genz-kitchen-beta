const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const publicDir = path.join(process.cwd(), "public");

const files = fs.readdirSync(publicDir).filter((file) =>
  /\.(png|jpg|jpeg)$/i.test(file)
);

async function compress() {
  for (const file of files) {
    const input = path.join(publicDir, file);
    const output = path.join(publicDir, file.replace(/\.(png|jpg|jpeg)$/i, ".webp"));

    await sharp(input)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 75 })
      .toFile(output);

    console.log(`Compressed: ${file}`);
  }
}

compress();