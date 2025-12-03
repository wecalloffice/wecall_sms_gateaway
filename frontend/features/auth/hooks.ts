"use client";

import { useMutation } from "@tanstack/react-query";
import { login, registerBusiness } from "./api";

export function useLogin() {
  return useMutation({
    mutationFn: login,
  });
}

export function useRegisterBusiness() {
  return useMutation({
    mutationFn: registerBusiness,
  });
}
