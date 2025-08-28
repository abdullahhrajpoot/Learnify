
// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabaseClient";

// export default function GuardianPaymentsPage() {
//   const [guardian, setGuardian] = useState<any>(null);
//   const [students, setStudents] = useState<any[]>([]);
//   const [expenses, setExpenses] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [busyExpenseId, setBusyExpenseId] = useState<number | string | null>(null);
//   const [errorMsg, setErrorMsg] = useState<string | null>(null);

//   // conversion: 1 credit = 3 PKR
//   const pkrPerCredit = 3;

//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       setErrorMsg(null);

//       try {
//         // 1) get current user
//         const {
//           data: { user },
//           error: userErr,
//         } = await supabase.auth.getUser();

//         if (userErr || !user) {
//           setErrorMsg(userErr?.message || "Not authenticated");
//           setLoading(false);
//           return;
//         }

//         // 2) guardian profile
//         const { data: gData, error: gErr } = await supabase
//           .from("profiles")
//           .select("id, full_name, email")
//           .eq("id", user.id)
//           .single();

//         if (gErr) throw gErr;
//         setGuardian(gData);

//         // 3) get linked students from student_guardians (includes credits)
//         const { data: links, error: linkErr } = await supabase
//           .from("student_guardians")
//           .select("student_id, credits, profiles!student_id(id, full_name, email)")
//           .eq("guardian_id", user.id);

//         if (linkErr) throw linkErr;

//         const mapped = (links || []).map((r: any) => ({
//           student_id: r.student_id,
//           credits: r.credits ?? 0,
//           profile: r.profiles ?? null,
//         }));
//         setStudents(mapped);

//         // 4) fetch UNPAID expenses for those student ids (paid = false)
//         const studentIds = mapped.map((s) => s.student_id);
//         if (studentIds.length === 0) {
//           setExpenses([]);
//           setLoading(false);
//           return;
//         }

//         const { data: exData, error: exErr } = await supabase
//           .from("expenses")
//           .select("id, student_id, amount, description, created_at, paid")
//           .in("student_id", studentIds)
//           .eq("paid", false) // <<-- only unpaid expenses
//           .order("created_at", { ascending: false });

//         if (exErr) throw exErr;

//         setExpenses(exData || []);
//       } catch (err: any) {
//         console.error("Error loading payments:", err);
//         setErrorMsg(err?.message || "Failed to load payments");
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, []);

//   // helper: get credits for a student
//   const getCreditsFor = (studentId: string) => {
//     return students.find((s) => s.student_id === studentId)?.credits ?? 0;
//   };

//   // client-side flow to pay an expense with credits
//   const handlePayWithCredits = async (expense: any) => {
//     setErrorMsg(null);
//     setBusyExpenseId(expense.id);

//     try {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) throw new Error("Not authenticated");

//       // compute required credits (ceil)
//       const requiredCredits = Math.ceil(Number(expense.amount) / pkrPerCredit);

//       // fetch current credits for the guardian-student link
//       const { data: linkRow, error: linkErr } = await supabase
//         .from("student_guardians")
//         .select("credits")
//         .eq("guardian_id", user.id)
//         .eq("student_id", expense.student_id)
//         .single();

//       if (linkErr) throw linkErr;
//       const currentCredits = linkRow?.credits ?? 0;

//       if (currentCredits < requiredCredits) {
//         throw new Error(`Not enough credits. Required ${requiredCredits}, you have ${currentCredits}.`);
//       }

//       // 1) insert payment record (type 'invoice') — payments table must allow insert for authenticated guardians
//       const { error: payErr } = await supabase.from("payments").insert([
//         {
//           guardian_id: user.id,
//           student_id: expense.student_id,
//           expense_id: expense.id,
//           amount: expense.amount,
//           type: "invoice",
//         },
//       ]);
//       if (payErr) throw payErr;

//       // 2) deduct credits from student_guardians
//       const newCredits = currentCredits - requiredCredits;
//       const { error: updateErr } = await supabase
//         .from("student_guardians")
//         .update({ credits: newCredits })
//         .eq("guardian_id", user.id)
//         .eq("student_id", expense.student_id);
//       if (updateErr) throw updateErr;

//       // 3) mark expense as paid (client-side update) — RLS must allow this (policy: guardian_mark_expense_paid)
//       const { error: markErr } = await supabase
//         .from("expenses")
//         .update({
//           paid: true,
//           paid_at: new Date().toISOString(),
//           paid_by: user.id,
//         })
//         .eq("id", expense.id);

