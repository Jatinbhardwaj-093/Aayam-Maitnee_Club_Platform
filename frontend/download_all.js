import fs from 'fs';
import path from 'path';

const screens = [
  { title: "Production Workspace Macbeth", url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NWExY2FiMzQ4OTQwODlhZjU2Yjc4MjM2Njg3EgsSBxCQl4D21x0YAZIBJAoKcHJvamVjdF9pZBIWQhQxNjk0NzM3NzE4MzkzNjg3Nzg4NQ&filename=&opi=89354086" },
  { title: "Member Dashboard Matinee Edition v2", url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NWExYmQzYTU2NTIwNTc2MDE1ZmRmMTczNjkxEgsSBxCQl4D21x0YAZIBJAoKcHJvamVjdF9pZBIWQhQxNjk0NzM3NzE4MzkzNjg3Nzg4NQ&filename=&opi=89354086" },
  { title: "Sponsor Dashboard Matinee Edition 1024", url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NWExMzk0MGRjMDQwMDMwM2ZjNjkzMDU4NTcyEgsSBxCQl4D21x0YAZIBJAoKcHJvamVjdF9pZBIWQhQxNjk0NzM3NzE4MzkzNjg3Nzg4NQ&filename=&opi=89354086" },
  { title: "Member Dashboard 3544", url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NWExYmRlMzg0MDUwNGVhYWI4ODZhMGQ0NmJlEgsSBxCQl4D21x0YAZIBJAoKcHJvamVjdF9pZBIWQhQxNjk0NzM3NzE4MzkzNjg3Nzg4NQ&filename=&opi=89354086" },
  { title: "Member Dashboard Matinee Edition 3608", url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NWExYmQ0YTNlZjUwNGVhYWI4ODZhMGQ0NmJlEgsSBxCQl4D21x0YAZIBJAoKcHJvamVjdF9pZBIWQhQxNjk0NzM3NzE4MzkzNjg3Nzg4NQ&filename=&opi=89354086" },
  { title: "Auditions Talent Casting Portal", url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NWExYzFjNWQyYjQwMzkyYzZhNmY5MWNlZjc4EgsSBxCQl4D21x0YAZIBJAoKcHJvamVjdF9pZBIWQhQxNjk0NzM3NzE4MzkzNjg3Nzg4NQ&filename=&opi=89354086" },
  { title: "Sponsor Dashboard Matinee Edition 3578", url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NWExYmQ5MDg0ODgwNGVhYWI4ODZhMGQ0NmJlEgsSBxCQl4D21x0YAZIBJAoKcHJvamVjdF9pZBIWQhQxNjk0NzM3NzE4MzkzNjg3Nzg4NQ&filename=&opi=89354086" },
  { title: "Club Gallery Matinee Edition", url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NWExYmQ3ZjNlYTYwOTI1YzdlMTVlMzVmOGFlEgsSBxCQl4D21x0YAZIBJAoKcHJvamVjdF9pZBIWQhQxNjk0NzM3NzE4MzkzNjg3Nzg4NQ&filename=&opi=89354086" },
  { title: "Core Maintainer Dashboard Matinee Edition v2", url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NWExYmQ1ZWRkNDIwNTc2MDE1ZmRmMTczNjkxEgsSBxCQl4D21x0YAZIBJAoKcHJvamVjdF9pZBIWQhQxNjk0NzM3NzE4MzkzNjg3Nzg4NQ&filename=&opi=89354086" },
  { title: "Core Member Dashboard Matinee Edition", url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NWExYmNmNTk2YWUwNWMyYzI3MDA5MDZjMjZiEgsSBxCQl4D21x0YAZIBJAoKcHJvamVjdF9pZBIWQhQxNjk0NzM3NzE4MzkzNjg3Nzg4NQ&filename=&opi=89354086" },
  { title: "Drama Club Landing Page Standard Sizing", url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NWExYmRkMmJlYTYwODlhZjU2Yjc4MjM2Njg3EgsSBxCQl4D21x0YAZIBJAoKcHJvamVjdF9pZBIWQhQxNjk0NzM3NzE4MzkzNjg3Nzg4NQ&filename=&opi=89354086" },
  { title: "Core Member Dashboard 3652", url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NWExYmRhZTc0OTAwNTc2MDI4OTcwMDc2YmE5EgsSBxCQl4D21x0YAZIBJAoKcHJvamVjdF9pZBIWQhQxNjk0NzM3NzE4MzkzNjg3Nzg4NQ&filename=&opi=89354086" },
  { title: "Sponsor Dashboard 3414", url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NWExYmQxZmI3YjQwMWE2MzE3MDhkMzljMjk0EgsSBxCQl4D21x0YAZIBJAoKcHJvamVjdF9pZBIWQhQxNjk0NzM3NzE4MzkzNjg3Nzg4NQ&filename=&opi=89354086" }
];

const outDir = path.resolve('temp_screens');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir);
}

async function downloadAll() {
  for (const screen of screens) {
    const filename = screen.title.toLowerCase().replace(/\s+/g, '_') + '.html';
    const filePath = path.join(outDir, filename);
    console.log(`Downloading ${screen.title}...`);
    try {
      const res = await fetch(screen.url);
      const html = await res.text();
      fs.writeFileSync(filePath, html);
      console.log(`Saved ${filename} (${html.length} bytes)`);
    } catch (err) {
      console.error(`Failed to download ${screen.title}:`, err);
    }
  }
}

downloadAll();
