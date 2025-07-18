import React, { useState } from 'react';

const JoinUs = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // WhatsApp SVG Icon
  const WhatsAppIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="34"
      height="34"
    >
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
      />
    </svg>
  );

  // Phone SVG Icon
  const PhoneIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <path
        fill="currentColor"
        d="M20.487 17.14l-4.065-3.696a1.001 1.001 0 00-1.391.043l-2.393 2.461c-.576-.11-1.734-.471-2.926-1.66-1.192-1.193-1.553-2.354-1.66-2.926l2.459-2.394a1 1 0 00.043-1.391L6.859 3.513a1 1 0 00-1.391-.087l-3.33 2.628a1 1 0 00-.29.649c-.015.25-.301 6.172 4.291 10.766C11.305 20.707 16.323 21 17.705 21c.202 0 .326-.006.359-.008a.992.992 0 00.648-.291l2.628-3.33a.997.997 0 00-.085-1.391z"
      />
    </svg>
  );

  // Gmail SVG Icon
  const GmailIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <path
        fill="currentColor"
        d="M24 4.5v15c0 .85-.65 1.5-1.5 1.5H21V7.387l-9 6.463-9-6.463V21H1.5C.649 21 0 20.35 0 19.5v-15c0-.425.162-.8.431-1.068C.7 3.16 1.076 3 1.5 3H2l10 7.25L22 3h.5c.425 0 .8.162 1.069.432.27.268.431.643.431 1.068z"
      />
    </svg>
  );

  return (
    <div
      style={{
        position: 'fixed',
        right: '1rem',
        bottom: '2rem',
        zIndex: 50,
        transition: 'all 0.3s ease-in-out',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column-reverse',
          alignItems: 'center',
          gap: '12px',
          height: isHovered ? 'auto' : '52px', // Only take space of one button when not hovered
        }}
      >
        {/* Main WhatsApp button (always visible) */}
        <div
          style={{
            height: '52px',
            width: '52px',
            backgroundColor: 'black',
            border: '1px solid black',
            borderRadius: '50%',
            cursor: 'pointer',
            zIndex: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            flexShrink: 0,
          }}
        >
          <div style={{ color: '#25D366' }}>
            <WhatsAppIcon />
          </div>
        </div>

        {/* Additional contact buttons (shown on hover) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column-reverse',
            gap: '12px',
            opacity: isHovered ? 1 : 0,
            visibility: isHovered ? 'visible' : 'hidden',
            transition: 'all 0.3s ease-in-out',
            marginBottom: isHovered ? '12px' : '0',
            height: isHovered ? 'auto' : '0',
            overflow: 'hidden',
          }}
        >
          {/* Mail icon */}
          <a
            href="mailto:info@v3care.com"
            style={{
              color: '#EA4335',
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '52px',
              height: '52px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
                target="_blank"
            rel="noreferrer"
          >
            <GmailIcon />
          </a>
          <a
               href="https://wa.me/919880778585"
            style={{
              color: 'green',
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '52px',
              height: '52px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
                target="_blank"
            rel="noreferrer"
          >
            <WhatsAppIcon />
          </a>

          {/* Phone icon */}
          <a
            href="tel:+919880778585"
            style={{
              color: '#34B7F1',
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '52px',
              height: '52px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
                target="_blank"
            rel="noreferrer"
          >
            <PhoneIcon />
          </a>
        </div>
      </div>
    </div>
  );
};

export default JoinUs;