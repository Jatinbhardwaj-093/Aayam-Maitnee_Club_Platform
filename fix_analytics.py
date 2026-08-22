import re

file_path = "/Users/jatinbhardwaj/Github/software_project/frontend/src/pages/maintainers/PlatformAnalytics.tsx"
with open(file_path, "r") as f:
    content = f.read()

# 1. Fix the Header & Tab Bar
old_header = '''        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#DCBAB2] pb-8">
          <div className="space-y-3">
            <div className="font-mono text-xs uppercase font-bold tracking-widest text-[#8C5A54] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8C241E]" />
              <span>Maintainer Operations</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl text-[#2A1816] font-normal tracking-tight">
              Platform Analytics
            </h1>
            <p className="text-sm text-[#6E4742] max-w-2xl font-light leading-relaxed">
              Executive overview of financial cash flow, production proposals, casting metrics, and system integrity. Strictly restricted to administrative ledger personnel.
            </p>
          </div>

          <div className="flex bg-[#EEDBD5] p-1.5 rounded-full border border-[#D5AAA2] w-fit shadow-inner overflow-x-auto custom-scrollbar">'''

new_header = '''        {/* Header Section */}
        <div className="flex flex-col gap-6 border-b border-[#DCBAB2] pb-8">
          <div className="space-y-3">
            <div className="font-mono text-xs uppercase font-bold tracking-widest text-[#8C5A54] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8C241E]" />
              <span>Maintainer Operations</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl text-[#2A1816] font-normal tracking-tight">
              Platform Analytics
            </h1>
            <p className="text-sm text-[#6E4742] max-w-2xl font-light leading-relaxed">
              Executive overview of financial cash flow, production proposals, casting metrics, and system integrity. Strictly restricted to administrative ledger personnel.
            </p>
          </div>

          <div className="w-full flex bg-[#FAF2EE] p-1.5 rounded-2xl sm:rounded-full border border-[#DCBAB2] shadow-inner overflow-x-auto custom-scrollbar mt-4">'''

content = content.replace(old_header, new_header)

# Fix individual tab buttons to expand
content = content.replace(
'''              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${''',
'''              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 min-w-[120px] px-5 py-3 rounded-xl sm:rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${'''
)


# 2. Fix the XAxis labels
# Find all XAxis that are NOT type="number" (which is used in the vertical bar chart)
old_xaxis = '<XAxis dataKey="name" stroke="#8C5A54" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} fontFamily="monospace" />'
new_xaxis = '<XAxis dataKey="name" stroke="#8C5A54" fontSize={10} tickLine={false} axisLine={false} tickMargin={5} angle={-35} textAnchor="end" height={60} fontFamily="monospace" />'

content = content.replace(old_xaxis, new_xaxis)

with open(file_path, "w") as f:
    f.write(content)

print("Fixed Analytics UI and Labels!")
