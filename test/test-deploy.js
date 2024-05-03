const { ethers } = require("hardhat");
const { assert } = require("chai");

describe("TemperaturaStorage", function () {
  let contractFactory, contract;
  const key = "k";
  beforeEach(async function () {
    contractFactory = await ethers.getContractFactory("TemperaturaStorage");
    contract = await contractFactory.deploy();
  });

  it("Should start with a value equal to the empty string", async function () {
    const currentValue = await contract.retrieve(key);
    const expectedValue = "";
    assert.equal(currentValue, expectedValue);
  });
  it("Should update when we call store", async function () {
    const expectedValue = "valoreTemperatura";
    const transactionResponse = await contract.store(key, expectedValue);
    await transactionResponse.wait(1);

    const currentValue = await contract.retrieve(key);
    assert.equal(currentValue.toString(), expectedValue);
  });
});
