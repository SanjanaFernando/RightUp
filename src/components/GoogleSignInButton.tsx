"use client";

import React, { useEffect, useRef, useState } from "react";
import { googleAuthAction } from "@/actions/otp";
import { useAuthStore } from "@/store/authStore";

declare global {
  interface Window {
    google?: any;
  }
}

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  label?: string;
}

/**
 * Renders the official Google Identity Services "Sign in with Google" button.
 * On success, calls the server to verify the token, sets the Zustand auth store,
 * and redirects to the home page.
 */
export default function GoogleSignInButton({
  onSuccess,
  label = "Continue with Google",
}: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) return;

    // Load the Google Identity script if not already present
    const loadGsi = () => {
      if (!window.google?.accounts) {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = initGoogle;
        document.head.appendChild(script);
      } else {
        initGoogle();
      }
    };

    const initGoogle = () => {
      if (!containerRef.current || !window.google?.accounts) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredential,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.renderButton(containerRef.current, {
        theme: "filled_black",
        size: "large",
        shape: "pill",
        width: containerRef.current.offsetWidth || 400,
        text: "continue_with",
      });
    };

    loadGsi();
  }, [clientId]);

  const handleCredential = async (response: { credential: string }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await googleAuthAction(response.credential);
      if (res.success && res.data) {
        setUser(res.data);
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.href = "/";
        }
      } else {
        setError(res.error || "Google sign-in failed.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!clientId) {
    return (
      <p className="text-xs text-gray-500 text-center">
        Google sign-in not configured. Add{" "}
        <code className="text-gray-400">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> to{" "}
        <code className="text-gray-400">.env.local</code>.
      </p>
    );
  }

  return (
    <div className="w-full">
      {/* Google renders its own button into this div */}
      <div ref={containerRef} className="w-full" />

      {loading && (
        <p className="text-center text-sm text-gray-400 mt-3 animate-pulse">
          Signing in with Google…
        </p>
      )}
      {error && (
        <p className="text-center text-sm text-red-400 mt-3">{error}</p>
      )}
    </div>
  );
}
