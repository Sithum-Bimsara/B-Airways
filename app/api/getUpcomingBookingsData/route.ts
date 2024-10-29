// import { NextRequest, NextResponse } from 'next/server';
// import { connection } from '../../database/db';
// import { verifyToken } from '../../lib/auth';

// export async function POST(request: NextRequest) {
//   try {
//     // Get the token from the request headers
//     const booking_type = request.nextUrl.searchParams.get('booking_type');
//     const cookie = request.headers.get('cookie');
//     if (!cookie) {
//       return NextResponse.json({ message: 'Not authenticated.' }, { status: 401 });
//     }

//     // Extract the token from the cookie
//     const token = cookie
//       .split(';')
//       .find(c => c.trim().startsWith('auth='))
//       ?.split('=')[1];

//     if (!token) {
//       return NextResponse.json({ message: 'Not authenticated.' }, { status: 401 });
//     }

//     // Verify the token and get the user ID
//     const decoded = verifyToken(token);
//     if (!decoded || !decoded.userId) {
//       return NextResponse.json({ message: 'Invalid token.' }, { status: 401 });
//     }

//     // Query to get all past bookings by the user
//     const [result] = await connection.query(
//       `SELECT 
//           b.Flight_ID, 
//           f.Departure_date AS Date,
//           a.Airport_name AS Destination_Airport_Name 
//        FROM booking b
//        JOIN flight f ON b.Flight_ID = f.Flight_ID
//        JOIN route r ON f.Route_ID = r.Route_ID
//        JOIN airport a ON r.Destination_airport_code = a.Airport_code
//        WHERE b.User_ID = ?
//        AND f.Departure_date >= CURDATE();`,
//       [decoded.userId]
//     );

//     // Type assertion to cast the result as any[]
//     const bookingsData = result as any[];

//     // Check if any bookings were found
//     if (bookingsData.length === 0) {
//       return NextResponse.json({ message: 'No bookings found.' }, { status: 404 });
//     }

//     // Return all bookings for the user
//     return NextResponse.json({
//       bookings: bookingsData.map(booking => ({
//         Flight_ID: booking.Flight_ID,
//         Date: booking.Date,
//         Destination_Airport_Name: booking.Destination_Airport_Name,
//       }))
//     });
//   } catch (error) {
//     console.error('Error fetching booking data:', error);
//     return NextResponse.json({ error: 'Internal Server Error.' }, { status: 500 });
//   }
// }
import { NextRequest, NextResponse } from 'next/server';
import { connection } from '../../database/db';
import { verifyToken } from '../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Get the token from the request headers
    const booking_type = request.nextUrl.searchParams.get('booking_type');
    const cookie = request.headers.get('cookie');
    if (!cookie) {
      return NextResponse.json({ message: 'Not authenticated.' }, { status: 401 });
    }

    // Extract the token from the cookie
    const token = cookie
      .split(';')
      .find(c => c.trim().startsWith('auth='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json({ message: 'Not authenticated.' }, { status: 401 });
    }

    // Verify the token and get the user ID
    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ message: 'Invalid token.' }, { status: 401 });
    }

    // Query to get all past bookings by the user
    const [result] = await connection.query(
      `SELECT 
          b.Flight_ID, 
          f.Departure_date AS Date,
          a.Airport_name AS Destination_Airport_Name 
       FROM booking b
       JOIN flight f ON b.Flight_ID = f.Flight_ID
       JOIN route r ON f.Route_ID = r.Route_ID
       JOIN airport a ON r.Destination_airport_code = a.Airport_code
       WHERE b.User_ID = ?
       AND f.Departure_date >= CURDATE();`,
      [decoded.userId]
    );

    // Type assertion to cast the result as any[]
    const bookingsData = result as any[];

    // Check if any bookings were found
    if (bookingsData.length === 0) {
      return NextResponse.json({ message: 'No bookings yet.' }, { status: 200 });
    }

    // Return all bookings for the user
    return NextResponse.json({
      bookings: bookingsData.map(booking => ({
        Flight_ID: booking.Flight_ID,
        Date: booking.Date,
        Destination_Airport_Name: booking.Destination_Airport_Name,
      }))
    });
  } catch (error) {
    console.error('Error fetching booking data:', error);
    return NextResponse.json({ error: 'Internal Server Error.' }, { status: 500 });
  }
}
