import React, { useMemo, useState, useEffect, useCallback } from "react";
import { createEditor, Editor, Transforms, Element as SlateElement } from "slate";
import type { Descendant } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Quote,
    List,
    ListOrdered
} from "lucide-react";

interface PlateEditorProps {
    markdownContent?: string;
    onChangeMarkdown?: (markdown: string) => void;
    onChangeText?: (text: string) => void;
    readOnly?: boolean;
}

const LIST_TYPES = ["numbered-list", "bulleted-list"];

const parseInlineMarkdown = (text: string): any[] => {
    const tokens = [
        { key: "bold", regex: /^\*\*([\s\S]+?)\*\*/ },
        { key: "italic", regex: /^_([\s\S]+?)_/ },
        { key: "strikethrough", regex: /^~~([\s\S]+?)~~/ },
        { key: "code", regex: /^`([\s\S]+?)`/ },
        { key: "underline", regex: /^<u>([\s\S]+?)<\/u>/ }
    ];

    const result: any[] = [];

    const parse = (str: string, activeMarks: Record<string, boolean>) => {
        if (!str) return;

        let matched = false;

        for (const token of tokens) {
            const match = str.match(token.regex);
            if (match) {
                matched = true;
                const innerText = match[1];
                const matchLen = match[0].length;

                const innerMarks = { ...activeMarks, [token.key]: true };
                parse(innerText, innerMarks);
                parse(str.substring(matchLen), activeMarks);
                break;
            }
        }

        if (!matched) {
            let nextIndex = str.length;
            const prefixes = ["**", "_", "~~", "`", "<u>"];
            for (const prefix of prefixes) {
                const idx = str.indexOf(prefix);
                if (idx !== -1 && idx < nextIndex) {
                    nextIndex = idx;
                }
            }

            if (nextIndex > 0) {
                const plainText = str.substring(0, nextIndex);
                result.push({
                    text: plainText,
                    ...activeMarks
                });
            }

            if (nextIndex < str.length) {
                parse(str.substring(nextIndex), activeMarks);
            }
        }
    };

    parse(text, {});

    if (result.length === 0) {
        return [{ text: "" }];
    }

    return result;
};

export const deserializeMarkdown = (markdown: string): any[] => {
    if (!markdown || !markdown.trim()) {
        return [{ type: "paragraph", children: [{ text: "" }] }];
    }

    const lines = markdown.split(/\r?\n/);
    const nodes: any[] = [];

    let inList = false;
    let listType = "";
    let listChildren: any[] = [];

    const flushList = () => {
        if (inList) {
            nodes.push({
                type: listType,
                children: listChildren
            });
            inList = false;
            listChildren = [];
        }
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        if (!trimmed) {
            flushList();
            continue;
        }

        if (trimmed.startsWith("# ")) {
            flushList();
            nodes.push({
                type: "heading-one",
                children: parseInlineMarkdown(trimmed.substring(2))
            });
            continue;
        }
        if (trimmed.startsWith("## ")) {
            flushList();
            nodes.push({
                type: "heading-two",
                children: parseInlineMarkdown(trimmed.substring(3))
            });
            continue;
        }
        if (trimmed.startsWith("> ")) {
            flushList();
            nodes.push({
                type: "block-quote",
                children: parseInlineMarkdown(trimmed.substring(2))
            });
            continue;
        }
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
            const textContent = trimmed.substring(2);
            if (!inList || listType !== "bulleted-list") {
                flushList();
                inList = true;
                listType = "bulleted-list";
            }
            listChildren.push({
                type: "list-item",
                children: parseInlineMarkdown(textContent)
            });
            continue;
        }

        const numListMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numListMatch) {
            const textContent = numListMatch[2];
            if (!inList || listType !== "numbered-list") {
                flushList();
                inList = true;
                listType = "numbered-list";
            }
            listChildren.push({
                type: "list-item",
                children: parseInlineMarkdown(textContent)
            });
            continue;
        }

        flushList();
        nodes.push({
            type: "paragraph",
            children: parseInlineMarkdown(line)
        });
    }

    flushList();

    if (nodes.length === 0) {
        return [{ type: "paragraph", children: [{ text: "" }] }];
    }

    return nodes;
};

