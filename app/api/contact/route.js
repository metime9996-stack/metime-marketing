export const runtime = 'nodejs';

const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));

export async function POST(req) {
  try {
    const form = await req.formData();
    const firstName = form.get('firstName');
    const lastName = form.get('lastName');
    const phone = form.get('phone');

    if (!firstName || !lastName || !phone) {
      return Response.json({ error: 'Please fill name and phone.' }, { status: 400 });
    }

    const html = `
      <h2>New client request</h2>
      <p><b>Name:</b> ${esc(firstName)} ${esc(lastName)}</p>
      <p><b>Phone:</b> ${esc(form.get('countryCode'))} ${esc(phone)} (${esc(form.get('country'))})</p>
      <p><b>Email:</b> ${esc(form.get('email') || '-')}</p>
      <p><b>Service:</b> ${esc(form.get('projectType') || '-')}</p>
      <p><b>Message:</b><br>${esc(form.get('message') || '-').replace(/\n/g, '<br>')}</p>
    `;

    const payload = {
      from: 'Website <onboarding@resend.dev>',
      to: [process.env.CONTACT_TO_EMAIL],
      subject: `New request from ${firstName} ${lastName}`,
      html,
    };

    const file = form.get('file');
    if (file && typeof file === 'object' && file.size > 0) {
      if (file.size > 4 * 1024 * 1024) {
        return Response.json({ error: 'File is too big (max 4 MB).' }, { status: 400 });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      payload.attachments = [{ filename: file.name, content: buffer.toString('base64') }];
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return Response.json({ error: 'Could not send. Please try again.' }, { status: 500 });
    }
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}