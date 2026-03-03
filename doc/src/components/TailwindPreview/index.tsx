import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import styles from './styles.module.css';

interface TailwindPreviewProps {
  html: string;
  css?: string;
  title?: string;
  height?: number;
}

type Viewport = { label: string; width: string };

const VIEWPORTS: Viewport[] = [
  { label: 'Mobile', width: '320px' },
  { label: 'Tablet', width: '768px' },
  { label: 'Full', width: '100%' },
];

function buildSrcdoc(html: string, css?: string): string {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<script src="https://cdn.tailwindcss.com"></script>
${css ? `<style>${css}</style>` : ''}
</head>
<body>${html}</body>
</html>`;
}

export default function TailwindPreview({
  html,
  css,
  title,
  height,
}: TailwindPreviewProps): ReactNode {
  const [activeViewport, setActiveViewport] = useState(2); // default: Full
  const [codeOpen, setCodeOpen] = useState(false);
  const [iframeHeight, setIframeHeight] = useState(height ?? 200);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const srcdoc = buildSrcdoc(html, css);

  const syncHeight = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe || height) return; // skip if explicit height given
    try {
      const doc = iframe.contentDocument;
      if (doc?.body) {
        const h = doc.body.scrollHeight;
        if (h > 0) setIframeHeight(Math.max(h + 16, 200));
      }
    } catch {
      // cross-origin or not yet loaded — ignore
    }
  }, [height]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const onLoad = () => {
      // Delay sync to allow Tailwind CDN to process classes
      setTimeout(syncHeight, 300);
    };
    iframe.addEventListener('load', onLoad);
    return () => iframe.removeEventListener('load', onLoad);
  }, [syncHeight, srcdoc]);

  const containerWidth = VIEWPORTS[activeViewport].width;

  return (
    <div className={styles.wrapper}>
      {/* Title bar with viewport buttons */}
      <div className={styles.titleBar}>
        {title && <span className={styles.title}>{title}</span>}
        <div className={styles.viewportButtons}>
          {VIEWPORTS.map((vp, i) => (
            <button
              key={vp.label}
              type="button"
              className={
                i === activeViewport
                  ? styles.viewportBtnActive
                  : styles.viewportBtn
              }
              onClick={() => setActiveViewport(i)}
            >
              {vp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preview area */}
      <div className={styles.previewArea}>
        <div
          className={styles.previewContainer}
          style={{ width: containerWidth }}
        >
          <iframe
            ref={iframeRef}
            className={styles.iframe}
            srcDoc={srcdoc}
            sandbox="allow-scripts allow-same-origin"
            style={{ height: iframeHeight }}
            title={title ?? 'Tailwind CSS Preview'}
          />
        </div>
      </div>

      {/* Code section */}
      <div className={styles.codeSection}>
        <button
          type="button"
          className={styles.codeToggle}
          onClick={() => setCodeOpen((v) => !v)}
        >
          <span
            className={
              codeOpen ? styles.codeToggleIconOpen : styles.codeToggleIcon
            }
          >
            &#9654;
          </span>
          {codeOpen ? 'Hide code' : 'Show code'}
        </button>
        {codeOpen && (
          <div className={styles.codeContent}>
            <CodeBlock language="html" title="HTML">
              {html.trim()}
            </CodeBlock>
            {css && (
              <CodeBlock language="css" title="CSS">
                {css.trim()}
              </CodeBlock>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
