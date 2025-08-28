"use client";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Instagram, Github, Linkedin, Mail, Phone, MapPin, Clock, MessageCircle, Sparkles, Waves, Send, Heart, Star, Award, Globe, Users, Shield, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const socialLinks = [
    { 
      name: "Instagram", 
      icon: Instagram, 
      url: "https://www.instagram.com/abdullahh_rajpoot/",
      color: "from-pink-500 to-purple-500",
      bgColor: "from-pink-500/20 to-purple-500/20"
    },
    { 
      name: "GitHub", 
      icon: Github, 
      url: "https://github.com/abdullahhrajpoot",
      color: "from-gray-700 to-gray-900",
      bgColor: "from-gray-700/20 to-gray-900/20"
    },
    { 
      name: "LinkedIn", 
      icon: Linkedin, 
      url: "https://www.linkedin.com/in/abdullah-hassan-66a043299?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      color: "from-blue-600 to-blue-800",
      bgColor: "from-blue-600/20 to-blue-800/20"
    },
  ];

  const contactMethods = [
    {
      title: "Phone",
      value: "+92 3371482621",
      icon: Phone,
      color: "text-green-600",
      bgColor: "bg-green-500/10",
      description: "Call us anytime"
    },
    {
      title: "Email",
      value: "abdullah.hassan07@gmail.com",
      icon: Mail,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      description: "Send us a message"
    },
    {
      title: "Location",
      value: "Pakistan",
      icon: MapPin,
      color: "text-red-600",
      bgColor: "bg-red-500/10",
      description: "Based in Pakistan"
    },
    {
      title: "Support",
      value: "24/7 Available",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
      description: "Round the clock support"
    },
  ];

  const features = [
    {
      title: "Quick Response",
      description: "We typically respond within 2-4 hours during business hours.",
      icon: MessageCircle,
      color: "text-blue-600"
    },
    {
      title: "Expert Support",
      description: "Our team of education experts is here to help you succeed.",
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Secure Communication",
      description: "All communications are encrypted and secure for your privacy.",
      icon: Shield,
      color: "text-purple-600"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <Navbar/>
      <div className="min-h-screen ocean-gradient-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Hero Section */}
            <motion.div
              variants={itemVariants}
              className="text-center mb-16 mt-20"
            >
              {/* <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-4 bg-gradient-to-r from-ocean-primary/20 to-ocean-secondary/20 rounded-2xl">
                  <MessageCircle className="w-12 h-12 text-ocean-primary" />
                </div>
                <div className="p-2 bg-ocean-accent/10 rounded-lg">
                  <Sparkles className="w-6 h-6 text-ocean-accent" />
                </div>
              </div> */}
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-500 to-cyan-500 bg-clip-text text-transparent">
                Contact <span className="text-ocean-accent">Learnify</span>
              </h1>
              <p className="text-xl md:text-2xl text-ocean-secondary/80 mb-8 max-w-4xl mx-auto leading-relaxed">
                Have questions, feedback, or just want to say hi? Reach out to us through any of the channels below! 
                We're here to help you succeed in your educational journey.
              </p>
              <div className="flex items-center justify-center gap-2">
                <Badge className="bg-ocean-primary/10 text-ocean-primary border-ocean-primary/20 px-4 py-2 text-base">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Quick Response
                </Badge>
                <Badge className="bg-ocean-accent/10 text-ocean-accent border-ocean-accent/20 px-4 py-2 text-base">
                  <Award className="w-4 h-4 mr-2" />
                  Expert Support
                </Badge>
              </div>
            </motion.div>

            {/* Contact Methods */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            >
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <motion.div
                    key={method.title}
                    whileHover={{ scale: 1.05, y: -5 }}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Card className="ocean-gradient-card shadow-lg border-0 overflow-hidden relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-ocean-primary/10 to-ocean-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <CardContent className="p-6 relative z-10 text-center">
                        <div className={`p-3 ${method.bgColor} rounded-xl w-fit mx-auto mb-4`}>
                          <Icon className={`w-8 h-8 ${method.color}`} />
                        </div>
                        <h3 className="text-lg font-bold text-ocean-primary mb-2">{method.title}</h3>
                        <p className="text-ocean-secondary/70 text-sm mb-1">{method.description}</p>
                        <p className="font-medium text-ocean-primary">{method.value}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Features Section */}
            <motion.div
              variants={itemVariants}
              className="mb-16"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-ocean-primary mb-4">
                  Why Contact Us?
                </h2>
                <p className="text-xl text-ocean-secondary/70 max-w-3xl mx-auto">
                  Experience exceptional support and guidance from our dedicated team
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={feature.title}
                      whileHover={{ scale: 1.02, x: 5 }}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <Card className="ocean-gradient-card shadow-lg border-0 overflow-hidden">
                        <CardContent className="p-8">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 ${feature.color.replace('text-', 'bg-').replace('-600', '-500/10')} rounded-xl`}>
                              <Icon className={`w-8 h-8 ${feature.color}`} />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-ocean-primary mb-3">{feature.title}</h3>
                              <p className="text-ocean-secondary/70 leading-relaxed">{feature.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Social Links Section */}
            <motion.div
              variants={itemVariants}
              className="mb-16"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-ocean-primary mb-4">
                  Connect With Us
                </h2>
                <p className="text-xl text-ocean-secondary/70 max-w-3xl mx-auto">
                  Follow us on social media for updates, tips, and educational content
                </p>
              </div>
              <div className="flex justify-center gap-8">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2, rotate: 10, y: -10 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="group"
                    >
                      <Card className="ocean-gradient-card shadow-lg border-0 overflow-hidden relative">
                        <div className={`absolute inset-0 bg-gradient-to-r ${social.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                        <CardContent className="p-8 relative z-10 text-center">
                          <div className={`p-4 bg-gradient-to-r ${social.color} rounded-2xl w-fit mx-auto mb-4`}>
                            <Icon className="w-10 h-10 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-ocean-primary">{social.name}</h3>
                          <p className="text-ocean-secondary/70 text-sm">Follow us on {social.name}</p>
                        </CardContent>
                      </Card>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Contact Form Section */}
            <motion.div
              variants={itemVariants}
              className="mb-16"
            >
              <Card className="ocean-gradient-card shadow-lg border-0 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-ocean-primary/5 to-ocean-secondary/5"></div>
                <CardContent className="p-12 relative z-10">
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <Send className="w-8 h-8 text-ocean-primary" />
                      <h2 className="text-3xl md:text-4xl font-bold text-ocean-primary">Send us a Message</h2>
                    </div>
                    <p className="text-xl text-ocean-secondary/70 max-w-2xl mx-auto">
                      Have a specific question or need personalized assistance? Fill out the form below and we'll get back to you as soon as possible.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <label className="text-ocean-primary font-medium">Name</label>
                      <input 
                        type="text" 
                        placeholder="Your full name"
                        className="w-full p-4 border border-ocean-primary/20 rounded-lg bg-white/80 backdrop-blur-sm text-ocean-primary focus:border-ocean-primary focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-ocean-primary font-medium">Email</label>
                      <input 
                        type="email" 
                        placeholder="your.email@example.com"
                        className="w-full p-4 border border-ocean-primary/20 rounded-lg bg-white/80 backdrop-blur-sm text-ocean-primary focus:border-ocean-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <label className="text-ocean-primary font-medium">Subject</label>
                    <input 
                      type="text" 
                      placeholder="What's this about?"
                      className="w-full p-4 border border-ocean-primary/20 rounded-lg bg-white/80 backdrop-blur-sm text-ocean-primary focus:border-ocean-primary focus:outline-none"
                    />
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <label className="text-ocean-primary font-medium">Message</label>
                    <textarea 
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      className="w-full p-4 border border-ocean-primary/20 rounded-lg bg-white/80 backdrop-blur-sm text-ocean-primary focus:border-ocean-primary focus:outline-none resize-none"
                    ></textarea>
                  </div>
                  
                  <div className="text-center">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button className="ocean-gradient text-white shadow-lg hover:shadow-xl h-12 px-8 text-lg">
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Footer Message */}
            <motion.div
              variants={itemVariants}
              className="text-center"
            >
              <Card className="ocean-gradient-card shadow-lg border-0 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-ocean-accent/5 to-ocean-secondary/5"></div>
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Heart className="w-6 h-6 text-red-500" />
                    <Star className="w-6 h-6 text-ocean-accent" />
                    <Globe className="w-6 h-6 text-ocean-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-ocean-primary mb-4">
                    We're Here to Help!
                  </h3>
                  <p className="text-ocean-secondary/70 text-lg max-w-3xl mx-auto leading-relaxed">
                    Whether you're a student looking for guidance, a tutor seeking support, a guardian with questions, 
                    or an administrator needing assistance, our team is dedicated to helping you succeed. 
                    Don't hesitate to reach out — we're just a message away!
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
