// import artifact - helps us interact with contract
const SimpleStorage = artifacts.require("SimpleStorage.sol")

// contract block
contract("SimpleStorage", () => {
  it("Should update data", async () => {
    // deploy - storage is a pointer to our SC instance
    const storage = await SimpleStorage.new()

    // call updateData function & wait fot TX to be mined
    await storage.updateData(10)

    // call readData function (view function - no gas)
    const data = await storage.readData()

    // if number is BIG this can fail due to overflow
    // assert(data.toNumber() === 10);

    // simple string comparison - typeof(data) is BigNumber 
    assert(data.toString() === "10")
  })
})
