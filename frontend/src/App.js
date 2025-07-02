import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import MatchForm from './MatchForm';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import AdminPanel from './AdminPanel';
import cityImages from './cityImages';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';

function App() {
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState(0);
  const [showAuth, setShowAuth] = useState('login');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (token) {
      setUser({ token, isAdmin });
    }
    
    axios.get('http://localhost:5000/api/neighborhoods')
      .then(res => {
        setNeighborhoods(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogin = (data) => {
    setUser(data);
    setShowAuth('login');
  };

  const handleRegister = (data) => {
    setShowAuth('login');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    setUser(null);
    setTab(0);
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleMatch = (data, city) => {
    setMatches(data);
    setSelectedCity(city);
  };

  const renderContent = () => {
    if (!user) {
      return (
        <Box sx={{ mt: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={showAuth === 'login' ? 0 : 1} onChange={(e, v) => setShowAuth(v === 0 ? 'login' : 'register')}>
              <Tab label="Login" />
              <Tab label="Register" />
            </Tabs>
          </Box>
          {showAuth === 'login' ? (
            <LoginForm onLogin={handleLogin} />
          ) : (
            <RegisterForm onRegister={handleRegister} />
          )}
        </Box>
      );
    }

    switch (tab) {
      case 0:
        return (
          <Box sx={{ mt: 4 }}>
            <MatchForm onMatch={(data) => handleMatch(data, Array.isArray(data) && data.length > 0 ? data[0].city : '')} />
            {Array.isArray(matches) && matches.length > 0 && (
              <>
                <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                  Best Matches in {selectedCity}
                </Typography>
                <Grid container spacing={3}>
                  {matches.map((n) => {
                    const defaultScore = Math.round((n.safety + (100 - n.pollution) + n.cleanliness + n.greenery) / 4);
                    return (
                      <Grid item xs={12} md={6} lg={4} key={n._id}>
                        <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                          <CardMedia
                            component="img"
                            height="160"
                            image={cityImages[n.city] || HERO_IMAGE}
                            alt={n.city}
                          />
                          <CardContent>
                            <Typography variant="h6">{n.name}</Typography>
                            <Typography variant="subtitle2" color="text.secondary">{n.city}</Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              <b>Safety:</b> {n.safety} | <b>Pollution:</b> {n.pollution} | <b>Cleanliness:</b> {n.cleanliness} | <b>Greenery:</b> {n.greenery}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              <b>Budget:</b> ₹{n.budget?.toLocaleString()} /mo
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              <b>Score:</b> {typeof n.score === 'number' ? n.score : defaultScore}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </>
            )}
            {matches && !Array.isArray(matches) && matches.error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {matches.error}
              </Typography>
            )}
            {Array.isArray(matches) && matches.length === 0 && (
              <Typography sx={{ mt: 2 }}>
                No matches found for your criteria.
              </Typography>
            )}
            <Typography variant="h5" sx={{ mt: 4 }}>All Neighborhoods</Typography>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
                <CircularProgress />
              </div>
            ) : (
              <TableContainer component={Paper} style={{ marginTop: 16 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>City</TableCell>
                      <TableCell align="right">Safety</TableCell>
                      <TableCell align="right">Pollution</TableCell>
                      <TableCell align="right">Cleanliness</TableCell>
                      <TableCell align="right">Greenery</TableCell>
                      <TableCell align="right">Budget (₹/mo)</TableCell>
                      <TableCell align="right">Score</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {neighborhoods.map((n) => {
                      const defaultScore = Math.round((n.safety + (100 - n.pollution) + n.cleanliness + n.greenery) / 4);
                      return (
                        <TableRow key={n._id}>
                          <TableCell>{n.name}</TableCell>
                          <TableCell>{n.city}</TableCell>
                          <TableCell align="right">{n.safety}</TableCell>
                          <TableCell align="right">{n.pollution}</TableCell>
                          <TableCell align="right">{n.cleanliness}</TableCell>
                          <TableCell align="right">{n.greenery}</TableCell>
                          <TableCell align="right">{n.budget?.toLocaleString()}</TableCell>
                          <TableCell align="right">{typeof n.score === 'number' ? n.score : defaultScore}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        );
      case 1:
        return user.isAdmin ? <AdminPanel /> : <Typography>Access denied</Typography>;
      default:
        return null;
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            NeighborFit
          </Typography>
          {user ? (
            <>
              <Button color="inherit" onClick={() => setTab(0)}>Home</Button>
              {user.isAdmin && (
                <Button color="inherit" onClick={() => setTab(1)}>Admin</Button>
              )}
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <Button color="inherit" onClick={() => setShowAuth('login')}>Login</Button>
          )}
        </Toolbar>
      </AppBar>
      <Box sx={{ width: '100%', height: 320, background: `url(${HERO_IMAGE}) center/cover no-repeat`, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
        <Typography variant="h2" sx={{ color: 'white', textShadow: '2px 2px 8px #333', fontWeight: 700, textAlign: 'center', px: 2 }}>
          NeighborFit
        </Typography>
      </Box>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        {!user && (
          <Typography variant="h4" align="center" gutterBottom>
            Welcome to NeighborFit
          </Typography>
        )}
        {!user && (
          <Typography variant="body1" align="center" gutterBottom>
            Find your ideal neighborhood in India based on safety, pollution, cleanliness, greenery, and more.
          </Typography>
        )}
        {renderContent()}
      </Container>
    </>
  );
}

export default App; 