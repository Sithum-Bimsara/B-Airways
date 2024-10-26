import React from 'react';

const SeatSelection = ({ seatInfo }) => {
  const renderCabin = (cabinType, seatCapacity, seatsPerRow, startRow) => {
    const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const rows = Math.ceil(seatCapacity / seatsPerRow);
    const bookedSeats = seatInfo[1];

    let seatRows = [];
    for (let row = startRow; row < startRow + rows; row++) {
      let seatRow = [];
      let colGroups = [];

      if (seatsPerRow === 6) {
        colGroups = [columns.slice(0, 2), columns.slice(2, 4), columns.slice(4, 6)];
      } else if (seatsPerRow === 10) {
        colGroups = [columns.slice(0, 3), columns.slice(3, 7), columns.slice(7, 10)];
      } else {
        colGroups = [columns.slice(0, seatsPerRow / 2), columns.slice(seatsPerRow / 2, seatsPerRow)];
      }

      colGroups.forEach((colGroup, groupIndex) => {
        colGroup.forEach(column => {
          const seatId = `${row}${column}`;
          const isBooked = bookedSeats.some(seat => seat.seat_id === seatId);
          seatRow.push(
            <div key={seatId} className="seat one">
              <label className="label" htmlFor={`seat-${seatId}`}>
                <input
                  id={`seat-${seatId}`}
                  type={isBooked ? "radio" : "checkbox"}
                  className="seat-check visuallyhidden"
                  name="seat-assignment"
                  value=""
                  data-seat={seatId}
                  disabled="disabled"
                />
                <span className="seat-label">{column}</span>
              </label>
            </div>
          );
        });
        if (groupIndex < colGroups.length - 1) {
          seatRow.push(
            <div key={`aisle-${row}-${groupIndex}`} className="aisle">
              <span className="aisle-number">{row}</span>
            </div>
          );
        }
      });

      seatRows.push(<div key={`row-${row}`} className="seat-row">{seatRow}</div>);
    }

    return (
      <div className="cabin">
        {seatRows}
      </div>
    );
  };

  const platinumCapacity = seatInfo[0].platinum_seat_capacity;
  const platinumSeatsPerRow = seatInfo[0].platinum_seats_per_row;
  const businessCapacity = seatInfo[0].business_seat_capacity;
  const businessSeatsPerRow = seatInfo[0].business_seats_per_row;
  const economyCapacity = seatInfo[0].economy_seat_capacity;
  const economySeatsPerRow = seatInfo[0].economy_seats_per_row;

  let currentRow = 1;

  return (
    <div className="plane">
      <h4>Platinum</h4>
      {renderCabin("Platinum", platinumCapacity, platinumSeatsPerRow, currentRow)}
      
      <h4>Business</h4>
      {renderCabin("Business", businessCapacity, businessSeatsPerRow, currentRow += Math.ceil(platinumCapacity / platinumSeatsPerRow))}
      
      <h4>Economy</h4>
      {renderCabin("Economy", economyCapacity, economySeatsPerRow, currentRow += Math.ceil(businessCapacity / businessSeatsPerRow))}
      
      <h4>Economy - Lower</h4>
      {renderCabin("Economy-Lower", economyCapacity, economySeatsPerRow, currentRow += 8)}
    </div>
  );
};

export default SeatSelection;