/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

const siteConfig = {
  title: 'Zilliqa Developer Portal', // Title for your website.
  tagline:
    'Technical and API documentation for participating in the Zilliqa network.',
  url: 'https://zilliqa.github.io', // Your website URL
  baseUrl: '/dev-portal/', // Base URL for your project */

  // Used for publishing and more
  projectName: 'dev-portal',
  organizationName: 'zilliqa',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    {doc: 'arch-overview', label: 'Overview'},
    {doc: 'exchange-getting-started', label: 'Exchanges'},
    {doc: 'mining-general-info', label: "Miners"},
    {doc: 'dapp-getting-started', label: 'Developer'},
    // {page: 'help', label: 'Help'},
    // {blog: true, label: 'Blog'},
  ],

  // If you have users set above, you add it here:
  // users,

  /* path to images for header/footer */
  headerIcon: 'img/zilliqa-logo_1zilliqa-logo.png',
  footerIcon: 'img/zilliqa-logo_1zilliqa-logo.png',
  favicon: 'img/favicon.png',

  /* Colors for website */
  colors: {
    primaryColor: '#02172d',
    secondaryColor: '#23a5a8',
  },

  algolia: {
    apiKey: '578197aca0b5d63327a461d068153853',
    indexName: 'zilliqa',
    algoliaOptions: {
      facetFilters: ['language:LANGUAGE'],
    },
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} Zilliqa Research Pte. Ltd.`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: ['https://buttons.github.io/buttons.js'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/docusaurus.png',
  twitterImage: 'img/docusaurus.png',

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  //   repoUrl: 'https://github.com/facebook/test-site',
};

module.exports = siteConfig;
