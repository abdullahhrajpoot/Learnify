// // app/guardian/students/[id]/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Link from "next/link";
// import { supabase } from "@/lib/supabaseClient";

// export default function GuardianStudentPage() {
//   const params = useParams();
//   const router = useRouter();
//   const studentId = (params as any)?.id as string | undefined;

//   const [loading, setLoading] = useState(true);
//   const [unauthorized, setUnauthorized] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const [studentProfile, setStudentProfile] = useState<any | null>(null);
//   const [credits, setCredits] = useState<number>(0);
//   const [expenses, setExpenses] = useState<any[]>([]);
//   const [busyExpenseId, setBusyExpenseId] = useState<number | string | null>(null);

//   // 1 credit = 3 PKR
//   const pkrPerCredit = 3;

//   useEffect(() => {
//     if (!studentId) {
//       setError("Missing student id.");
//       setLoading(false);
//       return;
//     }

//     const load = async () => {
//       setLoading(true);
//       setUnauthorized(false);
//       setError(null);

//       try {
//         // 1) ensure current user is guardian and linked to this student
//         const {
//           data: { user },
//           error: userErr,
//         } = await supabase.auth.getUser();
//         if (userErr || !user) {
//           setError(userErr?.message || "Not authenticated");
//           setLoading(false);
//           return;
//         }

//         // check link in student_guardians
//         const { data: link, error: linkErr } = await supabase
//           .from("student_guardians")
//           .select("student_id, credits")
//           .eq("guardian_id", user.id)
//           .eq("student_id", studentId)
//           .single();

//         if (linkErr || !link) {
//           setUnauthorized(true);
//           setLoading(false);
//           return;
//         }

//         // set credits
//         setCredits(link.credits ?? 0);

//         // 2) fetch profile
//         const { data: profile, error: profileErr } = await supabase
//           .from("profiles")
//           .select("id, full_name, email, phone, created_at, role")
//           .eq("id", studentId)
//           .single();

//         if (profileErr) throw profileErr;
//         setStudentProfile(profile);

//         // 3) fetch expenses for this student (both unpaid and paid)
//         const { data: exData, error: exErr } = await supabase
//           .from("expenses")
//           .select("id, student_id, amount, description, created_at, paid, paid_at, paid_by")
//           .eq("student_id", studentId)
//           .order("created_at", { ascending: false });

//         if (exErr) throw exErr;
//         setExpenses(exData || []);
//       } catch (err: any) {
//         console.error(err);
//         setError(err?.message || "Failed to load student");
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, [studentId]);

//   // calculate required credits for an expense
//   const requiredCreditsFor = (amountPkr: number) => Math.ceil(Number(amountPkr) / pkrPerCredit);

//   // pay expense with credits (client-only flow; requires RLS policy guardian_mark_expense_paid)
//   const handlePayWithCredits = async (expense: any) => {
//     setError(null);
//     setBusyExpenseId(expense.id);

//     try {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) throw new Error("Not authenticated");

//       // fetch latest credits (single)
//       const { data: linkRow, error: linkErr } = await supabase
//         .from("student_guardians")
//         .select("credits")
//         .eq("guardian_id", user.id)
//         .eq("student_id", studentId)
//         .single();

//       if (linkErr) throw linkErr;
//       const currentCredits = linkRow?.credits ?? 0;

//       const requiredCredits = requiredCreditsFor(expense.amount);
//       if (currentCredits < requiredCredits) {
//         throw new Error(`Not enough credits (${currentCredits}) — required ${requiredCredits}`);
//       }

//       // 1) insert payments row
//       const { error: payErr } = await supabase.from("payments").insert([{
//         guardian_id: user.id,
//         student_id: studentId,
//         expense_id: expense.id,
//         amount: expense.amount,
//         type: "invoice"
//       }]);
//       if (payErr) throw payErr;

//       // 2) update credits
//       const newCredits = currentCredits - requiredCredits;
//       const { error: updateErr } = await supabase
//         .from("student_guardians")
//         .update({ credits: newCredits })
//         .eq("guardian_id", user.id)
//         .eq("student_id", studentId);

//       if (updateErr) throw updateErr;

//       // 3) mark expense paid
//       const { error: markErr } = await supabase
//         .from("expenses")
//         .update({
//           paid: true,
//           paid_at: new Date().toISOString(),
//           paid_by: user.id
//         })
//         .eq("id", expense.id);

//       if (markErr) throw markErr;

//       // 4) update UI
//       setCredits(newCredits);
//       setExpenses((prev) => prev.map(e => e.id === expense.id ? { ...e, paid: true, paid_at: new Date().toISOString(), paid_by: user.id } : e));

