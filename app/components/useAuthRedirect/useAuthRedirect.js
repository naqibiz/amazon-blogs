"use client";
import { auth } from "@/app/database/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const useAuthRedirect = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState(null);
  const isPanelRoute = pathname?.includes("/panel");

  useEffect(() => {
    if (isPanelRoute) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log(user, "current user");
          setCurrentUser(user);
        } else {
          console.log("User not found, redirecting...");
          router.push("/admin-panel-auth");
        }
      });

      return () => unsubscribe();
    }
  }, [isPanelRoute, router]);

  return { currentUser };
};

export default useAuthRedirect;
