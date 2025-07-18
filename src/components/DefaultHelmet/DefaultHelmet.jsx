// components/common/DefaultHelmet.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

const DefaultHelmet = () => {
  
  return (
    <Helmet>
      <title>Best house cleaning service | V3 Care</title>
      <meta
        name="title"
        content="Best house cleaning service | Affordable cleaning services."
      />
      <meta
        name="description"
        content="Get professional high quality cleaning services at affordable prices, Book house cleaning, office cleaning, deep cleaning & bathroom cleaning services."
      />
     
    </Helmet>
  );
};

export default DefaultHelmet;