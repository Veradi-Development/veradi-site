'use client';

import { useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// React Quill을 동적으로 import (SSR 방지)
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageUpload: (file: File) => Promise<string>;
}

export default function RichTextEditor({ value, onChange, onImageUpload }: RichTextEditorProps) {
  const quillRef = useRef<any>(null);

  // 이미지 핸들러
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        // 이미지 업로드
        const imageUrl = await onImageUpload(file);

        // 에디터에 이미지 삽입
        const quill = quillRef.current?.getEditor();
        if (quill) {
          const range = quill.getSelection();
          quill.insertEmbed(range.index, 'image', imageUrl);
        }
      } catch (error) {
        alert('이미지 업로드에 실패했습니다.');
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ['link', 'image'],
          ['clean'],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'color',
    'background',
    'align',
    'link',
    'image',
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder="공지사항 내용을 입력하세요. 이미지는 툴바의 이미지 버튼을 클릭하여 삽입할 수 있습니다."
        style={{ height: '400px', marginBottom: '60px' }}
      />
      <style jsx global>{`
        .rich-text-editor .ql-editor {
          min-height: 400px;
          font-size: 16px;
          line-height: 1.6;
        }
        .rich-text-editor .ql-toolbar {
          border: 1px solid #d1d5db;
          border-radius: 0.375rem 0.375rem 0 0;
          background-color: #f9fafb;
        }
        .rich-text-editor .ql-container {
          border: 1px solid #d1d5db;
          border-top: none;
          border-radius: 0 0 0.375rem 0.375rem;
          font-family: inherit;
        }
        .rich-text-editor .ql-editor img {
          max-width: 100%;
          height: auto;
        }
      `}</style>
    </div>
  );
}

