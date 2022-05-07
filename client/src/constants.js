export const IPFS_API_ENDPOINT = 'https://ipfs.infura.io:5001'
export const IPFS_PROJECT_ID = '27a33smy5w7Wrvml0j5KWnE7kMp'
export const IPFS_PROJECT_KEY = '90d01bbba737df2b6550a7f32c0415ff'
export const WSS_INFURA_HOST = 'wss://ropsten.infura.io/ws/v3/b8509c529b8c49a39d119cc5effa8400'
export const CONTRACT_ADDRESS = '0xc73625759efb549796497cC606187cD8A361120C'
const { abi } = require('./contracts/Mbrk.json')
export const ABI = abi;

export const LANG = {
    fileUpload: 'Upload file',
    submit: 'Store on IPFS',
    download: 'download',
    delete: 'delete',
    libraryHeader: 'Files',
    remove: 'revoke',
    accessPanel: 'Viewers',
    addUser: 'Add viewer',
    invalidAddress: 'Address is not valid',
    addressExists: 'Address already exists',
    loading: 'Please wait',
    avgDownload: 'Download MB/s',
    avgUpload: 'Upload MB/s',
    avgLatency: 'Latency ms',
    diagnostics: 'Diagnostics',
    ping: 'Ping',
    createUser: 'Create user',
    deleteUser: 'Delete user',
    grantAdmin: 'Grant admin',
    revokeAdmin: 'Revoke admin',

    callPass: 'Smart contract call passed',
    callBad: 'Smart contract call failed',
    adminPanel: 'Admin panel',
    login: 'Login with MetaMask',
    title: 'M\n.B.R.K.',
}