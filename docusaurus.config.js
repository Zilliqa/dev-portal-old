module.exports = {
  title: 'Zilliqa Developer Portal', // not used, see customFields
  tagline: 'Technical documentation for participating in the Zilliqa network.', // not used, see customFields
  url: 'https://dev.zilliqa.com',
  baseUrl: '/',
  favicon: 'img/favicon.png',
  organizationName: 'zilliqa', // Usually your GitHub org/user name.
  projectName: 'dev-portal', // Usually your repo name.
  customFields : {
    // split the alignment for the cover page title and tagline
    title_one: 'Zilliqa',
    title_two: 'Developer Portal',
    tagline_one: 'Technical documentation for',
    tagline_two: 'participating in the Zilliqa network.'
  },
  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Zilliqa Developer Portal',
      logo: {
        alt: 'Zilliqa Logo',
        src: 'img/logo.png',
      },
      links: [
        {
          to: 'docs/basics/basics-intro-blockchain',
          activeBasePath: 'docs/basics',
          label: 'Basics',
          position: 'right',
        },
        {
          to: 'docs/dev/dev-started-introduction',
          activeBasePath: 'docs/dev',
          label: 'Developers',
          position: 'right',
        },
        {
          to: 'docs/apis/api-introduction',
          activeBasePath: 'docs/apis',
          label: 'APIs',
          position: 'right',
        },
        {
          to: 'docs/miners/mining-getting-started',
          activeBasePath: 'docs/miners',
          label: 'Miners',
          position: 'right',
        },
        {
          to: 'docs/exchanges/exchange-getting-started',
          activeBasePath: 'docs/exchanges',
          label: 'Exchanges',
          position: 'right',
        },
        {
          to: 'docs/staking/staking-overview',
          activeBasePath: 'docs/staking',
          label: 'Staking',
          position: 'right',
        },
        {
          to: 'docs/contributors/contribute-buildzil',
          activeBasePath: 'docs/contributors',
          label: 'Contributors',
          position: 'right',
        },
      ],
    },
    footer: {
      links: [
        {
          title: 'Developer Groups',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.com/invite/XMRE9tt',
            },
            {
              label: 'Telegram',
              href: 'https://t.me/ZilliqaDevs',
            },
 
          ],
        },
        {
          title: 'Social',
          items: [
            {
              label: 'Twitter',
              href: 'https://twitter.com/zilliqa',
            },
            {
              label: 'Youtube',
              href: 'https://www.youtube.com/channel/UCvinnFbf0u71cajoxKcfZIQ',
            },
          ],
        },
        {
          title: 'Other Links',
          items: [
            {
              label: 'Blog',
              href: 'https://blog.zilliqa.com/',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/zilliqa',
            },
          ],
        },
      ],
      copyright: `Copyright © 2019 Zilliqa Research Pte. Ltd.`,
    },
    algolia: {
      apiKey: 'f1777493b2d9d1824a5daf3be87092db',
      indexName: 'zilliqa_developer',
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // It is recommended to set document id as docs home page (`docs/` path).
          homePageId: 'basics-intro-blockchain',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/Zilliqa/dev-portal/tree/master/',
        },
        theme: {
          customCss: [require.resolve('./src/css/custom.css')],
        },
      },
    ],
  ],
};
