// // app/guardian/dashboard/page.tsx
// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabaseClient";

// export default function GuardianDashboard() {
//   const [students, setStudents] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Get logged-in guardian
//         const {
//           data: { user },
//           error: userError,
//         } = await supabase.auth.getUser();

//         if (userError) {
//           setError(userError.message);
//           setLoading(false);
//           return;
//         }

//         const guardianId = user?.id;
//         if (!guardianId) {
//           setError("Guardian not logged in.");
//           setLoading(false);
//           return;
//         }

//         // Get linked students (student_guardians)
//         const { data: guardianLinks, error: linkError } = await supabase
//           .from("student_guardians")
//           .select("student_id, credits, profiles!student_id(id, full_name, email)")
//           .eq("guardian_id", guardianId);

//         if (linkError) {
//           setError(linkError.message);
//           setLoading(false);
//           return;
//         }

//         if (!guardianLinks || guardianLinks.length === 0) {
//           setStudents([]);
//           setLoading(false);
//           return;
//         }

//         // Build flattened student entries. If profiles are joined above, use them.
//         const mapped = (guardianLinks || []).map((r: any) => ({
//           student_id: r.student_id,
//           credits: r.credits ?? 0,
//           profile: r.profiles ?? null,
//         }));

//         // If `profiles` wasn't included by join, fall back to fetching profiles explicitly
//         const needProfiles = mapped.some((m) => !m.profile);
//         if (needProfiles) {
//           const studentIds = mapped.map((m) => m.student_id);
//           const { data: studentProfiles, error: studentErr } = await supabase
//             .from("profiles")
//             .select("id, full_name, email, role")
//             .in("id", studentIds);
//           if (studentErr) throw studentErr;

//           const byId: Record<string, any> = {};
//           (studentProfiles || []).forEach((p: any) => (byId[p.id] = p));
//           const enriched = mapped.map((m) => ({ ...m, profile: m.profile ?? byId[m.student_id] ?? null }));
//           setStudents(enriched);
//         } else {
//           setStudents(mapped);
//         }

//         console.log("Guardian -> mapped students:", mapped);
//       } catch (err: any) {
//         console.error("Failed loading guardian students:", err);
//         setError(err?.message || "Failed to load students");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStudents();
//   }, []);

//   if (loading) {
//     return (
//       <div className="max-w-4xl mx-auto p-6">
//         <h1 className="text-3xl font-bold mb-6">Guardian Dashboard</h1>
//         <p className="text-gray-600">Loading students…</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6">👨‍👧 Guardian Dashboard</h1>

//       {error && <p className="text-red-500 mb-4">❌ {error}</p>}

//       {students.length === 0 ? (
//         <p className="text-gray-600">⚠️ No students linked to your account.</p>
//       ) : (
//         <ul className="grid md:grid-cols-2 gap-6">
//           {students.map((s) => {
//             const id = s.student_id;
//             const profile = s.profile ?? {};
//             const href = `/guardian/students/${id}`;

//             return (
//               <li key={id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition">
//                 {/* Entire card clickable */}
//                 <Link href={href} className="block p-6 no-underline text-inherit">
//                   <div className="flex items-start justify-between gap-4">
//                     <div>
//                       <div className="text-xl font-semibold">{profile.full_name ?? "Unnamed student"}</div>
//                       <div className="text-sm text-gray-600">{profile.email ?? "—"}</div>
//                       <div className="text-xs text-gray-400 mt-2">Credits: <span className="font-medium">{s.credits ?? 0}</span></div>
//                       <div className="text-xs text-gray-400 mt-1">ID: <span className="font-mono text-xs">{id}</span></div>
//                     </div>

//                     {/* Big visible button on the right */}
//                     <div className="flex flex-col items-end">
//                       <Link
//                         href={href}
//                         className="inline-block px-4 py-2 bg-slate-800 text-white rounded-lg shadow hover:bg-slate-900 text-sm"
//                         onClick={() => console.log("navigating to", href)}
//                       >
//                         View profile
//                       </Link>

//                       <Link
//                         href={`/guardian/payments?studentId=${encodeURIComponent(id)}`}
//                         className="mt-2 text-xs px-3 py-1 border rounded hover:bg-gray-50"
//                       >
//                         View payments
//                       </Link>
//                     </div>
//                   </div>
//                 </Link>
//               </li>
//             );
//           })}
//         </ul>
//       )}
//     </div>
//   );
// }





