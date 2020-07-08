module.exports = {
  title: 'Zilliqa Developer Portal',
  tagline: 'Technical and API documentation for participating in the Zilliqa network.',
  url: 'https://dev.zilliqa.com',
  baseUrl: '/',
  favicon: 'img/favicon.png',
  organizationName: 'zilliqa', // Usually your GitHub org/user name.
  projectName: 'dev-portal', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Zilliqa Developer Portal',
      logo: {
        alt: 'My Site Logo',
        src: 'img/zilliqa-logo_1zilliqa-logo.png',
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
          to: 'docs/contributors/contribute-buildzil',
          activeBasePath: 'docs/contributors',
          label: 'Contributors',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
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
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.com/invite/BnVzu5W',
            },
            {
              label: 'Telegram',
              href: 'https://t.me/ZilliqaDevs',
            },
 
          ],
        },
        {
          title: 'More',
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
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Zilliqa Research Pte. Ltd.`,
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
            'https://github.com/Zilliqa/dev-portal',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
