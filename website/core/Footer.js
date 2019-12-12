/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
          </a>
          <div>
            <h5>Docs</h5>
            <a href={this.docUrl('dapp-getting-started', this.props.language)}>
              Developers
            </a>
            <a href={this.docUrl('mining-general-info', this.props.language)}>
              Miners
            </a>
            <a href={this.docUrl('exchange-getting-started', this.props.language)}>
              Exchange Integration
            </a>
          </div>
          <div>
            <h5>Community</h5>
            <a
              href="https://twitter.com/zilliqa"
              target="_blank"
              rel="noreferrer noopener">
              Twitter
            </a>
            <a href="https://www.reddit.com/r/zilliqa">Reddit</a>
            <a href="https://blog.zilliqa.com/">Medium</a>
            <a href="https://discord.gg/8tpGXrB">Discord</a>
            <a href="https://www.youtube.com/channel/UCvinnFbf0u71cajoxKcfZIQ">YouTube</a>
            <a href="https://t.me/zilliqachat">Telegram</a>
          </div>
          <div>
            <h5>More</h5>
            <a href={`${this.props.config.baseUrl}blog`}>Blog</a>
            <a href="https://www.github.com/Zilliqa">GitHub</a>
            <a
              className="github-button"
              href={this.props.config.repoUrl}
              data-icon="octicon-star"
              data-count-href="/facebook/docusaurus/stargazers"
              data-show-count="true"
              data-count-aria-label="# stargazers on GitHub"
              aria-label="Star this project on GitHub">
              Star
            </a>
          </div>
        </section>
        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
