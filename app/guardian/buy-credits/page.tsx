// // app/guardian/buy-credits/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabaseClient";

// export default function BuyCreditsPage() {
//   const [students, setStudents] = useState<any[]>([]);
//   const [studentId, setStudentId] = useState<string | null>(null);
//   const [creditsToBuy, setCreditsToBuy] = useState<number>(100);
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState<string | null>(null);

//   // conversion: 1 credit = 3 PKR
//   const conversionRate = 3; // PKR per credit
//   const costPKR = creditsToBuy * conversionRate;

//   useEffect(() => {
//     const load = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) return;

//       const { data, error } = await supabase
//         .from("student_guardians")
//         .select("student_id, credits, profiles!student_id(id, full_name)")
//         .eq("guardian_id", user.id);

//       if (error) { console.error(error); return; }
//       const mapped = (data || []).map((r: any) => ({
//         student_id: r.student_id,
//         credits: r.credits ?? 0,
//         profile: r.profiles ?? null
//       }));
//       setStudents(mapped);
//       if (mapped.length) setStudentId(mapped[0].student_id);
//     };

//     load();
//   }, []);

//   const handleBuy = async () => {
//     setStatus(null);
//     if (!studentId) { setStatus("Select a student"); return; }
//     if (!creditsToBuy || creditsToBuy <= 0) { setStatus("Enter credits > 0"); return; }

//     setLoading(true);
//     try {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) throw new Error("Not authenticated");

//       // 1) insert a payments record (type 'credit')
//       const { error: payErr } = await supabase.from("payments").insert([{
//         guardian_id: user.id,
//         student_id: studentId,
//         expense_id: null,
//         amount: costPKR,
//         type: "credit"
//       }]);

//       if (payErr) throw payErr;

//       // 2) read current credits for this guardian-student and update
//       const { data: linkRows, error: linkErr } = await supabase
//         .from("student_guardians")
//         .select("credits")
//         .eq("guardian_id", user.id)
//         .eq("student_id", studentId)
//         .single();

//       if (linkErr) throw linkErr;

//       const current = linkRows?.credits ?? 0;
//       const newCredits = current + creditsToBuy;

//       const { error: updateErr } = await supabase
//         .from("student_guardians")
//         .update({ credits: newCredits })
//         .eq("guardian_id", user.id)
//         .eq("student_id", studentId);

//       if (updateErr) throw updateErr;

//       setStatus(`Success — purchased ${creditsToBuy} credits (Rs ${costPKR}).`);
//       // refresh local UI
//       setStudents((prev) => prev.map(s => s.student_id === studentId ? {...s, credits: newCredits} : s));
//     } catch (err: any) {
//       console.error(err);
//       setStatus(err.message || "Failed to buy credits");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-6">
//       <h1 className="text-2xl font-semibold mb-4">Buy Credits</h1>

//       <div className="mb-4">
//         <label className="block text-sm font-medium">Student</label>
//         <select value={studentId ?? ""} onChange={(e) => setStudentId(e.target.value)} className="mt-1 w-full p-2 border rounded">
//           <option value="">Select student</option>
//           {students.map(s => (
//             <option key={s.student_id} value={s.student_id}>
//               {s.profile?.full_name ?? s.student_id} — Credits: {s.credits}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="mb-4">
//         <label className="block text-sm font-medium">Credits to buy</label>
//         <input type="number" value={creditsToBuy} onChange={(e) => setCreditsToBuy(Number(e.target.value))} className="mt-1 w-full p-2 border rounded" />
//         <p className="text-sm text-gray-600 mt-2">Conversion: 300 PKR = 100 credits → 1 credit = {conversionRate} PKR</p>
//         <p className="text-sm text-gray-800 mt-1">Total cost: Rs {costPKR}</p>
//       </div>

//       {status && <div className="mb-4 text-sm">{status}</div>}

//       <div className="flex gap-2">
//         <button onClick={handleBuy} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
//           {loading ? "Processing..." : `Buy ${creditsToBuy} credits (Rs ${costPKR})`}
//         </button>
//       </div>
//     </div>
//   );
// }




"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function BuyCreditsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [creditsToBuy, setCreditsToBuy] = useState<number>(100);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const conversionRate = 3;
  const costPKR = creditsToBuy * conversionRate;

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("student_guardians")
        .select("student_id, credits, profiles!student_id(id, full_name)")
        .eq("guardian_id", user.id);

      const mapped = (data || []).map((r: any) => ({
        student_id: r.student_id,
        credits: r.credits ?? 0,
        profile: r.profiles ?? null,
      }));
      setStudents(mapped);
      if (mapped.length) setStudentId(mapped[0].student_id);
    };
    load();
  }, []);

  const handleBuy = async () => {
    setStatus(null);
    if (!studentId) return setStatus("Select a student");
    if (!creditsToBuy || creditsToBuy <= 0) return setStatus("Enter credits > 0");

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      await supabase.from("payments").insert([{
        guardian_id: user.id,
        student_id: studentId,
        expense_id: null,
        amount: costPKR,
        type: "credit",
      }]);

      const { data: linkRows } = await supabase
        .from("student_guardians")
        .select("credits")
        .eq("guardian_id", user.id)
        .eq("student_id", studentId)
        .single();

      const current = linkRows?.credits ?? 0;
      const newCredits = current + creditsToBuy;
      await supabase
        .from("student_guardians")
        .update({ credits: newCredits })
        .eq("guardian_id", user.id)
        .eq("student_id", studentId);

      setStatus(`✅ Purchased ${creditsToBuy} credits for Rs ${costPKR}`);
      setStudents((prev) =>
        prev.map((s) =>
          s.student_id === studentId ? { ...s, credits: newCredits } : s
        )
      );
    } catch (err: any) {
      setStatus(err.message || "Failed to buy credits");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6 text-center"
      >
        💳 Buy Credits
      </motion.h1>

      <Card>
        <CardContent className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium">Student</label>
            <select
              value={studentId ?? ""}
              onChange={(e) => setStudentId(e.target.value)}
              className="mt-1 w-full border rounded-lg p-2"
            >
              <option value="">Select student</option>
              {students.map((s) => (
                <option key={s.student_id} value={s.student_id}>
                  {s.profile?.full_name} — Credits: {s.credits}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Credits to Buy</label>
            <input
              type="number"
              value={creditsToBuy}
              onChange={(e) => setCreditsToBuy(Number(e.target.value))}
              className="mt-1 w-full border rounded-lg p-2"
            />
            <p className="text-sm text-gray-500 mt-2">
              1 credit = {conversionRate} PKR
            </p>
            <p className="text-sm font-medium mt-1">Total: Rs {costPKR}</p>
          </div>

          {status && <p className="text-center text-sm">{status}</p>}

          <Button
            onClick={handleBuy}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Processing…" : `Buy for Rs ${costPKR}`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

