import { Button, List, ListItem, ListItemText } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { LANG } from '../constants'
import { downloadFromIpfs, loadLibraryData, pingContract, uploadToIpfs, deleteFileFromContract } from '../api'
import './ContentLibrary.scss'

export default function ContentLibrary() {
    const fileSubmissionBox = useRef(null)
    const [submittedFile, setSubmittedFile] = useState(null);
    const [libraryData, setLibraryData] = useState(null);

    const dev = {
        filenames: ['abc.txt', 'cab.txt', 'bac.txt', 'acb.txt', 'bca.txt', 'cba.txt'],
        owners: ['abc.txtabc.txtabc.txtabc.txtabc.txtabc.txtabc.txtabc.txtabc.txtabc.txtabc.txtabc.txtabc.txtabc.txtabc.txt', 'cab.txt', 'bac.txt', 'acb.txt', 'bca.txt', 'cba.txt']
    }
    useEffect(() => {
        loadLibraryData().then(setLibraryData)
    }, [])

    const handleFileSubmit = (e) => {
        setSubmittedFile(e.target.files[0])
    }

    const handleUpload = () => {
        if (submittedFile == null) {
            return alert('must submit a file first')
        }

        uploadToIpfs(submittedFile)
    }

    const handleDownload = (filename) => {
        downloadFromIpfs(filename).then(buffer => new Blob(buffer)).then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
    }

    const handleDelete = (filename) => {
        deleteFileFromContract(filename)
    }

    return (
        <div className="contentLibrary">
            <div className="fileUploadBox">
                <Button className="uploadFileButton" variant="outlined" onClick={() => fileSubmissionBox.current.click()}>
                    {submittedFile?.name ?? LANG.fileUpload}
                    <input type="file" ref={fileSubmissionBox} hidden onChange={handleFileSubmit} />
                </Button>
                <Button className="storeFileButton" variant="contained" onClick={handleUpload} >{LANG.submit}</Button>
            </div>
            <div className="library">
                <h1>{LANG.libraryHeader}</h1>
                <List className="list">
                    {libraryData?.filenames.map((filename, i) => {
                        return (
                            <ListItem className="file" key={filename}>
                                <div className="fileInfo">
                                    <p>{filename}</p>
                                    {/* <p className="owner">{libraryData.owners[i]}</p> */}
                                </div>
                                <Button className="downloadButton" onClick={() => handleDownload(filename)}>{LANG.download}</Button>
                                <Button className="deleteButton" onClick={() => handleDelete(filename)}>{LANG.delete}</Button>
                            </ListItem>
                        )
                    })}
                </List>
            </div>

        </div>
    )
}