'use client';

import { useRef, useCallback } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
}

export default function RichTextEditor({ value, onChange, onImageUpload }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  }, [handleInput]);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload) {
      try {
        const url = await onImageUpload(file);
        document.execCommand('insertImage', false, url);
        handleInput();
      } catch (error) {
        console.error('Image upload failed:', error);
      }
    }
    e.target.value = '';
  }, [onImageUpload, handleInput]);

  return (
    <div className="border border-gray-300 rounded-md">
      <div className="border-b border-gray-300 p-2 flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
          title="굵게"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
          title="기울임"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => execCommand('underline')}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
          title="밑줄"
        >
          <u>U</u>
        </button>
        <div className="border-l border-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => execCommand('formatBlock', 'h2')}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
          title="제목"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', 'p')}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
          title="본문"
        >
          P
        </button>
        <div className="border-l border-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
          title="목록"
        >
          • 목록
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
          title="번호 목록"
        >
          1. 목록
        </button>
        {onImageUpload && (
          <>
            <div className="border-l border-gray-300 mx-1" />
            <label className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 cursor-pointer">
              이미지
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </>
        )}
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        className="min-h-[300px] p-4 focus:outline-none"
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  );
}

