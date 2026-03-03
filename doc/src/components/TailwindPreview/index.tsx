import { type ReactNode, useMemo } from 'react';
import CodeBlock from '@theme/CodeBlock';
import PreviewBase from '../PreviewBase';

interface TailwindPreviewProps {
  html: string;
  css?: string;
  title?: string;
  height?: number;
}

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
  const srcdoc = useMemo(() => buildSrcdoc(html, css), [html, css]);

  return (
    <PreviewBase
      html={html}
      title={title}
      height={height}
      srcdoc={srcdoc}
      sandbox="allow-scripts allow-same-origin"
      syncDelay={300}
      codeBlocks={
        <>
          <CodeBlock language="html" title="HTML">
            {html.trim()}
          </CodeBlock>
          {css && (
            <CodeBlock language="css" title="CSS">
              {css.trim()}
            </CodeBlock>
          )}
        </>
      }
    />
  );
}
