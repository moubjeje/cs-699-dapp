import React from 'react';
import { Button } from '@mui/material';

export default function LoginButton({ onLogin }) {
    const isMetaMaskInstalled = () => {
        return window.ethereum && window.ethereum.isMetaMask
    }

    const connectHandler = () => {
        if (!isMetaMaskInstalled()) {
            alert('Install MetaMask')
            return;
        }
        window.ethereum.request({
            method: 'eth_requestAccounts',
        }).then(res => onLogin(res[0])).catch(err => console.log(err))
    }

    return (
        <Button variant="contained" onClick={connectHandler}>Login with Metamask</Button>
    )
}