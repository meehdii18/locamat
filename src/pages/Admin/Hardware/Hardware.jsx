import React, { useEffect, useState } from "react";
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
    TextField, TableSortLabel, Box
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import { visuallyHidden } from "@mui/utils";
import PropTypes from "prop-types";

function Admin_Hardware() {
    const [error, setError] = useState(null);
    const [hardwares, setHardwares] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectedHardwareId, setSelectedHardwareId] = useState(null);

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('ref');

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

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
        { id: 'ref', label: 'Reference', minWidth: 170 },
        { id: 'name', label: 'Name', minWidth: 100 },
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
        fetchHardwares();
    }, []);

    const handleDeleteOpen = (id) => {
        setSelectedHardwareId(id);
        setDeleteDialog(true);
    };

    const handleDeleteClose = () => {
        setDeleteDialog(false);
        setSelectedHardwareId(null);
    };

    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, "hardware", selectedHardwareId));
            setHardwares(hardwares.filter(hardware => hardware.id !== selectedHardwareId));
            handleDeleteClose();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddHardware = () => {
        navigate('/admin/hardware/createhardware');
    };

    const handleEditOpen = (id) => {
        navigate(`/admin/hardware/edithardware/${id}`);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredHardwares = hardwares.filter(hardware =>
        hardware.ref.toString().includes(searchQuery.toLowerCase()) ||
        hardware.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hardware.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedHardwares = filteredHardwares.sort((a, b) => {
        if (order === 'asc') {
            return a[orderBy] < b[orderBy] ? -1 : a[orderBy] > b[orderBy] ? 1 : 0;
        } else {
            return a[orderBy] > b[orderBy] ? -1 : a[orderBy] < b[orderBy] ? 1 : 0;
        }
    });

    if (error) {
        return <p>Erreur : {error}</p>;
    }

    function EnhancedTableHead(props) {
        const { order, orderBy, onRequestSort } = props;
        const createSortHandler = (property) => (event) => {
            onRequestSort(event, property);
        };

        return (
            <TableHead>
                <TableRow>
                    {columns.map((column) => (
                        <StyledTableCell key={column.id}>
                            <TableSortLabel
                                active={orderBy === column.id}
                                direction={orderBy === column.id ? order : 'asc'}
                                onClick={createSortHandler(column.id)}
                                sx={{
                                    '&:hover , &.Mui-active , &.Mui-active .MuiTableSortLabel-icon': {
                                        color: '#ffffff',
                                    },
                                }}
                            >
                                {column.label}
                                {orderBy === column.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        </StyledTableCell>
                    ))}
                    <StyledTableCell>Actions</StyledTableCell>
                </TableRow>
            </TableHead>
        );
    }

    EnhancedTableHead.propTypes = {
        onRequestSort: PropTypes.func.isRequired,
        order: PropTypes.oneOf(['asc', 'desc']).isRequired,
        orderBy: PropTypes.string.isRequired,
    };

    return (
        <div>
            <TextField
                label="Search"
                variant="outlined"
                value={searchQuery}
                onChange={handleSearchChange}
                style={{ marginBottom: '20px', width: '100%' }}
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
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                            {sortedHardwares
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((hardware) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={hardware.id}>
                                        <TableCell>{hardware.ref}</TableCell>
                                        <TableCell>{hardware.name}</TableCell>
                                        <TableCell>{hardware.type}</TableCell>
                                        <TableCell>
                                            <IconButton color="secondary">
                                                <InfoIcon />
                                            </IconButton>
                                            <IconButton color="secondary" onClick={() => handleEditOpen(hardware.id)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="secondary" onClick={() => handleDeleteOpen(hardware.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
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
                    <Button onClick={handleDeleteClose} color="secondary" variant="contained">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="secondary" variant="contained" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Admin_Hardware;