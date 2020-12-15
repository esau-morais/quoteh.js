import { useState, useEffect, useRef } from 'react';

import { ReactComponent as Logo } from '../assets/Logo.svg';
import { ReactComponent as Skeleton } from '../assets/Skeleton.svg';
import './quote.css';

function Quote() {
  // Quote initial state: string
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  // Selection initial state: number
  const [xLines, setXLines] = useState(0);
  const [yLines, setYLines] = useState(0);
  // Selected text initial state: string
  const [selectedText, setSelectedText] = useState('');
  const selectedTextRef = useRef(null);
  // Popover initial state: false
  const [showPopover, setShowPopover] = useState(false);

  // Hide popover when the text is not selected¹
  const hidePopover = () => setShowPopover(false);

  const onSelectText = props => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (!selectedText) {
      // Hide popover when the text is not selected¹
      hidePopover();

      return;
    }

    const selectionRange = selection.getRangeAt(0);

    const startNode = selectionRange.startContainer.parentNode;
    const endNode = selectionRange.endContainer.parentNode;

    const highlightable = selectedTextRef.current;
    const highlightableRegion = highlightable.querySelector('.popover');

    if (highlightableRegion) {
      if (
        !highlightableRegion.contains(startNode) ||
        !highlightableRegion.contains(endNode)
      ) {
        // Hide popover when the text is not selected¹
        hidePopover();

        return;
      }
    } else if (
      !highlightable.contains(startNode) ||
      !highlightable.contains(endNode)
    ) {
      // Hide popover when the text is not selected¹
      hidePopover();

      return;
    }

    if (!startNode.isSameNode(endNode)) {
      // Hide popover when the text is not selected¹
      hidePopover();

      return;
    }

    const { x, y, width } = selectionRange.getBoundingClientRect();
    if (!width) {
      // Hide popover when the text is not selected¹, which means width = 0
      hidePopover();

      return;
    }

    setXLines(x + width / 10);
    setYLines(y + window.scrollY - 34);
    setSelectedText(selectedText);
    setShowPopover(true);

    const { onHighlightPop = () => {} } = props;
    onHighlightPop(selectedText);
  }

  useEffect(() => {
    window.addEventListener('mouseup', onSelectText);

    return () => window.removeEventListener('mouseup', onSelectText);
  })

  /*const shareSelectedText = () => {
    window.addEventListener('click', e => {
      if(navigator.share) {
        navigator.share({
          title: `${selectedText}`,
          url: ""
        })
          .then(() => console.log("shared!"))
          .catch(err => console.log(err))
      }
    })
  }*/

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
          <blockquote ref={selectedTextRef}>
            {showPopover &&  (
              <div
                className="popover"
                style={{ left: `${xLines}px`, top: `${yLines}px` }}
              >
                <span role="button">You highlighted</span>
              </div>
            )}

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

