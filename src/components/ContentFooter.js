import React from "react"

const ContentFooter = () => {
  const nowYear = new Date().getFullYear();
  
  return (
    <>
      <div className="contents__footer">&copy; 2020 jun-katada.com</div>
    </>
  )
}

export default ContentFooter;