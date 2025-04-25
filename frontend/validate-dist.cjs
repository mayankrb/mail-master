// validate-dist.cjs
const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'dist');
const invalid = fs.readdirSync(distPath).filter(name => name.includes(':') || name === ':');

if (invalid.length > 0) {
    console.error("❌ Invalid files/folders in dist:", invalid);
    process.exit(1);
} else {
    console.log("✅ All dist files are safe.");
}