"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Users, UserSquare2, Sparkles, Eye, CreditCard, GraduationCap, Calendar, TrendingUp } from "lucide-react";

export default function GuardianDashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return setError("Guardian not logged in");

        const { data: guardianLinks } = await supabase
          .from("student_guardians")
          .select("student_id, credits, profiles!student_id(id, full_name, email)")
          .eq("guardian_id", user.id);

        const mapped = (guardianLinks || []).map((r: any) => ({
          student_id: r.student_id,
          credits: r.credits ?? 0,
          profile: r.profiles ?? null,
        }));
        setStudents(mapped);
      } catch (err: any) {
        setError(err.message || "Failed to load students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const totalStudents = students.length
  const totalCredits = students.reduce((sum, s) => sum + (s.credits || 0), 0)
  const averageCredits = students.length > 0 ? totalCredits / students.length : 0

  return (
    <div className="min-h-screen ocean-gradient-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-2 bg-ocean-primary/10 rounded-lg">
            <UserSquare2 className="w-8 h-8 text-ocean-primary" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-ocean-primary">
              Guardian Dashboard
            </h1>
            <p className="text-ocean-secondary/80 text-sm sm:text-base">
              Monitor and support your students' learning journey
            </p>
          </div>
          <Sparkles className="w-6 h-6 text-ocean-accent ml-auto" />
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="ocean-gradient-card shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ocean-secondary/70">Total Students</p>
                  <p className="text-2xl font-bold text-ocean-primary">{totalStudents}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="ocean-gradient-card shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ocean-secondary/70">Total Credits</p>
                  <p className="text-2xl font-bold text-ocean-primary">{totalCredits}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="ocean-gradient-card shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ocean-secondary/70 mr-2">Average Credits</p>
                  <p className="text-2xl font-bold text-ocean-primary">{averageCredits.toFixed(1)}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Students List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="ocean-gradient-card shadow-lg border-0">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-white/20 rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-white/20 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-white/20 rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="ocean-gradient-card shadow-lg border-0">
              <CardContent className="p-6">
                <div className="text-center text-red-600">
                  <p className="font-medium">Error loading students</p>
                  <p className="text-sm">{error}</p>
                </div>
              </CardContent>
            </Card>
          ) : students.length === 0 ? (
            <Card className="ocean-gradient-card shadow-lg border-0">
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 text-ocean-secondary/40 mx-auto mb-4" />
                <p className="text-ocean-secondary/60 text-lg">No students linked</p>
                <p className="text-ocean-secondary/40 text-sm">Students will appear here when assigned by admin</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((s, i) => (
                <motion.div
                  key={s.student_id}
                  variants={itemVariants}
                  whileHover={{scale:1.02, y:-2}}
                >
                  <Card className="ocean-gradient-card shadow-lg border-0 overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col h-full">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-ocean-primary to-ocean-secondary rounded-lg flex items-center justify-center text-white font-bold text-lg">
                              {(s.profile?.full_name || 'S').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-ocean-primary text-lg">
                                {s.profile?.full_name || 'Unnamed Student'}
                              </div>
                              <Badge variant="secondary" className="bg-ocean-secondary/10 text-ocean-secondary border-ocean-secondary/20">
                                Student
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-ocean-secondary/70">
                              <GraduationCap className="w-3 h-3" />
                              {s.profile?.email || 'No email'}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-ocean-secondary/70">
                              <CreditCard className="w-3 h-3" />
                              Credits: <span className="font-semibold text-ocean-primary">{s.credits}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-ocean-secondary/60">
                              <Calendar className="w-3 h-3" />
                              ID: {s.student_id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-4 pt-4 border-t border-ocean-primary/10">
                          <Button asChild size="sm" className="flex-1 ocean-gradient text-white">
                            <Link href={`/guardian/students/${s.student_id}`}>
                              <Eye className="w-3 h-3 mr-1" />
                              View Profile
                            </Link>
                          </Button>
                          <Button asChild size="sm" variant="outline" className="flex-1 bg-white/80 backdrop-blur-sm border-ocean-primary/20 text-ocean-primary hover:bg-ocean-primary/5">
                            <Link href={`/guardian/payments?studentId=${s.student_id}`}>
                              <CreditCard className="w-3 h-3 mr-1" />
                              Payments
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
