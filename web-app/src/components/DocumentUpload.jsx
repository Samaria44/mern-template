import React, { useState } from 'react';
import { Button, Grid, Typography, Box, IconButton, List, ListItem, ListItemText } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const DocumentUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [updateFile, setUpdateFile] = useState(null);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newFilePreviews = files.map((file) => file.type.startsWith('image/') ? URL.createObjectURL(file) : null);

    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    setFilePreviews((prevPreviews) => [...prevPreviews, ...newFilePreviews]);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setFilePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append('files', file));
    try {
      //   const response = await axios.post('/upload', formData);
      //   console.log('Files uploaded:', response.data);
      // console.log('Files uploaded:', formData);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6">Upload Documents</Typography>
      </Grid>
      <Grid item xs={12}>
        <input
          accept="image/*,.pdf"
          style={{ display: 'none' }}
          id="upload-button"
          multiple
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="upload-button">
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUploadIcon />}
          >
            Upload Files
          </Button>
        </label>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="body1">Selected Files:</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body2">Images:</Typography>
            <Grid container spacing={2}>
              {filePreviews.map((preview, index) => (
                selectedFiles[index].type.startsWith('image/') && (
                  <Grid item key={index}>
                    <Box
                      sx={{
                        position: 'relative',
                        display: 'inline-block',
                        width: 100,
                        height: 100,
                        margin: 1,
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        component="img"
                        src={preview}
                        alt={selectedFiles[index].name}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        }}
                        onClick={() => handleRemoveFile(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                )
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2">PDFs:</Typography>
            <List>
              {selectedFiles.map((file, index) => (
                file.type === 'application/pdf' && (
                  <ListItem
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      padding: '8px',
                      margin: '8px 0',
                    }}
                  >
                    <ListItemText primary={file.name} />
                    <IconButton onClick={() => handleRemoveFile(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                )
              ))}
            </List>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={selectedFiles.length === 0}
            >
              Upload
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DocumentUpload;
