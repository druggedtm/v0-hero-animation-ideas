"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Linkedin, Mail, Ship, Users, Calculator } from "lucide-react"
import Image from "next/image"

gsap.registerPlugin(ScrollTrigger)

export default function Team() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const cards = sectionRef.current.querySelectorAll(".team-card")

    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: index * 0.1,
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
            toggleActions: "play none none none",
          },
        },
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  const teamMembers = [
    {
      name: "Pulak Das",
      role: "Founder",
      bio: "With extensive offshore experience in LPG carriers and oil tankers, Pulak has successfully managed vessel operations for ship owners and shipping agencies.",
      image: "/placeholder.svg?height=400&width=400",
      icon: <Ship className="h-6 w-6 text-orange-500" />,
      expertise: ["LPG Carriers", "Oil Tankers", "Vessel Operations", "Shipping Agency Management"],
    },
    {
      name: "Amit Kumar Nandi",
      role: "Technical Head",
      bio: "A seasoned maritime professional with vast expertise across LPG carriers, oil tankers, bulk carriers, chemical tankers, and container vessels.",
      image: "/placeholder.svg?height=400&width=400",
      icon: <Ship className="h-6 w-6 text-orange-500" />,
      expertise: ["LPG Carriers", "Oil Tankers", "Bulk Carriers", "Chemical Tankers", "Container Vessels"],
    },
    {
      name: "Ms. Von Yorett",
      role: "HR Manager",
      bio: "With over seven years of experience in the shipping industry, she ensures smooth personnel management and operational alignment.",
      image: "/placeholder.svg?height=400&width=400",
      icon: <Users className="h-6 w-6 text-orange-500" />,
      expertise: ["Personnel Management", "Operational Alignment", "Shipping Industry HR", "Team Development"],
    },
    {
      name: "Mrs. Akhila L.",
      role: "Finance Manager",
      bio: "With more than five years of financial expertise, she efficiently manages budgeting, financial planning, and risk analysis for the company.",
      image: "/placeholder.svg?height=400&width=400",
      icon: <Calculator className="h-6 w-6 text-orange-500" />,
      expertise: ["Financial Planning", "Budgeting", "Risk Analysis", "Maritime Finance"],
    },
  ]

  return (
    <section id="team" className="py-24 bg-slate-50 dark:bg-black-900 relative overflow-hidden" ref={sectionRef}>
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-20 wave-bg opacity-10"></div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-2 bg-orange-50 dark:bg-orange-900/30 rounded-full mb-4">
            <Users className="h-6 w-6 text-orange-500" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Expert Team</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Meet our team of maritime professionals bringing decades of industry experience and expertise to every
            project
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <Card
              key={index}
              className="team-card border-none shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300 border-l-4 border-orange-500 hover:border-l-8"
            >
              {/* Header with role indicator */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="bg-white/20 p-2 rounded-full">{member.icon}</div>
                    <span className="text-white font-medium">{member.role}</span>
                  </div>
                  <div className="flex space-x-2">
                    <a
                      href="#"
                      className="text-white hover:text-orange-200 transition-colors p-2"
                      aria-label={`${member.name}'s LinkedIn profile`}
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                    <a
                      href="#"
                      className="text-white hover:text-orange-200 transition-colors p-2"
                      aria-label={`Email ${member.name}`}
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row">
                {/* Photo */}
                <div className="relative md:w-1/3 h-64 md:h-auto overflow-hidden">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black-900/40 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="md:w-2/3 p-6">
                  <CardHeader className="p-0 pb-4">
                    <CardTitle className="text-xl group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                      {member.name}
                    </CardTitle>
                    <CardDescription className="text-orange-600 dark:text-orange-400 font-medium text-base">
                      {member.role}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-0">
                    <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm leading-relaxed">{member.bio}</p>

                    {/* Expertise Tags */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300">Expertise:</h4>
                      <div className="flex flex-wrap gap-2">
                        {member.expertise.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-2 py-1 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Team Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center bg-white dark:bg-black-800 p-8 rounded-xl shadow-lg border-t-4 border-orange-500">
            <div className="text-4xl font-bold text-orange-500 mb-2">20+</div>
            <div className="text-slate-600 dark:text-slate-400">Years Combined Experience</div>
          </div>
          <div className="text-center bg-white dark:bg-black-800 p-8 rounded-xl shadow-lg border-t-4 border-orange-500">
            <div className="text-4xl font-bold text-orange-500 mb-2">500+</div>
            <div className="text-slate-600 dark:text-slate-400">Successful Projects</div>
          </div>
          <div className="text-center bg-white dark:bg-black-800 p-8 rounded-xl shadow-lg border-t-4 border-orange-500">
            <div className="text-4xl font-bold text-orange-500 mb-2">100%</div>
            <div className="text-slate-600 dark:text-slate-400">Client Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  )
}
