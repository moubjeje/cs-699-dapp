import { Button, List, ListItem } from '@mui/material'
import { useCallback, useRef, useState } from 'react'
import { LANG } from '../constants'
import { downloadFromIpfs, uploadToIpfs, deleteFileFromContract } from '../api'
import './ContentLibrary.scss'

export default function ContentLibrary({ libraryData }) {
    const fileSubmissionBox = useRef(null)
    const [submittedFile, setSubmittedFile] = useState(null);

    const getFiles = useCallback(() => {
        const filenames = libraryData?.filenames ?? []
        const owners = libraryData?.owners ?? []
        const res = filenames.map((n, i) => {
            return { name: n, owner: owners[i] ?? null }
        })

        console.log(res)
        return res;
    }, [libraryData?.filenames, libraryData?.owners]);

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

    const isOwner = (fileOwner) => {
        console.log(libraryData.hillOwner)
        return libraryData.hillOwner.toLowerCase() === fileOwner.toLowerCase()
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
                    {getFiles().map((file, i) => {
                        return (
                            <ListItem className="file" key={file.name}>
                                <div className="fileInfo">
                                    <p>{file.name}</p>
                                    <p className="owner">{file.owner}</p>
                                </div>
                                <Button className="downloadButton" onClick={() => handleDownload(file.name)} >{LANG.download}</Button>
                                {isOwner(file.owner) && <Button className="deleteButton" onClick={() => handleDelete(file.name)} >{LANG.delete}</Button>}
                            </ListItem>
                        )
                    })}
                </List>
            </div>

        </div>
    )
}