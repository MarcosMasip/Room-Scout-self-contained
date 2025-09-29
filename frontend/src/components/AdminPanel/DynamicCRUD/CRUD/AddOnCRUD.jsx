import React from "react";
import DynamicCrud from "../DynamicCRUD";
import { API_BASE } from '../../../../api/baseUrl';

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150, editable: true },
    { field: 'price', headerName: 'Price', width: 150, type: 'number', editable: true },
    { field: 'propertyId', headerName: 'Property', width: 150, editable: true }
];

const formFields = [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'price', label: 'Price', type: 'number' },
    { name: 'propertyId', label: 'Property', type: 'text' }
];

const apiEndpoint = `${API_BASE}/addons`;

const AddOnCRUD = () => {
    return (
        <DynamicCrud
            title="Add On"
            columns={columns}
            apiEndpoint={apiEndpoint}
            formFields={formFields}
        />
    );
};

export default AddOnCRUD;
