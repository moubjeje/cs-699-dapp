const Mbrk = artifacts.require("Mbrk");

contract('Mbrk', (accounts) => {
    it('should ping', async () => {
        const mbrkInstance = await Mbrk.deployed()
        const res = await mbrkInstance.ping()
        assert.deepEqual(res, {},'ping did not respond empty')
    })

    describe('user create and delete', () => {
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

});