const serializeInline = (leaves: any[]): string => {
    if (!leaves) return "";
    return leaves
        .map(leaf => {
            let text = leaf.text || "";
            if (!text) return "";
            if (leaf.bold) text = `**${text}**`;
            if (leaf.italic) text = `_${text}_`;
            if (leaf.underline) text = `<u>${text}</u>`;
            if (leaf.strikethrough) text = `~~${text}~~`;
            if (leaf.code) text = `\`${text}\``;
            return text;
        })
        .join("");
};

export const serializeToMarkdown = (nodes: any[]): string => {
    return nodes
        .map(node => {
            if (node.type === "heading-one") {
                return `# ${serializeInline(node.children)}\n\n`;
            }
            if (node.type === "heading-two") {
                return `## ${serializeInline(node.children)}\n\n`;
            }
            if (node.type === "block-quote") {
                return `> ${serializeInline(node.children)}\n\n`;
            }
            if (node.type === "bulleted-list") {
                return (node.children || [])
                    .map((item: any) => `- ${serializeInline(item.children)}`)
                    .join("\n") + "\n\n";
            }
            if (node.type === "numbered-list") {
                return (node.children || [])
                    .map((item: any, idx: number) => `${idx + 1}. ${serializeInline(item.children)}`)
                    .join("\n") + "\n\n";
            }
            if (node.type === "paragraph") {
                return `${serializeInline(node.children)}\n\n`;
            }
            if (node.type === "list-item") {
                return `- ${serializeInline(node.children)}\n\n`;
            }
            return `${serializeInline(node.children)}\n\n`;
        })
        .join("")
        .trim();
};

const isMarkActive = (editor: any, format: string) => {
    const marks = Editor.marks(editor) as any;
    return marks ? marks[format] === true : false;
};

const toggleMark = (editor: any, format: string) => {
    const isActive = isMarkActive(editor, format);
    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
    }
};

const isBlockActive = (editor: any, format: string) => {
    const { selection } = editor;
    if (!selection) return false;

    const [match] = Array.from(
        Editor.nodes(editor, {
            at: Editor.unhangRange(editor, selection),
            match: n =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                (n as any).type === format,
        })
    );

    return !!match;
};

const toggleBlock = (editor: any, format: string) => {
    const isActive = isBlockActive(editor, format);
    const isList = LIST_TYPES.includes(format);

    Transforms.unwrapNodes(editor, {
        match: n =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            LIST_TYPES.includes((n as any).type),
        split: true,
    });

    const newProperties: Partial<SlateElement> = {
        type: isActive ? "paragraph" : isList ? "list-item" : format,
    } as any;
    Transforms.setNodes<SlateElement>(editor, newProperties);

    if (!isActive && isList) {
        const block = { type: format, children: [] };
        Transforms.wrapNodes(editor, block);
    }
};

