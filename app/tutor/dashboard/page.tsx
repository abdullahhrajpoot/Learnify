"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { GraduationCap, Users, Calendar, Clock, Phone, Sparkles, Eye, Edit, BookOpen, TrendingUp, CheckCircle } from "lucide-react";

type Profile = {
  id: string;
  full_name?: string | null;
  phone?: string | null;
  role?: string | null;
  created_at?: string | null;
};

export default function TutorDashboardPage() {
  const [students, setStudents] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSessions: 0,
    completedSessions: 0
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setStudents([]);
        setLoading(false);
        return;
      }
      
      // Load assigned students
      const { data: assignments } = await supabase
        .from("tutor_assignments")
        .select("student_id")
        .eq("tutor_id", user.id);

      const studentIds = (assignments ?? []).map((a: any) => a.student_id);
      if (studentIds.length === 0) {
        setStudents([]);
        setLoading(false);
        return;
      }

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, phone, role, created_at")
        .in("id", studentIds);

      setStudents(profiles ?? []);
      
      // Load session stats
      const { data: sessions } = await supabase
        .from("sessions")
        .select("status")
        .eq("tutor_id", user.id);
      
      const totalSessions = sessions?.length || 0;
      const completedSessions = sessions?.filter(s => s.status === 'completed').length || 0;
      
      setStats({
        totalStudents: studentIds.length,
        totalSessions,
        completedSessions
      });
      
      setLoading(false);
    }
    load();
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
            <GraduationCap className="w-8 h-8 text-ocean-primary" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-ocean-primary">
              Tutor Dashboard
            </h1>
            <p className="text-ocean-secondary/80 text-sm sm:text-base">
              Manage your students and sessions
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
                  <p className="text-2xl font-bold text-ocean-primary">{stats.totalStudents}</p>
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
                  <p className="text-sm text-ocean-secondary/70">Total Sessions</p>
                  <p className="text-2xl font-bold text-ocean-primary">{stats.totalSessions}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="ocean-gradient-card shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ocean-secondary/70">Completed</p>
                  <p className="text-2xl font-bold text-ocean-primary">{stats.completedSessions}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="ocean-gradient-card shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-ocean-primary">
                <BookOpen className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild className="ocean-gradient text-white shadow-lg">
                    <Link href="/tutor/sessions">
                      <Calendar className="w-4 h-4 mr-2" />
                      Manage Sessions
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild variant="outline" className="bg-white/80 backdrop-blur-sm border-ocean-primary/20 text-ocean-primary hover:bg-ocean-primary/5">
                    <Link href="/tutor/expenses">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Expenses
                    </Link>
                  </Button>
                </motion.div>
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
          <Card className="ocean-gradient-card shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-ocean-primary">
                <Users className="w-5 h-5" />
                My Students ({students.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              ) : students.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-ocean-secondary/40 mx-auto mb-4" />
                  <p className="text-ocean-secondary/60 text-lg">No students assigned yet</p>
                  <p className="text-ocean-secondary/40 text-sm">Students will appear here when assigned by admin</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {students.map((s, i) => (
                    <motion.div
                      key={s.id}
                      variants={itemVariants}
                      whileHover={{scale:1.02, y:-2}}
                    >
                      <Card className="ocean-gradient-card shadow-lg border-0 overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex flex-col h-full">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-ocean-primary to-ocean-secondary rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                  {(s.full_name || 'S').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-semibold text-ocean-primary text-lg">
                                    {s.full_name ?? "Unnamed student"}
                                  </div>
                                  <Badge variant="secondary" className="bg-ocean-secondary/10 text-ocean-secondary border-ocean-secondary/20">
                                    Student
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-ocean-secondary/70">
                                  <Phone className="w-3 h-3" />
                                  {s.phone ?? "No phone"}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-ocean-secondary/70">
                                  <Calendar className="w-3 h-3" />
                                  {s.created_at ? new Date(s.created_at).toLocaleDateString() : "—"}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-2 mt-4 pt-4 border-t border-ocean-primary/10">
                              <Button asChild size="sm" className="flex-1 ocean-gradient text-white">
                                <Link href={`/tutor/students/${s.id}`}>
                                  <Eye className="w-3 h-3 mr-1" />
                                  View
                                </Link>
                              </Button>
                              <Button asChild size="sm" variant="outline" className="flex-1 bg-white/80 backdrop-blur-sm border-ocean-primary/20 text-ocean-primary hover:bg-ocean-primary/5">
                                <Link href={`/tutor/students/${s.id}/edit`}>
                                  <Edit className="w-3 h-3 mr-1" />
                                  Edit
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
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
