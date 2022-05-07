import { TextField, Button, List, ListItem } from '@mui/material'
import { useState } from 'react'
import { LANG } from '../constants'
import { grantReadAccess, revokeReadAccess } from '../api'
import './AccessPanel.scss'
import { utils as web3Utils } from 'web3'

export default function AccessPanel({ repoData, pushAlert }) {
    const [userToAdd, setUserToAdd] = useState('')

    const handleAddUser = () => {
        if (!web3Utils.isAddress(userToAdd)) {
            pushAlert(LANG.invalidAddress)
            return
        }

        if (!repoData) {
            pushAlert(LANG.loading)
            return
        }

        if (repoData.accessList.includes(userToAdd)) {
            pushAlert(LANG.addressExists)
            return
        }

        grantReadAccess(userToAdd)
            .then(() => pushAlert(LANG.callPass, 'success'))
            .catch(() => pushAlert(LANG.callBad))
    }

    const handleRemoveUser = (address) => {
        if (!web3Utils.isAddress(address)) {
            pushAlert(`"${address}" ${LANG.invalidAddress}`, 'error')
            return
        }

        revokeReadAccess(address)
            .then(() => pushAlert(LANG.callPass, 'success'))
            .catch(() => pushAlert(LANG.callBad))
    }

    return (
        <div className="accessPanel">
            <div className="addUserBox">
                <TextField className="userAddressField" variant="filled" value={userToAdd} onChange={e => setUserToAdd(e.target.value)} />
                <Button className="addUserButton" variant="contained" onClick={handleAddUser}>
                    {LANG.addUser}
                </Button>
            </div>
            <div className="accessList">
                <h1>{LANG.accessPanel}</h1>
                <List className="list">
                    {repoData?.accessList.map((userAddress,i) => {
                        return (
                            <ListItem className="user" key={i}>
                                <div className="userInfo">
                                    <p>{userAddress}</p>
                                </div>
                                <Button className="removeButton" onClick={() => handleRemoveUser(userAddress)}>{LANG.remove}</Button>
                            </ListItem>
                        )
                    })}
                </List>
            </div>

        </div>
    )
}