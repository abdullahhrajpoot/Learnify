//"use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabaseClient";

// export default function ProtectedRoute({ allow, children }: { allow: string[], children: React.ReactNode }) {
//   const [loading, setLoading] = useState(true);
//   const [isAllowed, setIsAllowed] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const checkAuth = async () => {
//       // 1. Get session
//       const { data: { session } } = await supabase.auth.getSession();
//       if (!session) {
//         setIsAllowed(false);
//         setLoading(false);
//         return;
//       }

//       // 2. Get user role
//       const { data, error } = await supabase
//         .from("profiles")
//         .select("role")
//         .eq("id", session.user.id)
//         .single();

//       if (error || !data) {
//         setIsAllowed(false);
//         setLoading(false);
//         return;
//       }

//       // 3. Check role
//       if (allow.includes(data.role)) {
//         setIsAllowed(true);
//       } else {
//         setIsAllowed(false);
//       }

//       setLoading(false);
//     };

//     checkAuth();
//   }, [allow]);

//   useEffect(() => {
//     if (!loading && !isAllowed) {
//       router.replace("/login"); // 🚀 redirect instead of link
//     }
//   }, [loading, isAllowed, router]);

//   if (loading) return <div>Loading...</div>;

//   return isAllowed ? <>{children}</> : null;
// }
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

type Role = "admin" | "tutor" | "student" | "guardian"

export default function ProtectedRoute({
  allow,
  children,
}: {
  allow: Role[]
  children: React.ReactNode
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAllowed, setIsAllowed] = useState(false)

  useEffect(() => {
    let cancelled = false

    const checkAuth = async () => {
      // 1) session check
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        if (!cancelled) {
          setIsAllowed(false)
          setLoading(false)
          router.replace("/login")
        }
        return
      }

      // 2) read role from DB (authoritative)
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single()

      if (cancelled) return

      if (error || !data?.role) {
        setIsAllowed(false)
        setLoading(false)
        router.replace("/login")
        return
      }

      const role: Role = data.role as Role

      // 3) ADMIN BYPASS: admins are allowed everywhere
      if (role === "admin") {
        setIsAllowed(true)
        setLoading(false)
        return
      }

      // 4) otherwise must match allowed list
      if (allow.includes(role)) {
        setIsAllowed(true)
      } else {
        setIsAllowed(false)
        // optional: instead of login, you could route them to their own dashboard
        router.replace("/login")
      }

      setLoading(false)
    }

    checkAuth()
    return () => {
      cancelled = true
    }
  }, [allow, router])

  if (loading) return <div>Loading...</div>

  // if we’re redirecting, render nothing
  if (!isAllowed) return null

  return <>{children}</>
}
