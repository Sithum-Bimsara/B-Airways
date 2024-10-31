import { NextResponse } from 'next/server';
import { sendMail } from '../../utils/sendMail';

export async function POST(request: Request) {
  try {
    const { email, image } = await request.json();

    if (!email || !image) {
      return NextResponse.json(
        { message: 'Email and image are required.' },
        { status: 400 }
      );
    }

    // Decode base64 image
    const base64Data = image.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Send email with attachment
    await sendMail({
      email: process.env.SMTP_SERVER_USERNAME || 'no-reply@bairways.com',
      sendTo: email,
      subject: 'Your B Airways Ticket',
      text: 'Please find attached your boarding pass.',
      html: '<p>Please find attached your boarding pass.</p>',
      attachments: [
        {
          filename: 'boarding-pass.png',
          content: buffer,
          encoding: 'base64',
          contentType: 'image/png',
        },
      ],
    });

    return NextResponse.json({ message: 'Email sent successfully.' }, { status: 200 });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { message: 'Failed to send email.' },
      { status: 500 }
    );
  }
} 