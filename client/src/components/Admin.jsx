import { Button, TextField } from "@mui/material"
import { utils as web3Utils } from 'web3'
import { LANG } from '../constants'
import { useState } from 'react'
import { createUser, deleteUser, grantAdmin, revokeAdmin } from "../api"
import './Admin.scss'

export default function Admin({ pushAlert }) {
    const [userAddress, setUserAddress] = useState("")

    const handleCreateUser = () => {
        if (!web3Utils.isAddress(userAddress)) {
            pushAlert(`"${userAddress}" ${LANG.invalidAddress}`)
            return
        }

        createUser(userAddress)
            .then(() => pushAlert(LANG.callPass, 'success'))
            .catch(() => pushAlert(LANG.callBad))
    }

    const handleDeleteUser = () => {
        if (!web3Utils.isAddress(userAddress)) {
            pushAlert(`"${userAddress}" ${LANG.invalidAddress}`)
            return
        }

        deleteUser(userAddress)
            .then(() => pushAlert(LANG.callPass, 'success'))
            .catch(() => pushAlert(LANG.callBad))
    }

    const handleGrantAdmin = () => {
        if (!web3Utils.isAddress(userAddress)) {
            pushAlert(`"${userAddress}" ${LANG.invalidAddress}`)
            return
        }

        grantAdmin(userAddress)
            .then(() => pushAlert(LANG.callPass, 'success'))
            .catch(() => pushAlert(LANG.callBad))
    }
    const handleRevokeAdmin = () => {
        if (!web3Utils.isAddress(userAddress)) {
            pushAlert(`"${userAddress}" ${LANG.invalidAddress}`)
            return
        }

        revokeAdmin(userAddress)
            .then(() => pushAlert(LANG.callPass, 'success'))
            .catch(() => pushAlert(LANG.callBad))
    }

    return (
        <div className="adminPanel">
            <h1>{LANG.adminPanel}</h1>
            <div className="controls">
                <TextField className="userAddressField" variant="filled" value={userAddress} onChange={e => setUserAddress(e.target.value)} />
                <div className="buttons">
                    <Button variant="outlined" onClick={handleCreateUser}>
                        {LANG.createUser}
                    </Button>
                    <Button className="redButton" variant="outlined" onClick={handleDeleteUser}>
                        {LANG.deleteUser}
                    </Button>
                    <Button variant="outlined" onClick={handleGrantAdmin}>
                        {LANG.grantAdmin}
                    </Button>
                    <Button className="redButton" variant="outlined" onClick={handleRevokeAdmin}>
                        {LANG.revokeAdmin}
                    </Button>
                </div>
            </div>
        </div>
    )
}