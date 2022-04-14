import { create as createIPFS } from 'ipfs-http-client'
import { IPFS_API_ENDPOINT } from './constants'

const ipfs = createIPFS(IPFS_API_ENDPOINT)

const pingContract = () => { }

const uploadToIPFS = async (file) => {
    try {
        const { cid } = await ipfs.add(file)
        //todo delete if store fail
        await storeFileOnContract(file.name, file.size, cid);
        return true
    } catch (err) {
        console.log(ErrorEvent)
        return false
    }
}

const downloadFromIPFS = async (cid) => {
}

const storeFileOnContract = async (filename, fileSize, cid) => {
    console.log(cid)
}

export default {
    pingContract,
    uploadToIPFS,
    downloadFromIPFS
}