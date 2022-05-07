import { Button } from '@mui/material'
import { LANG } from '../constants'
import './Login.scss'

export default function Login({ onLogin }) {
  const isMetaMaskInstalled = () => {
    return window.ethereum && window.ethereum.isMetaMask
  }

  const connectHandler = () => {
    if (!isMetaMaskInstalled()) {
      alert('Install MetaMask')
      return
    }
    window.ethereum.request({
      method: 'eth_requestAccounts',
    }).then(res => onLogin(res[0])).catch()
  }

  return (
    <div className="login">
      <div className="app-title">
        <h1>My</h1>
        <h1>Beautiful</h1>
        <h1>Repository of</h1>
        <h1>Knowledge</h1>
        <Button variant="contained" onClick={connectHandler}>{LANG.login}</Button>
      </div>

    </div>
  )
}