const ConfirmationModal = ({ isOpen, onClose, onConfirm, bookingDetails }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Cancel Booking Confirmation</h2>
        <div className="booking-details">
          <p><strong>Booking ID:</strong> {bookingDetails.Booking_ID}</p>
          <p><strong>Passenger:</strong> {bookingDetails.Passenger_Name}</p>
          <p><strong>Flight Date:</strong> {new Date(bookingDetails.Date).toLocaleDateString()}</p>
        </div>
        <p className="confirmation-message">Are you sure you want to cancel this booking?</p>
        <div className="modal-buttons">
          <button className="confirm-button" onClick={onConfirm}>
            Yes, Cancel Booking
          </button>
          <button className="cancel-button" onClick={onClose}>
            No, Keep Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal; 