//       alert(`Paid Rs ${expense.amount} using ${requiredCredits} credits. Remaining credits: ${newCredits}`);
//     } catch (err: any) {
//       console.error(err);
//       setError(err?.message || "Payment failed");
//     } finally {
//       setBusyExpenseId(null);
//     }
//   };

//   if (loading) return <div className="p-6">Loading student…</div>;
//   if (unauthorized) return <div className="p-6 text-red-600">You are not authorized to view this student's details.</div>;
//   if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <div className="flex items-start justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-semibold">{studentProfile?.full_name ?? "Student"}</h1>
//           <div className="text-sm text-gray-600">{studentProfile?.email}</div>
//           <div className="text-sm text-gray-600">Phone: {studentProfile?.phone ?? "—"}</div>
//           <div className="text-xs text-gray-400">Joined: {studentProfile?.created_at ? new Date(studentProfile.created_at).toLocaleString() : "—"}</div>
//         </div>

//         <div className="text-right">
//           <div className="text-sm text-gray-500">Credits</div>
//           <div className="text-xl font-bold">{credits}</div>
//           <div className="mt-3 flex flex-col gap-2">
//             <Link href={`/guardian/buy-credits?studentId=${encodeURIComponent(studentId!)}`} className="px-3 py-1 bg-slate-800 text-white rounded text-sm">Buy Credits</Link>
//             <Link href="/guardian/payments" className="px-3 py-1 border rounded text-sm">All Expenses</Link>
//           </div>
//         </div>
//       </div>

//       <section className="mt-6">
//         <h2 className="text-lg font-semibold mb-3">Expenses for {studentProfile?.full_name}</h2>

//         {expenses.length === 0 ? (
//           <p className="text-gray-600">No expenses for this student.</p>
//         ) : (
//           <ul className="space-y-3">
//             {expenses.map((exp) => {
//               const requiredCredits = requiredCreditsFor(exp.amount);
//               return (
//                 <li key={exp.id} className="border p-3 rounded flex justify-between items-center">
//                   <div>
//                     <div className="font-medium">{exp.description ?? "Expense"}</div>
//                     <div className="text-sm text-gray-600">Amount: Rs {exp.amount}</div>
//                     <div className="text-xs text-gray-400">Created: {new Date(exp.created_at).toLocaleString()}</div>
//                     {exp.paid && <div className="text-xs text-green-600 mt-1">Paid on: {exp.paid_at ? new Date(exp.paid_at).toLocaleString() : "—"}</div>}
//                   </div>

//                   <div className="flex flex-col items-end gap-2">
//                     {!exp.paid ? (
//                       <>
//                         <Link href={`/guardian/buy-credits?studentId=${encodeURIComponent(studentId!)}`} className="text-xs px-2 py-1 bg-amber-500 text-white rounded">Buy credits</Link>
//                         <button
//                           onClick={() => handlePayWithCredits(exp)}
//                           disabled={busyExpenseId === exp.id}
//                           className="px-3 py-1 bg-emerald-600 text-white rounded text-sm disabled:opacity-50"
//                         >
//                           {busyExpenseId === exp.id ? "Processing..." : `Pay with ${requiredCredits} credits`}
//                         </button>
//                       </>
//                     ) : (
//                       <div className="text-sm text-gray-600">Paid</div>
//                     )}
//                   </div>
//                 </li>
//               );
//             })}
//           </ul>
//         )}
//       </section>
//     </div>
//   );
// }






