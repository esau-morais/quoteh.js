import { useState, useEffect } from 'react';

import { ReactComponent as Logo } from '../assets/Logo.svg';
import { ReactComponent as Skeleton } from '../assets/Skeleton.svg';
import './quote.css';

function Quote() {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  // 1. Get the quote and its author
  // 2. After the user clicks the button, it generates a new quote
  const getQuote = () => {
    fetch('https://type.fit/api/quotes')
      .then(res => res.json())
      .then(data => {
        let quoteId = Math.floor(Math.random() * data.length);
        let randomQuote = data[quoteId];
        setQuote(randomQuote['text']);
        setAuthor(randomQuote['author']);
        setIsLoading(false);
      })
  }

  useEffect(() => {
    getQuote();
  }, []);

  return (
    <div>
      <Logo className="logo" />
      {isLoading ? (
        <Skeleton className="skeleton" />
      ) : (
        <>
          <blockquote>

            <p>
              "{quote}"
            </p>
            <cite>
              {author}
            </cite>
          </blockquote>

          <button onClick={getQuote}>Give me more</button>
        </>
      )}
    </div>
  )
}

export default Quote;

