import { useState } from "react";
import {
  SuccessMessageType,
  ErrorMessageType,
} from "../../constants/MessageTypes";
import { ethers } from "ethers";
import { errorCodeMapping } from "../../constants/ErrorCodes";
export default function UpdatePrice({ ...props }) {
  const [newPrice, setNewPrice] = useState(props.currentPrice);
  function handlePriceChange(event) {
    setNewPrice(event.target.value);
  }
  async function handleUpdatePrice() {
    const VendingMachineContract = props.VendingmachineContract;
    try {
      const tx = await VendingMachineContract.update_price(
        ethers.parseEther(newPrice.toString())
      );
      props.handleShowMessage(
        SuccessMessageType,
        "Changing the price...",
        true
      );
      await tx.wait();
      props.handleShowMessage(SuccessMessageType, "Price changed!", true);
      props.LoadVendingmachineDetails();
    } catch (error) {
      if (error.message.includes("revert")) {
        props.handleShowMessage(
          ErrorMessageType,
          error.message.split('"')[1].trim(),
          true
        );
      } else {
        this.setState({
          MessageVisible: true,
          MessageType: ErrorMessageType,
          Message:
            errorCodeMapping[error.code] ||
            `Update price failed: ${error.message}`,
        });
      }
    }
  }
  return (
    <>
      <h2>Update Price</h2>
      <div className="flex items-end">
        <p className="flex flex-col w-1/2">
          Updated Price:
          <input
            type="text"
            name="price"
            value={newPrice}
            onChange={handlePriceChange}
            className="items-end text-center input input-bordered input-primary ml-3 w-fill"
          />
        </p>
        <button
          onClick={handleUpdatePrice}
          className="btn btn-primary w-1/2 m-4 mb-5"
        >
          Update Price now!
        </button>
      </div>
    </>
  );
}