//       if (markErr) throw markErr;

//       // 4) update UI — remove paid expense and update student credits in UI
//       setExpenses((prev) => prev.filter((e) => e.id !== expense.id));
//       setStudents((prev) =>
//         prev.map((s) => (s.student_id === expense.student_id ? { ...s, credits: newCredits } : s))
//       );

//       alert(`Paid expense (Rs ${expense.amount}) using ${requiredCredits} credits. New credits: ${newCredits}`);
//     } catch (err: any) {
//       console.error("Payment failed:", err);
//       setErrorMsg(err?.message || "Payment failed");
//       alert(err?.message || "Payment failed");
//     } finally {
//       setBusyExpenseId(null);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-6 max-w-4xl mx-auto">
//         <h1 className="text-2xl font-bold mb-4">Student Expenses</h1>
//         <p>Loading…</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Student Expenses</h1>

//       {errorMsg && <div className="mb-4 text-red-600">{errorMsg}</div>}

//       {guardian && (
//         <div className="mb-4 p-3 border rounded bg-gray-50">
//           <strong>Guardian:</strong> {guardian.full_name} <span className="text-sm text-gray-600">({guardian.email})</span>
//         </div>
//       )}

//       <section className="mb-6">
//         <h2 className="text-lg font-semibold">Assigned Students & Credits</h2>
//         {students.length === 0 ? (
//           <p className="text-gray-600">No students linked.</p>
//         ) : (
//           <ul className="grid md:grid-cols-2 gap-3 mt-3">
//             {students.map((s) => (
//               <li key={s.student_id} className="p-3 border rounded">
//                 <div className="font-medium">{s.profile?.full_name ?? "Unnamed"}</div>
//                 <div className="text-sm text-gray-600">Credits: {s.credits}</div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </section>

//       <section>
//         <h2 className="text-lg font-semibold mb-2">Expenses</h2>

//         {expenses.length === 0 ? (
//           <p className="text-gray-600">No unpaid expenses for assigned students.</p>
//         ) : (
//           <ul className="space-y-3">
//             {expenses.map((exp) => {
//               const requiredCredits = Math.ceil(Number(exp.amount) / pkrPerCredit);
//               const availableCredits = getCreditsFor(exp.student_id);
//               const studentName = students.find((s) => s.student_id === exp.student_id)?.profile?.full_name ?? "Unknown";

//               return (
//                 <li key={exp.id} className="border p-3 rounded flex justify-between items-center">
//                   <div>
//                     <div className="font-medium">{exp.description ?? "Expense"}</div>
//                     <div className="text-sm text-gray-600">Student: {studentName}</div>
//                     <div className="text-sm text-gray-500">Amount: Rs {exp.amount} — Required credits: {requiredCredits}</div>
//                     <div className="text-xs text-gray-400">Created: {new Date(exp.created_at).toLocaleString()}</div>
//                   </div>

//                   <div className="flex flex-col items-end gap-2">
//                     <button
//                       onClick={() => alert("Pay with PKR not implemented yet.")}
//                       className="px-3 py-1 border rounded text-sm"
//                     >
//                       Pay (PKR)
//                     </button>

//                     <button
//                       onClick={() => handlePayWithCredits(exp)}
//                       disabled={busyExpenseId === exp.id}
//                       className="px-3 py-1 bg-emerald-600 text-white rounded text-sm disabled:opacity-50"
//                     >
//                       {busyExpenseId === exp.id ? "Processing..." : `Pay with ${requiredCredits} credits (${availableCredits} available)`}
//                     </button>
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







// // app/guardian/payments/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { supabase } from "@/lib/supabaseClient";

// export default function GuardianPaymentsPage() {
//   const [guardian, setGuardian] = useState<any>(null);
//   const [students, setStudents] = useState<any[]>([]);
//   const [expenses, setExpenses] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [busyExpenseId, setBusyExpenseId] = useState<number | string | null>(null);
//   const [errorMsg, setErrorMsg] = useState<string | null>(null);

//   // conversion: 1 credit = 3 PKR
//   const pkrPerCredit = 3;
//   // show low-credit badge when student credits fall below this value
//   const lowCreditsThreshold = 10;

//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       setErrorMsg(null);

//       try {
//         // 1) get current user
//         const {
//           data: { user },
//           error: userErr,
//         } = await supabase.auth.getUser();

//         if (userErr || !user) {
//           setErrorMsg(userErr?.message || "Not authenticated");
//           setLoading(false);
//           return;
//         }

