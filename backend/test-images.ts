import * as fs from 'fs';
import * as path from 'path';

async function validateImages() {
  const filePath = path.join(process.cwd(), 'src', 'demo-server.ts');
  const code = fs.readFileSync(filePath, 'utf8');

  // Extract Unsplash URLs
  const regex = /https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-]+\?auto=format&fit=crop&q=80&w=800/g;
  const matches = [...new Set(code.match(regex) || [])];

  console.log(`Found ${matches.length} unique image URLs to validate...`);
  
  if (matches.length === 0) {
    console.error('No Unsplash images found in demo-server.ts!');
    process.exit(1);
  }

  let failedCount = 0;
  for (const url of matches) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        console.log(`[OK] ${url}`);
      } else {
        console.error(`[FAIL] ${url} - Status: ${response.status}`);
        failedCount++;
      }
    } catch (err: any) {
      console.error(`[ERROR] ${url} - ${err.message}`);
      failedCount++;
    }
  }

  if (failedCount === 0) {
    console.log('\n✅ Validation Passed! All images returned 200 OK.');
    process.exit(0);
  } else {
    console.error(`\n❌ Validation Failed! ${failedCount} images did not return 200 OK.`);
    process.exit(1);
  }
}

validateImages();
