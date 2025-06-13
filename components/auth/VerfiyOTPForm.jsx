import React, { useRef, useState } from 'react';
import { ArrowLeft, Mail } from 'lucide-react';

export default function VerifyOTPForm({ email, onBack, onVerify }) {
  console.log(email);
  const [otp, setOtp] = useState(Array(6).fill(''));
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      alert('Please enter the complete 6-digit otpCode.');
      return;
    }
    onVerify(otpCode, email);  // ✅ Pass both code and email
  };

  return (
    <div className="w-full lg:w-1/2 px-6 py-8 lg:px-12 lg:py-10 md:px-8 md:py-24 flex flex-col justify-center min-h-[550px]">
      <div className="w-full max-w-sm md:max-w-md mx-auto flex flex-col">
        
        <div className="text-sm text-gray-500 mb-20 flex items-center space-x-2">
          <span className="w-2 h-2 bg-orange-500 rounded-full inline-block"></span>
          <span>Step 3 of 3</span>
        </div>

        <div className="mx-auto mb-6 flex items-center justify-center w-14 h-14 rounded-full bg-orange-100">
          <Mail className="w-7 h-7 text-orange-600" />
        </div>

        <h2 className="text-lg sm:text-xl font-bold mb-1.5 text-center">
          Enter your verification code
        </h2>

        <p className="text-gray-500 mb-5 text-sm text-center">
          We've sent a 6-digit code to your email. Enter it below to verify your account.
        </p>

        <div className="flex justify-between mb-6">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-12 text-center border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
          ))}
        </div>

        <div className="text-sm text-gray-600 mb-8 text-center">
          Didn't get the code?{" "}
          <button className="text-orange-500 hover:underline">Resend OTP</button>
        </div>

        <div className="h-[3.8rem] md:h-[3.1rem]" />

        <div className="flex gap-3">
          <button
            onClick={onBack}
            type="button"
            className="flex items-center justify-center w-1/2 px-4 py-1 cursor-pointer border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <button
            onClick={handleSubmit}
            type="button"
            className="w-1/2 px-4 py-2 bg-orange-500 text-white cursor-pointer rounded-lg hover:bg-orange-600 transition"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
}
