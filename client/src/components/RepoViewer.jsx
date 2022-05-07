import { Button, List, ListItem } from '@mui/material'
import { useCallback, useRef, useState } from 'react'
import { LANG } from '../constants'
import { downloadFile, uploadFile, deleteFile } from '../api'
import './RepoViewer.scss'

export default function RepoViewer({ repoData, pushAlert }) {
    const fileSubmissionBox = useRef(null)
    const [submittedFile, setSubmittedFile] = useState(null)

    const fileList = useCallback(() => {
        const filenames = repoData?.filenames ?? []
        const owners = repoData?.owners ?? []
        const res = filenames.map((n, i) => {
            return { name: n, owner: owners[i] ?? null }
        })

        return res
    }, [repoData?.filenames, repoData?.owners])

    const handleFileSubmit = (e) => {
        setSubmittedFile(e.target.files[0])
    }

    const handleUpload = async () => {
        if (submittedFile == null) {
            return alert('must submit a file first')
        }

        uploadFile(submittedFile)
            .then(() => pushAlert(LANG.callPass, 'success'))
            .catch(() => pushAlert(LANG.callBad))
    }

    const handleDownload = (filename) => {
        downloadFile(filename).then(buffer => new Blob(buffer)).then(blob => {
            pushAlert(LANG.callPass,'success')
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.style.display = 'none'
            a.href = url
            a.download = filename
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
        }).catch(()=>pushAlert(LANG.callBad))
    }

    const handleDelete = (filename) => {
        deleteFile(filename)
        .then(() => pushAlert(LANG.callPass, 'success'))
        .catch(() => pushAlert(LANG.callBad))
    }

    const isOwner = (fileOwner) => {
        return repoData.repoOwner.toLowerCase() === fileOwner.toLowerCase()
    }

    return (
        <div className="repoViewer">
            <div className="fileUploadBox">
                <Button className="uploadFileButton" variant="outlined" onClick={() => fileSubmissionBox.current.click()}>
                    {submittedFile?.name ?? LANG.fileUpload}
                    <input type="file" ref={fileSubmissionBox} hidden onChange={handleFileSubmit} />
                </Button>
                <Button className="storeFileButton" variant="contained" onClick={handleUpload} >{LANG.submit}</Button>
            </div>
            <div className="repository">
                <h1>{LANG.libraryHeader}</h1>
                <List className="list">
                    {fileList().map((file, i) => {
                        return (
                            <ListItem className="file" key={i}>
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