import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useThemeConfig } from '@docusaurus/theme-common';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';
import StarSvg from './components/cards_img01.js';
import CodeSvg from './components/cards_img02.js';
import MineSvg from './components/cards_img03.js';
import ExchangeSvg from './components/cards_img04.js';
import ContributeSvg from './components/cards_img05.js';

const CoverImgDiv = () => {
    const colorMode = useThemeConfig().colorMode;
    const isDarkTheme = colorMode == 'dark';
  if (isDarkTheme) {
    return (
      <>
        <div className="cover-image">
          <img className="cover-image-hand" src={useBaseUrl('img/hand.png')}/>
        </div>
      </>
    );
  } else {
    return (
      <div className="cover-image">
        <img className="cover-image-hand" src={useBaseUrl('img/hand_light.png')}/>
      </div>
    );
  }
};

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
    const colorMode = useThemeConfig().colorMode;
    const isDarkTheme = colorMode == 'dark';

  if (isDarkTheme) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  return (
          <Layout>
        <div className="cover-container">
          <div className="cover-title">
            <h1 className="hero__title">{siteConfig.title}</h1>
            <p className="hero__subtitle">{siteConfig.tagline}</p>
          </div>
          <CoverImgDiv/>
        </div>
        <div id="cover-cards">
          <div className="column">
            <a href={useBaseUrl('docs/basics/basics-intro-blockchain')}>
              <div>
                  <StarSvg/>
                  <div className="cards-text">
                    <h2>Basics</h2>
                    <p>Learn about blockchain and Zilliqa.</p>
                  </div>
              </div>
            </a>
          </div>
          <div className="column">
            <a href={useBaseUrl('docs/dev/dev-started-introduction')}>
              <div>
                <CodeSvg/>
                <div className="cards-text">
                  <h2>Developers</h2>
                  <p>Build full-stack blockchain apps on Zilliqa.</p>
                </div>
              </div>
            </a>
          </div>
          <div className="column">
            <a href={useBaseUrl('docs/miners/mining-getting-started')}>
              <div>
                <MineSvg />
                <div className="cards-text">
                  <h2>Miners</h2>
                  <p>Participate as a miner and start earning $ZIL.</p>
                </div>
              </div>
            </a>
          </div>
          <div className="column">
            <a href={useBaseUrl('docs/exchanges/exchange-getting-started')}>
              <div>
                <ExchangeSvg/>
                <div className="cards-text">
                  <h2>Exchanges</h2>
                  <p>Information for exchanges and seed node operators.</p>
                </div>
              </div>
            </a>
          </div>
          <div className="column">
            <a href={useBaseUrl('docs/contributors/contribute-buildzil')}>
              <div>
                <ContributeSvg/>
                <div className="cards-text">
                  <h2>Contributors</h2>
                  <p>Learn how you can contribute to Zilliqa's ecosystem.</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </Layout>
  );
}

export default Home;
