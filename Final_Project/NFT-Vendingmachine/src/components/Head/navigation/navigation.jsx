import WalletIntegration from "../walletintegration/walletIntegration";
import { Route, Routes, Link, NavLink } from "react-router-dom";
import Home from "../../Home/Home";
import { Vendingmachine } from "../../Vendingmachine/Vendingmachine";
import { PersonalListing } from "../../PersonalListing/PersonalListing";
import { Listings } from "../../Listing/Listings";
import NotFound from "../../NotFound/NotFound";
import NFT_Metadata from "../../Listing/DisplayDetails";
import { GiSnowBottle } from "react-icons/gi";
export default function navigation({ ...props }) {
  window.ethereum.on("chainChanged", (chainId) => window.location.reload());
  return (
    <>
      <nav className="navbar bg-neutral p-4 min-h-fit">
        <div className="navbar-start">
          <NavLink to="/" className="pl-4">
            <GiSnowBottle className="h-12 w-24 text-primary" />
            <p className="font-bold">Snowman Soda</p>
          </NavLink>
        </div>
        <div className="navbar-center">
          <NavLink
            to="/Vendingmachine"
            className={({ isActive }) => {
              return isActive
                ? "btn-primary btn font-bold rounded-full"
                : "btn font-bold rounded-full";
            }}
          >
            The Vendingmachine!
          </NavLink>
          <NavLink
            to="/Listings"
            className={({ isActive }) => {
              return isActive
                ? "btn-primary btn font-bold rounded-full"
                : "btn font-bold rounded-full";
            }}
          >
            Listings
          </NavLink>
          <NavLink
            to="/PersonalListing"
            className={({ isActive }) => {
              return isActive
                ? "btn-primary btn font-bold rounded-full"
                : "btn font-bold rounded-full";
            }}
          >
            Personal Listings
          </NavLink>
        </div>
        <div className="navbar-end">
          <WalletIntegration
            WalletState={props.WalletState}
            SetWalletState={props.SetWalletState}
            WalletConnected={props.WalletConnected}
            SetWalletConnected={props.SetWalletConnected}
            Provider={props.Provider}
            ErrorMessageSetVisible={props.ErrorMessageSetVisible}
            SetSigner={props.SetSigner}
            setErrorMessage={props.setErrorMessage}
          />
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Vendingmachine" element={<Vendingmachine />} />
        <Route path="/Listings" element={<Listings Signer={props.Signer} />} />
        <Route path="/PersonalListing" element={<PersonalListing />} />
        <Route path="*" element={<NotFound />} />
        <Route
          path="/NFT_Details/:address/:tokenID"
          element={<NFT_Metadata />}
        />
      </Routes>
    </>
  );
}
