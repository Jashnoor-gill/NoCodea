import React, { useCallback, useRef } from 'react';
import { EditorContent, useEditor, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import SlashCommand from '@tiptap/extension-slash-command';
import { PaperClipIcon, PhotoIcon, VideoCameraIcon, LinkIcon, CodeBracketIcon, TableCellsIcon, ListBulletIcon, ListOrderedIcon, BoldIcon, ItalicIcon, StrikethroughIcon, QuoteIcon, ChevronDownIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Helper: oEmbed fetch
async function getOembed(url) {
  // Replace with your backend oEmbed endpoint if needed
  const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`);
  if (!res.ok) throw new Error('oEmbed fetch failed');
  return await res.json();
}

// Helper: Image upload handler
async function uploadImage(file) {
  // Replace with your backend upload endpoint
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/upload', { method: 'POST', body: formData });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return data.url;
}

// Custom Slash Command items
const slashItems = [
  { title: 'Heading 1', icon: <BoldIcon className="w-4 h-4" />, command: ({ editor }) => editor.chain().focus().toggleHeading({ level: 1 }).run() },
  { title: 'Heading 2', icon: <BoldIcon className="w-4 h-4" />, command: ({ editor }) => editor.chain().focus().toggleHeading({ level: 2 }).run() },
  { title: 'Bold', icon: <BoldIcon className="w-4 h-4" />, command: ({ editor }) => editor.chain().focus().toggleBold().run() },
  { title: 'Italic', icon: <ItalicIcon className="w-4 h-4" />, command: ({ editor }) => editor.chain().focus().toggleItalic().run() },
  { title: 'Bullet List', icon: <ListBulletIcon className="w-4 h-4" />, command: ({ editor }) => editor.chain().focus().toggleBulletList().run() },
  { title: 'Ordered List', icon: <ListOrderedIcon className="w-4 h-4" />, command: ({ editor }) => editor.chain().focus().toggleOrderedList().run() },
  { title: 'Blockquote', icon: <QuoteIcon className="w-4 h-4" />, command: ({ editor }) => editor.chain().focus().toggleBlockquote().run() },
  { title: 'Code Block', icon: <CodeBracketIcon className="w-4 h-4" />, command: ({ editor }) => editor.chain().focus().toggleCodeBlock().run() },
  { title: 'Table', icon: <TableCellsIcon className="w-4 h-4" />, command: ({ editor }) => editor.chain().focus().insertTable({ rows: 2, cols: 2 }).run() },
  // Add more as needed
];

export default function WysiwygEditor({ value, onChange, className = '', dark = false, mediaModal, ...props }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: true }),
      Link,
      Placeholder.configure({ placeholder: 'Start writing...' }),
      SlashCommand.configure({
        items: ({ query }) => slashItems.filter(item => item.title.toLowerCase().includes(query.toLowerCase())),
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange && onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose max-w-none min-h-[300px] focus:outline-none ${dark ? 'prose-invert bg-gray-900 text-white' : 'bg-white text-gray-900'} ${className}`,
      },
    },
  });

  // Toolbar actions
  const setImage = useCallback(async () => {
    if (mediaModal) {
      const url = await mediaModal();
      if (url) editor.chain().focus().setImage({ src: url }).run();
    } else {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async () => {
        const file = input.files[0];
        if (file) {
          const url = await uploadImage(file);
          editor.chain().focus().setImage({ src: url }).run();
        }
      };
      input.click();
    }
  }, [editor, mediaModal]);

  const setEmbed = useCallback(async () => {
    const url = prompt('Enter embed URL');
    if (url) {
      try {
        const oembed = await getOembed(url);
        editor.chain().focus().insertContent(`<div class="embed">${oembed.html}</div>`).run();
      } catch (e) {
        alert('Could not fetch embed.');
      }
    }
  }, [editor]);

  // Gallery (simple version: insert multiple images)
  const setGallery = useCallback(async () => {
    if (mediaModal) {
      const urls = await mediaModal({ multiple: true });
      if (urls && urls.length) {
        const html = `<div class="gallery grid grid-cols-2 gap-2">${urls.map(url => `<img src="${url}" class="rounded" />`).join('')}</div>`;
        editor.chain().focus().insertContent(html).run();
      }
    }
  }, [editor, mediaModal]);

  if (!editor) return <div className="p-4 text-gray-400">Loading editor...</div>;

  return (
    <div className={`border rounded shadow-sm ${dark ? 'bg-gray-900' : 'bg-white'} ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-2 border-b bg-gray-50 dark:bg-gray-800">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1 rounded ${editor.isActive('bold') ? 'bg-blue-100 dark:bg-blue-900' : ''}`} title="Bold"><BoldIcon className="w-5 h-5" /></button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1 rounded ${editor.isActive('italic') ? 'bg-blue-100 dark:bg-blue-900' : ''}`} title="Italic"><ItalicIcon className="w-5 h-5" /></button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`p-1 rounded ${editor.isActive('strike') ? 'bg-blue-100 dark:bg-blue-900' : ''}`} title="Strikethrough"><StrikethroughIcon className="w-5 h-5" /></button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-1 rounded ${editor.isActive('bulletList') ? 'bg-blue-100 dark:bg-blue-900' : ''}`} title="Bullet List"><ListBulletIcon className="w-5 h-5" /></button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-1 rounded ${editor.isActive('orderedList') ? 'bg-blue-100 dark:bg-blue-900' : ''}`} title="Ordered List"><ListOrderedIcon className="w-5 h-5" /></button>
        <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-1 rounded ${editor.isActive('blockquote') ? 'bg-blue-100 dark:bg-blue-900' : ''}`} title="Blockquote"><QuoteIcon className="w-5 h-5" /></button>
        <button onClick={setImage} className="p-1 rounded" title="Insert Image"><PhotoIcon className="w-5 h-5" /></button>
        <button onClick={setGallery} className="p-1 rounded" title="Insert Gallery"><PaperClipIcon className="w-5 h-5" /></button>
        <button onClick={setEmbed} className="p-1 rounded" title="Embed"><VideoCameraIcon className="w-5 h-5" /></button>
        <button onClick={() => editor.chain().focus().undo().run()} className="p-1 rounded" title="Undo">↺</button>
        <button onClick={() => editor.chain().focus().redo().run()} className="p-1 rounded" title="Redo">↻</button>
      </div>
      {/* Editor */}
      <EditorContent editor={editor} className="px-4 py-2 min-h-[300px]" />
      {/* Bubble menu for formatting */}
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="bg-white dark:bg-gray-800 border rounded shadow flex gap-1 p-1">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1 rounded ${editor.isActive('bold') ? 'bg-blue-100 dark:bg-blue-900' : ''}`}><BoldIcon className="w-4 h-4" /></button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1 rounded ${editor.isActive('italic') ? 'bg-blue-100 dark:bg-blue-900' : ''}`}><ItalicIcon className="w-4 h-4" /></button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`p-1 rounded ${editor.isActive('strike') ? 'bg-blue-100 dark:bg-blue-900' : ''}`}><StrikethroughIcon className="w-4 h-4" /></button>
      </BubbleMenu>
      {/* Floating menu for slash commands (optional) */}
      <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }} className="bg-white dark:bg-gray-800 border rounded shadow flex flex-col gap-1 p-2">
        <div className="text-xs text-gray-500 mb-1">Type <span className="font-mono">/</span> for commands</div>
      </FloatingMenu>
    </div>
  );
} 