import React, { useState, useEffect } from "react";
import { Box, Button, Switch, TextField } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ScrollDialog from "./Dialog";
import StoreForm from "./Storeform";
import ControledDataGrid from "./ControledDataGrid";
import { storeService } from "../services/storeServices";
import { useSnackbar } from "notistack";
import ScannerModal from "./ScannerModel";
const StoreTab = () => {
  const [stores, setStores] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [openScanner, setOpenScanner] = useState(false);
  const [selectedCode, setSelectedCode] = useState("");
  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await storeService.getStores();
      setStores(res || []);
    } catch (error) {
      enqueueSnackbar("Failed to fetch stores", { variant: "error" });
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
    if (id && window.confirm("This store item will be permanently deleted?")) {
      try {
        await storeService.deleteStore(id);
        enqueueSnackbar("Store item deleted successfully!", { variant: "success" });
        setStores((prev) => prev.filter((item) => item._id !== id));
      } catch (error) {
        enqueueSnackbar("Failed to delete store item", { variant: "error" });
      }
    }
  };

  const handleStatusChange = async (rowData) => {
    try {
      const { _id, active, ...rest } = rowData;

      // Ensure we always toggle a proper boolean value
      const currentActive = typeof active === "boolean" ? active : true; // treat missing value as active
      const newActive = !currentActive;

      await storeService.updateStore(_id, { ...rest, active: newActive });
      enqueueSnackbar("Status updated successfully", { variant: "success" });
      fetchStores();
    } catch (error) {
      enqueueSnackbar("Failed to update status", { variant: "error" });
    }
  };

  const handleSubmitForm = async (data) => {
    try {
      if (data._id) {
        const { _id, ...updateData } = data; // Remove _id from body
        await storeService.updateStore(_id, updateData);
        enqueueSnackbar("Store item updated successfully!", { variant: "success" });
      } else {
        await storeService.createStore(data);
        enqueueSnackbar("Store item added successfully!", { variant: "success" });
      }
      handleCloseModal();
      fetchStores();
    } catch (error) {
      enqueueSnackbar("Operation failed", { variant: "error" });
    }
  };

  const filteredStores = stores.filter((item) =>
    [item.name].some((v) => (v || "").toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const columns = [
    { field: "name", headerName: "Name", width: 200 },
    { field: "weight", headerName: "Weight", width: 150 },
    { field: "carats", headerName: "Carats", width: 150 },
    {
      field: "code",
      headerName: "Scan Code",
      width: 150,
      renderCell: (params) => (
        <span
          onClick={() => {
            setSelectedCode(params.row.code || "");
            setOpenScanner(true);
          }}
          style={{ color: "black", cursor: "pointer", textDecoration: "underline" }}
        >
          Show QR
        </span>
      ),
    },
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
          label="Search Store"
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
            Add Store Item
          </Button>
          <Button
            onClick={fetchStores}
            variant="contained"
            startIcon={<RefreshIcon />}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <ControledDataGrid
        entity="store"
        tableData={filteredStores}
        columns={columns}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
        action={true}
        loading={loading}
      />

      {modalOpen && (
        <ScrollDialog
          title={formData ? "Edit Store Item" : "Add New Store Item"}
          form={<StoreForm submitHandler={handleSubmitForm} data={formData} />}
          modalOpen={modalOpen}
          handleOpenModal={handleOpenModal}
          handleCloseModal={handleCloseModal}
        />
      )}

      <ScannerModal
        open={openScanner}
        handleClose={() => setOpenScanner(false)}
        code={selectedCode}
      />
    </Box>
  );
};

export default StoreTab;
