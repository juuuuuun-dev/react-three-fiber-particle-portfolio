import React from 'react';
import { useTranslation } from 'react-i18next';

const Paragraph = ({ value, index }) => {
  const [t] = useTranslation();
  return (
    <>
      <div className='paragraph clearfix'>
        <h3 className='paragraph__title'>
          {t(`about.paragraph.${index}.title`)}
        </h3>
        {renderDescription(t, value, index)}
        {renderList(t, value, index)}
        {renderQuotes(t, value, index)}
      </div>
    </>
  );
};

const renderDescription = (t, value, index) => {
  if (value['description']) {
    return (
      <p
        dangerouslySetInnerHTML={{
          __html: t(`about.paragraph.${index}.description`)
        }}
      />
    );
  }
};

const renderList = (t, value, index) => {
  if (value['list']) {
    return (
      <ul>
        {value['list'].map((_value, key) => {
          return <li key={key}>{t(`about.paragraph.${index}.list.${key}`)}</li>;
        })}
      </ul>
    );
  }
};

const renderQuotes = (t, value, index) => {
  if (value['quotes']) {
    return (
      <>
        {value['quotes'].map((quote, quoteIndex) => {
          return (
            <dl key={quoteIndex}>
              <dt>
                {t(`about.paragraph.${index}.quotes.${quoteIndex}.title`)}
              </dt>
              {quote.items.map((item, itemIndex) => {
                return (
                  <dd key={itemIndex}>
                    <blockquote className='blockquote'>
                      <p>
                        {t(
                          `about.paragraph.${index}.quotes.${quoteIndex}.items.${itemIndex}.body`
                        )}
                      </p>
                      <footer>
                        {t(
                          `about.paragraph.${index}.quotes.${quoteIndex}.items.${itemIndex}.author`
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
