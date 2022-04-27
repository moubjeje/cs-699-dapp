export const IPFS_API_ENDPOINT = 'https://ipfs.infura.io:5001'
export const WEB3_INFURA_HOST = 'https://ropsten.infura.io/v3/b8509c529b8c49a39d119cc5effa8400'
export const CONTRACT_ADDRESS = '0xD596317DEd894FF5C97E46791A24a9a761De142b' //TODO may change

export const CONTRACT_ABI = () => {
    const abi = require('./contracts/Mbrk.json')
    return abi.abi
}

export const LANG = {
    fileUpload: 'Upload file',
    submit: 'Store on IPFS',
    createUser: 'Create User',
    download: 'download',
    delete: 'delete',
    libraryHeader: 'Files',
    remove: 'revoke',
    accessPanel: 'Viewers',
    addUser: 'Add viewer',
    invalidAddress: 'is not a valid address',
    addressExists: 'Address already exists',
    loading: 'Please wait',
    avgDownload: 'Download MB/s',
    avgUpload: 'Upload MB/s',
    avgLatency: 'Latency ms',
    diagnostics: 'Diagnostics',
    ping: 'Ping'
}