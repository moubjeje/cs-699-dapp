const Mbrk = artifacts.require("Mbrk");

contract('Mbrk', (accounts) => {
    it('should ping', async () => {
        const mbrkInstance = await Mbrk.deployed()
        const res = await mbrkInstance.ping()
        assert.deepEqual(res, {}, 'ping did not respond empty')
    })

    describe('accounts', () => {
        it('should create user', async () => {
            const mbrkInstance = await Mbrk.deployed()
            await mbrkInstance.createUser(accounts[0])
            const user = await mbrkInstance.getUser(accounts[0])
            assert(user.isValid, "createUser() failed")
        })

        it('should fail to create user', async () => {
            const mbrkInstance = await Mbrk.deployed()
            try {
                await mbrkInstance.createUser(accounts[0])
                assert.fail("createUser() allowed duplicate keys")
            } catch (e) {
                assert(true)
            }
        })

        it('should delete user', async () => {
            const mbrkInstance = await Mbrk.deployed()
            await mbrkInstance.deleteUser(accounts[0])
            const user = mbrkInstance.getUser(accounts[0])
            assert(!user.isValid, "deleteUser() failed")
        })

        it('should fail to delete user', async () => {
            const mbrkInstance = await Mbrk.deployed()
            try {
                await mbrkInstance.deleteUser(accounts[0])
                assert.fail("deleteUser() processed inValid key")
            } catch (e) {
                assert(true)
            }
        })
    })

    describe('ant hills', () => {
        it('should enable for new user', async () => {
            const mbrkInstance = await Mbrk.deployed()
            await mbrkInstance.createUser(accounts[1])
            const hill = await mbrkInstance.getHill(accounts[1])
            assert(hill.isValid, "ant hill was not enabled")
        })

        it('should reset for deleted user', async () => {
            const mbrkInstance = await Mbrk.deployed()
            await mbrkInstance.grantReadAccess(accounts[1], accounts[2])
            await mbrkInstance.deleteUser(accounts[1])
            const hill = await mbrkInstance.getHill(accounts[1])
            assert(!hill.isValid, "ant hill was not reset")
            assert(!hill.accessList.length,0,"access list was not reset")
        })

        it('should add user to access list', async () => {
            const mbrkInstance = await Mbrk.deployed()
            await mbrkInstance.createUser(accounts[1])
            await mbrkInstance.grantReadAccess(accounts[1], accounts[2])
            await mbrkInstance.grantReadAccess(accounts[1], accounts[3])
            const hill = await mbrkInstance.getHill(accounts[1])
            assert(hill.accessList[0], accounts[2], "access list is incorrect")
            assert(hill.accessList[1], accounts[3], "access list is incorrect")
        })

        it('should remove user from access list', async () => {
            const mbrkInstance = await Mbrk.deployed()
            await mbrkInstance.revokeReadAccess(accounts[1], accounts[2])
            const hill = await mbrkInstance.getHill(accounts[1])
            assert(hill.accessList[0], accounts[3], "access list is incorrect")
            assert(hill.accessList.length,1, "more than one user in access list")
        })
    })
});
