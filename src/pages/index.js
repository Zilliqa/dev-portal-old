import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

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
  return (
      <Layout>
        <div className="cover-container">
          <div className="cover-title">
            <h1 className="hero__title">{siteConfig.title}</h1>
            <p className="hero__subtitle">{siteConfig.tagline}</p>
          </div>
          <div className="cover-image">
            <img  src="../../static/assets/bg2.png"/>
          </div>
        </div>
        <div id="cover-cards">
          <div className="column">
            <a href={useBaseUrl('docs/basics/basics-intro-blockchain')}>
              <div>
                  <img className="cards-image" src="../../static/assets/main01.svg"/>
                  <div className="cards-text">
                    <h2>Basics</h2>
                    <p>Learn about Blockchain and Zilliqa.</p>
                  </div>
              </div>
            </a>
          </div>
          <div className="column">
            <a href={useBaseUrl('docs/dev/dev-started-introduction')}>
              <div>
                <img className="cards-image" src="../../static/assets/main02.svg"/>
                <div className="cards-text">
                  <h2>Developers</h2>
                  <p>Tutorials and guides on building full stack Blockchain apps on Zilliqa.</p>
                </div>
              </div>
            </a>
          </div>
          <div className="column">
            <a href={useBaseUrl('docs/miners/mining-getting-started')}>
              <div>
                <img className="cards-image" src="../../static/assets/main03.svg"/>
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
                <img className="cards-image" src="../../static/assets/main04.svg"/>
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
                <img className="cards-image" src="../../static/assets/main05.svg"/>
                <div className="cards-text">
                  <h2>Contributors</h2>
                  <p>Learn how you can contribute to Zilliqa's ecosystem</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </Layout>
  );
}

export default Home;
