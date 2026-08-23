const fs = require('fs');
const file = 'frontend/src/pages/maintainers/MediaModeration.tsx';
let content = fs.readFileSync(file, 'utf8');

// Insert CustomDropdown component before MediaModeration function
const customDropdownComponent = `
const CustomDropdown = ({ value, options, onChange }: { value: string, options: string[], onChange: (v: string) => void }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full bg-[#FDF8F7] border border-[#DCBAB2] rounded-xl px-4 py-2.5 text-xs text-[#2A1816] font-bold text-left flex justify-between items-center hover:bg-[#FAF2EE] transition-colors focus:outline-none focus:ring-2 focus:ring-[#B32D25]/30"
            >
                {value}
                <svg className={\`w-4 h-4 text-[#8C5A54] transition-transform \${open ? 'rotate-180' : ''}\`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {open && (
                <div className="absolute top-full mt-1.5 left-0 w-full bg-[#FDF8F7] border border-[#DCBAB2] rounded-xl shadow-xl z-50 overflow-hidden">
                    {options.map((opt) => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => { onChange(opt); setOpen(false); }}
                            className={\`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-[#FAF2EE] transition-colors \${value === opt ? 'bg-[#EEDBD5] text-[#8C241E]' : 'text-[#5C3B37]'}\`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

`;

if (!content.includes('CustomDropdown')) {
  content = content.replace('export default function MediaModeration', customDropdownComponent + 'export default function MediaModeration');
}

// Replace newMedia state
content = content.replace(
  `    const [newMedia, setNewMedia] = useState({
        title: "",
        category: "Tamashbin Kathputliya",
        imageUrl: "",
        caption: "",
        uploaderName: "Core Maintainer"
    });`,
  `    const [newMedia, setNewMedia] = useState({
        title: "",
        category: "Tamashbin Kathputliya",
        caption: "",
        uploaderName: "Core Maintainer"
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);`
);

// Replace handleAddMediaSubmit
content = content.replace(
  `    const handleAddMediaSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMedia.imageUrl || !newMedia.title) return;

        setSubmitting(true);
        const baseUrl = import.meta.env.VITE_API_URL || "";
        try {
            const res = await fetch(\`\${baseUrl}/api/gallery\`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newMedia)
            });

            if (res.ok) {
                const added = await res.json();
                setItems((prev) => [added, ...prev]);
                setIsAddModalOpen(false);
                setNewMedia({
                    title: "",
                    category: "Tamashbin Kathputliya",
                    imageUrl: "",
                    caption: "",
                    uploaderName: "Core Maintainer"
                });
            } else {
                const mockNewItem: GalleryMediaItem = {
                    id: Date.now(),
                    ...newMedia,
                    uploadedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                    status: "approved"
                };
                setItems((prev) => [mockNewItem, ...prev]);
                setIsAddModalOpen(false);
            }
        } catch (err) {
            console.error(err);
            const mockNewItem: GalleryMediaItem = {
                id: Date.now(),
                ...newMedia,
                uploadedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                status: "approved"
            };
            setItems((prev) => [mockNewItem, ...prev]);
            setIsAddModalOpen(false);
        } finally {
            setSubmitting(false);
        }
    };`,
  `    const handleAddMediaSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile || !newMedia.title) return;

        setSubmitting(true);
        const baseUrl = import.meta.env.VITE_API_URL || "";
        
        const formData = new FormData();
        formData.append("title", newMedia.title);
        formData.append("category", newMedia.category);
        formData.append("caption", newMedia.caption);
        formData.append("uploaderName", newMedia.uploaderName);
        formData.append("file", selectedFile);

        try {
            const res = await fetch(\`\${baseUrl}/api/gallery\`, {
                method: "POST",
                body: formData
            });

            if (res.ok) {
                const result = await res.json();
                setItems((prev) => [result.item, ...prev]);
                setIsAddModalOpen(false);
                setNewMedia({
                    title: "",
                    category: "Tamashbin Kathputliya",
                    caption: "",
                    uploaderName: "Core Maintainer"
                });
                setSelectedFile(null);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };`
);

// Replace form fields
const oldSelect = `<select
                                value={newMedia.category}
                                onChange={(e) => setNewMedia({ ...newMedia, category: e.target.value })}
                                className="w-full bg-[#E8D6CF]/70 border border-[#D5AAA2] rounded-xl px-3 py-2 text-xs text-[#2A1816] font-bold focus:outline-none focus:border-[#B32D25] shadow-inner"
                            >
                                {PLAY_CATEGORIES.filter((c) => c !== "All").map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>`;

