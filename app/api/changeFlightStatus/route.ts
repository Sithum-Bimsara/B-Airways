import { NextResponse } from 'next/server';
import { connection } from '../../database/db';
import { sendMail } from '../../utils/sendMail';

export async function POST(request: Request) {
  try {
    const { Flight_ID, newStatus } = await request.json();

    // Validate required fields
    if (!Flight_ID || !newStatus) {
      return NextResponse.json(
        { message: 'Flight_ID and newStatus are required.' },
        { status: 400 }
      );
    }

    // Validate newStatus
    const validStatuses = ['Scheduled', 'Delayed', 'Cancelled'];
    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json(
        { message: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}.` },
        { status: 400 }
      );
    }

    // Check if the flight exists
    const [flightExists] = await connection.query(
      'SELECT * FROM Flight WHERE Flight_ID = ?',
      [Flight_ID]
    );

    if ((flightExists as any[]).length === 0) {
      return NextResponse.json({ message: 'Flight not found.' }, { status: 404 });
    }

    // Update the flight status
    await connection.query(
      'UPDATE Flight SET Status = ? WHERE Flight_ID = ?',
      [newStatus, Flight_ID]
    );

    // Fetch all users who have booked this flight
    const [bookedUsers] = await connection.query(
      `
      SELECT DISTINCT u.Email, u.First_name, u.Last_name 
      FROM booking b
      JOIN User u ON b.User_ID = u.User_ID
      WHERE b.Flight_ID = ?
      `,
      [Flight_ID]
    );

    // Prepare the email content with more personalization and details
    const getStatusMessage = (status: string) => {
      switch(status) {
        case 'Delayed':
          return 'has been delayed. We apologize for any inconvenience this may cause.';
        case 'Cancelled':
          return 'has been cancelled. We sincerely apologize for this disruption to your travel plans.';
        default:
          return 'is now scheduled to operate as planned.';
      }
    };

    const flightStatusMessage = (firstName: string) => `
      Dear ${firstName},

      Important Update Regarding Your B Airways Flight

      We would like to inform you that your flight (Flight ID: ${Flight_ID}) ${getStatusMessage(newStatus)}

      ${newStatus === 'Cancelled' ? 
        'Please contact our customer service team for assistance with rebooking or refund options.' :
        'Please check your booking details in your B Airways account for the most up-to-date information.'}

      If you have any questions or concerns, please don't hesitate to reach out to our customer service team.

      Thank you for choosing B Airways. We value your trust in us.

      Best regards,
      B Airways Customer Service Team
      
      Note: This is an automated message. Please do not reply to this email.
    `;

    // Send emails to all users
    const emailPromises = (bookedUsers as { Email: string, First_name: string }[]).map(user =>
      sendMail({
        email: process.env.SMTP_SERVER_USERNAME || '', // Sender address from environment variable
        sendTo: user.Email,          // Recipient email
        subject: `Important: Flight Status Update for B Airways Flight ${Flight_ID}`,
        text: flightStatusMessage(user.First_name),
      })
    );

    await Promise.all(emailPromises);

    return NextResponse.json(
      { message: 'Flight status updated successfully and notifications sent.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating flight status:', error);
    return NextResponse.json(
      { message: 'Error updating flight status.' },
      { status: 500 }
    );
  }
}