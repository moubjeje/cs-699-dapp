import RepoViewer from '../components/RepoViewer'
import AccessPanel from '../components/AccessPanel'
import Diagnostics from '../components/Diagnostics'
import Admin from '../components/Admin'
import { Alert } from '@mui/material'
import './Home.scss'
import { useState, useEffect, useRef } from 'react'
import { loadRepoData, loadUserData, addEventCallback } from '../api'
import { LANG } from '../constants'

function Home() {
  const [alerts, setAlerts] = useState([])
  const alertsRef = useRef(alerts)
  alertsRef.current = alerts

  const [repoData, setRepoData] = useState(null)
  const [userData, setUserData] = useState(null)
  const [contractUpdate, setContractUpdate] = useState(0)
  addEventCallback(() => setContractUpdate(contractUpdate + 1))

  const updateContractData = () => {
    //bad fix
    loadRepoData().then(setRepoData)
      .catch(() => createAlert(LANG.callBad))
    loadUserData().then(setUserData)
      .catch(() => createAlert(LANG.callBad))
  }

  const createAlert = (msg, severity = 'error') => {
    if (msg === LANG.callPass) {
      updateContractData()
    }

    const newAlert = <Alert key={`${alerts.length}_${msg}`} severity={severity}>{msg}</Alert>
    setAlerts([...alerts, newAlert])
    setTimeout(() => {
      if (alertsRef.current <= 0) return
      setAlerts(alertsRef.current.slice(1))
    }, 3000)
  }

  const isAdmin = () => {
    return userData?.isAdmin
  }

  useEffect(() => {
    updateContractData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractUpdate])

  return (
    <div className="home">
      {alerts}
      <div className="row">
        <RepoViewer repoData={repoData} pushAlert={createAlert} />
        <AccessPanel repoData={repoData} pushAlert={createAlert} />
      </div>
      <Diagnostics pushAlert={createAlert} />
      {isAdmin() && <Admin pushAlert={createAlert}></Admin>}
    </div>
  )
}

export default Home