import './RoundFilter.css'

export default function RoundFilter() {
  return (
    <svg className='round-filter' width="0" height="0" xmlns="http://www.w3.org/2000/svg" version="1.1">
    <defs>
      <filter id="round-filter">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />    
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
      </filter>
    </defs>
    </svg>
  )
}