export const PlateEditor: React.FC<PlateEditorProps> = ({ markdownContent, onChangeMarkdown, onChangeText, readOnly = false }) => {
    const editor = useMemo(() => withHistory(withReact(createEditor())), []);

    const [value, setValue] = useState<Descendant[]>(() => {
        if (markdownContent) {
            return deserializeMarkdown(markdownContent);
        }
        return [
            {
                type: "paragraph",
                children: [{ text: "Merlin walked slowly towards the glowing pedestal. Arthur watched carefully, grasping the cold leather grip of Excalibur. The forest was silent, waiting for the wizard to speak." }],
            } as any,
        ];
    });

    // Handle updates when markdownContent changes externally
    useEffect(() => {
        if (markdownContent !== undefined) {
            const currentMd = serializeToMarkdown(editor.children);
            if (currentMd !== markdownContent) {
                const parsed = deserializeMarkdown(markdownContent);
                setValue(parsed);
                editor.children = parsed;
                // Trigger a full redraw of the Slate editor value
                editor.onChange();
            }
        }
    }, [markdownContent, editor]);

    const serializeToText = (nodes: Descendant[]): string => {
        return nodes.map(n => (n as any).children?.map((c: any) => c.text).join("") || "").join("\n");
    };

    useEffect(() => {
        if (readOnly) return;
        const timer = setTimeout(() => {
            if (onChangeText) {
                const textContent = serializeToText(value);
                onChangeText(textContent);
            }
            if (onChangeMarkdown) {
                const md = serializeToMarkdown(value);
                onChangeMarkdown(md);
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, [value, onChangeText, onChangeMarkdown, readOnly]);

    const renderElement = useCallback((props: any) => {
        const { attributes, children, element } = props;
        switch (element.type) {
            case "heading-one":
                return <h1 className="text-2xl font-bold font-serif mb-2.5 text-foreground leading-tight mt-4" {...attributes}>{children}</h1>;
            case "heading-two":
                return <h2 className="text-xl font-bold font-serif mb-2.5 text-foreground leading-tight mt-3" {...attributes}>{children}</h2>;
            case "block-quote":
                return <blockquote className="border-l-4 border-primary pl-4 my-2.5 italic text-muted-foreground" {...attributes}>{children}</blockquote>;
            case "bulleted-list":
                return <ul className="list-disc list-inside pl-4 my-2.5 text-foreground" {...attributes}>{children}</ul>;
            case "numbered-list":
                return <ol className="list-decimal list-inside pl-4 my-2.5 text-foreground" {...attributes}>{children}</ol>;
            case "list-item":
                return <li className="mb-1 text-foreground" {...attributes}>{children}</li>;
            default:
                return <p className="mb-2.5 text-foreground leading-relaxed" {...attributes}>{children}</p>;
        }
    }, []);

    const renderLeaf = useCallback((props: any) => {
        const { attributes, children, leaf } = props;
        let el = children;
        if (leaf.bold) {
            el = <strong className="font-bold">{el}</strong>;
        }
        if (leaf.italic) {
            el = <em className="italic">{el}</em>;
        }
        if (leaf.underline) {
            el = <span className="underline">{el}</span>;
        }
        if (leaf.strikethrough) {
            el = <span className="line-through">{el}</span>;
        }
        if (leaf.code) {
            el = <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-sm text-foreground">{el}</code>;
        }
        return <span {...attributes}>{el}</span>;
    }, []);

    return (
        <div className="flex flex-col h-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2rem] overflow-hidden shadow-xs min-h-[480px]">
            {/* Theatrical rich text toolbar */}
            {!readOnly && (
                <div className="flex flex-wrap items-center gap-1.5 p-2.5 bg-[#F5EAE6] border-b border-[#DCBAB2] select-none">
                    <button
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            toggleMark(editor, "bold");
                        }}
                        title="Bold (Ctrl+B)"
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                            isMarkActive(editor, "bold")
                                ? "bg-[#8C241E] text-[#FDF8F7]"
                                : "text-[#5C3B37] hover:text-[#2A1816] hover:bg-[#EEDBD5]"
                        }`}
                    >
                        <Bold className="w-3.5 h-3.5" />
                    </button>

                    <button
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            toggleMark(editor, "italic");
                        }}
                        title="Italic (Ctrl+I)"
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                            isMarkActive(editor, "italic")
                                ? "bg-[#8C241E] text-[#FDF8F7]"
                                : "text-[#5C3B37] hover:text-[#2A1816] hover:bg-[#EEDBD5]"
                        }`}
                    >
                        <Italic className="w-3.5 h-3.5" />
                    </button>

                    <button
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            toggleMark(editor, "underline");
                        }}
                        title="Underline (Ctrl+U)"
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                            isMarkActive(editor, "underline")
                                ? "bg-[#8C241E] text-[#FDF8F7]"
                                : "text-[#5C3B37] hover:text-[#2A1816] hover:bg-[#EEDBD5]"
                        }`}
                    >
                        <Underline className="w-3.5 h-3.5" />
                    </button>

                    <button
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            toggleMark(editor, "strikethrough");
                        }}
                        title="Strikethrough"
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                            isMarkActive(editor, "strikethrough")
                                ? "bg-[#8C241E] text-[#FDF8F7]"
                                : "text-[#5C3B37] hover:text-[#2A1816] hover:bg-[#EEDBD5]"
                        }`}
                    >
                        <Strikethrough className="w-3.5 h-3.5" />
                    </button>

                    <button
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            toggleMark(editor, "code");
                        }}
                        title="Monospace Stage Note"
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                            isMarkActive(editor, "code")
                                ? "bg-[#8C241E] text-[#FDF8F7]"
                                : "text-[#5C3B37] hover:text-[#2A1816] hover:bg-[#EEDBD5]"
                        }`}
                    >
                        <Code className="w-3.5 h-3.5" />
                    </button>

                    <div className="w-px h-5 bg-[#DCBAB2] mx-1" />

                    <button
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            toggleBlock(editor, "heading-one");
                        }}
                        title="Act / Scene Header"
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                            isBlockActive(editor, "heading-one")
                                ? "bg-[#8C241E] text-[#FDF8F7]"
                                : "text-[#5C3B37] hover:text-[#2A1816] hover:bg-[#EEDBD5]"
                        }`}
                    >
                        <Heading1 className="w-3.5 h-3.5" />
                    </button>

                    <button
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            toggleBlock(editor, "heading-two");
                        }}
                        title="Character Cue Header"
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                            isBlockActive(editor, "heading-two")
                                ? "bg-[#8C241E] text-[#FDF8F7]"
                                : "text-[#5C3B37] hover:text-[#2A1816] hover:bg-[#EEDBD5]"
                        }`}
                    >
                        <Heading2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            toggleBlock(editor, "block-quote");
                        }}
                        title="Stage Direction Block"
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                            isBlockActive(editor, "block-quote")
                                ? "bg-[#8C241E] text-[#FDF8F7]"
                                : "text-[#5C3B37] hover:text-[#2A1816] hover:bg-[#EEDBD5]"
                        }`}
                    >
                        <Quote className="w-3.5 h-3.5" />
                    </button>

                    <button
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            toggleBlock(editor, "bulleted-list");
                        }}
                        title="Bulleted List"
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                            isBlockActive(editor, "bulleted-list")
                                ? "bg-[#8C241E] text-[#FDF8F7]"
                                : "text-[#5C3B37] hover:text-[#2A1816] hover:bg-[#EEDBD5]"
                        }`}
                    >
                        <List className="w-3.5 h-3.5" />
                    </button>

                    <button
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            toggleBlock(editor, "numbered-list");
                        }}
                        title="Numbered List"
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                            isBlockActive(editor, "numbered-list")
                                ? "bg-[#8C241E] text-[#FDF8F7]"
                                : "text-[#5C3B37] hover:text-[#2A1816] hover:bg-[#EEDBD5]"
                        }`}
                    >
                        <ListOrdered className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* Scrollable editing page */}
            <div className="flex-1 overflow-y-auto p-6 pt-5 select-text custom-scrollbar">
                <Slate editor={editor} initialValue={value} onChange={setValue}>
                    <Editable
                        className="outline-none min-h-full font-serif text-base sm:text-lg leading-relaxed text-[#2A1816] placeholder:text-[#8C5A54]/50 select-text selection:bg-[#8C241E]/20"
                        placeholder={readOnly ? "No story content yet." : "Draft play scenes, character dialogue, and stage blocking here..."}
                        style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
                        renderElement={renderElement}
                        renderLeaf={renderLeaf}
                        readOnly={readOnly}
                    />
                </Slate>
            </div>

            <div className="px-6 py-3 border-t border-[#DCBAB2] flex items-center justify-between text-xs text-[#8C5A54] select-none bg-[#F5EAE6]">
                <div className="font-mono text-xs">
                    Words: <span className="font-bold text-[#2A1816] bg-[#FAF2EE] px-2.5 py-0.5 rounded-full border border-[#DCBAB2]">{serializeToText(value).split(/\s+/).filter(Boolean).length}</span>
                </div>
                <div className="italic font-serif text-[11px] text-[#8C5A54]">
                    Real-time script stream active
                </div>
            </div>
        </div>
    );
};

export default PlateEditor;
