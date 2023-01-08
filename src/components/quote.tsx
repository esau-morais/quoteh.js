import { useState, useEffect, useRef, MouseEvent } from 'react'
import Balancer from 'react-wrap-balancer'

import useSWR from 'swr'

import { ReactComponent as Logo } from '../assets/Logo.svg'
import { ReactComponent as Skeleton } from '../assets/Skeleton.svg'
import './quote.css'

const Quote = () => {
  const [quote, setQuote] = useState('')
  const [author, setAuthor] = useState('')

  const getQuote = async () => {
    await fetch('https://type.fit/api/quotes')
      .then(res => res.json())
      .then(data => {
        const quoteId = Math.floor(Math.random() * data.length)
        const randomQuote = data[quoteId]
        setQuote(randomQuote['text'])
        setAuthor(randomQuote['author'])
      })
  }

  const { isLoading } = useSWR('quotes', getQuote, {
    revalidateOnFocus: false
  })

  return (
    <div>
      <Logo className="logo" />
      {isLoading ? (
        <Skeleton className="skeleton" />
      ) : (
        <>
          <blockquote>
            <Balancer>
              <p>&quot;{quote}&quot;</p>
              <cite>
                {author}
              </cite>
            </Balancer>
          </blockquote>

          <button onClick={getQuote}>Give me more</button>
        </>
      )}
    </div>
  )
}

export default Quote

