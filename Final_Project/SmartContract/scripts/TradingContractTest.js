const { ethers } = require("hardhat");
const hre = require("hardhat");
async function main() {
  const abi = [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "approved",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "ApprovalForAll",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "getApproved",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
      ],
      name: "isApprovedForAll",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "main_contract_addy",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ownerOf",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "string",
          name: "uri",
          type: "string",
        },
      ],
      name: "safeMint",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "setApprovalForAll",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "proxy",
          type: "address",
        },
      ],
      name: "set_Addy",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes4",
          name: "interfaceId",
          type: "bytes4",
        },
      ],
      name: "supportsInterface",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "tokenURI",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  const Snowmantoken = await ethers.getContractFactory(
    "contracts/VendingmachineV4.sol:SnowmanToken"
  );
  const nftContract = await Snowmantoken.deploy();
  await nftContract.deployed();

  console.log("NFT Contract Address is:", nftContract.address);

  const VendingMachine = await ethers.getContractFactory("VendingmachineV4");
  const proxy = await upgrades.deployProxy(VendingMachine, [
    100,
    nftContract.address,
  ]);
  await proxy.deployed();

  const implementationAddress = await upgrades.erc1967.getImplementationAddress(
    proxy.address
  );

  console.log("Proxy contract address: " + proxy.address);

  console.log("Implementation contract address: " + implementationAddress);

  const price = await proxy.soda_amount();
  console.log("Soda Price is:", price);
  const addyNFT = await proxy.SnowmanAddy();
  console.log("Address of NFT in the Vendingmachine is:", addyNFT);
  await nftContract.set_Addy(proxy.address);
  const addy = await nftContract.main_contract_addy();
  console.log("Address in Snowmantoken is set to:", addy);

  await proxy.purchaseSoda({ value: 1000 });
  console.log("Minted an NFT!");
  const OwnerOfNr1 = await nftContract.ownerOf(0);
  console.log("The Owner of NFT number one is:", OwnerOfNr1);

  console.log("Deploying Trading Contract!");

  const TradingContract = await ethers.getContractFactory(
    "contracts/new_newTrading.sol:Trading_New"
  );

  const TrandingContractProxy = await upgrades.deployProxy(TradingContract);
  await TrandingContractProxy.deployed();

  const implemnatationTrading = await upgrades.erc1967.getImplementationAddress(
    TrandingContractProxy.address
  );

  console.log("Proxy contract address: " + TrandingContractProxy.address);

  console.log("Implementation contract address: " + implemnatationTrading);

  console.log("Successfully deployed the trading contract!");

  await proxy.purchaseSoda({ value: 1000 });

  const OwnerOfNr2 = await nftContract.ownerOf(1);
  console.log("Owner of 1", OwnerOfNr2);

  const tx = await nftContract.setApprovalForAll(
    TrandingContractProxy.address,
    true
  );
  await tx.wait();
  await proxy.purchaseSoda({ value: 1000 });
  //await nftContract.setProxyTrading(TrandingContractProxy.address);
  await TrandingContractProxy.listItem(0, nftContract.address, 10000);
  console.log("NFT is Listed!");
  await TrandingContractProxy.listItem(1, nftContract.address, 100);
  const personalListings = await TrandingContractProxy.getPersonalListings();
  console.log("Personal Listings are:", personalListings);
  console.log(await nftContract.ownerOf(1));

  await TrandingContractProxy.buyItem(0, { value: 10000 });

  console.log("Owner after buying!", await nftContract.ownerOf(0));
  const new_personalListings =
    await TrandingContractProxy.getPersonalListings();
  console.log("Personal Listings after buying:", new_personalListings);
  console.log("All listings:", await TrandingContractProxy.getAllListings());
  const signer0 = await ethers.provider.getSigner(0);
  const new_contract = new ethers.Contract(
    "0x8662367839ef9eD726dB6c1ab3EE8167c3538548",
    abi,
    signer0
  );
  await new_contract.safeMint(
    "0xdf5656FF58F644AeD95A59dD3065A0d0b638E4A1",
    "ipfs://QmSXQQwUVCExrvbjLsQmy6ZACshxhywNpgHwpdn3CjAem7"
  );
  console.log("Owner of new contracts is:", await new_contract.ownerOf(0));
  console.log("NFT minted from another contract!");
  //await new_contract.setApprovalForAll(TrandingContractProxy.address, true);
  const isApproved = await new_contract.isApprovedForAll(
    "0xdf5656FF58F644AeD95A59dD3065A0d0b638E4A1",
    TrandingContractProxy.address
  );

  const new_Approved = await nftContract.isApprovedForAll(
    "0xdf5656FF58F644AeD95A59dD3065A0d0b638E4A1",
    TrandingContractProxy.address
  );
  console.log("Old Approved?", new_Approved);

  console.log("Is Approved?", isApproved);

  console.log(await TrandingContractProxy.getAllListings());
}

main();
