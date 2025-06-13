import React, { useState, useMemo } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import backgroundImage from "../assets/illustration.png";
import { useNavigate } from "react-router-dom";
import useLoginTan from "../hooks/useLoginHook";
import LoadingOverlay from "../components/common/LoadingOverlay";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const navigate = useNavigate();
  const loginMutation = useLoginTan();

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const validationSchema = useMemo(
    () =>
      Yup.object({
        email: Yup.string()
          .email("Invalid email address")
          .required("Email is required"),
        password: Yup.string().required("Password is required"),
        rememberMe: Yup.bool(),
      }),
    []
  );

  const handleSubmit = (values, { setSubmitting }) => {
    const payload = {
      email: values.email,
      password: values.password,
    };
    console.log("Login payload:", payload);

    setShowOverlay(true);

    loginMutation.mutate(payload, {
      onSuccess: async () => {
        await delay(3000);
        toast.success("Login successful!");
        setSubmitting(false);
        setShowOverlay(false);
        navigate("/dashboard");
      },
      onError: (error) => {
        toast.error(error.message || "Login failed");
        setSubmitting(false);
        setShowOverlay(false);
      },
    });
  };

  return (
    <div className="flex justify-center items-center w-[90%] h-[100vh] mx-auto relative">
      <div className="flex flex-col lg:flex-row w-full max-w-4xl shadow-lg rounded-2xl overflow-hidden">
        {/* Left side image */}
        <div
          className="hidden lg:block lg:w-1/2 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          aria-hidden="true"
        />

        {/* Right side login form */}
        <div className="w-full lg:w-1/2 px-6 py-8 lg:px-12 lg:py-10 md:px-8 md:py-24 flex flex-col justify-center min-h-[550px]">
          <h2 className="text-lg sm:text-xl font-bold mb-1.5">Welcome back!</h2>
          <p className="text-gray-500 mb-5 text-sm">
            Login to your account to continue
          </p>

          <Formik
            initialValues={{ email: "", password: "", rememberMe: false }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid, dirty }) => (
              <Form noValidate>
                {/* Email */}
                <div className="mb-4 text-left">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
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
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Password */}
                <div className="mb-4 text-left relative">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="********"
                    className="px-3 py-2 border rounded-lg w-full focus:outline-none border-gray-200 focus:ring-blue-200 focus:ring-1 text-base pr-10"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    aria-pressed={showPassword}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-[34px] text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Remember me + Forgot password */}
                <div className="flex items-center justify-between mb-5">
                  <label className="flex items-center text-sm text-gray-700 cursor-pointer select-none">
                    <Field
                      type="checkbox"
                      name="rememberMe"
                      className="mr-2 accent-[#ff5c00]"
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    className="text-sm text-[#ff5c00] underline hover:text-orange-600 focus:outline-none"
                    onClick={() =>
                      toast("Forgot password? Implement reset flow")
                    }
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !isValid || !dirty}
                  className="mb-4 bg-[#ff5c00] text-white py-2 rounded-lg cursor-pointer hover:bg-orange-600 transition-colors text-sm w-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
              </Form>
            )}
          </Formik>

          {/* Divider */}
          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="px-3 text-gray-500 text-sm whitespace-nowrap">
              or continue with
            </span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Social login */}
          <div className="flex flex-row justify-center sm:justify-start space-x-4 mb-5 w-full">
            <button
              type="button"
              className="flex items-center justify-center border cursor-pointer border-gray-200 focus:ring-blue-200 rounded-full w-10 h-10 sm:rounded-md sm:w-full sm:h-auto px-0 sm:px-4 py-2 hover:bg-gray-100 text-sm font-medium"
              onClick={() => toast("Google login - implement logic")}
            >
              <FcGoogle className="w-5 h-5" />
              <span className="hidden sm:inline ml-2">Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center border cursor-pointer border-gray-200 focus:ring-blue-200 rounded-full w-10 h-10 sm:rounded-md sm:w-full sm:h-auto px-0 sm:px-4 py-2 hover:bg-gray-100 text-sm font-medium"
              onClick={() => toast("GitHub login - implement logic")}
            >
              <FaGithub className="w-5 h-5" />
              <span className="hidden sm:inline ml-2">GitHub</span>
            </button>
          </div>

          {/* Signup link */}
          <p className="text-sm text-center text-gray-700">
            Don't have an account?{" "}
            <span
              className="text-[#ff5c00] underline cursor-pointer hover:text-orange-600"
              onClick={() => navigate("/signup")}
            >
              Signup
            </span>
          </p>
        </div>
      </div>

      {(loginMutation.isLoading || showOverlay) && <LoadingOverlay />}
    </div>
  );
}
