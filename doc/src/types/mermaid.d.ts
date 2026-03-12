// Type stub for mermaid — mermaid is not installed because settings.mermaid is false.
// This prevents TypeScript errors when checking mermaid-init.astro.
declare module "mermaid" {
  const mermaid: {
    initialize(config: Record<string, unknown>): void;
    run(config: { nodes: Element[] }): Promise<void>;
  };
  export default mermaid;
}
