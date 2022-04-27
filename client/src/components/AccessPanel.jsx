import { TextField, Button, List, ListItem, alertClasses, Alert } from '@mui/material'
import { useEffect, useState, useRef } from 'react'
import { LANG } from '../constants'
import { grantReadAccess, loadLibraryData, revokeReadAccess } from '../api'
import './AccessPanel.scss'
import { utils as web3Utils } from 'web3'

export default function AccessPanel() {
    const [userToAdd, setUserToAdd] = useState('')
    const [libraryData, setLibraryData] = useState(null)
    const [alerts, setAlerts] = useState([])
    const alertsRef = useRef(alerts);
    alertsRef.current = alerts;

    useEffect(() => {
        loadLibraryData().then(setLibraryData)
    }, [])

    const handleAddUser = () => {
        if (!web3Utils.isAddress(userToAdd))
            return createAlert(`"${userToAdd}" ${LANG.invalidAddress}`)
        if (!libraryData)
            return createAlert(LANG.loading)
        if (libraryData.accessList.includes(userToAdd))
            return createAlert(LANG.addressExists)
        grantReadAccess(userToAdd)
    }

    const handleRemoveUser = (address) => {
        if (!web3Utils.isAddress(address)) return createAlert(`"${address}" ${LANG.invalidAddress}`, 'error');
        revokeReadAccess(address)
    }

    const createAlert = (msg, severity = 'error') => {
        const newAlert = <Alert key={`${alerts.length}_${msg}`} severity={severity}>{msg}</Alert>
        setAlerts([...alerts, newAlert]);
        setTimeout(() => {
            if (alertsRef.current <= 0) return
            setAlerts(alertsRef.current.slice(1))
        }, 3000)
    }

    return (
        <div className="accessPanel">
            {alerts}
            <div className="addUserBox">
                <TextField className="userAddressField" variant="filled" value={userToAdd} onChange={e => setUserToAdd(e.target.value)} />
                <Button className="addUserButton" variant="contained" onClick={handleAddUser}>
                    {LANG.addUser}
                </Button>
            </div>
            <div className="accessList">
                <h1>{LANG.accessPanel}</h1>
                <List className="list">
                    {libraryData?.accessList.map((userAddress) => {
                        return (
                            <ListItem className="user" key={userAddress}>
                                <p>{userAddress}</p>
                                <Button className="removeButton" onClick={() => handleRemoveUser(userAddress)}>{LANG.remove}</Button>
                            </ListItem>
                        )
                    })}
                </List>
            </div>

        </div>
    )
}