import React from 'react';
import logoNav from "../../../public/assets/img/services/v3logo.png";

const LoadingPlaceholder = () => {
  return (
    <>
      <style jsx>{`
        @keyframes progressBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-progress-bar {
          animation: progressBar 1.5s linear infinite;
        }
      `}</style>
      <div className="min-h-screen bg-red-50/10 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <img
            src={logoNav}
            alt="insidelayer"
            className="block mx-auto"
          />
          <div className="w-48 h-1 bg-red-200 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-red-500 animate-progress-bar"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoadingPlaceholder;
