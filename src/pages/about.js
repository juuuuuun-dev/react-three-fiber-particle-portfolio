import React from "react";
import smile from "../images/smile.png";

export function About() {
  return (
    <>
      <div className="paragraph clearfix">
        <h3 className="paragraph__title"><img width="22px" className="mr-2 float-left" src={smile} alt="smile" />I'm web developer</h3>
        <p>
          東京に住んでいるWEBデベロッパーです。<br />
          2005年にWEBデザイナーになり、その後サーバーサイドの開発やDevOpsの実装などを行っております。<br />
          どれもやればやるほど好きになっていくのを実感してます
        </p>
      </div>

      <div className="paragraph clearfix">
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

      <div className="paragraph clearfix">
        <h3 className="paragraph__title"><img width="22px" className="mr-2 float-left" src={smile} alt="smile" />Using Framework and Library</h3>
        <ul>
          <li>Django</li>
          <li>Laravel</li>
          <li>TypeScript</li>
          <li>React</li>
          <li>Vue</li>
          <li>NuxtJS</li>
          <li>WebGL</li>
          <li>Three.js</li>
          <li>Vuetify</li>
          <li>uikit</li>
          <li>Docker</li>
          <li>Phothoshop</li>
          <li>Illustrator</li>
        </ul>
      </div>

      <div className="paragraph clearfix">
        <h3 className="paragraph__title"><img width="22px" className="mr-2 float-left" src={smile} alt="smile" />Something important</h3>
        <dl>
          <dt>Strategy</dt>
          {/* <dd>`Honesty is the best policy - 正直は最善の策である。` by zenon</dd> */}
          <dd>
          <blockquote className="blockquote" cite="">
          <p>
            The aim of marketing is to know and understand the customer so well the product or service fits him and sells itself.
          </p>
          <p>マーケティングの目的とは、顧客を理解し、製品とサービスを顧客に合わせ、おのずから売れるようにすることである。</p>
          </blockquote>
          Peter Drucker （ピーター・ドラッカー）
          </dd>
        </dl>
        <dl>
          <dt>ERD</dt>
          <dd>`The executive and the knowledge worker have only on tool information - 経営者と知識労働者にとっての唯一のツールは情報である 。` by Peter Ferdinand Drucker</dd>
        </dl>
        <dl>
          <dt>Testing</dt>
          <dd>code is read</dd>
        </dl>
        <dl>
          <dt>その時のBestをなるべく尽くす</dt>
          <dd>
          全力を注がなければ、単に約束と希望があるだけで、計画はない
          Unless commitment is made, there are only promises and hopes; but no plans 
          - by Peter Ferdinand Drucker
          </dd>
        </dl>
      </div>
      
    </>
  );
}