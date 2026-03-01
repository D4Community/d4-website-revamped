import React from 'react'
import { AboutSection } from '../home'
import AboutContent from './sections/AboutContent'
import FAQSection from '../home/sections/FAQSection'
import AboutPhilosophy from './sections/AboutPhilosophy'

const AboutPage = () => {
  return (
    <div>
      <AboutContent />
      <AboutPhilosophy />
      <AboutSection />
      <FAQSection />
    </div>

  )
}

export default AboutPage