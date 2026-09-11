import sharp from 'sharp';
import { readFile, mkdir } from 'node:fs/promises';
const items = JSON.parse(await readFile('lib/work-data.json', 'utf8'));
await mkdir('public/work/thumbnails', { recursive: true });
for (const item of items) {
  await sharp('public' + (item.poster || item.src)).resize({width:640,height:800,fit:'inside',withoutEnlargement:true}).webp({quality:82}).toFile(`public/work/thumbnails/${item.id}.webp`);
}
console.log(`Prepared ${items.length} local thumbnails; archival files unchanged.`);
