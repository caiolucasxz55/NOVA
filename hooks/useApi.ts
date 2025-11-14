"use client";

import { apiClient } from "@/lib/apiClient";
import { useState } from "react";

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = async (
    url: string,
    options: RequestInit = {}
  ) => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiClient(url, options);

      return data;
    } catch (err: any) {
      setError(err.message || "Erro inesperado");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const get = async (url: string) =>
    request(url, { method: "GET" });

  const post = async (url: string, body?: any) =>
    request(url, {
      method: "POST",
      body: JSON.stringify(body),
    });

  const put = async (url: string, body?: any) =>
    request(url, {
      method: "PUT",
      body: JSON.stringify(body),
    });

  const del = async (url: string) =>
    request(url, { method: "DELETE" });

  return {
    get,
    post,
    put,
    del,
    loading,
    error,
  };
}
