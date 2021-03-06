import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Script from 'next/script';
import { IntlProvider } from 'react-intl';
import { DefaultSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { isEmpty, mergeAll } from 'lodash/fp';
import { Container, Header, Content, Footer, FlexboxGrid } from 'rsuite';

import constants from 'src/utils/constants';
import metaProps from 'src/utils/metaProps';
import wordingCommon from 'src/locale/common';
import wordingErrors from 'src/locale/errorMessages';
import { LocaleContext } from 'src/contexts/LocaleContext';
import { en, flattenMessages } from 'src/utils/intl-i18n';

import EnvironmentBadge from './EnvironmentBadge';
import ErrorBoundary from './ErrorBoundary';
import FirebaseCollectionsLoaders from './dataLoaders/firebase/Collections';
import FirestoreCollectionsLoaders from './dataLoaders/firestore/Collections';
import Nav from './Nav';

const Layout = ({ children, query, wordingPage }) => {
  const router = useRouter();
  const { currentLocale } = useContext(LocaleContext);

  // [Note]: locale setting is async in the context
  const metaLocale = !isEmpty(query) && !isEmpty(query.lang) ? query.lang : currentLocale;

  const intlMessages = flattenMessages(
    mergeAll([wordingCommon, wordingPage, wordingErrors])[currentLocale],
  );

  return (
    <div id="main-layout">
      {/* Scripts */}
      <Script
        src="https://kit.fontawesome.com/4133372eed.js"
        crossOrigin="anonymous"
        strategy="beforeInteractive"
      />
      {/* Status Page and analitics */}
      {process.env.NEXT_PUBLIC_APP_ENV === 'production' ? (
        <>
          {/* <Script
            src="https://www.datadoghq-browser-agent.com/datadog-rum.js"
            type="text/javascript"
            strategy="beforeInteractive"
          />
          <Script
            src="https://{code}.statuspage.io/embed/script.js"
            strategy="beforeInteractive"
          /> */}
        </>
      ) : null}

      {/* SEO */}
      <DefaultSeo
        title={metaProps.title}
        keywords={metaProps.keywords[metaLocale]}
        description={metaProps.description[metaLocale]}
        openGraph={{
          type: 'website',
          url: currentLocale === en ? `${constants.DOMAIN}?lang=${en}` : constants.DOMAIN,
          site_name: 'Boilerplate',
          description: metaProps.description[metaLocale],
          images: [{ url: metaProps.og.global.imageUrl[metaLocale], width: 650, height: 340 }],
        }}
      />

      <FirebaseCollectionsLoaders route={router ? router.route : null} />
      <FirestoreCollectionsLoaders route={router ? router.route : null} />
      <IntlProvider
        defaultLocale={currentLocale}
        key={currentLocale}
        locale={currentLocale}
        messages={intlMessages}
      >
        <ErrorBoundary errorLevel={constants.ERRORS_LEVELS.layout}>
          <Container>
            <Header>{/*<Nav />*/}</Header>
            <Content>
              <FlexboxGrid justify="center">
                <FlexboxGrid.Item colspan={20}>{children}</FlexboxGrid.Item>
              </FlexboxGrid>
            </Content>
            <Footer />
          </Container>
        </ErrorBoundary>
      </IntlProvider>
      <EnvironmentBadge />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  query: PropTypes.shape({ lang: PropTypes.string }),
  wordingPage: PropTypes.shape({}).isRequired,
};

Layout.defaultProps = {
  children: null,
  query: { lang: '' },
};

export default Layout;
