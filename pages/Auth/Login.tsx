import React from 'react';
import { SignIn } from '@clerk/clerk-react';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Smart CRM</h1>
          <p className="text-slate-300">Sign in to your account</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
          <SignIn 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none",
                headerTitle: "text-white text-2xl font-bold",
                headerSubtitle: "text-slate-300",
                socialButtonsBlockButton: "bg-white/10 border-white/20 text-white hover:bg-white/20",
                socialButtonsBlockButtonText: "text-white",
                dividerLine: "bg-white/20",
                dividerText: "text-slate-300",
                formFieldLabel: "text-white",
                formFieldInput: "bg-white/10 border-white/20 text-white placeholder:text-slate-400",
                formButtonPrimary: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
                footerActionLink: "text-purple-400 hover:text-purple-300",
                identityPreviewEditButton: "text-purple-400 hover:text-purple-300",
                formResendCodeLink: "text-purple-400 hover:text-purple-300",
                otpCodeFieldInput: "bg-white/10 border-white/20 text-white",
                formFieldSuccessText: "text-green-400",
                formFieldErrorText: "text-red-400",
                alertText: "text-red-400",
                formFieldHintText: "text-slate-400"
              }
            }}
            signUpUrl="/register"
            afterSignInUrl="/dashboard"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;