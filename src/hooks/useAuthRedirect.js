"use client";
import { auth } from "@/services/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/authSlice";

const useAuthRedirect = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [currentUser, setCurrentUser] = useState(null);
  const isPanelRoute = pathname?.includes("/panel");

  useEffect(() => {
    if (isPanelRoute) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          };
          setCurrentUser(user);
          dispatch(setUser(userData));
        } else {
          dispatch(setUser(null));
          router.push("/admin-panel-auth");
        }
      });

      return () => unsubscribe();
    }
  }, [isPanelRoute, router, dispatch]);

  return { currentUser };
};

export default useAuthRedirect;

