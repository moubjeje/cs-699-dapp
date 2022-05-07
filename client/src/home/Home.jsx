import ContentLibrary from '../components/ContentLibrary'
import AccessPanel from '../components/AccessPanel'
import Diagnostics from '../components/Diagnostics'
import Admin from '../components/Admin'
import { Alert } from '@mui/material';
import './Home.scss';
import { useState, useEffect, useRef } from 'react';
import { loadLibraryData, loadUserData, addLibraryUpdatedCallback } from '../api';

function Home() {
  const [alerts, setAlerts] = useState([])
  const alertsRef = useRef(alerts);
  alertsRef.current = alerts;

  const [libraryData, setLibraryData] = useState(null)
  const [userData, setUserData] = useState(null)
  const [contractUpdate, setContractUpdate] = useState(0);
  addLibraryUpdatedCallback(() => setContractUpdate(contractUpdate + 1))

  useEffect(() => {
    loadLibraryData().then(setLibraryData)
    loadUserData().then(setUserData)
  }, [contractUpdate])

  const createAlert = (msg, severity = 'error') => {
    const newAlert = <Alert key={`${alerts.length}_${msg}`} severity={severity}>{msg}</Alert>
    setAlerts([...alerts, newAlert]);
    setTimeout(() => {
      if (alertsRef.current <= 0) return
      setAlerts(alertsRef.current.slice(1))
    }, 3000)
  }

  return (
    <div className="home">
      {alerts}
      <div className="row">
        <ContentLibrary libraryData={libraryData} pushAlert={createAlert} />
        {/* <div className="space"></div> */}
        <AccessPanel libraryData={libraryData} pushAlert={createAlert} />
      </div>
      <Diagnostics />
      <Admin userData={userData} pushAlert={createAlert}></Admin>
    </div>
  );
}

export default Home;