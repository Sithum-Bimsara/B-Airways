// import { NextResponse } from 'next/server';
// import { connection } from '../../database/db';

// export async function POST(request: Request) {
//   try {
//     const { flightId, bookings } = await request.json();

//     // Validate input
//     if (!flightId || !Array.isArray(bookings) || bookings.length === 0) {
//       return NextResponse.json(
//         { message: 'Invalid input data.' },
//         { status: 400 }
//       );
//     }

//     // Start transaction
//     await connection.beginTransaction();

//     try {
//       for (const booking of bookings) {
//         const { passengerId, seatId, price } = booking;

//         if (!passengerId || !seatId || !price) {
//           throw new Error('Missing booking information.');
//         }

//         // Call the CreateBooking stored procedure
//         await connection.execute(
//           'CALL CreateBooking(?, ?, ?, ?, ?)',
//           [flightId, null, passengerId, seatId, price]
//         );
//       }

//       // Commit transaction
//       await connection.commit();

//       return NextResponse.json(
//         { message: 'Bookings successfully created.' },
//         { status: 200 }
//       );
//     } catch (err: any) {
//       // Rollback transaction on error
//       await connection.rollback();
//       console.error('Error creating bookings:', err);
//       return NextResponse.json(
//         { message: err.message || 'Failed to create bookings.' },
//         { status: 500 }
//       );
//     }
//   } catch (error: any) {
//     console.error('API Error:', error);
//     return NextResponse.json(
//       { message: 'Internal Server Error.' },
//       { status: 500 }
//     );
//   }
// }