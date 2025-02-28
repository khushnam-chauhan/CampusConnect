import React from 'react'
import './FeatureCard.css'
function FeatureCard(props) {
  return (
    <div className='feature-card'>
        <h1 className='fcard-head'>{props.head}</h1>
        <p className='fcard-para'>{props.para}</p>
    </div>
  )
}

export default FeatureCard