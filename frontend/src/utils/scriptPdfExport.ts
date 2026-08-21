// @ts-nocheck
import { jsPDF } from "jspdf";

export interface ScriptExportData {
  id?: string | number;
  title: string;
  playwright?: string;
  genre?: string;
  language?: string;
  pages?: string | number;
  acts?: string;
  rolesCount?: string;
  excerpt?: string;
  content?: string;
  author_name?: string;
}

export function exportScriptToPdf(script: ScriptExportData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  // Colors
  const COLOR_CRIMSON = [140, 36, 30]; // #8C241E
  const COLOR_DARK = [42, 24, 22]; // #2A1816
  const COLOR_MUTED = [140, 90, 84]; // #8C5A54
  const COLOR_BODY = [92, 59, 55]; // #5C3B37
  const COLOR_BG_BOX = [250, 242, 238]; // #FAF2EE
  const COLOR_BORDER = [220, 186, 178]; // #DCBAB2

  let parsed: any = {};
  let lines: Array<{ characterName?: string; characterId?: string; text: string; color?: string; type?: string }> = [];
  let characters: Array<{ name: string; traits?: string | string[]; role?: string; color?: string }> = [];
  let synopsis = script.excerpt || "";
  let theme = "";
  let settingInfo = "";

  if (script.content) {
    try {
      if (script.content.trim().startsWith("{") || script.content.trim().startsWith("[")) {
        parsed = JSON.parse(script.content);
        if (parsed.characters) characters = parsed.characters;
        if (parsed.lines) lines = parsed.lines;
        if (parsed.abstract) synopsis = parsed.abstract;
        if (parsed.theme) theme = parsed.theme;
        if (parsed.settingInfo) settingInfo = parsed.settingInfo;
      } else {
        const blocks = script.content.split(/\n\n+/);
        blocks.forEach((block) => {
          const trimmed = block.trim();
          if (!trimmed) return;
          if (trimmed.startsWith("(") && trimmed.endsWith(")")) {
            lines.push({
              characterName: "stage-note",
              text: trimmed.slice(1, -1),
              type: "stage-note"
            });
          } else if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
            lines.push({
              characterName: "scene-heading",
              text: trimmed.slice(1, -1),
              type: "scene-heading"
            });
          } else {
            const m = trimmed.match(/^(\*\*([^*]+)\*\*|([A-Za-z0-9\s]+)):\s*([\s\S]*)$/);
            if (m) {
              const charName = (m[2] || m[3] || "Character").trim();
              const text = m[4].trim();
              lines.push({
                characterName: charName,
                text,
                type: "dialogue"
              });
            } else {
              lines.push({
                characterName: "stage-note",
                text: trimmed,
                type: "stage-note"
              });
            }
          }
        });
      }
    } catch (e) {
      console.warn("Script parsing note:", e);
    }
  }

  function checkPageBreak(neededHeight: number) {
    if (cursorY + neededHeight > pageHeight - margin - 12) {
      doc.addPage();
      cursorY = margin + 5;
      drawHeaderRunning();
    }
  }

  function drawHeaderRunning() {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...COLOR_MUTED);
    doc.text("AAYAM - THE MATINEE CLUB | OFFICIAL PRODUCTION SCRIPT", margin, margin - 6);
    doc.setDrawColor(...COLOR_BORDER);
    doc.setLineWidth(0.3);
    doc.line(margin, margin - 4, pageWidth - margin, margin - 4);
  }

  // --- 1. COVER / HEADER SECTION ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_CRIMSON);
  doc.text("AAYAM - THE MATINEE CLUB • IIT MADRAS BS DRAMA SOCIETY", pageWidth / 2, cursorY, { align: "center" });
  cursorY += 6;

  doc.setFont("times", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...COLOR_DARK);
  const titleText = script.title || "Untitled Playbook Script";
  const splitTitle = doc.splitTextToSize(titleText, contentWidth);
  splitTitle.forEach((tLine: string) => {
    doc.text(tLine, pageWidth / 2, cursorY, { align: "center" });
    cursorY += 8;
  });

  doc.setFont("times", "italic");
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_BODY);
  const metaSubtitle = `A Play by ${script.playwright || "Aayam Playwright"}${script.genre ? ` • ${script.genre}` : ""}${script.language ? ` • ${script.language}` : ""}`;
  doc.text(metaSubtitle, pageWidth / 2, cursorY, { align: "center" });
  cursorY += 6;

  doc.setFont("courier", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_MUTED);
  const specText = `${script.acts || "3 Acts"}  |  ${script.pages || "50+"} Pages  |  ${script.rolesCount || `${characters.length || 6} Roles`}`;
  doc.text(specText, pageWidth / 2, cursorY, { align: "center" });
  cursorY += 8;

  // Header Divider
  doc.setDrawColor(...COLOR_CRIMSON);
  doc.setLineWidth(0.8);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 7;

  // --- 2. SYNOPSIS & DRAMATURGY PREMISE ---
  if (synopsis) {
    checkPageBreak(30);
    const synLines = doc.splitTextToSize(`"${synopsis}"`, contentWidth - 8);
    const boxHeight = 12 + synLines.length * 4.5;

    doc.setFillColor(...COLOR_BG_BOX);
    doc.setDrawColor(...COLOR_BORDER);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, cursorY, contentWidth, boxHeight, 3, 3, "FD");

    doc.setFont("courier", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...COLOR_CRIMSON);
    doc.text("STORY SYNOPSIS & DRAMATURGY PREMISE", margin + 4, cursorY + 6);

    doc.setFont("times", "italic");
    doc.setFontSize(9.5);
    doc.setTextColor(...COLOR_BODY);
    let synY = cursorY + 11;
    synLines.forEach((sLine: string) => {
      doc.text(sLine, margin + 4, synY);
      synY += 4.5;
    });

    cursorY += boxHeight + 6;
  }

  // --- 3. THEME & SETTING ---
  if (theme || settingInfo) {
    checkPageBreak(20);
    const colWidth = (contentWidth - 4) / 2;
    const themeLines = theme ? doc.splitTextToSize(theme, colWidth - 8) : [];
    const settingLines = settingInfo ? doc.splitTextToSize(settingInfo, colWidth - 8) : [];
    const maxLineCount = Math.max(themeLines.length, settingLines.length, 1);
    const boxHeight = 11 + maxLineCount * 4.5;

    doc.setFillColor(...COLOR_BG_BOX);
    doc.setDrawColor(...COLOR_BORDER);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, cursorY, contentWidth, boxHeight, 3, 3, "FD");

    if (theme) {
      doc.setFont("courier", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...COLOR_CRIMSON);
      doc.text("CORE DRAMATIC THEME", margin + 4, cursorY + 5.5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...COLOR_DARK);
      let tY = cursorY + 10;
      themeLines.forEach((tl: string) => {
        doc.text(tl, margin + 4, tY);
        tY += 4.5;
      });
    }

    if (settingInfo) {
      const rightX = margin + colWidth + 4;
      doc.setFont("courier", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...COLOR_CRIMSON);
      doc.text("SETTING & TIME PERIOD", rightX, cursorY + 5.5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...COLOR_DARK);
      let sY = cursorY + 10;
      settingLines.forEach((sl: string) => {
        doc.text(sl, rightX, sY);
        sY += 4.5;
      });
    }

    cursorY += boxHeight + 6;
  }

  // --- 4. DRAMATIS PERSONAE (CHARACTERS) ---
  if (characters.length > 0) {
    checkPageBreak(25);
    doc.setFont("courier", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...COLOR_CRIMSON);
    doc.text(`DRAMATIS PERSONAE (${characters.length} Roles)`, margin, cursorY);
    cursorY += 4;

    doc.setDrawColor(...COLOR_BORDER);
    doc.setLineWidth(0.3);
    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 5;

    characters.forEach((c) => {
      checkPageBreak(10);
      const traitsStr = c.traits
        ? Array.isArray(c.traits)
          ? c.traits.join(", ")
          : c.traits
        : "";

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...COLOR_DARK);
      const nameWidth = doc.getTextWidth(`• ${c.name}`);
      doc.text(`• ${c.name}`, margin + 2, cursorY);

      if (c.role) {
        doc.setFont("courier", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(...COLOR_CRIMSON);
        doc.text(` [${c.role.toUpperCase()}]`, margin + 2 + nameWidth, cursorY);
      }

      if (traitsStr) {
        doc.setFont("times", "italic");
        doc.setFontSize(8.5);
        doc.setTextColor(...COLOR_MUTED);
        const prefixOffset = margin + 2 + nameWidth + (c.role ? doc.getTextWidth(` [${c.role.toUpperCase()}]`) + 2 : 2);
        const splitTraits = doc.splitTextToSize(`— ${traitsStr}`, contentWidth - (prefixOffset - margin));
        doc.text(splitTraits[0] || "", prefixOffset, cursorY);
      }
      cursorY += 5.5;
    });

    cursorY += 4;
  }

  // --- 5. THEATRICAL PLAYBOOK & SPOKEN DIALOGUES ---
  checkPageBreak(25);
  doc.setFont("courier", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_CRIMSON);
  doc.text("THEATRICAL MANUSCRIPT & SPOKEN DIALOGUE", margin, cursorY);
  cursorY += 3;

  doc.setDrawColor(...COLOR_CRIMSON);
  doc.setLineWidth(0.6);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 7;

  if (lines.length > 0) {
    lines.forEach((line) => {
      if (line.type === "scene-heading" || line.characterName === "scene-heading") {
        checkPageBreak(16);
        cursorY += 3;
        doc.setFillColor(245, 234, 230);
        doc.setDrawColor(...COLOR_BORDER);
        doc.setLineWidth(0.3);
        doc.rect(margin, cursorY, contentWidth, 8, "FD");

        doc.setFont("courier", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(...COLOR_CRIMSON);
        doc.text(`[ ${line.text.toUpperCase()} ]`, pageWidth / 2, cursorY + 5.5, { align: "center" });
        cursorY += 13;
      } else if (line.type === "stage-note" || line.characterName === "stage-note") {
        const noteLines = doc.splitTextToSize(`( ${line.text} )`, contentWidth - 10);
        const noteHeight = noteLines.length * 4.2 + 4;
        checkPageBreak(noteHeight + 4);

        doc.setFillColor(248, 243, 240);
        doc.rect(margin + 4, cursorY, contentWidth - 4, noteHeight, "F");

        // Crimson Left Accent Bar
        doc.setDrawColor(...COLOR_CRIMSON);
        doc.setLineWidth(1);
        doc.line(margin + 4, cursorY, margin + 4, cursorY + noteHeight);

        doc.setFont("courier", "italic");
        doc.setFontSize(8.5);
        doc.setTextColor(...COLOR_BODY);
        let nY = cursorY + 4;
        noteLines.forEach((nl: string) => {
          doc.text(nl, margin + 8, nY);
          nY += 4.2;
        });

        cursorY += noteHeight + 4;
      } else {
        const speechLines = doc.splitTextToSize(`"${line.text}"`, contentWidth - 16);
        const lineBlockHeight = 6 + speechLines.length * 4.6 + 3;
        checkPageBreak(lineBlockHeight);

        // Character Name Cue
        doc.setFont("courier", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(...COLOR_CRIMSON);
        doc.text(`${(line.characterName || "ACTOR").toUpperCase()}:`, margin + 4, cursorY);
        cursorY += 4.5;

        // Dialogue speech text
        doc.setFont("times", "normal");
        doc.setFontSize(10.5);
        doc.setTextColor(...COLOR_DARK);
        speechLines.forEach((sl: string) => {
          doc.text(sl, margin + 10, cursorY);
          cursorY += 4.6;
        });

        cursorY += 3.5;
      }
    });
  } else if (script.content) {
    const rawParagraphs = script.content.split("\n");
    rawParagraphs.forEach((para) => {
      if (!para.trim()) {
        cursorY += 3;
        return;
      }
      const pLines = doc.splitTextToSize(para, contentWidth);
      checkPageBreak(pLines.length * 4.8);
      doc.setFont("times", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...COLOR_DARK);
      pLines.forEach((pl: string) => {
        doc.text(pl, margin, cursorY);
        cursorY += 4.8;
      });
    });
  }

  // --- FOOTER & PAGE NUMBERING ON EVERY PAGE ---
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("courier", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...COLOR_MUTED);
    doc.setDrawColor(...COLOR_BORDER);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - margin + 2, pageWidth - margin, pageHeight - margin + 2);

    doc.text(
      `Aayam - The Matinee Club | IIT Madras BS Drama Society`,
      margin,
      pageHeight - margin + 6
    );
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - margin + 6,
      { align: "right" }
    );
  }

  // DIRECT FILE DOWNLOAD TRIGGER:
  const safeFilename = (script.title || "Aayam_Script_Playbook")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_");
  doc.save(`${safeFilename}_Official_Playbook.pdf`);
}
