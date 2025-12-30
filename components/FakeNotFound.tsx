
import React from 'react';

const FakeNotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f1f3f4] flex flex-col items-center justify-center p-6 font-sans text-[#3c4043]">
      <div className="max-w-md w-full space-y-8">
        <div className="space-y-4">
          <h1 className="text-2xl font-normal">
            <span className="font-bold">404.</span> <span className="text-[#70757a]">That’s an error.</span>
          </h1>
          <p className="text-sm leading-relaxed">
            The requested URL was not found on this server. <span className="text-[#70757a]">That’s all we know.</span>
          </p>
        </div>
        <div className="pt-4">
          <a 
            href="/" 
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Go back to home page
          </a>
        </div>
        <div className="pt-10 flex justify-center opacity-20 grayscale">
           <i className="fa-solid fa-robot text-8xl"></i>
        </div>
      </div>
    </div>
  );
};

export default FakeNotFound;
