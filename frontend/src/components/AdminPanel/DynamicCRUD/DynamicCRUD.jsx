import React, { useEffect, useCallback, useReducer } from "react";
import DataTable from './DataTable/DataTable';
import Add from "./Add/Add";
import axios from "axios";
import { API_BASE } from '../../../api/baseUrl';
import './DynamicCRUD.scss';

const initialState = {
    open: false,
    formData: {},
    rows: [],
    errorMessage: "",
    successMessage: "",
    properties: []
};

function reducer(state, action) {
    switch (action.type) {
        case 'SET_ROWS':
            return { ...state, rows: action.payload };
        case 'SET_PROPERTIES':
            return { ...state, properties: action.payload };
        case 'SET_FORM_DATA':
            return { ...state, formData: action.payload };
        case 'SET_OPEN':
            return { ...state, open: action.payload };
        case 'SET_ERROR_MESSAGE':
            return { ...state, errorMessage: action.payload, successMessage: "" };
        case 'SET_SUCCESS_MESSAGE':
            return { ...state, successMessage: action.payload, errorMessage: "" };
        default:
            return state;
    }
}

const DynamicCrud = ({ title, columns, apiEndpoint, formFields }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { open, formData, rows, errorMessage, successMessage, properties } = state;

    const fetchProperties = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE}/properties`);
            dispatch({ type: 'SET_PROPERTIES', payload: response.data });
        } catch (err) {
            console.error("Error fetching properties:", err);
        }
    }, []);

    useEffect(() => {
        if (columns.some((column) => column.field === "propertyId")) {
            fetchProperties();
        }
    }, [columns, fetchProperties]);

    const fetchRecords = useCallback(async () => {
        try {
            const response = await axios.get(apiEndpoint);
            dispatch({ type: 'SET_ROWS', payload: response.data });
        } catch (err) {
            console.error(`Error fetching ${title.toLowerCase()}:`, err);
            dispatch({ type: 'SET_ERROR_MESSAGE', payload: `Error fetching ${title.toLowerCase()}. Please try again later.` });
        }
    }, [apiEndpoint, title]);

    useEffect(() => {
        fetchRecords();
    }, [fetchRecords]);

    useEffect(() => {
        const initialFormData = {};
        formFields.forEach((field) => (initialFormData[field.name] = ""));
        dispatch({ type: 'SET_FORM_DATA', payload: initialFormData });
    }, [formFields]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch({ type: 'SET_FORM_DATA', payload: { ...formData, [name]: value } });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(apiEndpoint, formData);
            dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: `${title} created successfully!` });
            dispatch({ type: 'SET_OPEN', payload: false });
            fetchRecords();
        } catch (err) {
            console.error(`Error creating ${title.toLowerCase()}:`, err);
            dispatch({ type: 'SET_ERROR_MESSAGE', payload: `Error creating ${title.toLowerCase()}. Please try again.` });
        }
    };

    const handleUpdate = async (id, updatedData) => {
        try {
            await axios.put(`${apiEndpoint}/${id}`, updatedData);
            dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: `${title} updated successfully!` });
            fetchRecords();
        } catch (err) {
            console.error(`Error updating ${title.toLowerCase()}:`, err);
            dispatch({ type: 'SET_ERROR_MESSAGE', payload: `Error updating ${title.toLowerCase()}. Please try again.` });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(`Are you sure you want to delete this ${title.toLowerCase()}?`)) {
            return;
        }
        try {
            await axios.delete(`${apiEndpoint}/${id}`);
            dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: `${title} deleted successfully!` });
            fetchRecords();
        } catch (err) {
            console.error(`Error deleting ${title.toLowerCase()}:`, err);
            dispatch({ type: 'SET_ERROR_MESSAGE', payload: `Error deleting ${title.toLowerCase()}. Please try again.` });
        }
    };

    return (
        <div className="dynamic-crud">
            <div className="info">
                <h1>{title}</h1>
                {title !== "Booking" && (
                    <button onClick={() => dispatch({ type: 'SET_OPEN', payload: true })}>
                        Add New {title}
                    </button>
                )}
            </div>

            {errorMessage && <p className="error">{errorMessage}</p>}
            {successMessage && <p className="success">{successMessage}</p>}

            <DataTable
                columns={columns}
                rows={rows}
                handleUpdate={handleUpdate}
                handleDelete={handleDelete}
            />

            {open && (
                <Add
                    slug={title.toLowerCase()}
                    columns={columns}
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    setOpen={() => dispatch({ type: 'SET_OPEN', payload: false })}
                    properties={properties}
                />
            )}
        </div>
    );
};

export default DynamicCrud;
