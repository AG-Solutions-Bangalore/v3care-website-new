import React, { lazy, Suspense, useEffect, useRef } from 'react';
import DefaultHelmet from '../../components/DefaultHelmet/DefaultHelmet';
import LoadingPlaceholder from '../../components/LoadingPlaceholder/LoadingPlaceholder'; // Create this component


const HeroSection = lazy(() => import('./hero-section/HeroSection'));
const PopularService = lazy(() => import('./popular-service/PopularService'));
const TestimonialsSection = lazy(() => import('./testimonial-section/TestimonialsSection'));
const BlogSection = lazy(() => import('./blog-section/BlogSection'));
const ClientsSection = lazy(() => import('./client-section/ClientsSection'));

const Home = () => {
  const sectionRefs = {
    popularService: useRef(null),
    testimonials: useRef(null),
    blog: useRef(null),
    clients: useRef(null)
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '20px', 
      threshold: 0.01
    };

    const observers = {};
    const loadedSections = new Set(['hero']); 

    Object.keys(sectionRefs).forEach(section => {
      observers[section] = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !loadedSections.has(section)) {
            loadedSections.add(section);
           
          }
        });
      }, observerOptions);

      if (sectionRefs[section].current) {
        observers[section].observe(sectionRefs[section].current);
      }
    });

    return () => {
      Object.values(observers).forEach(observer => observer.disconnect());
    };
  }, []);

  return (
    <>
      <DefaultHelmet />
      

      <Suspense fallback={<LoadingPlaceholder />}>
        <HeroSection />
      </Suspense>


      <div ref={sectionRefs.popularService}>
        <Suspense fallback={<LoadingPlaceholder />}>
          <PopularService />
        </Suspense>
      </div>

      <div ref={sectionRefs.testimonials}>
        <Suspense fallback={<LoadingPlaceholder />}>
          <TestimonialsSection />
        </Suspense>
      </div>

      <div ref={sectionRefs.blog}>
        <Suspense fallback={<LoadingPlaceholder />}>
          <BlogSection />
        </Suspense>
      </div>

      <div ref={sectionRefs.clients}>
        <Suspense fallback={<LoadingPlaceholder />}>
          <ClientsSection />
        </Suspense>
      </div>
    </>
  );
};

export default Home;