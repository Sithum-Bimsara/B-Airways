import { sendMail } from '../../utils/sendMail';

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    // Email content
    const subject = `New Contact Form Submission from ${name}`;
    const text = `
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `;
    const html = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    await sendMail({
      email: email,
      sendTo: 'akinduhiman2@gmail.com',
      subject: subject,
      text: text,
      html: html
    });

    return Response.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Contact form error:', error);
    return Response.json(
      { message: 'Failed to send email' },
      { status: 500 }
    );
  }
} 