import "./Admin_navigation.css";
import React from "react";
import {Box, Tab} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import Admin_Users from "../Users/Users.jsx";
import {TabList, TabPanel} from "@mui/lab";

function Admin_navigation() {
    const [value, setValue] = React.useState('1');

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
                        <Tab label="Users" value="1" />
                        <Tab label="Hardware" value="2" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <Admin_Users/>
                </TabPanel>
                <TabPanel value="2">
                    admin hardware
                </TabPanel>
            </TabContext>
        </Box>
    );
}

export default Admin_navigation;