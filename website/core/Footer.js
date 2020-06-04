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
                height="70"
              />
            )}
          </a>
          <div>
            <h5>Links</h5>
            <a 
              href="https://www.github.com/Zilliqa"            
              target="_blank"
              rel="noreferrer noopener">
              GitHub
            </a>
            <a 
              href="https://blog.zilliqa.com/"
              target="_blank"
              rel="noreferrer noopener">
              Medium
            </a>
            <a
              href="https://twitter.com/zilliqa"
              target="_blank"
              rel="noreferrer noopener">
              Twitter
            </a>
            <a 
              href="https://discord.gg/XMRE9tt"
              target="_blank"
              rel="noreferrer noopener">
              Discord
            </a>
            <a 
              href="https://www.youtube.com/channel/UCvinnFbf0u71cajoxKcfZIQ"
              target="_blank"
              rel="noreferrer noopener">
              YouTube
            </a>
          </div>
        </section>
        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
