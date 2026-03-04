import { type ReactNode, useMemo } from 'react';
import CodeBlock from '@theme/CodeBlock';
import PreviewBase from '../PreviewBase';
import { preflightCss } from './preflight';

interface CssPreviewProps {
  html: string;
  css: string;
  title?: string;
  height?: number;
  defaultOpen?: boolean;
}

function buildSrcdoc(html: string, css: string): string {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>${preflightCss}</style>
<style>html, body { height: 100%; }</style>
<style>${css}</style>
</head>
<body>${html}</body>
</html>`;
}

export default function CssPreview({
  html,
  css,
  title,
  height,
  defaultOpen,
}: CssPreviewProps): ReactNode {
  const srcdoc = useMemo(() => buildSrcdoc(html, css), [html, css]);

  return (
    <PreviewBase
      title={title}
      height={height}
      srcdoc={srcdoc}
      defaultOpen={defaultOpen}
      sandbox="allow-same-origin"
      syncDelay={0}
      codeBlocks={
        <>
          <CodeBlock language="html" title="HTML">
            {html.trim()}
          </CodeBlock>
          <CodeBlock language="css" title="CSS">
            {css.trim()}
          </CodeBlock>
        </>
      }
    />
  );
}
