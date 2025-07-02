import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Alert from '@mui/material/Alert';

export default function AdminPanel() {
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '', city: '', safety: 50, pollution: 50, cleanliness: 50, greenery: 50
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchNeighborhoods();
  }, []);

  const fetchNeighborhoods = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/neighborhoods`);
    const data = await res.json();
    setNeighborhoods(data);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const url = editing 
      ? `${process.env.REACT_APP_API_URL}/api/neighborhoods/${editing._id}`
      : `${process.env.REACT_APP_API_URL}/api/neighborhoods`;
    const method = editing ? 'PUT' : 'POST';
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setMessage(editing ? 'Updated successfully!' : 'Added successfully!');
        fetchNeighborhoods();
        handleClose();
      }
    } catch (err) {
      setMessage('Error occurred');
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/neighborhoods/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        setMessage('Deleted successfully!');
        fetchNeighborhoods();
      }
    } catch (err) {
      setMessage('Error occurred');
    }
  };

  const handleEdit = (neighborhood) => {
    setEditing(neighborhood);
    setFormData(neighborhood);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditing(null);
    setFormData({ name: '', city: '', safety: 50, pollution: 50, cleanliness: 50, greenery: 50 });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Admin Panel</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Add Neighborhood</Button>
      </Box>
      
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Safety</TableCell>
              <TableCell>Pollution</TableCell>
              <TableCell>Cleanliness</TableCell>
              <TableCell>Greenery</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {neighborhoods.map((n) => (
              <TableRow key={n._id}>
                <TableCell>{n.name}</TableCell>
                <TableCell>{n.city}</TableCell>
                <TableCell>{n.safety}</TableCell>
                <TableCell>{n.pollution}</TableCell>
                <TableCell>{n.cleanliness}</TableCell>
                <TableCell>{n.greenery}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(n)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(n._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Neighborhood' : 'Add Neighborhood'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="City"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Safety"
            type="number"
            value={formData.safety}
            onChange={(e) => setFormData({ ...formData, safety: parseInt(e.target.value) })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Pollution"
            type="number"
            value={formData.pollution}
            onChange={(e) => setFormData({ ...formData, pollution: parseInt(e.target.value) })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Cleanliness"
            type="number"
            value={formData.cleanliness}
            onChange={(e) => setFormData({ ...formData, cleanliness: parseInt(e.target.value) })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Greenery"
            type="number"
            value={formData.greenery}
            onChange={(e) => setFormData({ ...formData, greenery: parseInt(e.target.value) })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editing ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 