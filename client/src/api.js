import { create as createIpfs } from 'ipfs-http-client'
import Web3 from 'web3'
import { IPFS_API_ENDPOINT, CONTRACT_ADDRESS, ABI, WSS_INFURA_HOST, IPFS_PROJECT_ID, IPFS_PROJECT_KEY } from './constants'

let contract
let ipfs
let auth

const downloads = []
const uploads = []
const pings = []

let updateDownload
let updateUpload
let updateLatency

export const initializeWeb3 = async (account) => {
    const accountLowerCase = account.toLowerCase()
    const web3MetaMask = new Web3(window.ethereum)
    const web3Infura = new Web3(new Web3.providers.WebsocketProvider(WSS_INFURA_HOST))

    contract = new web3MetaMask.eth.Contract(ABI, CONTRACT_ADDRESS, { from: accountLowerCase })
    const contractInfura = new web3Infura.eth.Contract(ABI, CONTRACT_ADDRESS)

    setupEventListeners(contractInfura, accountLowerCase)

    auth = `Basic ${Buffer.from(IPFS_PROJECT_ID + ':' + IPFS_PROJECT_KEY).toString('base64')}`
    ipfs = createIpfs(IPFS_API_ENDPOINT)
}

export const pingContract = async () => {
    try {
        const perfStart = performance.now()
        await contract.methods.ping().call()
        const perfEnd = performance.now()
        collectLatencyMetric(perfEnd - perfStart)
    } catch (err) {
        console.error(err)
        throw err
    }
}

export const uploadFile = async (file) => {
    try {
        const perfStart = performance.now()
        const { path } = await ipfs.add(file)
        const perfEnd = performance.now()
        const elapsed = (perfEnd - perfStart)
        ipfs.pin.add(path, { headers: { authorization: auth } })
        await createFile(file.name, file.size, path)
        collectUploadMetric({ elapsed, size: file.size })
    } catch (err) {
        console.error(err)
        throw err
    }
}

export const downloadFile = async (filename) => {
    try {
        const metaData = await getFile(filename)

        const chunks = []
        let size = 0
        const perfStart = performance.now()
        for await (const chunk of ipfs.cat(metaData.cid)) {
            size += chunk.byteLength
            chunks.push(chunk)
        }
        const elapsed = (performance.now() - perfStart)

        collectDownloadMetric({ elapsed, size })

        return chunks
    } catch (err) {
        console.error(err)
        throw err
    }
}

export const loadRepoData = async () => {
    try {
        const res = await contract.methods.getRepo().call()
        return res
    } catch (err) {
        console.error(err)
        throw err
    }
}

export const loadUserData = async () => {
    try {
        const res = await contract.methods.getUser().call()
        return res
    } catch (err) {
        console.error(err)
        throw err
    }
}

const createFile = async (filename, fileSize, cid) => {
    try {
        await contract.methods.createFile(filename, cid, fileSize).send()

    } catch (err) {
        console.error(err)
        throw err
    }
}

const getFile = async (filename) => {
    try {
        const res = await contract.methods.getFile(filename).call()
        return res
    } catch (err) {
        console.error(err)
        throw err
    }
}

export const deleteFile = async (filename) => {
    try {
        const { cid } = await contract.methods.getFile(filename).call()
        await contract.methods.deleteFile(filename).send()
        ipfs.pin.rm(cid, { headers: { authorization: auth } })

    } catch (err) {
        console.error(err)
        throw err
    }
}

export const grantReadAccess = async (address) => {
    try {
        await contract.methods.grantReadAccess(address).send()

    } catch (err) {
        console.error(err)
        throw err
    }
}

export const revokeReadAccess = async (address) => {
    try {
        await contract.methods.revokeReadAccess(address).send()

    } catch (err) {
        console.error(err)
        throw err
    }
}

export const grantAdmin = async (address) => {
    try {
        await contract.methods.grantAdmin(address).send()

    } catch (err) {
        console.error(err)
        throw err
    }
}

export const revokeAdmin = async (address) => {
    try {
        await contract.methods.revokeAdmin(address).send()

    } catch (err) {
        console.error(err)
        throw err
    }
}

export const createUser = async (address) => {
    try {
        await contract.methods.createUser(address).send()

    } catch (err) {
        console.error(err)
        throw err
    }
}

export const deleteUser = async (address) => {
    try {
        await contract.methods.deleteUser(address).send()
    } catch (err) {
        console.error(err)
        throw err
    }
}

const collectDownloadMetric = (download) => {
    downloads.push(download)

    if (!updateDownload) return

    const average = downloads.reduce(({ avg, n }, curr) => {
        const sizeMb = curr.size / Math.pow(2, 20)
        const elapsedSec = curr.elapsed / 1000
        const throughput = sizeMb / elapsedSec

        return {
            avg: (throughput + (n * avg)) / (n + 1),
            n: n + 1
        }

    }, { avg: 0, n: 0 }).avg

    updateDownload(average)
}

const collectUploadMetric = (upload) => {
    uploads.push(upload)

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
    pings.push(latency)

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

const eventCallbacks = []

export const addEventCallback = (fn) => {
    eventCallbacks.push(fn)
}

const setupEventListeners = (_contract, account) => {
    const callback = (event) => {
        const user = event.returnValues.user?.toLowerCase()

        if (user === account) {
            eventCallbacks.forEach(fn => fn())
        }
    }

    const eventOptions = {
        fromBlock: 'latest'
    }

    _contract.events.UserUpdated(eventOptions)
        .on('data', callback)
    _contract.events.RepoUpdated(eventOptions)
        .on('data', callback)
}