import "./Admin_navigation.css";
import React from "react";
import {Box, Tab} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import Admin_Users from "../Users/Users.jsx";
import {TabList, TabPanel} from "@mui/lab";
import {useParams} from "react-router-dom";
import Admin_Hardware from "../Hardware/Hardware.jsx";

function Admin_navigation() {
    let { tab } = useParams();
    if (tab === undefined) {
        tab = 'users';
    }
    const [value, setValue] = React.useState(tab);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', typography: 'body1' }} className={"admin_navigation"}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange}
                             aria-label="lab API tabs example"
                             textColor={"secondary"}
                             indicatorColor={"secondary"}>
                        <Tab label="Users" value="users" />
                        <Tab label="Hardware" value="hardware" />
                    </TabList>
                </Box>
                <TabPanel value="users">
                    <Admin_Users/>
                </TabPanel>
                <TabPanel value="hardware">
                    <Admin_Hardware/>
                </TabPanel>
            </TabContext>
        </Box>
    );
}

export default Admin_navigation;