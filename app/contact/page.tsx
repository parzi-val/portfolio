import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Github, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-gray-200 font-jetbrains">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Navigation currentPath="/contact" />

        <div className="mt-6">
          <h1 className="text-2xl font-bold text-violet-400 mb-6">Contact</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-[#1a1a1a] p-6 rounded">
              <h2 className="text-lg font-bold mb-6 border-b border-gray-800 pb-2">Get in touch</h2>

              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      className="bg-[#252525] border-gray-700 focus:border-violet-500 text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      className="bg-[#252525] border-gray-700 focus:border-violet-500 text-gray-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    placeholder="What is this regarding?"
                    className="bg-[#252525] border-gray-700 focus:border-violet-500 text-gray-200"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Your message..."
                    rows={6}
                    className="bg-[#252525] border-gray-700 focus:border-violet-500 text-gray-200 resize-none"
                  />
                </div>

                <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white">Send Message</Button>

                <p className="text-xs text-gray-400 text-center mt-4">
                  I'll get back to you as soon as possible. Usually within 24-48 hours.
                </p>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-[#1a1a1a] p-6 rounded">
                <h2 className="text-lg font-bold mb-6 border-b border-gray-800 pb-2">Contact Info</h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#252525] flex items-center justify-center text-violet-400 flex-shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-gray-400 mt-1">krbala1511@gmail.com</p>
                    </div>
                  </div>


                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#252525] flex items-center justify-center text-violet-400 flex-shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Location</h3>
                      <p className="text-gray-400 mt-1">VIT Vellore</p>
                      <p className="text-gray-400">Tamil Nadu, India</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#1a1a1a] p-6 rounded">
                <h2 className="text-lg font-bold mb-6 border-b border-gray-800 pb-2">Social Profiles</h2>

                <div className="grid grid-cols-2 gap-4">
                  <a
                    href="https://github.com/parzi-val"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:bg-[#252525] p-2 -mx-2 rounded transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#252525] flex items-center justify-center text-violet-400">
                      <Github className="w-5 h-5" />
                    </div>
                    <div className="font-medium">GitHub</div>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/balasubramanian-kr-7424a5222/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:bg-[#252525] p-2 -mx-2 rounded transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#252525] flex items-center justify-center text-violet-400">
                      <Linkedin className="w-5 h-5" />
                    </div>
                    <div className="font-medium">LinkedIn</div>
                  </a>

                  <a
                    href="https://x.com/_balalalala_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:bg-[#252525] p-2 -mx-2 rounded transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#252525] flex items-center justify-center text-violet-400">
                      <Twitter className="w-5 h-5" />
                    </div>
                    <div className="font-medium">Twitter</div>
                  </a>

                  <a
                    href="mailto:krbala1511@gmail.com"
                    className="flex items-center gap-3 hover:bg-[#252525] p-2 -mx-2 rounded transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#252525] flex items-center justify-center text-violet-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="font-medium">Email</div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

