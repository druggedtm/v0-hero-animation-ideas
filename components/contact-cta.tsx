"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Mail, Phone, MapPin } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

export default function ContactCTA() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const elements = sectionRef.current.querySelectorAll(".animate-on-scroll")

    elements.forEach((element, index) => {
      gsap.fromTo(
        element,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: index * 0.1,
          scrollTrigger: {
            trigger: element,
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

  return (
    <section id="contact" className="py-24 bg-white dark:bg-black-950 relative overflow-hidden" ref={sectionRef}>
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-20 wave-bg opacity-10"></div>
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-orange-100 dark:bg-orange-900/20 blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-orange-100 dark:bg-orange-900/20 blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Contact Information */}
          <div className="animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Get in Touch</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              We're here to answer your questions and discuss your maritime needs. Contact us today to learn more about
              our services.
            </p>

            <div className="space-y-6">
              <div className="flex items-start card-prominent dark:card-prominent-dark p-4">
                <Mail className="h-6 w-6 mr-4 text-orange-500" />
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">Email</h4>
                  <p className="text-slate-600 dark:text-slate-400">contact@oceanic-advisors.com</p>
                </div>
              </div>

              <div className="flex items-start card-prominent dark:card-prominent-dark p-4">
                <Phone className="h-6 w-6 mr-4 text-orange-500" />
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">Phone</h4>
                  <p className="text-slate-600 dark:text-slate-400">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start card-prominent dark:card-prominent-dark p-4">
                <MapPin className="h-6 w-6 mr-4 text-orange-500" />
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">Address</h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    123 Harbor Avenue, Suite 400
                    <br />
                    Port City, PC 12345
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form (Placeholder) */}
          <div className="animate-on-scroll">
            <div className="bg-white dark:bg-black-800 rounded-2xl shadow-xl p-8 border-l-8 border-orange-500">
              <h3 className="text-xl font-semibold mb-4">Send us a message</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">We'll get back to you as soon as possible.</p>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-black-900"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-black-900"
                    placeholder="Your email"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-black-900"
                    placeholder="Your message"
                  ></textarea>
                </div>

                <button className="btn-orange w-full">Send Message</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
