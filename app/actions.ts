"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendEmail = async (formData: FormData) => {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const subject = formData.get("subject") as string
  const message = formData.get("message") as string

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "krbala1511@gmail.com",
      subject: `New message from ${name}: ${subject}`,
      replyTo: email,
      html: `<h3>From: ${email}</h3><p>${message}</p>`,
    })
  } catch (error) {
    console.error(error)
    return {
      error: "Something went wrong. Please try again.",
    }
  }
}
