import { NextResponse } from "next/server";
import { Resend } from "resend";
import { adminAuth } from "@/functions/firebase-admin";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateRandomPassword(length: number = 12): string {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, displayName } = body;

    if (!email || !displayName) {
      return NextResponse.json(
        { error: "Missing email or display name" },
        { status: 400 }
      );
    }

    // Generate a random password
    const password = generateRandomPassword(12);

    // Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName,
      emailVerified: false,
      disabled: false,
    });

    // Send welcome email via Resend
  await resend.emails.send({
      from: "NMD Association <no-reply@nanosatellitemissions.com>",
      to: email,
      subject: "Your NMD Account Has Been Created 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #0056b3;">Welcome, ${displayName}!</h2>
          <p>Your account has been successfully created. Here are your credentials:</p>
          <ul>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Password:</strong> ${password}</li>
          </ul>
          <p>Please change your password after logging in for security reasons.</p>
          <br/>
          <p>Best regards,<br/><strong>NMD Association Team</strong></p>
        </div>
      `,
    });

    // if (error) {
    //   console.error("Email send error:", error);
    //   return NextResponse.json(
    //     { error: "User created, but failed to send email." },
    //     { status: 500 }
    //   );
    // }

    return NextResponse.json({
      message: "User created successfully and email sent.",
      userId: userRecord.uid,
      password,
    });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