//         // 2) guardian profile
//         const { data: gData, error: gErr } = await supabase
//           .from("profiles")
//           .select("id, full_name, email")
//           .eq("id", user.id)
//           .single();

//         if (gErr) throw gErr;
//         setGuardian(gData);

//         // 3) get linked students from student_guardians (includes credits)
//         const { data: links, error: linkErr } = await supabase
//           .from("student_guardians")
//           .select("student_id, credits, profiles!student_id(id, full_name, email)")
//           .eq("guardian_id", user.id);

//         if (linkErr) throw linkErr;

//         const mapped = (links || []).map((r: any) => ({
//           student_id: r.student_id,
//           credits: r.credits ?? 0,
//           profile: r.profiles ?? null,
//         }));
//         setStudents(mapped);

//         // 4) fetch UNPAID expenses for those student ids (paid = false)
//         const studentIds = mapped.map((s) => s.student_id);
//         if (studentIds.length === 0) {
//           setExpenses([]);
//           setLoading(false);
//           return;
//         }

//         const { data: exData, error: exErr } = await supabase
//           .from("expenses")
//           .select("id, student_id, amount, description, created_at, paid")
//           .in("student_id", studentIds)
//           .eq("paid", false) // only unpaid
//           .order("created_at", { ascending: false });

//         if (exErr) throw exErr;

//         setExpenses(exData || []);
//       } catch (err: any) {
//         console.error("Error loading payments:", err);
//         setErrorMsg(err?.message || "Failed to load payments");
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, []);

//   // helper: get credits for a student
//   const getCreditsFor = (studentId: string) => {
//     return students.find((s) => s.student_id === studentId)?.credits ?? 0;
//   };

//   // client-side flow to pay an expense with credits
//   const handlePayWithCredits = async (expense: any) => {
//     setErrorMsg(null);
//     setBusyExpenseId(expense.id);

//     try {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) throw new Error("Not authenticated");

//       // compute required credits (ceil)
//       const requiredCredits = Math.ceil(Number(expense.amount) / pkrPerCredit);

//       // fetch current credits for the guardian-student link
//       const { data: linkRow, error: linkErr } = await supabase
//         .from("student_guardians")
//         .select("credits")
//         .eq("guardian_id", user.id)
//         .eq("student_id", expense.student_id)
//         .single();

//       if (linkErr) throw linkErr;
//       const currentCredits = linkRow?.credits ?? 0;

//       if (currentCredits < requiredCredits) {
//         throw new Error(`Not enough credits. Required ${requiredCredits}, you have ${currentCredits}.`);
//       }

//       // 1) insert payment record (type 'invoice')
//       const { error: payErr } = await supabase.from("payments").insert([
//         {
//           guardian_id: user.id,
//           student_id: expense.student_id,
//           expense_id: expense.id,
//           amount: expense.amount,
//           type: "invoice",
//         },
//       ]);
//       if (payErr) throw payErr;

//       // 2) deduct credits from student_guardians
//       const newCredits = currentCredits - requiredCredits;
//       const { error: updateErr } = await supabase
//         .from("student_guardians")
//         .update({ credits: newCredits })
//         .eq("guardian_id", user.id)
//         .eq("student_id", expense.student_id);
//       if (updateErr) throw updateErr;

//       // 3) mark expense as paid (client-side update) — RLS must allow this (policy: guardian_mark_expense_paid)
//       const { error: markErr } = await supabase
//         .from("expenses")
//         .update({
//           paid: true,
//           paid_at: new Date().toISOString(),
//           paid_by: user.id,
//         })
//         .eq("id", expense.id);

//       if (markErr) throw markErr;

//       // 4) update UI — remove paid expense and update student credits in UI
//       setExpenses((prev) => prev.filter((e) => e.id !== expense.id));
//       setStudents((prev) =>
//         prev.map((s) => (s.student_id === expense.student_id ? { ...s, credits: newCredits } : s))
//       );

//       alert(`Paid expense (Rs ${expense.amount}) using ${requiredCredits} credits. New credits: ${newCredits}`);
//     } catch (err: any) {
//       console.error("Payment failed:", err);
//       setErrorMsg(err?.message || "Payment failed");
//       alert(err?.message || "Payment failed");
//     } finally {
//       setBusyExpenseId(null);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-6 max-w-4xl mx-auto">
//         <h1 className="text-2xl font-bold mb-4">Student Expenses</h1>
//         <p>Loading…</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Student Expenses</h1>

//       {errorMsg && <div className="mb-4 text-red-600">{errorMsg}</div>}

