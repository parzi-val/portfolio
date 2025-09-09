import Link from "next/link"
import { Github, Linkedin, Twitter, Mail } from "lucide-react"

export function SocialSection() {
  const socialLinks = [
    {
      name: "GitHub",
      username: "parzi-val",
      icon: <Github className="w-5 h-5" />,
      url: "https://github.com/parzi-val",
    },
    {
      name: "LinkedIn",
      username: "Balasubramanian KR",
      icon: <Linkedin className="w-5 h-5" />,
      url: "https://www.linkedin.com/in/balasubramaniankr/",
    },
    {
      name: "Twitter",
      username: "@parzeival",
      icon: <Twitter className="w-5 h-5" />,
      url: "https://x.com/parzeival",
    },
    {
      name: "Email",
      username: "krbala1511@gmail.com",
      icon: <Mail className="w-5 h-5" />,
      url: "mailto:krbala1511@gmail.com",
    },
  ]

  return (
    <div className="bg-[#1a1a1a] p-4 rounded">
      <h2 className="text-lg font-bold mb-4">Connect</h2>

      <div className="grid grid-cols-1 gap-3">
        {socialLinks.map((social, i) => (
          <Link
            key={i}
            href={social.url}
            className="flex items-center gap-3 hover:bg-[#252525] p-2 -mx-2 rounded transition-colors icon-tilt"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="w-10 h-10 rounded-full bg-[#252525] flex items-center justify-center text-violet-400 icon">
              {social.icon}
            </div>
            <div>
              <div className="font-medium">{social.name}</div>
              <div className="text-sm text-gray-400">{social.username}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

