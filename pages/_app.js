/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import { Provider } from 'react-redux';
import App, { Container } from 'next/app';
import withRedux from 'next-redux-wrapper';

import initStore from '../utils/store';

/* debug to log how the store is being used */
export default withRedux(initStore, {
  debug: typeof window !== 'undefined' && process.env.NODE_ENV !== 'production',
})(
  class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
      return {
        pageProps: {
          // Call page-level getInitialProps
          ...(Component.getInitialProps
            ? await Component.getInitialProps(ctx)
            : {}),
        },
      };
    }

    render() {
      const { Component, pageProps, store } = this.props;

      return (
        <Container>
          <Provider store={store}>
            <Component {...pageProps} />
          </Provider>
        </Container>
      );
    }
  }
);