//       {guardian && (
//         <div className="mb-4 p-3 border rounded bg-gray-50">
//           <strong>Guardian:</strong> {guardian.full_name}{" "}
//           <span className="text-sm text-gray-600">({guardian.email})</span>
//         </div>
//       )}

//       <section className="mb-6">
//         <h2 className="text-lg font-semibold">Assigned Students & Credits</h2>
//         {students.length === 0 ? (
//           <p className="text-gray-600">No students linked.</p>
//         ) : (
//           <ul className="grid md:grid-cols-2 gap-3 mt-3">
//             {students.map((s) => (
//               <li key={s.student_id} className="p-3 border rounded relative">
//                 <div className="font-medium">{s.profile?.full_name ?? "Unnamed"}</div>
//                 <div className="text-sm text-gray-600">Credits: {s.credits}</div>

//                 {/* Low-credit badge + Buy button if credits low */}
//                 {s.credits < lowCreditsThreshold && (
//                   <div className="mt-3 flex items-center gap-2">
//                     <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Low credits</span>
//                     <Link
//                       href={`/guardian/buy-credits?studentId=${encodeURIComponent(s.student_id)}`}
//                       className="text-xs px-2 py-1 bg-slate-800 text-white rounded"
//                     >
//                       Add credits
//                     </Link>
//                   </div>
//                 )}
//               </li>
//             ))}
//           </ul>
//         )}
//       </section>

//       <section>
//         <h2 className="text-lg font-semibold mb-2">Expenses</h2>

//         {expenses.length === 0 ? (
//           <p className="text-gray-600">No unpaid expenses for assigned students.</p>
//         ) : (
//           <ul className="space-y-3">
//             {expenses.map((exp) => {
//               const requiredCredits = Math.ceil(Number(exp.amount) / pkrPerCredit);
//               const availableCredits = getCreditsFor(exp.student_id);
//               const studentName = students.find((s) => s.student_id === exp.student_id)?.profile?.full_name ?? "Unknown";

//               const needsTopUp = availableCredits < requiredCredits;

//               return (
//                 <li key={exp.id} className="border p-3 rounded flex justify-between items-center">
//                   <div>
//                     <div className="font-medium">{exp.description ?? "Expense"}</div>
//                     <div className="text-sm text-gray-600">Student: {studentName}</div>
//                     <div className="text-sm text-gray-500">
//                       Amount: Rs {exp.amount} — Required credits: {requiredCredits}
//                     </div>
//                     <div className="text-xs text-gray-400">Created: {new Date(exp.created_at).toLocaleString()}</div>
//                   </div>

//                   <div className="flex flex-col items-end gap-2">
//                     <button
//                       onClick={() => alert("Pay with PKR not implemented yet.")}
//                       className="px-3 py-1 border rounded text-sm"
//                     >
//                       Pay (PKR)
//                     </button>

