import Admin_navigation from "../Admin_navigation.jsx";
import { useEffect, useState } from "react";
import { db } from "../../../firebase.js";
import { collection, getDocs } from "firebase/firestore";
import "./Users.css";
import {
    Paper,
    styled,
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TableHead, TablePagination,
    TableRow
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from "@mui/material/IconButton";

function Admin_Users() {
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);



    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const columns = [
        { id: 'email', label: 'Email', minWidth: 170 },
        { id: 'firstName', label: 'First Name', minWidth: 100 },
        { id: 'lastName', label: 'Last Name', minWidth: 170 },
        { id: 'phoneNumber', label: 'Phone Number', minWidth: 170 },
    ];

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                console.log("Fetching users...");
                const allUsers = await getDocs(collection(db, "users"));
                const fetchedUsers = []; // Stockage temporaire
                allUsers.forEach((user) => {
                    fetchedUsers.push(user.data());
                });
                setUsers(fetchedUsers); // Mise à jour immuable de l'état
            } catch (err) {
                setError(err.message);
            }
        };
        fetchUsers().then(() => console.log("Users fetched!"));
    }, []);

    if (error) {
        return <p>Erreur : {error}</p>;
    }

    return (
        <div>
            <Admin_navigation/>
            <h1>Admin Users</h1>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <StyledTableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </StyledTableCell>
                                ))}
                                <StyledTableCell>Actions</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((user) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={user.email}>
                                            {columns.map((column) => {
                                                const value = user[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.format && typeof value === 'number'
                                                            ? column.format(value)
                                                            : value}
                                                    </TableCell>
                                                );
                                            })}
                                            <TableCell>
                                                <IconButton color={"primary"}><EditIcon/></IconButton>
                                                <IconButton color={"error"}><DeleteIcon/></IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[1, 10, 25, 100]}
                    component="div"
                    count={users.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </div>

    );
}

export default Admin_Users;
