-- Create view for member discount
CREATE VIEW MemberDiscountView AS
SELECT 
    u.User_ID,
    m.Membership_Type,
    l.Discount
FROM user u
JOIN member_detail m ON u.User_ID = m.User_ID
JOIN loyalty_detail l ON l.Membership_Type = m.Membership_Type;


-- Create view for flight details with passenger counts
CREATE VIEW FlightDetailsView AS
SELECT 
    f.Flight_ID,
    f.Status,
    f.Departure_date,
    a1.Airport_code AS Origin_airport_code,
    a2.Airport_code AS Destination_airport_code,
    a1.Airport_name AS OriginAirportName,
    a2.Airport_name AS DestinationAirportName,
    COUNT(DISTINCT p.Passenger_ID) AS PassengerCount
FROM flight f
JOIN route r ON f.Route_ID = r.Route_ID
JOIN airport a1 ON r.Origin_airport_code = a1.Airport_code
JOIN airport a2 ON r.Destination_airport_code = a2.Airport_code
LEFT JOIN booking b ON f.Flight_ID = b.Flight_ID
LEFT JOIN passenger p ON b.Passenger_ID = p.Passenger_ID
GROUP BY 
    f.Flight_ID, f.Status, f.Departure_date, 
    a1.Airport_code, a2.Airport_code,
    a1.Airport_name, a2.Airport_name;

-- Create view for revenue by aircraft model
CREATE VIEW AircraftModelRevenueView AS
SELECT 
    am.Airplane_model_ID,
    am.Model_name,
    SUM(b.Price) as TotalRevenue
FROM booking b
JOIN flight f ON f.Flight_ID = b.Flight_ID    
JOIN airplane a ON a.Airplane_ID = f.Airplane_ID
JOIN airplane_model am ON am.Airplane_model_ID = a.Airplane_model_ID
GROUP BY am.Airplane_model_ID, am.Model_name;