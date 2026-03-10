import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${token}`;

  await resend.emails.send({
    from: "情報強者 <onboarding@resend.dev>",
    to: email,
    subject: "【情報強者】メールアドレスの確認",
    html: `
      <div style="display:none;max-height:0;overflow:hidden;">情報強者へのご登録ありがとうございます。ボタンをクリックしてメールアドレスを確認してください。</div>
      <div style="max-width: 480px; margin: 0 auto; font-family: sans-serif;">
        <h2 style="color: #1e40af;">メールアドレスの確認</h2>
        <p>情報強者にご登録いただきありがとうございます。</p>
        <p>以下のボタンをクリックして、メールアドレスを確認してください。</p>
        <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #1d4ed8; color: #ffffff; text-decoration: none; border-radius: 6px; margin: 16px 0;">
          メールアドレスを確認する
        </a>
        <p style="color: #6b7280; font-size: 14px;">このリンクは24時間有効です。</p>
        <p style="color: #6b7280; font-size: 14px;">心当たりがない場合は、このメールを無視してください。</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;

  await resend.emails.send({
    from: "情報強者 <onboarding@resend.dev>",
    to: email,
    subject: "【情報強者】パスワードの再設定",
    html: `
      <div style="display:none;max-height:0;overflow:hidden;">パスワードの再設定リクエストを受け付けました。</div>
      <div style="max-width: 480px; margin: 0 auto; font-family: sans-serif;">
        <h2 style="color: #1e40af;">パスワードの再設定</h2>
        <p>パスワードの再設定リクエストを受け付けました。</p>
        <p>以下のボタンをクリックして、新しいパスワードを設定してください。</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #1d4ed8; color: #ffffff; text-decoration: none; border-radius: 6px; margin: 16px 0;">
          パスワードを再設定する
        </a>
        <p style="color: #6b7280; font-size: 14px;">このリンクは1時間有効です。</p>
        <p style="color: #6b7280; font-size: 14px;">心当たりがない場合は、このメールを無視してください。パスワードは変更されません。</p>
      </div>
    `,
  });
}
