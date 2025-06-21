import React, { useState } from 'react';
import backgroundImage from '../assets/illustration.png';
import AccountForm from '../components/common/auth/AccountForm';
import DetailsForm from '../components/common/auth/DetailsForm';
import VerifyOTPForm from '../components/common/auth/VerfiyOTPForm';
import { sendVerificationCodeService, verifyCodeService } from '../services/authService';
import useSignupTan from '../hooks/useSignupTan';
import toast from 'react-hot-toast';
import LoadingOverlay from '../components/common/LoadingOverlay';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false); // general loading for step 1 and 2
  const [showOverlay, setShowOverlay] = useState(false); // overlay for step 3
  const signupMutation = useSignupTan();

  const navigate = useNavigate();

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const goToStep = (newStep) => setStep(newStep);

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const handleContinueStep1 = async (data) => {
    updateFormData(data);
    setLoading(true);
    try {
      await sendVerificationCodeService({ email: data.email });
      toast.success(`A verification code has been sent to ${data.email}.`);
      goToStep(2);
    } catch (err) {
      console.error('Error sending verification code:', err.message);
      toast.error(err.message || 'Unable to send verification code at this time. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otpCode, email) => {
    if (!email || !otpCode) {
      return toast.error('Both email and verification code are required.');
    }

    setLoading(true);
    try {
      await verifyCodeService({ email, code: otpCode });
      await delay(3000);  // Keep loading spinner on after success
      toast.success('Verification successful. Please continue to complete your profile.');
      goToStep(3);
    } catch (err) {
      console.error('OTP verification failed:', err.message);
      toast.error(err.message || 'Verification failed. Please ensure the code is correct.');
    } finally {
      setLoading(false);
    }
  };

  // UPDATED Step 3 handler
  const handleContinueStep3 = (data) => {
    const finalData = { ...formData, ...data };
    setShowOverlay(true); // show overlay immediately

    signupMutation.mutate(finalData, {
      onSuccess: async () => {
        await delay(3000); // keep overlay for 3 seconds after success
        toast.success('Your account has been created successfully.');
        setShowOverlay(false);
        navigate('/login')
        // optionally reset or redirect here
      },
      onError: (err) => {
        toast.error(err.message || 'Account creation failed. Please try again.');
        setShowOverlay(false);
      },
    });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <AccountForm onContinue={handleContinueStep1} isLoading={loading} />;
      case 2:
        if (!formData.email) {
          toast.error('Email is missing. Redirecting to Step 1.');
          goToStep(1);
          return null;
        }
        return (
          <VerifyOTPForm
            email={formData.email}
            onBack={() => goToStep(1)}
            onVerify={handleVerifyOtp}
            isLoading={loading}
          />
        );
      case 3:
        return (
          <DetailsForm
            onBack={() => goToStep(2)}
            onContinue={handleContinueStep3}
            isLoading={showOverlay || signupMutation.isLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center items-center w-[90%] h-[100vh] mx-auto relative">
      <div className="flex flex-col lg:flex-row w-full max-w-4xl shadow-lg rounded-2xl overflow-hidden">
        <div
          className="hidden lg:block lg:w-1/2 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        {renderStep()}
      </div>

      {(signupMutation.isLoading || showOverlay || loading) && <LoadingOverlay />}
    </div>
  );
}
