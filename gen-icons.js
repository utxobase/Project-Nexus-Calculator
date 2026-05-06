const fs = require('fs');

function generateIcon(size) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#050505"/>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
        font-size="${Math.floor(size * 0.65)}" fill="#ff5500"
        font-family="serif" font-weight="bold">&#x20BF;</text>
</svg>`;
    fs.writeFileSync(`icon-${size}.svg`, svg);
    console.log(`✅ icon-${size}.svg created`);
}

generateIcon(192);
generateIcon(512);
console.log('Done. Copy icon-192.svg and icon-512.svg into your project folder.');