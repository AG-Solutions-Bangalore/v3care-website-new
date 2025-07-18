import React from 'react'
import HeroSection from './hero-section/HeroSection'
import PopularService from './popular-service/PopularService'
import TestimonialsSection from './testimonial-section/TestimonialsSection'
import BlogSection from './blog-section/BlogSection'
import ClientsSection from './client-section/ClientsSection'
import DefaultHelmet from '../../components/DefaultHelmet/DefaultHelmet'



const Home = () => {
  return (
    <>
     <DefaultHelmet/>
  <HeroSection/>
  <PopularService/>
  <TestimonialsSection/>
  <BlogSection/>
  <ClientsSection/>
    </>
  )
}

export default Home