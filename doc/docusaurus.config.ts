import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'CSS Best Practices for AI',
  tagline: 'Curated CSS techniques that AI agents should know',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'http://css-bp.localhost:8811',
  baseUrl: '/',

  organizationName: 'takazudo',
  projectName: 'css-best-practices',

  onBrokenLinks: 'warn',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
          beforeDefaultRemarkPlugins: [[require('./plugins/remark-creation-date.js'), {}]],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'CSS Best Practices',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'overviewSidebar',
          position: 'left',
          label: 'Overview',
        },
        {
          type: 'docSidebar',
          sidebarId: 'layoutSidebar',
          position: 'left',
          label: 'Layout',
        },
        {
          type: 'docSidebar',
          sidebarId: 'typographySidebar',
          position: 'left',
          label: 'Typography',
        },
        {
          type: 'docSidebar',
          sidebarId: 'spacingSizingSidebar',
          position: 'left',
          label: 'Spacing & Sizing',
        },
        {
          type: 'docSidebar',
          sidebarId: 'colorSidebar',
          position: 'left',
          label: 'Color',
        },
        {
          type: 'docSidebar',
          sidebarId: 'visualEffectsSidebar',
          position: 'left',
          label: 'Visual Effects',
        },
        {
          type: 'docSidebar',
          sidebarId: 'responsiveSidebar',
          position: 'left',
          label: 'Responsive',
        },
        {
          type: 'docSidebar',
          sidebarId: 'interactiveSidebar',
          position: 'left',
          label: 'Interactive',
        },
        {
          type: 'docSidebar',
          sidebarId: 'modernCssSidebar',
          position: 'left',
          label: 'Modern CSS',
        },
        {
          type: 'docSidebar',
          sidebarId: 'inboxSidebar',
          position: 'left',
          label: 'INBOX',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `CSS Best Practices for AI Agents. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['css', 'scss'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
