import React from 'react';
import { Helmet } from 'react-helmet';
import useStore from '../contexts/store';
import variables from '../scss/_variables.scss';

const MetaHead = () => {
  const appTitle = useStore(state => state.appTitle);
  const primaryColor = variables.primaryColor;
  const descriptin = useStore(state => state.descriptin);
  const pageTitle = useStore(state => state.pageTitle);
  return (
    <>
      <Helmet defaultTitle={appTitle} titleTemplate={`%s | ${appTitle}`}>
        <meta charSet='utf-8' />
        {pageTitle && <title>{pageTitle}</title>}
        <meta
          name='theme-color'
          content={primaryColor}
          data-react-helmet='true'
        />
        {/* <meta name="theme-color" content="#004ba0" data-react-helmet="true" /> */}
        <meta descriptin={descriptin} />
      </Helmet>
    </>
  );
};
export default MetaHead;
