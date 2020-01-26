import React from "react";
import smile from "../images/smile.png";

export function About() {
  return (
    <>
      <div className="paragraph">
        <h3 className="paragraph__title"><img width="22px" className="mr-2 float-left" src={smile} alt="smile" />I'm web developer</h3>
        <p>
          東京に住んでいるWEBデベロッパーです。<br />
          2005年にWEBデザイナーになり、その後サーバーサイドの開発やDevOpsの実装などを行っております。<br />
          どれもやればやるほど好きになっていくのを実感してます
        </p>
      </div>

      <div className="paragraph">
        <h3 className="paragraph__title"><img width="22px" className="mr-2 float-left" src={smile} alt="smile" />Use programming languages</h3>
        <ul>
          <li>C</li>
          <li>Python</li>
          <li>PHP</li>
          <li>SQL</li>
          <li>JavaScript</li>
          <li>HTML</li>
          <li>CSS</li>
        </ul>
      </div>

      <div className="paragraph">
        <h3 className="paragraph__title"><img width="22px" className="mr-2 float-left" src={smile} alt="smile" />Using Framework and Library</h3>
        <ul>
          <li>TypeScript</li>
          <li>React</li>
          <li>Vue</li>
          <li>NuxtJS</li>
          <li>Django</li>
          <li>Laravel</li>
          <li>WebGL</li>
          <li>Three.js</li>
          <li>Vuetify</li>
          <li>uikit</li>
          <li>Docker</li>
          <li>Phothoshop</li>
          <li>Illustrator</li>
        </ul>
      </div>

      <div className="paragraph">
        <h3 className="paragraph__title"><img width="22px" className="mr-2 float-left" src={smile} alt="smile" />Something important</h3>
        <dl>
          <dt>Web strategy</dt>
          <dd>なぜ</dd>
        </dl>
      </div>
      
    </>
  );
}