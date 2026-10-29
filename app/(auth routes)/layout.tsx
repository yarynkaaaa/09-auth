"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthProvider from "@/components/AuthProvider/AuthProvider";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  return (
    <AuthProvider>
      <div>
        <div>{children}</div>
      </div>
    </AuthProvider>
  );
}
