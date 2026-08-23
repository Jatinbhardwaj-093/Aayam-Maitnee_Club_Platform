const fs = require('fs');
const file = 'frontend/src/pages/maintainers/AuditionsManagement.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add imports
const importsToAdd = ", VenetianMask, Mic, Settings, Wrench, Clapperboard, Paintbrush, Scissors, Shirt, Palette";
if (!content.includes('VenetianMask')) {
    content = content.replace('RotateCcw,', 'RotateCcw' + importsToAdd + ',');
    // if RotateCcw wasn't there, let's just append before "from 'lucide-react';"
    if (!content.includes(importsToAdd)) {
        content = content.replace('} from "lucide-react";', '  VenetianMask, Mic, Settings, Wrench, Clapperboard, Paintbrush, Scissors, Shirt, Palette,\n} from "lucide-react";');
    }
}

const iconHelper = `
export const getRoleCategoryIcon = (category, className = "w-4 h-4") => {
  if (!category) return <Users className={className} />;
  const lower = category.toLowerCase();
  if (lower.includes("character")) return <VenetianMask className={className} />;
  if (lower.includes("performer") || lower.includes("actor")) return <Mic className={className} />;
  if (lower.includes("backstage") || lower.includes("technical")) return <Wrench className={className} />;
  if (lower.includes("director") || lower.includes("directorial")) return <Clapperboard className={className} />;
  if (lower.includes("makeup") || lower.includes("hair")) return <Paintbrush className={className} />;
  if (lower.includes("costume") || lower.includes("wardrobe")) return <Shirt className={className} />;
  if (lower.includes("creative") || lower.includes("stylist") || lower.includes("designer")) return <Palette className={className} />;
  return <Users className={className} />;
};

`;

if (!content.includes('export const getRoleCategoryIcon')) {
    content = content.replace('const CustomSelect = ({ value, options, onChange', iconHelper + 'const CustomSelect = ({ value, options, onChange');
}

fs.writeFileSync(file, content);
