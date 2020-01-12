import React from "react";
import { Helmet } from "react-helmet";
import useStore from "../contexts/store";

const MetaHead = () => {
  const appTitle = useStore(state => state.appTitle);
  const primaryColor = useStore(state => state.primaryColor);
  const descriptin = useStore(state => state.descriptin);
  const pageTitle = useStore(state => state.pageTitle);
  return (
    <>
    <Helmet
      defaultTitle={appTitle}
      titleTemplate={`%s | ${appTitle}`}
    >
      <meta charSet="utf-8" />
      { pageTitle && <title>{ pageTitle }</title> }
      <meta theme-color={primaryColor} />
      <meta descriptin={descriptin} />
    </Helmet>
    </>
  );
}
export default MetaHead;