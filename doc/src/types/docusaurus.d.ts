/**
 * Custom frontmatter fields injected by the remark-creation-date plugin.
 * Use with type assertion: `frontMatter as typeof frontMatter & RemarkCreationDateFields`
 */
export type RemarkCreationDateFields = {
  /** Formatted as YYYY/MM/DD */
  custom_creation_date?: string;
  /** Unix timestamp in milliseconds */
  custom_creation_timestamp?: number;
};
