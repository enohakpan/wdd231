const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../images/recipes');
const outputDir = path.join(__dirname, '../images/optimized');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Get all image files
const imageFiles = fs.readdirSync(imagesDir).filter(file => 
  /\.(jpg|jpeg|png|webp)$/i.test(file)
);

// Process each image
imageFiles.forEach(async (file) => {
  const inputPath = path.join(imagesDir, file);
  const outputPath = path.join(outputDir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
  
  try {
    await sharp(inputPath)
      .webp({ quality: 80 })
      .resize(800, 600, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toFile(outputPath);
    
    console.log(`Optimized ${file} to ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`Error processing ${file}:`, error);
  }
}); 