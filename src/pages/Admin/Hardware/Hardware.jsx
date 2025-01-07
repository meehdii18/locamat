import { useEffect, useState } from "react";
import { db } from "../../../firebase.js";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
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
    TextField, TableSortLabel
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

function Admin_Hardware() {
    const [error, setError] = useState(null);
    const [hardwares, setHardwares] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [editDialog, setEditDialog] = useState(false);
    const [selectedHardwareId, setSelectedHardwareId] = useState(null);
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
        { id: 'ref', label: 'Réference', minWidth: 170 },
        { id: 'name', label: 'Nom', minWidth: 100 },
        { id: 'type', label: 'Type', minWidth: 170 },
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
        const fetchHardwares = async () => {
            try {
                console.log("Fetching hardwares...");
                const allHardwares = await getDocs(collection(db, "hardware"));
                const fetchedHardwares = [];
                allHardwares.forEach((hardware) => {
                    fetchedHardwares.push({ id: hardware.id, ...hardware.data() });
                });
                setHardwares(fetchedHardwares);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchHardwares().then(() => console.log("Hardwares fetched!"));
    }, []);

    const handleDeleteOpen = (id) => {
        setSelectedHardwareId(id);
        setDeleteDialog(true);
    };

    const handleDeleteClose = () => {
        setDeleteDialog(false);
        setSelectedHardwareId(null);
    };

    const handleEditOpen = (id) => {
        setSelectedHardwareId(id);
        setEditDialog(true);
    };

    const handleEditClose = () => {
        setEditDialog(false);
        setSelectedHardwareId(null);
    }

    const handleDelete = async () => {
        try {
            // Delete hardware from Firestore
            await deleteDoc(doc(db, "hardware", selectedHardwareId));
            setHardwares(hardwares.filter(hardware => hardware.id !== selectedHardwareId));

            handleDeleteClose();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddHardware = () => {
        //TODO changer la page de destination
        navigate('/admin/users/createuser');
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredHardwares = hardwares.filter(hardware =>
        hardware.ref.toString().includes(searchQuery.toLowerCase()) ||
        hardware.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hardware.type.toLowerCase().includes(searchQuery.toLowerCase())
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
                onClick={handleAddHardware}
                style={{ marginBottom: '20px' }}
            >
                Add Hardware
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
                                <StyledTableCell>Détails</StyledTableCell>
                                <StyledTableCell>Actions</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredHardwares
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((hardware) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={hardware.ref}>
                                            {columns.map((column) => {
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        { hardware[column.id] }
                                                    </TableCell>
                                                );
                                            })}
                                            <TableCell>
                                                <Button variant={"contained"} color={"secondary"}>Détails</Button>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton color={"secondary"} onClick={() => handleEditOpen(hardware.id)}>
                                                    <EditIcon/>
                                                </IconButton>
                                                <IconButton color={"secondary"} onClick={() => handleDeleteOpen(hardware.id)}>
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
                    count={filteredHardwares.length}
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
                        Are you sure you want to delete this hardware?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose} color="secondary" variant={"contained"}>
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="secondary" variant={"contained"} autoFocus>
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
                <DialogTitle id="alert-dialog-title">{"Edit Hardware"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">

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

export default Admin_Hardware;