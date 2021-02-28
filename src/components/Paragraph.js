import React from 'react';
import { useTranslation } from 'react-i18next';

const Paragraph = ({ value, index, prefix }) => {
  const [t] = useTranslation();
  return (
    <>
      <div className='paragraph clearfix' data-testid={`${prefix}-paragraph-${index}`}>
        <h3 className='paragraph__title'>
          {t(`${prefix}.paragraph.${index}.title`)}
        </h3>
        {renderDescription(t, value, index, prefix)}
        {renderList(t, value, index, prefix)}
        {renderQuotes(t, value, index, prefix)}
      </div>
    </>
  );
};

const renderDescription = (t, value, index, prefix) => {
  if (value['description']) {
    return (
      <p
        dangerouslySetInnerHTML={{
          __html: t(`${prefix}.paragraph.${index}.description`)
        }}
      />
    );
  }
};

const renderList = (t, value, index, prefix) => {
  if (value['list']) {
    return (
      <ul>
        {value['list'].map((_value, key) => {
          return <li className="box-list" key={key}><span className="box-list__start"></span><span className="box-list__body">{t(`${prefix}.paragraph.${index}.list.${key}`)}</span><span className="box-list__end"></span></li>;
        })}
      </ul>
    );
  }
};

const renderQuotes = (t, value, index, prefix) => {
  if (value['quotes']) {
    return (
      <>
        {value['quotes'].map((quote, quoteIndex) => {
          return (
            <dl key={quoteIndex}>
              <dt>
                {t(`${prefix}.paragraph.${index}.quotes.${quoteIndex}.title`)}
              </dt>
              {quote.items.map((item, itemIndex) => {
                return (
                  <dd key={itemIndex}>
                    <blockquote className='blockquote'>
                      <p>
                        {t(
                          `${prefix}.paragraph.${index}.quotes.${quoteIndex}.items.${itemIndex}.body`
                        )}
                      </p>
                      <footer>
                        {t(
                          `${prefix}.paragraph.${index}.quotes.${quoteIndex}.items.${itemIndex}.author`
                        )}
                      </footer>
                    </blockquote>
                  </dd>
                );
              })}
            </dl>
          );
        })}
      </>
    );
  }
};

export default Paragraph;
