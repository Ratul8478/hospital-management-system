const fs = require('fs');
const path = require('path');

// Generate a valid base64 192x192 PNG buffer for Android WebAPK
// Minimal valid 1x1 to 192x192 PNG
const png192Base64 = "iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAIAAADdvvtQAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA0SURBVHhe7cEBDQAAAMKg909tDwcUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4DUbcAABf8+2iQAAAABJRU5ErkJggg==";
const png512Base64 = "iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA0SURBVHhe7cEBDQAAAMKg909tDwcUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4DUbcAABf8+2iQAAAABJRU5ErkJggg==";

fs.writeFileSync(path.join(__dirname, 'preview', 'icon-192.png'), Buffer.from(png192Base64, 'base64'));
fs.writeFileSync(path.join(__dirname, 'preview', 'icon-512.png'), Buffer.from(png512Base64, 'base64'));
console.log('PNG icons written');
