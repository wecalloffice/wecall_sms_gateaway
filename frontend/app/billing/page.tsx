"use client";

// Redirect to platform billing page
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BillingPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/billing");
  }, [router]);

  return null;
}
