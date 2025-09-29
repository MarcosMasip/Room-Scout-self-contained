import React, { useEffect, useState } from "react";
import "./PropertyRoomBooking.css";
import { useLocation } from "react-router-dom";
import NavBar from "../../components/Generic/NavBar/NavBar";
import axios from "axios";
import { API_BASE } from '../../api/baseUrl';

const PropertyRoomBooking = () => {
    const location = useLocation();
    const { propertyId, startDate, endDate } = location.state || {};

    const [availabilityData, setAvailabilityData] = useState([]);
    const [roomTypesData, setRoomTypesData] = useState([]);

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                console.log(propertyId, startDate, endDate);
                const availabilityResponse = await axios.get(
                    `${API_BASE}/bookings/availability?propertyId=${propertyId}&startDate=${startDate}&endDate=${endDate}`
                );

                setAvailabilityData(availabilityResponse.data);
            } catch (error) {
                console.error("Error fetching availability:", error);
            }
        };    

        const fetchRoomTypes = async () => {
            try {
                const roomTypesResponse = await axios.get(
                    `${API_BASE}/roomtypes`
                );

                setRoomTypesData(roomTypesResponse.data);
            } catch (error) {
                console.error("Error fetching room types:", error);
            }
        };

        fetchAvailability();
        fetchRoomTypes();
    }, [propertyId, startDate, endDate]);

    const availableRoomTypes = roomTypesData.filter((roomType) =>
        availabilityData.some((availability) => availability[0] === roomType.id)
    );

    const handleBooking = async (room) => {
        const userId = localStorage.getItem("identification");
        const username = localStorage.getItem("username");
        const document = localStorage.getItem("document");

        if (!userId) {
            alert("You must be logged in to make a booking.");
            return;
        }

        const bookingDetails = {
            startDate: startDate,
            endDate: endDate, 
            totalPrice: room.basePrice, 
            roomTypeId: room.id,
            userId: userId
        };

        try {
            await axios.post(
                `${API_BASE}/bookings`,
                bookingDetails
            );

            alert(`Booking confirmed! \nName: ${username} \nDocument: ${document}`);
        } catch (error) {
            console.error("Error creating booking:", error);
            alert("Failed to create booking.");
        }
    };

    return (
        <div>
            <NavBar />
            <div className="roomTypesContainer">
                <h1 className="roomTypesTitle">Available Room Types</h1>
                <div className="roomCards">
                    {availableRoomTypes.map((room) => {
                        const availability = availabilityData.find(
                            (avail) => avail[0] === room.id
                        );
                        return (
                            <div className="roomCard" key={room.id}>
                                <img
                                    src={room.image}
                                    alt={room.name}
                                    className="roomCardImage"
                                />
                                <div className="roomCardContent">
                                    <h2 className="roomCardTitle">{room.name}</h2>
                                    <p className="roomCardInfo">{room.description}</p>
                                    <p className="roomCardPrice">Price: ${room.basePrice}</p>
                                    <p className="roomCardAvailability">
                                        Available Rooms:{" "}
                                        {availability ? availability[1] : "Unknown"}
                                    </p>
                                    <button
                                        onClick={() => handleBooking(room)}
                                        className="roomCardButton"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PropertyRoomBooking;
