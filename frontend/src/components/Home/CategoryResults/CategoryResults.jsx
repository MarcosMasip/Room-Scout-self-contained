import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHeaderContext } from '../../../context/HeaderContext';
import './CategoryResults.css';
import axios from 'axios';
import { API_BASE } from '../../../api/baseUrl';

const CategoryResults = () => {
    const { selectedCategory, searchData } = useHeaderContext();
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        const fetchProperties = async () => {
            if (!selectedCategory) return;

            try {
                const response = await axios.get(`${API_BASE}/properties/type/${selectedCategory}`);
                setProperties(response.data);
            } catch (error) {
                console.error('Error al cargar las propiedades:', error);
            }
        };

        fetchProperties();
    }, [selectedCategory]);

    const handleClick = (hotelName, propertyId) => {
        const { dates } = searchData;
        if (!dates || dates.length === 0 || !dates[0].startDate || !dates[0].endDate) {
            alert("Por favor selecciona fechas antes de continuar.");
            return;
        }

        // Format the dates as ISO strings (YYYY-MM-DD)
        const startDate = new Date(dates[0].startDate).toISOString().split('T')[0];
        const endDate = new Date(dates[0].endDate).toISOString().split('T')[0];

        navigate(`/rooms/${hotelName}`, {
            state: {
                propertyId: propertyId,
                startDate: startDate,
                endDate: endDate
            }
        });
    };

    if (!selectedCategory || properties.length === 0) return null;

    return (
        <div className="categoryResults">
            <h2>{selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}s</h2>
            <div className="gridContainer">
                {properties.map(item => (
                    <div className="gridItem" key={item.id} onClick={() => handleClick(item.name, item.id)}>
                        <h3>{item.name}</h3>
                        <p>{item.country}</p>
                        <p>{item.city}</p>
                        <p>{item.address}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryResults;
