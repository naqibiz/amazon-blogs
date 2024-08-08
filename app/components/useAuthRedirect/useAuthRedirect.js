"use client";
import { auth } from "@/app/database/firebaseConfig";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const useAuthRedirect = () => {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname?.startsWith("/panel")) {
      router.push("/admin-panel-auth");
    }
  }, [user, loading, pathname, router]);

  return { user, loading, error };
};

export default useAuthRedirect;
