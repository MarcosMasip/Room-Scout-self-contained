import React from "react";
import DynamicCrud from "../DynamicCRUD";
import { API_BASE } from '../../../../api/baseUrl';

const columns = [
	{ field: "id", headerName: "ID", width: 90 },
	{ field: "identification", headerName: "Identification", width: 150, editable: true },
	{ field: "username", headerName: "Username", width: 150, editable: true },
	{ field: "email", headerName: "Email", width: 200, editable: true },
	{ field: "name", headerName: "Name", width: 150, editable: true },
	{ field: "surname", headerName: "Surname", width: 150, editable: true },
	{ field: "role", headerName: "Role", width: 150, editable: true },
];

const formFields = [
	{ name: "identification", label: "Identification", type: "text" },
	{ name: "username", label: "Username", type: "text" },
	{ name: "name", label: "Name", type: "text" },
	{ name: "surname", label: "Surame", type: "text" },
	{ name: "email", label: "Email", type: "text" },
	{ name: "password", label: "Password", type: "text" },
	{ name: "role", label: "Role", type: "text" },
];

const apiEndpoint = `${API_BASE}/users`;

const UserCRUD = () => {
	return (
		<DynamicCrud
			title="User"
			columns={columns}
			apiEndpoint={apiEndpoint}
			formFields={formFields}
		/>
	);
};

export default UserCRUD;
