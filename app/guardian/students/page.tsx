// // app/guardian/students/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabaseClient";

// export default function GuardianStudentsPage() {
//   const [students, setStudents] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetch = async () => {
//       setLoading(true);
//       try {
//         const { data: { user } } = await supabase.auth.getUser();
//         if (!user) { setError("Not signed in"); setLoading(false); return; }

//         const { data, error } = await supabase
//           .from("student_guardians")
//           .select("student_id, credits, profiles!student_id (id, full_name, email)")
//           .eq("guardian_id", user.id);

//         if (error) throw error;

//         const mapped = (data || []).map((r: any) => ({
//           id: r.profiles?.id ?? r.student_id,
//           full_name: r.profiles?.full_name ?? "Unnamed",
//           email: r.profiles?.email ?? "",
//           credits: r.credits ?? 0
//         }));

//         setStudents(mapped);
//       } catch (err: any) {
//         setError(err.message || "Failed");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetch();
//   }, []);

//   if (loading) return <div className="p-6">Loading students…</div>;
//   if (error) return <div className="p-6 text-red-500">{error}</div>;

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <h1 className="text-2xl font-semibold mb-4">My Students</h1>

//       {students.length === 0 ? (
//         <p className="text-gray-600">No students linked.</p>
//       ) : (
//         <ul className="space-y-3">
//           {students.map((s) => (
//             <li key={s.id} className="border p-4 rounded shadow-sm">
//               <div className="font-semibold">{s.full_name}</div>
//               <div className="text-sm text-gray-600">{s.email}</div>
//               <div className="mt-2 text-sm">Credits: <strong>{s.credits}</strong></div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GuardianStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setError("Not signed in"); setLoading(false); return; }

        const { data, error } = await supabase
          .from("student_guardians")
          .select("student_id, credits, profiles!student_id (id, full_name, email)")
          .eq("guardian_id", user.id);

        if (error) throw error;

        const mapped = (data || []).map((r: any) => ({
          id: r.profiles?.id ?? r.student_id,
          full_name: r.profiles?.full_name ?? "Unnamed",
          email: r.profiles?.email ?? "",
          credits: r.credits ?? 0
        }));

        setStudents(mapped);
      } catch (err: any) {
        setError(err.message || "Failed");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  if (loading) return <div className="p-6">Loading students…</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.h1 
        initial={{opacity:0, y:-20}} 
        animate={{opacity:1, y:0}} 
        className="text-3xl font-bold mb-8 text-center"
      >
        📚 My Students
      </motion.h1>

      {students.length === 0 ? (
        <p className="text-gray-600 text-center">No students linked.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((s, idx) => (
            <motion.div 
              key={s.id}
              initial={{opacity:0, y:20}} 
              animate={{opacity:1, y:0}} 
              transition={{delay: idx * 0.1}}
            >
              <Card className="rounded-2xl shadow-md hover:shadow-xl transition">
                <CardHeader>
                  <CardTitle className="text-lg">{s.full_name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-gray-600">{s.email}</p>
                  <p className="text-sm">Credits: <strong>{s.credits}</strong></p>
                  <Link href={`/guardian/students/${s.id}`}>
                    <Button className="mt-3 w-full" size="sm">View Profile</Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
