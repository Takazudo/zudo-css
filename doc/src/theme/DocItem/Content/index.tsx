import { type ReactNode } from 'react';
import clsx from 'clsx';
import { ThemeClassNames } from '@docusaurus/theme-common';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import Heading from '@theme/Heading';
import MDXContent from '@theme/MDXContent';
import type { Props } from '@theme/DocItem/Content';
import type { RemarkCreationDateFields } from '@site/src/types/docusaurus';

/**
 * Component to display document metadata (creation date, update date, author)
 * Rendered via SSR so metadata is available even with JavaScript disabled.
 */
function DocMetadata(): ReactNode {
  const { frontMatter: rawFrontMatter, metadata } = useDoc();
  const frontMatter = rawFrontMatter as typeof rawFrontMatter & RemarkCreationDateFields;

  const creationDate = frontMatter.custom_creation_date;
  const lastUpdatedAt = metadata.lastUpdatedAt;
  const lastUpdatedBy = metadata.lastUpdatedBy;

  // Format the last updated date to match creation date format (YYYY/MM/DD)
  let formattedUpdateDate: string | undefined;
  let updateISODate: string | undefined;
  let formattedCreationDate: string | undefined;
  let creationISODate: string | undefined;

  if (lastUpdatedAt) {
    const date = new Date(lastUpdatedAt);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    formattedUpdateDate = `${year}/${month}/${day}`;
    updateISODate = date.toISOString();

    // If no custom creation date from Git, use lastUpdatedAt as fallback
    if (!creationDate) {
      formattedCreationDate = formattedUpdateDate;
      creationISODate = updateISODate;
    }
  }

  // Use custom creation date from frontmatter if available
  if (creationDate) {
    formattedCreationDate = creationDate;
    const ts = frontMatter.custom_creation_timestamp;
    creationISODate = ts ? new Date(ts).toISOString() : creationDate.replace(/\//g, '-');
  }

  // Don't render anything if we have no metadata to show
  if (!formattedCreationDate && !lastUpdatedAt && !lastUpdatedBy) {
    return null;
  }

  return (
    <ul className="theme-doc-meta">
      {formattedCreationDate && (
        <li className="theme-doc-meta-created">
          <span>Created:</span>
          <time dateTime={creationISODate}>{formattedCreationDate}</time>
        </li>
      )}
      {formattedUpdateDate && (
        <li className="theme-doc-meta-updated">
          <span>Updated:</span>
          <time dateTime={updateISODate}>{formattedUpdateDate}</time>
        </li>
      )}
      {lastUpdatedBy && (
        <li className="theme-doc-meta-author">
          <span>Author:</span>
          <address>{lastUpdatedBy}</address>
        </li>
      )}
    </ul>
  );
}

/**
 Title can be declared inside md content or declared through
 front matter and added manually. To make both cases consistent,
 the added title is added under the same div.markdown block
 See https://github.com/facebook/docusaurus/pull/4882#issuecomment-853021120

 We render a "synthetic title" if:
 - user doesn't ask to hide it with front matter
 - the markdown content does not already contain a top-level h1 heading
*/
function useSyntheticTitle(): string | null {
  const { metadata, frontMatter, contentTitle } = useDoc();
  const shouldRender = !frontMatter.hide_title && typeof contentTitle === 'undefined';
  if (!shouldRender) {
    return null;
  }
  return metadata.title;
}

export default function DocItemContent({ children }: Props): ReactNode {
  const syntheticTitle = useSyntheticTitle();
  return (
    <div className={clsx(ThemeClassNames.docs.docMarkdown, 'markdown')}>
      {syntheticTitle && (
        <header>
          <Heading as="h1">{syntheticTitle}</Heading>
        </header>
      )}
      <DocMetadata />
      <MDXContent>{children}</MDXContent>
    </div>
  );
}
