// components/common/DefaultHelmet.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

const DefaultHelmet = () => {
  
  return (
    <Helmet>
      <title>Best House Cleaning Services | V3 Care</title>
      <meta
        name="title"
        content="Best House Cleaning Services | V3 Care"
      />
      <meta
        name="description"
        content="Get spotless homes with V3 Care, offering the best house cleaning services for a fresh and hygienic living space. Book your service today!"
      />
     
    </Helmet>
  );
};

export default DefaultHelmet;