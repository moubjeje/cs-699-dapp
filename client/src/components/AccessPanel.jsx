import { TextField, Button, List, ListItem } from '@mui/material'
import { useState } from 'react'
import { LANG } from '../constants'
import { grantReadAccess, revokeReadAccess } from '../api'
import './AccessPanel.scss'
import { utils as web3Utils } from 'web3'

export default function AccessPanel({ pushAlert }) {
    const [userToAdd, setUserToAdd] = useState('')
    const libraryData = { accessList: ["0xEfAb33D5Cd84bB4BefdC8E31cA9172bbecE1fcE2"] }
    const handleAddUser = () => {
        if (!web3Utils.isAddress(userToAdd))
            return pushAlert(`"${userToAdd}" ${LANG.invalidAddress}`)
        if (!libraryData)
            return pushAlert(LANG.loading)
        if (libraryData.accessList.includes(userToAdd))
            return pushAlert(LANG.addressExists)
        grantReadAccess(userToAdd)
    }

    const handleRemoveUser = (address) => {
        if (!web3Utils.isAddress(address)) return pushAlert(`"${address}" ${LANG.invalidAddress}`, 'error');
        revokeReadAccess(address)
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
                    {libraryData?.accessList.map((userAddress) => {
                        return (
                            <ListItem className="user" key={userAddress}>
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