import { useEffect, useState } from 'react'
import { LANG } from '../constants'
import { pingContract, setupMetrics } from '../api'
import './Diagnostics.scss'
import { Button } from '@mui/material'

export default function Diagnostics({ pushAlert }) {
    const [avgDownload, setAvgDownload] = useState('N/A')
    const [avgUpload, setAvgUpload] = useState('N/A')
    const [avgLatency, setAvgLatency] = useState('N/A')

    useEffect(() => {
        setupMetrics(setAvgDownload, setAvgUpload, setAvgLatency)
    }, [])

    const handlePing = () => {
        pingContract()
            .then(() => pushAlert(LANG.callPass, 'success'))
            .catch(() => pushAlert(LANG.callBad))
    }

    return (
        <div className="diagnostics">
            <div className="header">
                <h1>{LANG.diagnostics}</h1>
                <Button variant="outlined" onClick={handlePing}>{LANG.ping}</Button>
            </div>
            <div className="network-metrics">
                <div className="stack-box">
                    <label>{LANG.avgDownload}</label>
                    <p>{parseFloat(avgDownload).toFixed(2)}</p>
                </div>
                <div className="stack-box">
                    <label>{LANG.avgUpload}</label>
                    <p>{parseFloat(avgUpload).toFixed(2)}</p>
                </div>
                <div className="stack-box">
                    <label>{LANG.avgLatency}</label>
                    <p>{parseFloat(avgLatency).toFixed(2)}</p>
                </div>
            </div>
        </div>
    )
}