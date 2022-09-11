const hre = require('hardhat');
const { seedSubgraph, saveDeployedContract, createName } = require('./utils');

async function deployContract(seedSubgraphBool) {
  const ERC721 = await hre.ethers.getContractFactory('ERC721StandardToken');
  const deployer = await hre.ethers.getSigners();
  const { contractName, symbol } = await createName();
  const erc721 = await ERC721.deploy(contractName, symbol, 10000);
  let contractDeployed = await erc721.deployed();

  await saveDeployedContract({
    name: contractName,
    symbol,
    address: erc721.address,
    deployer: await deployer[0].getAddress(),
    createdAt: new Date().toISOString(),
  });

  if (seedSubgraphBool) {
    seedSubgraph(erc721.address);
    console.log(`📗 ${erc721.address} - "${contractName}"`);
  } else {
    console.log(`📔 ${erc721.address} - "${contractName}"`);
  }
  await contractDeployed.flipSaleState();
  return contractDeployed;
}

async function main() {
  for (let i = 0; i < 5; i++) {
    await deployContract(i === 0);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
