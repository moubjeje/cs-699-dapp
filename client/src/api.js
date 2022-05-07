import { ThemeProvider } from '@emotion/react'
import { create as createIPFS } from 'ipfs-http-client'
import Web3 from 'web3'
import { IPFS_API_ENDPOINT, CONTRACT_ADDRESS, ABI } from './constants'

const ipfs = createIPFS(IPFS_API_ENDPOINT)
let web3
let contract

const downloads = [];
const uploads = [];
const pings = [];

let updateDownload;
let updateUpload;
let updateLatency;

export const initializeWeb3 = (account) => {
    const accountLowerCase = account.toLowerCase();
    // web3 = new Web3(window.ethereum)

    const provider = new Web3.providers.WebsocketProvider('ws://127.0.0.1:7545');
    web3 = new Web3(provider)
    contract = new web3.eth.Contract(ABI, '0xefAB428ce0b7b789230129F29b321d641cc7F52d', { from: accountLowerCase })

    setupEventListeners(contract, accountLowerCase)
}
export const resetWeb3 = () => {
    web3.eth.currentProvider.disconnect()
    web3 = null
    contract = null
}

export const pingContract = async () => {
    try {
        const perfStart = performance.now()
        await contract.methods.ping().call()
        const perfEnd = performance.now()
        collectLatencyMetric(perfEnd - perfStart)
        return true
    } catch (e) {
        console.error(e)
        return false
    }
}

export const uploadToIpfs = async (file) => {
    try {
        const perfStart = performance.now()

        const { path } = await ipfs.add(file)

        const perfEnd = performance.now()
        const elapsed = (perfEnd - perfStart)

        if (storeFileOnContract(file.name, file.size, path)) {
            ipfs.pin.add(path)
            collectUploadMetric({ elapsed, size: file.size })
            return true
        }

        return false
    } catch (e) {
        console.error(e)
        return false
    }
}

export const downloadFromIpfs = async (filename) => {
    try {
        const metaData = await loadFileFromContract(filename)

        const chunks = []
        let size = 0;
        const perfStart = performance.now()
        for await (const chunk of ipfs.cat(metaData.cid)) {
            size += chunk.byteLength
            chunks.push(chunk)
        }
        const elapsed = (performance.now() - perfStart)

        collectDownloadMetric({ elapsed, size })

        return chunks
    } catch (e) {
        console.error(e)
    }
}

export const loadLibraryData = async () => {
    try {
        return await contract.methods.getHill().call();
    } catch (err) {
        console.error(err)
    }
}

export const loadUserData = async () => {
    try {
        return await contract.methods.getUser().call();
    } catch (err) {
        console.error(err)
    }
}

const storeFileOnContract = async (filename, fileSize, cid) => {
    try {
        await contract.methods.createFile(filename, cid, fileSize).send()
        return true
    } catch (err) {
        console.error(err)
        return false
    }
}

const loadFileFromContract = async (filename) => {
    try {
        return await contract.methods.getFile(filename).call()
    } catch (err) {
        console.error(err)
    }
}

export const deleteFileFromContract = async (filename) => {
    try {
        const { cid } = await contract.methods.getFile(filename).call()
        await contract.methods.deleteFile(filename).send()
        await ipfs.pin.rm(cid)
    } catch (err) {
        console.error(err)
    }
}

export const createUserOnContract = async (address) => {
    try {
        await contract.methods.createUser(address).call()
        return true
    } catch (err) {
        console.error(err)
        return false
    }
}

export const grantReadAccess = async (address) => {
    try {
        return await contract.methods.grantReadAccess(address).send()
    } catch (err) {
        console.error(err)
    }
}

export const revokeReadAccess = async (address) => {
    try {
        return await contract.methods.revokeReadAccess(address).send()
    } catch (err) {
        console.error(err)
    }
}

export const grantAdmin = async (address) => {
    try {
        return await contract.methods.grantAdmin(address).send()
    } catch (err) {
        console.error(err)
    }
}

export const revokeAdmin = async (address) => {
    try {
        return await contract.methods.revokeAdmin(address).send()
    } catch (err) {
        console.error(err)
    }
}

export const createUser = async (address) => {
    try {
        return await contract.methods.createUser(address).send()
    } catch (err) {
        console.error(err)
    }
}

export const deleteUser = async (address) => {
    try {
        return await contract.methods.deleteUser(address).send()
    } catch (err) {
        console.error(err)
    }
}



const collectDownloadMetric = (download) => {
    downloads.push(download);

    if (!updateDownload) return

    const a = performance.now()
    setTimeout(() => {
        console.log(performance.now() - a)
    }, 1000)
    const average = downloads.reduce(({ avg, n }, curr) => {
        const sizeMb = curr.size / Math.pow(2, 20)
        console.log(sizeMb)
        const elapsedSec = curr.elapsed / 1000
        console.log(elapsedSec)
        const throughput = sizeMb / elapsedSec

        return {
            avg: (throughput + (n * avg)) / (n + 1),
            n: n + 1
        }

    }, { avg: 0, n: 0 }).avg

    updateDownload(average)
}

const collectUploadMetric = (upload) => {
    uploads.push(upload);

    if (!updateUpload) return

    const average = uploads.reduce(({ avg, n }, curr) => {
        const sizeMb = curr.size / Math.pow(2, 20)
        const elapsedSec = curr.elapsed / 1000
        const throughput = sizeMb / elapsedSec

        return {
            avg: (throughput + (n * avg)) / (n + 1),
            n: n + 1
        }

    }, { avg: 0, n: 0 }).avg

    updateUpload(average)
}

const collectLatencyMetric = (latency) => {
    pings.push(latency);

    if (!updateLatency) return

    const average = pings.reduce(({ avg, n }, curr) => {
        return {
            avg: (curr + (n * avg)) / (n + 1),
            n: n + 1
        }

    }, { avg: 0, n: 0 }).avg

    updateLatency(average)
}

export const setupMetrics = (setDownload, setUpload, setLatency) => {
    updateDownload = setDownload
    updateUpload = setUpload
    updateLatency = setLatency
}

const userUpdatedCallbacks = []
const libraryUpdatedCallbacks = []

export const addUserUpdatedCallback = (fn) => {
    userUpdatedCallbacks.push(fn)
}

export const addLibraryUpdatedCallback = (fn) => {
    libraryUpdatedCallbacks.push(fn)
}

const setupEventListeners = (_contract, account) => {
    const callback = (event) => {
        const user = event.returnValues.user?.toLowerCase()
        const libraryOwner = event.returnValues.libraryOwner?.toLowerCase()

        if (user === account) {
            userUpdatedCallbacks.forEach(fn => fn())
        }

        if (libraryOwner === account) {
            libraryUpdatedCallbacks.forEach(fn => fn())
        }
    }

    const eventOptions = {
        fromBlock: 'latest'
    }

    _contract.events.UserUpdated(eventOptions)
        .on('data', callback)
    _contract.events.LibraryUpdated(eventOptions)
        .on('data', callback)
}