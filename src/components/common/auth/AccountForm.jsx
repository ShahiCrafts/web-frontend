import React, { useState, useMemo } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function AccountForm({ onContinue }) {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const validationSchema = useMemo(() => 
    Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      terms: Yup.bool().oneOf([true], "You must accept the Privacy Policy"),
    }), []
  );

  const handleSubmit = async (values) => {
    await onContinue({ email: values.email, password: values.password });
  };

  return (
    <div className="w-full lg:w-1/2 px-6 py-8 lg:px-12 lg:py-10 md:px-8 md:py-24 flex flex-col justify-center min-h-[550px]">
      <div className="lg:hidden flex flex-col items-center justify-center mb-6">
        <img src={logo} alt="OnGo Desk Logo" className="w-12 h-12 mb-2" />
        <h1 className="text-xl font-semibold text-gray-800">OnGo Desk</h1>
      </div>

      <div className="w-full max-w-sm md:max-w-md mx-auto">
        <div className="text-sm text-gray-500 mb-4 flex items-center space-x-2">
          <span className="w-2 h-2 bg-orange-500 rounded-full inline-block"></span>
          <span>Step 1 of 3</span>
        </div>

        <h2 className="text-lg sm:text-xl font-bold mb-1.5">Create an account!</h2>
        <p className="text-gray-500 mb-5 text-sm">Connect with people and make change happen</p>

        <Formik
          initialValues={{ email: "", password: "", terms: false }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, isValid, dirty }) => (
            <Form noValidate>
              <div className="mb-4 text-left">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="px-3 py-2 border border-gray-200 focus:ring-blue-200 rounded-lg w-full focus:outline-none focus:ring-1 text-base"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="mb-4 text-left relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Field
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="********"
                  className="px-3 py-2 border rounded-lg w-full focus:outline-none border-gray-200 focus:ring-blue-200 focus:ring-1 text-base pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  aria-pressed={showPassword}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-[34px] text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="flex items-start mb-5 text-left">
                <Field
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="mt-1 accent-[#ff5c00] mr-2"
                />
                <label htmlFor="terms" className="text-sm text-gray-700 leading-snug">
                  I hereby agree to the{" "}
                  <span className="text-[#ff5c00] underline cursor-pointer">Privacy Policy</span>
                </label>
              </div>
              <ErrorMessage name="terms" component="div" className="text-red-500 text-sm mb-3" />

              <button
                type="submit"
                disabled={isSubmitting || !isValid || !dirty}
                className="mb-2 bg-[#ff5c00] text-white py-2 rounded-lg cursor-pointer hover:bg-orange-600 transition-colors text-sm w-full font-semibold"
              >
                {isSubmitting ? "Creating..." : "Create an account"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-3 text-gray-500 text-sm whitespace-nowrap">or continue with</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="flex flex-row justify-center sm:justify-start space-x-4 mb-5 w-full">
          <button
            type="button"
            className="flex items-center justify-center border cursor-pointer border-gray-200 focus:ring-blue-200 rounded-full w-10 h-10 sm:rounded-md sm:w-full sm:h-auto px-0 sm:px-4 py-2 hover:bg-gray-100 text-sm font-medium"
          >
            <FcGoogle className="w-5 h-5" />
            <span className="hidden sm:inline ml-2">Google</span>
          </button>
          <button
            type="button"
            className="flex items-center justify-center border cursor-pointer border-gray-200 focus:ring-blue-200 rounded-full w-10 h-10 sm:rounded-md sm:w-full sm:h-auto px-0 sm:px-4 py-2 hover:bg-gray-100 text-sm font-medium"
          >
            <FaGithub className="w-5 h-5" />
            <span className="hidden sm:inline ml-2">GitHub</span>
          </button>
        </div>

        <p className="text-sm text-center text-gray-700">
          Already have an account?{" "}
          <span className="text-[#ff5c00] underline cursor-pointer" onClick={() => navigate('/login')}>Login</span>
        </p>
      </div>
    </div>
  );
}
