import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const APP_URL = () => process.env.NEXT_PUBLIC_APP_URL || "https://www.joho-kyosha.com";

function emailLayout(preheader: string, content: string) {
  return `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px;">

        <!-- Header -->
        <tr><td style="background-color: #1e3a5f; padding: 24px 32px; border-radius: 8px 8px 0 0; text-align: center;">
          <a href="${APP_URL()}" style="text-decoration: none;">
            <span style="font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: 1px;">情報強者</span>
          </a>
          <p style="margin: 4px 0 0; font-size: 12px; color: #94a3b8;">怪しい情報商材・団体の口コミサイト</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding: 32px; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">
          ${content}
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding: 24px 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; text-align: center;">
          <p style="margin: 0 0 8px; font-size: 12px; color: #9ca3af;">
            このメールは <a href="${APP_URL()}" style="color: #6b7280; text-decoration: underline;">情報強者</a> から自動送信されています。
          </p>
          <p style="margin: 0; font-size: 12px; color: #9ca3af;">
            心当たりがない場合は、このメールを無視してください。
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${APP_URL()}/api/auth/verify?token=${token}`;

  const content = `
    <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #111827;">メールアドレスの確認</h2>
    <p style="margin: 0 0 8px; font-size: 15px; color: #374151; line-height: 1.6;">
      情報強者にご登録いただきありがとうございます。
    </p>
    <p style="margin: 0 0 24px; font-size: 15px; color: #374151; line-height: 1.6;">
      以下のボタンをクリックして、メールアドレスの確認を完了してください。
    </p>
    <div style="text-align: center; margin: 0 0 24px;">
      <a href="${verifyUrl}" style="display: inline-block; padding: 14px 32px; background-color: #1d4ed8; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 15px; font-weight: 600;">
        メールアドレスを確認する
      </a>
    </div>
    <p style="margin: 0 0 8px; font-size: 13px; color: #6b7280;">ボタンが機能しない場合は、以下のURLをブラウザに貼り付けてください：</p>
    <p style="margin: 0 0 16px; font-size: 12px; color: #9ca3af; word-break: break-all;">${verifyUrl}</p>
    <div style="border-top: 1px solid #e5e7eb; padding-top: 16px;">
      <p style="margin: 0; font-size: 13px; color: #6b7280;">このリンクは <strong>24時間</strong> 有効です。</p>
    </div>
  `;

  await resend.emails.send({
    from: "情報強者 <noreply@joho-kyosha.com>",
    to: email,
    subject: "【情報強者】メールアドレスの確認",
    html: emailLayout("情報強者へのご登録ありがとうございます。ボタンをクリックしてメールアドレスを確認してください。", content),
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${APP_URL()}/auth/reset-password?token=${token}`;

  const content = `
    <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #111827;">パスワードの再設定</h2>
    <p style="margin: 0 0 8px; font-size: 15px; color: #374151; line-height: 1.6;">
      パスワードの再設定リクエストを受け付けました。
    </p>
    <p style="margin: 0 0 24px; font-size: 15px; color: #374151; line-height: 1.6;">
      以下のボタンをクリックして、新しいパスワードを設定してください。
    </p>
    <div style="text-align: center; margin: 0 0 24px;">
      <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background-color: #1d4ed8; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 15px; font-weight: 600;">
        パスワードを再設定する
      </a>
    </div>
    <p style="margin: 0 0 8px; font-size: 13px; color: #6b7280;">ボタンが機能しない場合は、以下のURLをブラウザに貼り付けてください：</p>
    <p style="margin: 0 0 16px; font-size: 12px; color: #9ca3af; word-break: break-all;">${resetUrl}</p>
    <div style="border-top: 1px solid #e5e7eb; padding-top: 16px;">
      <p style="margin: 0; font-size: 13px; color: #6b7280;">このリンクは <strong>1時間</strong> 有効です。期限が切れた場合は再度リクエストしてください。</p>
    </div>
  `;

  await resend.emails.send({
    from: "情報強者 <noreply@joho-kyosha.com>",
    to: email,
    subject: "【情報強者】パスワードの再設定",
    html: emailLayout("パスワードの再設定リクエストを受け付けました。", content),
  });
}
