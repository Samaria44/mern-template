import { Box, Button, Grid, MenuItem, TextField, Typography } from "@mui/material";
import IndeterminateCheckboxList from "../components/DropdownWithHierarchicalCheckboxes";
import MiniDrawer from "../components/MiniDrawer";
import { useEffect, useState } from "react";
import { userService } from "../services/userServices";
import { permissionService } from "../services/permissionServices";
import { useSnackbar } from "notistack";

const Permission = () => {

    const { enqueueSnackbar } = useSnackbar();

    const [permission, setPermission] = useState(null);
    const [user, setUser] = useState(null);
    const handleSubmitForm = async (deviceData) => {
        // console.log('Form data:', deviceData);
        setUser(deviceData.user);
        const response = await permissionService.getUserPermission(deviceData.user);
        if (response.status == 200) {
            setPermission(response.data);
            // console.log(response.data)
            // alert("permission Updated Successfully");
        } else {
            // alert(response.data.message);
            enqueueSnackbar(response.data.message, { variant: 'error' });
        }
    }


    function generatePermissionsObject(entities, roles) {
        const permissionsObject = {};

        entities.forEach(entity => {
            permissionsObject[entity] = {};
            roles.forEach(role => {
                permissionsObject[entity][role] = false;
            });
        });

        return permissionsObject;
    }

    // Define the entities and roles arrays
    const entities = ['project', 'complain', 'vehicle', 'user', 'permission', 'department', 'device', "equipment", "subEquipment", "equipmentType", "equipmentProblem", "team"];
    const roles = ['create', 'read', 'update', 'delete'];

    // Generate the permissions object
    const permissionsObject = generatePermissionsObject(entities, roles);
    // const assignDefaultPermissions = () => {

    // }
    const handleButtonClick = async () => {
        let obj = { userId: user, ...permissionsObject }
        // console.log('added Object:', obj);

        const response = await permissionService.createPermission(obj);
        if (response.status == 201) {
            setPermission(response.data);
            // console.log(response.data)
            // alert("Permission added Successfully");
            enqueueSnackbar("Permission added Successfully", { variant: 'success' });
        } else {
            // alert(response.data.message);
            enqueueSnackbar(response.data.message, { variant: 'error' });
        }
    };

    return <>
        <MiniDrawer>
            <h1>Permission </h1>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Typography variant='h6'>User</Typography>
                    <Form submitHandler={handleSubmitForm} />
                </Grid>
                <Grid item xs={8}>
                    <Typography variant='h6'>Rights</Typography>
                    {permission && Object.keys(permission).length > 0
                        ? <IndeterminateCheckboxList data={permission} />
                        : <Box style={{ textAlign: "center" }}>
                            <p>No Permissions</p>
                            {user != null && <Button sx={{ mb: 2, ml: 1 }} onClick={handleButtonClick} variant="contained">Assign Default Rights</Button>}
                        </Box>}
                </Grid>
            </Grid>
        </MiniDrawer>
    </>
}

export default Permission;

const Form = ({ submitHandler, data }) => {
    const [formValues, setFormValues] = useState({
        _id: '',
        user: '',
        department: ''
    });

    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            const response = await userService.getUsers();
            setUsers(response.data);
            setFilteredUsers(response.data);
            extractDepartments(response.data);
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        if (data) {
            setFormValues(data);
        }
    }, [data]);

    useEffect(() => {
        if (formValues.department === '') {
            setFilteredUsers(users);
        } else {
            setFilteredUsers(users.filter(user => user.department === formValues.department));
        }
    }, [formValues.department, users]);

    const extractDepartments = (data) => {
        const uniqueDepartments = Array.from(new Set(data.map(user => user.department_name)));
        setDepartments([{ name: 'All', id: '' }, ...uniqueDepartments.map(dept => ({ name: dept, id: data.find(user => user.department_name === dept).department }))]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }));

        // console.log(formValues);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submitHandler(formValues);
    };

    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { my: 1 },
            }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
        >
            <TextField
                name="department"
                select
                size="small"
                label="Department"
                sx={{ width: "100%" }}
                value={formValues.department}
                onChange={handleChange}
            >
                {departments.map((department) => (
                    <MenuItem key={department.id} value={department.id}>
                        {department.name}
                    </MenuItem>
                ))}
            </TextField>

            <TextField
                name="user"
                select
                size="small"
                label="User"
                sx={{ width: "100%" }}
                value={formValues.user}
                onChange={handleChange}
            >
                {filteredUsers.map((user) => (
                    <MenuItem key={user._id} value={user._id}>
                        {user.name}
                    </MenuItem>
                ))}
            </TextField>

            <Button type="submit" variant="contained" size="small" sx={{ mt: 2 }} disabled={(formValues.user == '')}>Find</Button>
        </Box>
    );
};
