import fs from 'fs';
import path from 'path';

// A simple regex-based HTML scanner
function parseHtml(html) {
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'No Title';
  
  // Find all h1 and h2
  const headings = [];
  const hMatches = html.matchAll(/<(h1|h2)[^>]*>([\s\S]*?)<\/\1>/gi);
  for (const match of hMatches) {
    const text = match[2].replace(/<[^>]+>/g, '').trim();
    if (text) headings.push(`${match[1].toUpperCase()}: ${text}`);
  }

  // Find tables and headers
  const tables = [];
  const tableMatches = html.matchAll(/<table[^>]*>([\s\S]*?)<\/table>/gi);
  let tableIdx = 1;
  for (const match of tableMatches) {
    const ths = [];
    const thMatches = match[1].matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi);
    for (const th of thMatches) {
      ths.push(th[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' '));
    }
    tables.push(`Table ${tableIdx++} headers: [${ths.join(', ')}]`);
  }

  // Find forms or key interactive items
  const interactives = [];
  if (html.includes('<input')) interactives.push('Has inputs');
  if (html.includes('<button')) {
    const buttonMatches = [...html.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/gi)];
    const buttonTexts = buttonMatches.map(m => m[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ')).filter(Boolean);
    interactives.push(`Buttons: [${buttonTexts.slice(0, 10).join(', ')}${buttonTexts.length > 10 ? '...' : ''}]`);
  }

  // Look for sidebar items or tabs
  const sidebarItems = [];
  const aMatches = html.matchAll(/<a[^>]*class="[^"]*nav[^"]*"[^>]*>([\s\S]*?)<\/a>/gi);
  for (const match of aMatches) {
    const text = match[1].replace(/<[^>]+>/g, '').trim();
    if (text && !sidebarItems.includes(text)) sidebarItems.push(text);
  }

  return { title, headings: headings.slice(0, 12), tables, interactives, sidebarItems };
}

const dir = 'temp_screens';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const content = fs.readFileSync(path.join(dir, file), 'utf-8');
  const info = parseHtml(content);
  console.log(`=========================================`);
  console.log(`FILE: ${file}`);
  console.log(`TITLE: ${info.title}`);
  console.log(`HEADINGS:`, info.headings);
  if (info.tables.length) console.log(`TABLES:`, info.tables);
  console.log(`INTERACTIVES:`, info.interactives);
  if (info.sidebarItems.length) console.log(`NAV ITEMS:`, info.sidebarItems);
});