"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function GuardianStudentPage() {
  const params = useParams();
  const studentId = (params as any)?.id as string | undefined;

  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [studentProfile, setStudentProfile] = useState<any | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [busyExpenseId, setBusyExpenseId] = useState<number | string | null>(null);

  const pkrPerCredit = 3;

  useEffect(() => {
    if (!studentId) {
      setError("Missing student id.");
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setUnauthorized(false);
      setError(null);

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError("Not authenticated");
          setLoading(false);
          return;
        }

        const { data: link } = await supabase
          .from("student_guardians")
          .select("student_id, credits")
          .eq("guardian_id", user.id)
          .eq("student_id", studentId)
          .single();

        if (!link) {
          setUnauthorized(true);
          setLoading(false);
          return;
        }

        setCredits(link.credits ?? 0);

        const { data: profile } = await supabase
          .from("profiles")
          .select("id, full_name, email, phone, created_at, role")
          .eq("id", studentId)
          .single();
        setStudentProfile(profile);

        const { data: exData } = await supabase
          .from("expenses")
          .select("id, student_id, amount, description, created_at, paid, paid_at, paid_by")
          .eq("student_id", studentId)
          .order("created_at", { ascending: false });

        setExpenses(exData || []);
      } catch (err: any) {
        setError(err?.message || "Failed to load student");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [studentId]);

  const requiredCreditsFor = (amountPkr: number) => Math.ceil(Number(amountPkr) / pkrPerCredit);

  const handlePayWithCredits = async (expense: any) => {
    setBusyExpenseId(expense.id);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: linkRow } = await supabase
        .from("student_guardians")
        .select("credits")
        .eq("guardian_id", user.id)
        .eq("student_id", studentId)
        .single();

      const currentCredits = linkRow?.credits ?? 0;
      const requiredCredits = requiredCreditsFor(expense.amount);
      if (currentCredits < requiredCredits) {
        throw new Error(`Not enough credits (${currentCredits}) — required ${requiredCredits}`);
      }

      await supabase.from("payments").insert([{
        guardian_id: user.id,
        student_id: studentId,
        expense_id: expense.id,
        amount: expense.amount,
        type: "invoice"
      }]);

      await supabase
        .from("student_guardians")
        .update({ credits: currentCredits - requiredCredits })
        .eq("guardian_id", user.id)
        .eq("student_id", studentId);

      await supabase
        .from("expenses")
        .update({ paid: true, paid_at: new Date().toISOString(), paid_by: user.id })
        .eq("id", expense.id);

      setCredits(currentCredits - requiredCredits);
      setExpenses((prev) =>
        prev.map(e => e.id === expense.id ? { ...e, paid: true, paid_at: new Date().toISOString(), paid_by: user.id } : e)
      );
    } catch (err: any) {
      setError(err?.message || "Payment failed");
    } finally {
      setBusyExpenseId(null);
    }
  };

  if (loading) return <div className="p-6">Loading student…</div>;
  if (unauthorized) return <div className="p-6 text-red-600">You are not authorized to view this student's details.</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <motion.div 
        initial={{opacity:0, y:-20}} 
        animate={{opacity:1, y:0}}
        className="flex items-start justify-between gap-6 bg-white shadow-md p-6 rounded-2xl"
      >
        <div>
          <h1 className="text-2xl font-bold">{studentProfile?.full_name}</h1>
          <p className="text-sm text-gray-600">{studentProfile?.email}</p>
          <p className="text-sm text-gray-600">Phone: {studentProfile?.phone ?? "—"}</p>
          <p className="text-xs text-gray-400">Joined: {studentProfile?.created_at ? new Date(studentProfile.created_at).toLocaleDateString() : "—"}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Credits</p>
          <p className="text-2xl font-bold">{credits}</p>
          <div className="mt-4 flex flex-col gap-2">
            <Link href={`/guardian/buy-credits?studentId=${studentId}`}>
              <Button className="w-full">Buy Credits</Button>
            </Link>
            <Link href="/guardian/payments">
              <Button variant="outline" className="w-full">All Expenses</Button>
            </Link>
          </div>
        </div>
      </motion.div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Expenses</h2>
        {expenses.length === 0 ? (
          <p className="text-gray-600">No expenses found.</p>
        ) : (
          <div className="space-y-4">
            {expenses.map((exp, idx) => {
              const requiredCredits = requiredCreditsFor(exp.amount);
              return (
                <motion.div 
                  key={exp.id} 
                  initial={{opacity:0, y:20}} 
                  animate={{opacity:1, y:0}} 
                  transition={{delay: idx * 0.05}}
                >
                  <Card className="rounded-xl shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base">{exp.description ?? "Expense"}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Amount: Rs {exp.amount}</p>
                        <p className="text-xs text-gray-400">Created: {new Date(exp.created_at).toLocaleString()}</p>
                        {exp.paid && (
                          <p className="text-xs text-green-600 mt-1">
                            Paid on: {exp.paid_at ? new Date(exp.paid_at).toLocaleString() : "—"}
                          </p>
                        )}
                      </div>
                      <div>
                        {!exp.paid ? (
                          <div className="flex flex-col gap-2">
                            <Link href={`/guardian/buy-credits?studentId=${studentId}`}>
                              <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                                Buy credits
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700"
                              disabled={busyExpenseId === exp.id}
                              onClick={() => handlePayWithCredits(exp)}
                            >
                              {busyExpenseId === exp.id ? "Processing..." : `Pay with ${requiredCredits} credits`}
                            </Button>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">✅ Paid</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
