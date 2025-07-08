"use client";

import React from "react";
import gsap from "gsap";
import { useTranslation } from "react-i18next";
import isEmpty from "lodash/isEmpty";
import count from "universal-counter";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
import axios from "axios";
import { LoginResult } from "@/types";

export default function LoginFormModal() {
  const [showPassword, setShowPassword] = React.useState(false);
  const modalRef = React.useRef<HTMLDivElement>(null);
  const phoneRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const [isRemember, setIsRemember] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    phone: "",
    password: "",
  });

  const { t } = useTranslation();

  React.useEffect(() => {
    if (open && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.7, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [open]);

  React.useEffect(() => {
    const action = () => {
      setOpen(true);
    };
    window.addEventListener("login-clicked", action);
    return () => {
      window.removeEventListener("login-clicked", action);
    };
  }, []);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPhone = localStorage.getItem("phone");
      const storedPassword = localStorage.getItem("password");
      setFormData({
        phone: storedPhone ? JSON.parse(storedPhone) : "",
        password: storedPassword ? JSON.parse(storedPassword) : "",
      });
      setIsRemember(!!storedPhone && !!storedPassword);
    }
  }, []);

  const handleLogin = async () => {
    const formData = new FormData();
    const phone = phoneRef.current?.value?.trim();
    const password = passwordRef.current?.value;

    if (isEmpty(phone)) {
      toast.error(t("Please enter your phone number"));
      phoneRef.current?.focus();
      return;
    } else if (isEmpty(password)) {
      toast.error(t("Please enter your password"));
      passwordRef.current?.focus();
      return;
    } else if (count(phone) < 9) {
      toast.error(t("Phone number must be at least 9 digits"));
      phoneRef.current?.focus();
      return;
    }

    const loadingToast = toast.loading(t("Logging in..."));

    formData.append("phone", phone || "");
    formData.append("password", password || "");

    try {
      const response = await axios.post("/api/login", formData);
      const result: LoginResult = response.data;
      toast.dismiss(loadingToast);

      if (result) {
        const code = result.code;
        const message = result.message;

        if (code === 0) {
          const type = result.type;
          toast.error(message || t("Login failed"));
          if (type === "phone") {
            phoneRef.current?.focus();
          } else if (type === "password") {
            passwordRef.current?.focus();
          }
        } else if (code === 1) {
          const signInResult = await signIn("credentials", {
            phone: phone,
            password: password,
            userData: JSON.stringify(result.user),
            redirect: false,
          });
          if (signInResult?.ok) {
            toast.success(t("Login successful!"));
            setOpen(false);
            if (isRemember) {
              localStorage.setItem("phone", JSON.stringify(result.user?.phone));
              localStorage.setItem(
                "password",
                JSON.stringify(result.user?.password)
              );
            }
          } else {
            toast.error(t("Login failed"));
          }
        }
      } else {
        throw new Error(t("Login failed"));
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error instanceof Error ? error.message : t("Login failed"));
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 text-white relative">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <h2 className="text-4xl font-bold text-center mb-10">{t("Login")}</h2>
        <div>
          <div className="relative mb-6">
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              ref={phoneRef}
              type="text"
              name="phone"
              id="phone"
              autoComplete="tel"
              autoFocus
              value={formData.phone}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }));
              }}
              placeholder={t("Phone Number")}
              className="w-full bg-black/20 border border-white/30 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-400"
            />
          </div>

          <div className="relative mb-4">
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              {showPassword ? (
                <svg
                  onClick={() => setShowPassword((v) => !v)}
                  className="w-5 h-5 text-gray-400 cursor-pointer"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
                <svg
                  onClick={() => setShowPassword((v) => !v)}
                  className="w-5 h-5 text-gray-400 cursor-pointer"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95m3.362-2.7A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.043 5.197M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3l18 18"
                  />
                </svg>
              )}
            </div>
            <input
              ref={passwordRef}
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }));
              }}
              placeholder={t("Password")}
              className="w-full bg-black/20 border border-white/30 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-400"
            />
          </div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                checked={isRemember}
                onChange={() => {
                  setIsRemember((prev) => !prev);
                }}
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 bg-transparent border-gray-400 text-purple-600 focus:ring-purple-500 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-300">
                {t("Remember me")}
              </label>
            </div>
          </div>
          <div>
            <button
              onClick={handleLogin}
              type="button"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-md font-bold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900 transition-all">
              LOGIN
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <a href="#" className="font-bold text-white hover:underline">
            SIGN UP
          </a>
        </p>
      </div>
    </div>
  );
}
