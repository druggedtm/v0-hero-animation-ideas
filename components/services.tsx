"use client"

import { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  Award,
  Wrench,
  Search,
  Droplets,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Ship,
  FileCheck,
  Settings,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

gsap.registerPlugin(ScrollTrigger)

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [openServices, setOpenServices] = useState<{ [key: number]: boolean }>({})

  useEffect(() => {
    if (!sectionRef.current) return

    const cards = sectionRef.current.querySelectorAll(".service-card")

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

  const toggleService = (index: number) => {
    setOpenServices((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const services = [
    {
      title: "Classification Assistance Services",
      description:
        "Helping ship owners comply with classification society requirements and statutory regulations to ensure seamless operations.",
      icon: <Award className="h-12 w-12 text-orange-500 group-hover:text-white transition-colors duration-300" />,
      details: [
        "Classification society compliance assistance",
        "Statutory regulation guidance",
        "Survey preparation and coordination",
        "Documentation review and preparation",
        "Certification process management",
        "Regulatory compliance audits",
      ],
      benefits: [
        "Ensure seamless vessel operations",
        "Avoid costly delays and penalties",
        "Maintain classification status",
        "Expert guidance through complex regulations",
      ],
    },
    {
      title: "Technical Advisory & Solutions",
      description: "Providing cost-effective technical and mechanical repair solutions for vessels globally.",
      icon: <Wrench className="h-12 w-12 text-orange-500 group-hover:text-white transition-colors duration-300" />,
      details: [
        "Technical troubleshooting and problem-solving",
        "Mechanical repair solutions",
        "Equipment optimization recommendations",
        "Maintenance planning and scheduling",
        "Spare parts procurement assistance",
        "Performance analysis and improvement",
      ],
      benefits: [
        "Cost-effective repair solutions",
        "Minimize vessel downtime",
        "Expert technical guidance",
        "Global support network",
      ],
    },
    {
      title: "Ship Surveys",
      description:
        "Conducting On-Hire/Off-Hire surveys, bunker surveys, cargo quantity surveys, and pre-purchase inspections.",
      icon: <Search className="h-12 w-12 text-orange-500 group-hover:text-white transition-colors duration-300" />,
      details: [
        "On-Hire/Off-Hire surveys",
        "Bunker quantity and quality surveys",
        "Cargo quantity surveys",
        "Pre-purchase inspections",
        "Condition surveys",
        "Draft surveys and cargo calculations",
      ],
      benefits: [
        "Accurate vessel condition assessment",
        "Risk mitigation for transactions",
        "Detailed survey reports",
        "Independent third-party verification",
      ],
    },
    {
      title: "Tank Cleaning & Hold Cleaning Services",
      description:
        "Offering bulk carrier cargo hold cleaning and oil tanker grade change services at major ports in UAE and Oman.",
      icon: <Droplets className="h-12 w-12 text-orange-500 group-hover:text-white transition-colors duration-300" />,
      details: [
        "Bulk carrier cargo hold cleaning",
        "Oil tanker grade change services",
        "Chemical tanker cleaning operations",
        "Tank inspection and certification",
        "Environmental compliance assurance",
        "Specialized cleaning procedures",
      ],
      benefits: [
        "Services at major UAE and Oman ports",
        "Compliance with international standards",
        "Quick turnaround times",
        "Experienced cleaning crews",
      ],
      locations: ["UAE Ports", "Oman Ports", "Fujairah", "Jebel Ali", "Sohar", "Salalah"],
    },
  ]

  return (
    <section id="services" className="py-24 bg-white dark:bg-black-950 relative overflow-hidden" ref={sectionRef}>
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-20 wave-bg opacity-10"></div>
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-orange-100 dark:bg-orange-900/20 blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-orange-100 dark:bg-orange-900/20 blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-2 bg-orange-50 dark:bg-orange-900/30 rounded-full mb-4">
            <Ship className="h-6 w-6 text-orange-500" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Maritime Services</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Comprehensive maritime solutions delivered by experienced Master Mariners and Chief Engineers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              className="service-card card-prominent dark:card-prominent-dark group transform transition-all duration-300 hover:-translate-y-2"
            >
              <Card className="border-none bg-transparent shadow-none">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex justify-center items-center w-16 h-16 rounded-full bg-orange-100 dark:bg-black-800 shadow-md">
                        {service.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                          {service.title}
                        </CardTitle>
                      </div>
                    </div>
                    <Collapsible open={openServices[index]} onOpenChange={() => toggleService(index)}>
                      <CollapsibleTrigger className="p-2 hover:bg-orange-100/50 dark:hover:bg-black-800/50 rounded-full transition-colors">
                        {openServices[index] ? (
                          <ChevronDown className="h-5 w-5 text-orange-500" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-orange-500" />
                        )}
                      </CollapsibleTrigger>
                    </Collapsible>
                  </div>
                  <CardDescription className="text-slate-600 dark:text-slate-400 mt-3">
                    {service.description}
                  </CardDescription>
                </CardHeader>

                <Collapsible open={openServices[index]}>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="space-y-6">
                        {/* Service Details */}
                        <div>
                          <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center">
                            <Settings className="h-4 w-4 mr-2 text-orange-500" />
                            Service Details
                          </h4>
                          <div className="grid md:grid-cols-2 gap-2">
                            {service.details.map((detail, detailIndex) => (
                              <div key={detailIndex} className="flex items-start">
                                <CheckCircle className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-slate-600 dark:text-slate-400">{detail}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Benefits */}
                        <div>
                          <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center">
                            <FileCheck className="h-4 w-4 mr-2 text-orange-500" />
                            Key Benefits
                          </h4>
                          <div className="grid md:grid-cols-2 gap-2">
                            {service.benefits.map((benefit, benefitIndex) => (
                              <div key={benefitIndex} className="flex items-start">
                                <ChevronRight className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-slate-600 dark:text-slate-400">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Locations (if applicable) */}
                        {service.locations && (
                          <div>
                            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">Service Locations</h4>
                            <div className="flex flex-wrap gap-2">
                              {service.locations.map((location, locationIndex) => (
                                <span
                                  key={locationIndex}
                                  className="px-3 py-1 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium"
                                >
                                  {location}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* CTA Button */}
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                          <button className="w-full btn-orange">Request Service Quote</button>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            </div>
          ))}
        </div>

        {/* Service Process */}
        <div className="mt-20 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-black-900 dark:to-black-800 rounded-2xl p-8 md:p-12 border-l-8 border-orange-500">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Our Service Process</h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Streamlined approach ensuring efficient delivery of maritime services
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Initial Consultation", desc: "Discuss your specific requirements" },
              { step: "2", title: "Service Planning", desc: "Develop customized solution approach" },
              { step: "3", title: "Execution", desc: "Deliver services with expert precision" },
              { step: "4", title: "Follow-up", desc: "Ensure satisfaction and ongoing support" },
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4 shadow-lg">
                  {process.step}
                </div>
                <h4 className="font-semibold mb-2">{process.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">{process.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
