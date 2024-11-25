DELIMITER //

CREATE EVENT delete_pending_bookings
ON SCHEDULE EVERY 15 MINUTE
DO
BEGIN
    DELETE FROM Booking 
    WHERE status = 'pending' 
    AND TIMESTAMPDIFF(MINUTE, Issue_date, NOW()) > 1;
END //

DELIMITER ;
