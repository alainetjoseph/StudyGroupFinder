import React from 'react';

const BlockedPage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-background px-6 text-foreground font-sans">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-destructive/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-destructive/10 blur-[120px] rounded-full" />
      </div>
      
      <div className="relative z-10 bg-card border border-[var(--color-danger)]/20 p-10 rounded-2xl shadow-2xl max-w-md w-full text-center">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-3 text-foreground">Account Blocked</h1>
        <p className="text-muted mb-8 leading-relaxed">Your account has been restricted by an administrator due to violations of our terms of service.</p>
        <button 
          onClick={() => {
            window.location.href = '/login';
          }}
          className="bg-destructive hover:bg-destructive/80 text-foreground font-semibold py-3 px-6 rounded-xl w-full transition active:scale-[0.98] shadow-lg shadow-[var(--color-danger)]/20"
        >
          Return to Login
        </button>
      </div>
    </div>
  );
};

export default BlockedPage;
