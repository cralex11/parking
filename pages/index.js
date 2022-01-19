import React from 'react';
import { connect } from 'react-redux';

import wordingPage from 'src/locale/landing';

import Layout from 'src/components/shared/Layout';
import Landing from 'src/components/Landing';
import Link from 'next/link';

const Index = () => {
  return (
    <Layout wordingPage={wordingPage}>
      <div className="gb-img" />
      <div id="p-wrapper">
        <Link id="parking" href="/parking" passHref>
          Parking
        </Link>
      </div>
    </Layout>
  );
};

export default connect()(Index);
