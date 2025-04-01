import { Credit } from '@sanjo/credits'
import '@sanjo/credits/styles.css'
import { credits } from './credits'

export default function () {
  return (
    <div>
      <h1>Credits</h1>

      {credits.map((credit, index) => (
        <Credit key={index} {...credit} />
      ))}
    </div>
  )
}
