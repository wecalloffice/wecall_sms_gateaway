"use client";



import { useMutation } from "@tanstack/react-query";
// import { getWallet, getTransactions, topUpWallet } from "@/features/billing/billing.api";
import { login, registerBusiness } from "./api";
import { useRouter } from "next/navigation";



// export function useLogin() {
//   const router = useRouter();

//   return useMutation({
//     mutationFn: login,
//     onSuccess: (data) => {
//       const role = data.user.role;

//       // Store tokens
//       localStorage.setItem("access", data.access);
//       localStorage.setItem("refresh", data.refresh);
//       localStorage.setItem("user", JSON.stringify(data.user));

//       // REDIRECT BASED ON ROLE
//       if (role === "PLATFORM_ADMIN") {
//         router.push("/platform/dashboard");
//       } else if (role === "RESELLER_ADMIN") {
//         router.push("/reseller/dashboard");
//       } else if (role === "CLIENT_ADMIN" || role === "CLIENT_USER") {
//         router.push("/client/dashboard");
//       } else {
//         // fallback
//         router.push("/");
//       }
//     },
//   });
// }


// export function useRegisterBusiness() {
//   return useMutation({
//     mutationFn: registerBusiness,
//   });
// }


export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      const role = data.user.role;

      // Save tokens
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect based on role
      switch (role) {
        case "PLATFORM_ADMIN":
          router.push("/platform/dashboard");
          break;
        case "RESELLER_ADMIN":
          router.push("/reseller/dashboard");
          break;
        case "CLIENT_ADMIN":
        
          router.push("/client/dashboard");
          break;
        default:
          router.push("/");
      }
    },
    onError: (error: any) => {
      console.error("LOGIN ERROR:", error);
    },
  });
}




export function useRegisterBusiness() {
  return useMutation({
    mutationFn: registerBusiness,
  });
}