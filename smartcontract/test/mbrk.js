const Mbrk = artifacts.require("Mbrk");

contract('Mbrk', (accounts) => {
    const owner = accounts[0];

    it('should ping', async () => {
        const mbrkInstance = await Mbrk.deployed()
        const res = await mbrkInstance.ping()
        assert.deepEqual(res, {}, 'ping did not respond empty')
    })

    describe('accounts', () => {
        it('should create user', async () => {
            const mbrkInstance = await Mbrk.deployed()
            await mbrkInstance.createUser(accounts[1])
            const user = await mbrkInstance.getUser({ from: accounts[1] })
            assert(user.isValid, "createUser() failed")
        })

        it('should fail to create user', async () => {
            const mbrkInstance = await Mbrk.deployed()
            try {
                await mbrkInstance.createUser(accounts[1])
                assert.fail("createUser() allowed duplicate keys")
            } catch (e) { }
        })

        it('should delete user', async () => {
            const mbrkInstance = await Mbrk.deployed()
            await mbrkInstance.deleteUser(accounts[1])
            try {
                await mbrkInstance.getUser({ from: accounts[1] })
                assert.fail("getUser() returned deleted user")
            } catch (e) { }
        })

        it('should fail to delete self', async () => {
            const mbrkInstance = await Mbrk.deployed()
            try {
                await mbrkInstance.deleteUser(accounts[0])
                assert.fail("deleteUser() allowed self-deletion")
            } catch (e) { }
        })
    })

    describe('admins', () => {
        it('should grant admin rights', async () => {
            const mbrkInstance = await Mbrk.deployed()
            await mbrkInstance.createUser(accounts[1])
            await mbrkInstance.grantAdmin(accounts[1])
            const res = await mbrkInstance.getUser({ from: accounts[1] })
            assert(res.isAdmin, "grantAdmin() failed")
        })

        it('should revoke admin rights', async () => {
            const mbrkInstance = await Mbrk.deployed()
            await mbrkInstance.revokeAdmin(accounts[1])
            const res = await mbrkInstance.getUser({ from: accounts[1] })
            assert(!res.isAdmin, "grantAdmin() failed")
        })

        it('should fail to create user as non-admin', async () => {
            const mbrkInstance = await Mbrk.deployed()
            try {
                await mbrkInstance.createUser(accounts[2], { from: accounts[1] })
                assert.fail("createUser() allowed non-admin")
            } catch (e) {
                assert(true)
            }
        })
    })

    describe('ant hills', () => {
        it('should enable for new user', async () => {
            const mbrkInstance = await Mbrk.deployed()
            const hill = await mbrkInstance.getHill({ from: accounts[1] })
            assert(hill.isValid, "ant hill was not enabled")
        })

        it('should add users to access list', async () => {
            const mbrkInstance = await Mbrk.deployed()
            await mbrkInstance.createUser(accounts[3])
            await mbrkInstance.createUser(accounts[2])
            await mbrkInstance.grantReadAccess(accounts[3], { from: accounts[1] })
            await mbrkInstance.grantReadAccess(accounts[2], { from: accounts[1] })
            const hill = await mbrkInstance.getHill({ from: accounts[1] })
            const user = await mbrkInstance.getUser({ from: accounts[2] })
            assert(user.accessList[0], accounts[1], "access list is incorrect")
            assert(hill.accessList[1], accounts[2], "access list is incorrect")
            assert(hill.accessList[0], accounts[3], "access list is incorrect")
        })

        it('should delete on deleted user', async () => {
            const mbrkInstance = await Mbrk.deployed()
            await mbrkInstance.deleteUser(accounts[1])
            try {
                await mbrkInstance.getHill({ from: accounts[1] })
                assert.fail("hill was not deleted")
            } catch (e) {
                assert(true)
            }
        })

        it('should fail to add user to access list', async () => {
            const mbrkInstance = await Mbrk.deployed()
            try {
                await mbrkInstance.grantReadAccess(accounts[1], { from: accounts[2] })
                assert.fail("grantReadAccess() allowed deleted user")
            } catch (e) { }
        })

        it('should remove user from access list', async () => {
            const mbrkInstance = await Mbrk.deployed()
            await mbrkInstance.createUser(accounts[1])
            await mbrkInstance.grantReadAccess(accounts[2], { from: accounts[1] })
            await mbrkInstance.grantReadAccess(accounts[3], { from: accounts[1] })
            await mbrkInstance.revokeReadAccess(accounts[2])
            const hill = await mbrkInstance.getHill({ from: accounts[1] })
            assert(hill.accessList[0], accounts[3], "access list is incorrect")
            assert(hill.accessList.length, 1, "more than one user in access list")
        })
    })

    describe('files', () => {
        const filename = "good file"
        const cid = "good cid"
        const fileSize = 444

        it('should create file meta', async () => {
            const mbrkInstance = await Mbrk.deployed()
            await mbrkInstance.createFile(filename, cid, fileSize, { from: accounts[1] })
            const res = await mbrkInstance.checkFileExists(filename, { from: accounts[1] });
            assert(res, "file was not created")
        })

        it('should get file meta', async () => {
            const mbrkInstance = await Mbrk.deployed()
            const res = await mbrkInstance.getFile(filename, { from: accounts[1] })
            assert(res.cid, cid, "cid incorrect")
            assert(res.size, fileSize, "file size incorrect")
            assert(res.isValid, true, "file is not valid")
        })

        it('should delete file meta', async () => {
            const mbrkInstance = await Mbrk.deployed()
            await mbrkInstance.deleteFile(filename, { from: accounts[1] })
            const res = await mbrkInstance.checkFileExists(filename, { from: accounts[1] })
            try {
                await mbrkInstnace.getFile(filename, { from: accounts[1] })
                assert.fail("getFile() returned deleted file")
            } catch (e) { }
            assert(!res, cid, "cid incorrect")
        })
    })
});
