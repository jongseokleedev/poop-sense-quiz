"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

let initialized = false;

export function initPosthog() {
  if (initialized || typeof window === "undefined") return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;
  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    capture_pageview: true,
    capture_pageleave: true,
    person_profiles: "always",
  });
  initialized = true;
}

export function track(event: string, props?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!initialized) return;
  posthog.capture(event, props);
}

export function PosthogProvider() {
  useEffect(() => {
    initPosthog();
  }, []);
  return null;
}
