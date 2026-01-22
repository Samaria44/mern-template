import { Modal, Box, Typography } from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";

// Simple modal that shows a QR code image for the given product code
export default function ScannerModal({ open, handleClose, code }) {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          bgcolor: "#fff",
          p: 3,
          width: 320,
          m: "100px auto",
          textAlign: "center",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Product Scan Code
        </Typography>
        {code ? (
          <QRCodeCanvas
            // value={`${window.location.origin}/product/${code}`}
            value={`http://172.16.200.22/product/${code}`}
            size={200}
            includeMargin
          />
        ) : (
          <Typography variant="body2">No code available</Typography>
        )}
      </Box>
    </Modal>
  );
}