//                     {needsTopUp ? (
//                       <Link
//                         href={`/guardian/buy-credits?studentId=${encodeURIComponent(exp.student_id)}`}
//                         className="px-3 py-1 bg-amber-500 text-white rounded text-sm"
//                       >
//                         Low on credits — Add credits
//                       </Link>
//                     ) : (
//                       <button
//                         onClick={() => handlePayWithCredits(exp)}
//                         disabled={busyExpenseId === exp.id}
//                         className="px-3 py-1 bg-emerald-600 text-white rounded text-sm disabled:opacity-50"
//                       >
//                         {busyExpenseId === exp.id ? "Processing..." : `Pay with ${requiredCredits} credits (${availableCredits} available)`}
//                       </button>
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
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function GuardianPaymentsPage() {
  const [guardian, setGuardian] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyExpenseId, setBusyExpenseId] = useState<number | string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const pkrPerCredit = 3;
  const lowCreditsThreshold = 10;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg(null);

      try {
        const { data: { user }, error: userErr } = await supabase.auth.getUser();
        if (userErr || !user) {
          setErrorMsg(userErr?.message || "Not authenticated");
          setLoading(false);
          return;
        }

        const { data: gData, error: gErr } = await supabase
          .from("profiles")
          .select("id, full_name, email")
          .eq("id", user.id)
          .single();
        if (gErr) throw gErr;
        setGuardian(gData);

        const { data: links, error: linkErr } = await supabase
          .from("student_guardians")
          .select("student_id, credits, profiles!student_id(id, full_name, email)")
          .eq("guardian_id", user.id);
        if (linkErr) throw linkErr;

        const mapped = (links || []).map((r: any) => ({
          student_id: r.student_id,
          credits: r.credits ?? 0,
          profile: r.profiles ?? null,
        }));
        setStudents(mapped);

        const studentIds = mapped.map((s) => s.student_id);
        if (studentIds.length === 0) {
          setExpenses([]);
          setLoading(false);
          return;
        }

        const { data: exData, error: exErr } = await supabase
          .from("expenses")
          .select("id, student_id, amount, description, created_at, paid")
          .in("student_id", studentIds)
          .eq("paid", false)
          .order("created_at", { ascending: false });
        if (exErr) throw exErr;
        setExpenses(exData || []);
      } catch (err: any) {
        setErrorMsg(err?.message || "Failed to load payments");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getCreditsFor = (studentId: string) =>
    students.find((s) => s.student_id === studentId)?.credits ?? 0;

  const handlePayWithCredits = async (expense: any) => {
    setErrorMsg(null);
    setBusyExpenseId(expense.id);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const requiredCredits = Math.ceil(Number(expense.amount) / pkrPerCredit);

      const { data: linkRow } = await supabase
        .from("student_guardians")
        .select("credits")
        .eq("guardian_id", user.id)
        .eq("student_id", expense.student_id)
        .single();

      const currentCredits = linkRow?.credits ?? 0;
      if (currentCredits < requiredCredits) {
        throw new Error(`Not enough credits. Required ${requiredCredits}, you have ${currentCredits}.`);
      }

      await supabase.from("payments").insert([{
        guardian_id: user.id,
        student_id: expense.student_id,
        expense_id: expense.id,
        amount: expense.amount,
        type: "invoice",
      }]);

      const newCredits = currentCredits - requiredCredits;
      await supabase
        .from("student_guardians")
        .update({ credits: newCredits })
        .eq("guardian_id", user.id)
        .eq("student_id", expense.student_id);

      await supabase
        .from("expenses")
        .update({
          paid: true,
          paid_at: new Date().toISOString(),
          paid_by: user.id,
        })
        .eq("id", expense.id);

      setExpenses((prev) => prev.filter((e) => e.id !== expense.id));
      setStudents((prev) =>
        prev.map((s) =>
          s.student_id === expense.student_id ? { ...s, credits: newCredits } : s
        )
      );
    } catch (err: any) {
      setErrorMsg(err?.message || "Payment failed");
    } finally {
      setBusyExpenseId(null);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center"
      >
        🎉 Student Expenses & Payments
      </motion.h1>

      {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}

      {guardian && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Guardian Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{guardian.full_name}</p>
            <p className="text-gray-500 text-sm">{guardian.email}</p>
          </CardContent>
        </Card>
      )}

      <section>
        <h2 className="text-xl font-semibold mb-4">👩‍🎓 Students & Credits</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {students.map((s) => (
            <motion.div
              key={s.student_id}
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-xl border shadow-sm bg-gradient-to-br from-gray-50 to-white"
            >
              <div className="font-semibold">{s.profile?.full_name}</div>
              <p className="text-sm text-gray-500">Credits: {s.credits}</p>
              {s.credits < lowCreditsThreshold && (
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="destructive">Low credits</Badge>
                  <Link href={`/guardian/buy-credits?studentId=${s.student_id}`}>
                    <Button size="sm">Add credits</Button>
                  </Link>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">💸 Pending Expenses</h2>
        {expenses.length === 0 ? (
          <p className="text-gray-500">No unpaid expenses 🎉</p>
        ) : (
          <div className="space-y-4">
            {expenses.map((exp) => {
              const requiredCredits = Math.ceil(exp.amount / pkrPerCredit);
              const availableCredits = getCreditsFor(exp.student_id);
              const studentName =
                students.find((s) => s.student_id === exp.student_id)?.profile?.full_name ??
                "Unknown";

              const needsTopUp = availableCredits < requiredCredits;

              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border rounded-xl shadow-sm flex justify-between items-center bg-white"
                >
                  <div>
                    <p className="font-semibold">{exp.description}</p>
                    <p className="text-sm text-gray-500">Student: {studentName}</p>
                    <p className="text-sm text-gray-500">
                      Rs {exp.amount} = {requiredCredits} credits
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {needsTopUp ? (
                      <Link href={`/guardian/buy-credits?studentId=${exp.student_id}`}>
                        <Button variant="destructive" size="sm">
                          Add credits
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handlePayWithCredits(exp)}
                        disabled={busyExpenseId === exp.id}
                      >
                        {busyExpenseId === exp.id
                          ? "Processing..."
                          : `Pay with ${requiredCredits} credits`}
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
