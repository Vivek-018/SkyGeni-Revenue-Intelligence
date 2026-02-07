const fs = require('fs');
const path = require('path');

// Copy data files from repo root to backend/data/
const sourceDir = path.join(__dirname, '../../data');
const destDir = path.join(__dirname, '../data');

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  console.log('Created data directory:', destDir);
}

// Files to copy
const files = ['accounts.json', 'reps.json', 'deals.json', 'activities.json', 'targets.json'];

let copied = 0;
files.forEach(file => {
  const src = path.join(sourceDir, file);
  const dest = path.join(destDir, file);
  
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${file}`);
    copied++;
  } else {
    console.warn(`Warning: ${file} not found at ${src}`);
  }
});

if (copied > 0) {
  console.log(`Successfully copied ${copied} data files to backend/data/`);
} else {
  console.log('No data files copied. They may already be in backend/data/ or not found at repo root.');
}
