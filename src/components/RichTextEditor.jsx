import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

// ---------------------------------------------------------------------------
// Custom numeric font-size options (like Microsoft Word), instead of the
// default 'small' / 'large' / 'huge' keyword sizes.
// ---------------------------------------------------------------------------
const SIZE_OPTIONS = [
  { value: '10px', label: '10' },
  { value: '12px', label: '12' },
  { value: '14px', label: '14' },
  { value: '16px', label: '16' },
  { value: '18px', label: '18' },
  { value: '20px', label: '20' },
  { value: '24px', label: '24' },
  { value: '28px', label: '28' },
  { value: '32px', label: '32' },
  { value: '36px', label: '36' },
  { value: '48px', label: '48' },
  { value: '72px', label: '72' },
];

// Register the custom size attributor once (module scope, not per-render).
const SizeStyle = Quill.import('attributors/style/size');
SizeStyle.whitelist = SIZE_OPTIONS.map((opt) => opt.value);
Quill.register(SizeStyle, true);

// Custom toolbar options: Heading, Font Size (numeric), Bold/Italic/Underline, Link, Lists, Blockquote, Clean
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  [{ size: [false, ...SIZE_OPTIONS.map((opt) => opt.value)] }],
  ['bold', 'italic', 'underline'],
  ['link'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['blockquote'],
  ['clean'],
];

// Tooltip text (with keyboard shortcuts) shown on hover, keyed by CSS selector
// scoped to the toolbar container.
const TOOLTIP_MAP = {
  '.ql-header .ql-picker-label': 'Gaya Heading',
  '.ql-header .ql-picker-item[data-value="1"]': 'Heading 1 (Ctrl+Alt+1)',
  '.ql-header .ql-picker-item[data-value="2"]': 'Heading 2 (Ctrl+Alt+2)',
  '.ql-header .ql-picker-item[data-value="3"]': 'Heading 3 (Ctrl+Alt+3)',
  '.ql-header .ql-picker-item:not([data-value])': 'Normal (Ctrl+Alt+0)',
  '.ql-size .ql-picker-label': 'Ukuran Teks',
  '.ql-bold': 'Tebal (Ctrl+B)',
  '.ql-italic': 'Miring (Ctrl+I)',
  '.ql-underline': 'Garis Bawah (Ctrl+U)',
  '.ql-link': 'Sisipkan Tautan (Ctrl+K)',
  '.ql-list[value="ordered"]': 'Daftar Bernomor (Ctrl+Shift+7)',
  '.ql-list[value="bullet"]': 'Daftar Poin (Ctrl+Shift+8)',
  '.ql-blockquote': 'Kutipan (Ctrl+Shift+9)',
  '.ql-clean': 'Hapus Format (Ctrl+Spasi)',
};

// Inject the numeric-size labels + tooltip styling once per page.
function ensureEditorStylesInjected() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('rte-custom-styles')) return;

  const sizeLabelRules = SIZE_OPTIONS.map(
    ({ value, label }) => `
      .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="${value}"]::before,
      .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="${value}"]::before {
        content: "${label}";
      }
    `
  ).join('\n');

  const style = document.createElement('style');
  style.id = 'rte-custom-styles';
  style.textContent = `
    ${sizeLabelRules}

    .ql-toolbar.ql-snow .ql-picker.ql-size {
      width: 62px;
    }
    .ql-toolbar.ql-snow .ql-picker.ql-size .ql-picker-options {
      max-height: 220px;
      overflow-y: auto;
    }

    /* --- Responsive editor box: toolbar stays fixed, editor area scrolls --- */
    .rte-wrapper .ql-toolbar.ql-snow {
      border-top-left-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
      position: sticky;
      top: 0;
      z-index: 10;
      background: #fff;
    }
    .rte-wrapper .ql-container.ql-snow {
      border-bottom-left-radius: 0.5rem;
      border-bottom-right-radius: 0.5rem;
      height: auto;
    }
    .rte-wrapper .ql-editor {
      min-height: 240px;
      max-height: 55vh;
      overflow-y: auto;
    }
    @media (max-width: 640px) {
      .rte-wrapper .ql-editor {
        max-height: 40vh;
      }
    }
    /* Let the link-edit popup / tooltips escape the box instead of being clipped */
    .rte-wrapper .ql-tooltip {
      z-index: 30;
    }

    /* --- Word-style shortcut tooltips --- */
    .ql-toolbar.ql-snow [data-tooltip] {
      position: relative;
    }
    .ql-toolbar.ql-snow [data-tooltip]:hover::after {
      content: attr(data-tooltip);
      position: absolute;
      bottom: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%);
      background: #1e293b;
      color: #fff;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 500;
      line-height: 1.3;
      white-space: nowrap;
      z-index: 60;
      pointer-events: none;
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    }
    .ql-toolbar.ql-snow [data-tooltip]:hover::before {
      content: '';
      position: absolute;
      bottom: calc(100% + 3px);
      left: 50%;
      transform: translateX(-50%);
      border: 5px solid transparent;
      border-top-color: #1e293b;
      z-index: 60;
      pointer-events: none;
    }
    /* Keep tooltips above dropdown panels */
    .ql-toolbar.ql-snow .ql-picker-item[data-tooltip] {
      position: relative;
    }
  `;
  document.head.appendChild(style);
}

/**
 * RichTextEditor – Quill-based WYSIWYG editor.
 *
 * Props:
 *   value      {string}   – HTML string (controlled from parent)
 *   onChange   {function} – called with new HTML string whenever content changes
 *   placeholder {string}  – editor placeholder text
 *   error      {boolean}  – show error border when true
 */
export default function RichTextEditor({ value, onChange, placeholder, error }) {
  const containerRef = useRef(null);
  const quillRef    = useRef(null);
  const isComposing  = useRef(false); // track internal vs external updates

  // Initialise Quill once
  useEffect(() => {
    if (quillRef.current) return; // already initialised

    ensureEditorStylesInjected();

    const quill = new Quill(containerRef.current, {
      theme: 'snow',
      placeholder: placeholder || 'Tulis isi artikel di sini...',
      modules: {
        toolbar: TOOLBAR_OPTIONS,
      },
    });

    quillRef.current = quill;

    // Attach shortcut tooltips to the rendered toolbar buttons/dropdown items
    const toolbarEl = quill.getModule('toolbar')?.container;
    if (toolbarEl) {
      Object.entries(TOOLTIP_MAP).forEach(([selector, text]) => {
        toolbarEl.querySelectorAll(selector).forEach((el) => {
          el.setAttribute('data-tooltip', text);
        });
      });
    }

    // Notify parent whenever content changes
    quill.on('text-change', () => {
      if (!isComposing.current && onChange) {
        const html = quill.getSemanticHTML();
        // Treat empty editor as empty string
        onChange(html === '<p></p>' || html === '<p><br></p>' ? '' : html);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync value from parent → editor (e.g. when editing an existing article)
  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;

    // Only update if content actually differs to avoid cursor jumping
    const currentHtml = quill.getSemanticHTML();
    if (currentHtml !== value && !quill.hasFocus()) {
      isComposing.current = true;
      quill.clipboard.dangerouslyPasteHTML(value || '');
      isComposing.current = false;
    }
  }, [value]);

  return (
    <div
      className={[
        'rte-wrapper rounded-lg border transition-colors',
        error ? 'border-red-400' : 'border-slate-200 focus-within:border-primary',
      ].join(' ')}
    >
      {/* Quill mounts the toolbar + editor here */}
      <div ref={containerRef} />
    </div>
  );
}