const newSelect = `<CustomDropdown 
                                value={newMedia.category} 
                                options={PLAY_CATEGORIES.filter((c) => c !== "All")} 
                                onChange={(val) => setNewMedia({ ...newMedia, category: val })} 
                            />`;

content = content.replace(oldSelect, newSelect);

const oldFormFields = `<div className="space-y-1">
                            <label className="text-xs font-mono uppercase tracking-wider text-[#2A1816] font-bold">
                                Image URL *
                            </label>
                            <Input
                                type="url"
                                required
                                placeholder="https://..."
                                value={newMedia.imageUrl}
                                onChange={(e) => setNewMedia({ ...newMedia, imageUrl: e.target.value })}
                                className="border-[#D5AAA2] bg-[#E8D6CF]/70 h-10 text-xs rounded-xl font-semibold text-[#2A1816] focus:border-[#B32D25] shadow-inner"
                            />
                        </div>`;

const newFormFields = `<div className="space-y-1">
                            <label className="text-xs font-mono uppercase tracking-wider text-[#2A1816] font-bold">
                                Upload Photo *
                            </label>
                            <div 
                                className={\`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer \${dragActive ? 'border-[#B32D25] bg-[#B32D25]/10' : 'border-[#D5AAA2] bg-[#E8D6CF]/40 hover:bg-[#E8D6CF]/70'}\`}
                                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                                onDragLeave={() => setDragActive(false)}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setDragActive(false);
                                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                        setSelectedFile(e.dataTransfer.files[0]);
                                    }
                                }}
                                onClick={() => document.getElementById('gallery-file-upload')?.click()}
                            >
                                <input 
                                    id="gallery-file-upload" 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setSelectedFile(e.target.files[0]);
                                        }
                                    }} 
                                />
                                {selectedFile ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 rounded-full bg-[#B32D25]/20 flex items-center justify-center">
                                            <CheckCircle2 className="w-6 h-6 text-[#B32D25]" />
                                        </div>
                                        <span className="text-xs font-bold text-[#2A1816]">{selectedFile.name}</span>
                                        <span className="text-[10px] text-[#5C3B37]">Click to change</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 rounded-full bg-[#D5AAA2]/40 flex items-center justify-center">
                                            <Cloud className="w-6 h-6 text-[#8C5A54]" />
                                        </div>
                                        <span className="text-xs font-bold text-[#2A1816]">Drag & drop an image here</span>
                                        <span className="text-[10px] text-[#5C3B37]">or click to browse files</span>
                                    </div>
                                )}
                            </div>
                        </div>`;

content = content.replace(oldFormFields, newFormFields);
content = content.replace(/className="border-\[\#D5AAA2\] bg-\[\#E8D6CF\]\/70 h-10 text-xs rounded-xl font-semibold text-\[\#2A1816\] focus:border-\[\#B32D25\] shadow-inner"/g, 'className="border-[#DCBAB2] bg-[#FDF8F7] h-10 text-xs rounded-xl font-semibold text-[#2A1816] focus:border-[#B32D25] shadow-sm hover:bg-[#FAF2EE] transition-colors"');
content = content.replace(/<DialogFooter className="pt-4 border-t border-\[\#D8B4AE\]\/70 flex gap-2">[\s\S]*?<\/DialogFooter>/, `<DialogFooter className="pt-5 border-t border-[#D8B4AE]/70 flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                onClick={() => setIsAddModalOpen(false)}
                                className="border border-[#DCBAB2] text-[#6E4742] bg-[#FDF8F7] hover:bg-[#FAF2EE] hover:text-[#2A1816] rounded-full text-xs font-mono font-bold uppercase tracking-wider flex-1 py-3 transition-colors cursor-pointer text-center"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] rounded-full text-xs font-mono font-bold uppercase tracking-widest flex-1 py-3 transition-colors cursor-pointer border border-[#A6352F] shadow-lg shadow-[#8C241E]/20 text-center flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Cloud className="w-3.5 h-3.5" />
                                        <span>Upload Photo</span>
                                    </>
                                )}
                            </button>
                        </DialogFooter>`);

fs.writeFileSync(file, content);
