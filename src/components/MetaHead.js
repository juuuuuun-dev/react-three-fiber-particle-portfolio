import React from 'react';
import { Helmet } from 'react-helmet';
import useStore from '../contexts/store';
import { useTranslation } from 'react-i18next';

const MetaHead = () => {
  const [t] = useTranslation();
  const lang = useStore(state => state.lang);
  const appTitle = useStore(state => state.appTitle);
  const pageTitle = useStore(state => state.pageTitle);
  const showContent = useStore(state => state.showContent);
  let description;
  if (showContent) {
    const contentId = showContent.slice(1);
    description = t(`${contentId}.description`)
  } else {
    description = t(`index.description`)
  }

  return (
    <>
      <Helmet
        data-testid="helmet"
        defaultTitle={appTitle}
        titleTemplate={`%s | ${appTitle}`}
        htmlAttributes={{
          lang: lang,
        }}
      >
        <meta charSet='utf-8' />
        {pageTitle && <title>{pageTitle}</title>}
        <meta name="description" content={description} />
      </Helmet>
    </>
  );
};
export default MetaHead;
