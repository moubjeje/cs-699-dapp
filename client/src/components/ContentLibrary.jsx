import { Button } from '@mui/material'
import { useRef, useState } from 'react'
import { LANG } from '../constants'
import api from '../api'

export default function ContentLibrary() {
    const fileSubmissionBox = useRef(null)
    const [submittedFile, setSubmittedFile] = useState(null);

    const handleFileSubmit = (e) => {
        setSubmittedFile(e.target.files[0])
        console.log(e.target.files[0])
    }

    const handleUpload = (e) => {
        if (submittedFile == null) {
            return alert('must submit a file first')
        }

        api.uploadToIPFS(submittedFile)
    }

    return (
        <div className="contentLibrary">
            <Button variant="outlined" onClick={() => fileSubmissionBox.current.click()}>
                {submittedFile?.name ?? LANG.fileUpload}
                <input type="file" ref={fileSubmissionBox} hidden onChange={handleFileSubmit} />
            </Button>
            <Button variant="contained" onClick={handleUpload} >{LANG.submit}</Button>
        </div>
    )
}