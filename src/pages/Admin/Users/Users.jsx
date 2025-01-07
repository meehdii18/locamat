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
    Button,
    IconButton,
    TextField
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UserPage from "../UserPage/UserPage.jsx";
import AddIcon from '@mui/icons-material/Add';

function Admin_Users() {
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [editDialog, setEditDialog] = useState(false);
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
        { id: 'admin', label: 'Admin', minWidth: 100 },
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

    const handleDeleteOpen = (id) => {
        setSelectedUserId(id);
        setDeleteDialog(true);
    };

    const handleDeleteClose = () => {
        setDeleteDialog(false);
        setSelectedUserId(null);
    };

    const handleEditOpen = (id) => {
        setSelectedUserId(id);
        setEditDialog(true);
    };

    const handleEditClose = () => {
        setEditDialog(false);
        setSelectedUserId(null);
    }

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

            handleDeleteClose();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddUser = () => {
        navigate('/admin/users/createuser');
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (error) {
        return <p>Erreur : {error}</p>;
    }

    return (
        <div>
            <TextField
                label="Search"
                variant="outlined"
                value={searchQuery}
                onChange={handleSearchChange}
                style={{ marginBottom: '20px', width: '100%'   }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                            borderColor: '#9c27b0',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#9c27b0',
                        },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                    color: '#9c27b0',
                },
                }}
            />
            <Button
                variant="contained"
                color="secondary"
                startIcon={<AddIcon />}
                onClick={handleAddUser}
                style={{ marginBottom: '20px' }}
            >
                Add User
            </Button>
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
                            {filteredUsers
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((user) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={user.id}>
                                            {columns.map((column) => {
                                                const value = user[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.id === 'admin' ? (value ? 'Yes' : 'No') : value}
                                                    </TableCell>
                                                );
                                            })}
                                            <TableCell>
                                                <IconButton color={"secondary"} onClick={() => handleEditOpen(user.id)}>
                                                    <EditIcon/>
                                                </IconButton>
                                                <IconButton color={"secondary"} onClick={() => handleDeleteOpen(user.id)}>
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
                    count={filteredUsers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <Dialog
                open={deleteDialog}
                onClose={handleDeleteClose}
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
                    <Button onClick={handleDeleteClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="primary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={editDialog}
                onClose={handleEditClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{ border: 'solid #9107d6 1px' }}
            >
                <DialogTitle id="alert-dialog-title">{"Edit User"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <UserPage id={selectedUserId}/>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose} color="secondary" variant={"contained"}>
                        Retour
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Admin_Users;