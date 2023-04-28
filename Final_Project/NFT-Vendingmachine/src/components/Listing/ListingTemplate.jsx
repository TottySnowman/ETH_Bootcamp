import { NavLink } from "react-router-dom";
export default function ListingTemplate({ ...props }) {
  return (
    <div className="card-body">
      <span class="text-center font-bold text-white">
        {props.name}#{props.tokenID}
      </span>
      <div className="items-center text-center">
        <NavLink
          className="no-underline"
          to={`/NFT_Details/${props.address}/${props.tokenID}`}
        >
          <figure>
            <img src={props.nft_img} alt="NFT" />
          </figure>
          {props.ListingNR ? (
            <p className="italic">Listing nr: {props.ListingNR} </p>
          ) : (
            ""
          )}
          <div class="items-center text-center">
            <p className="font-bold">{props.title}</p>
            <p>{props.description}</p>
          </div>
        </NavLink>
      </div>
    </div>
  );
}
