// "use client";
// import React, { useEffect, useState } from "react";

// import { supabase } from "@/lib/supabaseClient";

// export default function Students() {
//   const [students, setStudents] = useState<any>([]);

//   useEffect(() => {
//     const fetchStudents = async () => {
//       const user = await supabase.auth.getUser();
//       const { data, error } = await supabase
//         .from("tutor_assignments")
//         .select("*")
//         .eq("tutor_id", user.data.user?.id);

//       if (error) {
//         console.log(error.message);
//         return;
//       }
//       console.log(data)
//       setStudents(data);
//     };
//     fetchStudents();
//   }, []);

//   return (
//     <div>
//       <ul>
//         {students ? (students.map(
//             (student: any, index: any) => (
//               <li key={index}>
//                 <p>{student.student_id}</p>
//                 <p>{student.created_at}</p>
//               </li>
//             )
//             //  <li></li>
//           )) : 
          
//           (<p>You suck</p>)
//           } 
//       </ul>
//     </div>
//   );
// }




// "use client";
// import React, { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabaseClient";
// import Link from "next/link";

// type Profile = {
//   id: string;
//   full_name?: string | null;
//   phone?: string | null;
//   role?: string | null;
//   created_at?: string | null;
// };

// export default function Students() {
//   const [students, setStudents] = useState<Profile[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchStudents() {
//       try {
//         setLoading(true);
//         setError(null);

//         // get current user
//         const {
//           data: { user },
//           error: userErr,
//         } = await supabase.auth.getUser();
//         if (userErr) throw userErr;
//         if (!user) {
//           setError("Not authenticated");
//           return;
//         }

//         // get assigned student ids
//         const { data: assignments, error: assignErr } = await supabase
//           .from("tutor_assignments")
//           .select("student_id")
//           .eq("tutor_id", user.id);
//         if (assignErr) throw assignErr;

//         const studentIds = (assignments ?? []).map((a: any) => a.student_id);
//         if (studentIds.length === 0) {
//           setStudents([]);
//           return;
//         }

//         // fetch student profiles
//         const { data: profiles, error: profilesErr } = await supabase
//           .from("profiles")
//           .select("id, full_name, phone, role, created_at")
//           .in("id", studentIds);
//         if (profilesErr) throw profilesErr;

//         setStudents(profiles ?? []);
//       } catch (err: any) {
//         setError(err.message || "Failed to fetch students");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchStudents();
//   }, []);

//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-semibold mb-4">Assigned Students</h1>

//       {loading && <div>Loading students...</div>}
//       {error && <div className="text-red-600">{error}</div>}
//       {!loading && students.length === 0 && <div>No students assigned.</div>}

//       <ul className="space-y-4">
//         {students.map((s) => (
//           <li key={s.id} className="p-4 border rounded shadow-sm">
//             <div className="font-semibold">{s.full_name ?? "Unnamed student"}</div>
//             <div className="text-sm text-gray-600">Phone: {s.phone ?? "—"}</div>
//             <div className="text-sm text-gray-600">
//               Joined:{" "}
//               {s.created_at
//                 ? new Date(s.created_at).toLocaleDateString()
//                 : "—"}
//             </div>
//             <div className="flex gap-2 mt-2">
//               <Link
//                 href={`/tutor/students/${s.id}`}
//                 className="px-3 py-1 border rounded text-sm"
//               >
//                 View
//               </Link>
//               <Link
//                 href={`/tutor/students/${s.id}/edit`}
//                 className="px-3 py-1 border rounded text-sm"
//               >
//                 Edit
//               </Link>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }



"use client"

import React, { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

type Profile = {
  id: string
  full_name?: string | null
  phone?: string | null
  role?: string | null
  created_at?: string | null
}

export default function Students() {
  const [students, setStudents] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStudents() {
      try {
        setLoading(true)
        setError(null)

        const { data: { user }, error: userErr } = await supabase.auth.getUser()
        if (userErr) throw userErr
        if (!user) {
          setError("Not authenticated")
          return
        }

        const { data: assignments, error: assignErr } = await supabase
          .from("tutor_assignments")
          .select("student_id")
          .eq("tutor_id", user.id)
        if (assignErr) throw assignErr

        const studentIds = (assignments ?? []).map((a: any) => a.student_id)
        if (studentIds.length === 0) {
          setStudents([])
          return
        }

        const { data: profiles, error: profilesErr } = await supabase
          .from("profiles")
          .select("id, full_name, phone, role, created_at")
          .in("id", studentIds)
        if (profilesErr) throw profilesErr

        setStudents(profiles ?? [])
      } catch (err: any) {
        setError(err.message || "Failed to fetch students")
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Assigned Students</h1>

      {error && <div className="text-red-600 mb-4">{error}</div>}
      {!loading && students.length === 0 && <div>No students assigned.</div>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading
          ? // Skeletons while loading
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-4 space-y-4">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16 rounded-md" />
                  <Skeleton className="h-8 w-16 rounded-md" />
                </div>
              </Card>
            ))
          : // Actual data
            students.map((s) => (
              <Card key={s.id} className="hover:shadow-md transition">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {s.full_name ?? "Unnamed student"}
                    <Badge variant="secondary">ID: {s.id.slice(0, 6)}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-gray-600">Phone: {s.phone ?? "—"}</p>
                  <p className="text-sm text-gray-600">
                    Joined: {s.created_at ? new Date(s.created_at).toLocaleDateString() : "—"}
                  </p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Link href={`/tutor/students/${s.id}`}>
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                  <Link href={`/tutor/students/${s.id}/edit`}>
                    <Button size="sm">Edit</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
      </div>
    </div>
  )
}
