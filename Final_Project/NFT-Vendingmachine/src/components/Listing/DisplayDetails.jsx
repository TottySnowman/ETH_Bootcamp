import { useParams } from "react-router-dom";
import { alchemy } from "../../constants/AlchemyConfig";
import { useEffect, useState } from "react";

export default function NFT_Metadata() {
  const { tokenID } = useParams();
  const { address } = useParams();
  const [metaData, setMetaData] = useState(null);
  const [nftImage, setNFTImage] = useState();
  useEffect(() => {
    const data = async function getMetaData() {
      const nftMetaData = await alchemy.nft.getNftMetadata(
        address.toString(),
        tokenID.toString(),
        "ERC721"
      );

      if (nftMetaData.media.length > 0) {
        setNFTImage(nftMetaData.media[0].gateway);
      } else {
        setNFTImage(nftMetaData.tokenUri.gateway);
      }
      setMetaData(nftMetaData);
    };
    data();
  }, []);
  return (
    <div className="flex prose m-4 items-center justify-center">
      {metaData ? (
        <div className="items-center justify-center">
          <h1>
            {metaData.contract.name}#{metaData.tokenId}
          </h1>
          <figure>
            <img
              src="https://ipfs.io/ipfs/QmPWXKhu8FC5PMuJSEu1h7pab6gTHKyzseeWer1rxfLsVh"
              alt="NFT"
            />
          </figure>
          <h2>Title: {metaData.title}</h2>
          <p>Description: {metaData.description}</p>
          <p>Contract Address: {metaData.contract.address}</p>
          <p>Attributes:</p>
          {metaData.rawMetadata.attributes.map((attribute, index) => {
            return (
              <p key={index}>
                {attribute.trait_type} : {attribute.value}
              </p>
            );
          })}
        </div>
      ) : (
        <h1>Loading data...</h1>
      )}
    </div>
  );
}
