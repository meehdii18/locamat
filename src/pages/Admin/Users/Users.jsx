import Admin_navigation from "../Admin_navigation.jsx";
import { useEffect, useState } from "react";
import { db, auth } from "../../../firebase.js";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
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
    TableRow,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from "@mui/material/IconButton";

function Admin_Users() {
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const navigate = useNavigate();

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
                const fetchedUsers = [];
                allUsers.forEach((user) => {
                    fetchedUsers.push({ id: user.id, ...user.data() });
                });
                setUsers(fetchedUsers);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchUsers().then(() => console.log("Users fetched!"));
    }, []);

    const handleClickOpen = (id) => {
        setSelectedUserId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedUserId(null);
    };

    const handleDelete = async () => {
        try {
            // Delete user from Firestore
            await deleteDoc(doc(db, "users", selectedUserId));
            setUsers(users.filter(user => user.id !== selectedUserId));

            // Delete user from Firebase Authentication
            const user = auth.currentUser;
            if (user) {
                await user.delete();
            }

            handleClose();
        } catch (err) {
            setError(err.message);
        }
    };

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
                                        <TableRow hover role="checkbox" tabIndex={-1} key={user.id}>
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
                                                <IconButton color={"primary"} onClick={() => navigate(`/admin/users/${user.id}`)}>
                                                    <EditIcon/>
                                                </IconButton>
                                                <IconButton color={"error"} onClick={() => handleClickOpen(user.id)}>
                                                    <DeleteIcon/>
                                                </IconButton>
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
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this user?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="primary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Admin_Users;