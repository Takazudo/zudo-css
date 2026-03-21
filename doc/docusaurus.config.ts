import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'zudo-css',
  tagline: 'CSS best practices documentation',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://takazudomodular.com',
  baseUrl: '/pj/zcss/',

  organizationName: 'takazudo',
  projectName: 'css-best-practices',

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ja'],
    localeConfigs: {
      en: { label: 'English' },
      ja: { label: '日本語' },
    },
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

  headTags: [
    {
      tagName: 'link',
      attributes: { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap',
      },
    },
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'zudo-css',
      logo: {
        alt: 'zudo-css Logo',
        src: 'img/logo.svg',
      },
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
          sidebarId: 'colorSidebar',
          position: 'left',
          label: 'Color',
        },
        {
          type: 'docSidebar',
          sidebarId: 'visualSidebar',
          position: 'left',
          label: 'Visual',
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
          sidebarId: 'methodologySidebar',
          position: 'left',
          label: 'Methodology',
        },
        {
          type: 'docSidebar',
          sidebarId: 'cssPlaygroundSidebar',
          position: 'left',
          label: 'CSS Playground',
        },
        {
          type: 'docSidebar',
          sidebarId: 'inboxSidebar',
          position: 'left',
          label: 'INBOX',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `© ${new Date().getFullYear()} Takazudo. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['css', 'scss'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
