import React, { useState, useEffect } from "react";
import { Box, Button, Switch, TextField } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ScrollDialog from "./Dialog";
import LocationForm from "./locationform";
import ControledDataGrid from "./ControledDataGrid";
import { locationService } from "../services/locationServices";
import { useSnackbar } from "notistack";

const LocationsTab = () => {
  const [locations, setLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const res = await locationService.getLocations();
      setLocations(res || []);
    } catch (error) {
      enqueueSnackbar("Failed to fetch locations", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => {
    setModalOpen(false);
    setFormData(null);
  };

  const handleEditClick = (rowData) => {
    setFormData(rowData);
    handleOpenModal();
  };

  const handleDeleteClick = async (id) => {
    if (id && window.confirm("This location will be permanently deleted?")) {
      try {
        await locationService.deleteLocation(id);
        enqueueSnackbar("Location Deleted Successfully!", { variant: "success" });
        setLocations((prev) => prev.filter((loc) => loc._id !== id));
      } catch (error) {
        enqueueSnackbar("Failed to delete location", { variant: "error" });
      }
    }
  };

  const handleStatusChange = async (rowData) => {
    try {
      const { _id, active, ...rest } = rowData;

      // Ensure we always toggle a proper boolean value
      const currentActive = typeof active === "boolean" ? active : true; // treat missing value as active
      const newActive = !currentActive;

      await locationService.updateLocation(_id, { ...rest, active: newActive });
      enqueueSnackbar("Status updated successfully", { variant: "success" });
      fetchLocations();
    } catch (error) {
      enqueueSnackbar("Failed to update status", { variant: "error" });
    }
  };

  const handleSubmitForm = async (data) => {
    try {
      if (data._id) {
        const { _id, ...updateData } = data; // Remove _id from body
        await locationService.updateLocation(_id, updateData);
        enqueueSnackbar("Location Updated Successfully!", { variant: "success" });
      } else {
        await locationService.createLocation(data);
        enqueueSnackbar("Location Added Successfully!", { variant: "success" });
      }
      handleCloseModal();
      fetchLocations();
    } catch (error) {
      enqueueSnackbar("Operation failed", { variant: "error" });
    }
  };

  const filteredLocations = locations.filter((loc) =>
    [loc.name, loc.address].some((v) => (v || "").toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const columns = [
    { field: "name", headerName: "Name", width: 200 },
    { field: "address", headerName: "Address", width: 250 },
    { field: "latitude", headerName: "Latitude", width: 120 },
    { field: "longitude", headerName: "Longitude", width: 120 },
    {
      field: "active",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Switch
          checked={Boolean(params.row.active)}
          onChange={() => handleStatusChange(params.row)}
          color="primary"
        />
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          label="Search Locations"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenModal}
            sx={{ mr: 1 }}
          >
            Add Location
          </Button>
          <Button
            onClick={fetchLocations}
            variant="contained"
            startIcon={<RefreshIcon />}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <ControledDataGrid
        entity="location"
        tableData={filteredLocations}
        columns={columns}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
        action={true}
        loading={loading}
      />

      {modalOpen && (
        <ScrollDialog
          title={formData ? "Edit Location" : "Add New Location"}
          form={<LocationForm submitHandler={handleSubmitForm} data={formData} />}
          modalOpen={modalOpen}
          handleOpenModal={handleOpenModal}
          handleCloseModal={handleCloseModal}
        />
      )}
    </Box>
  );
};

export default LocationsTab;
