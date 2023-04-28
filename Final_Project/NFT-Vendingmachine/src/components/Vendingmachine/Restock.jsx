import { useState } from "react";
import {
  SuccessMessageType,
  ErrorMessageType,
} from "../../constants/MessageTypes";
import { errorCodeMapping } from "../../constants/ErrorCodes";
export default function RestockSoda({ ...props }) {
  const [restockAmount, setRestockAmount] = useState(0);
  function handleChangeRestockSoda(event) {
    setRestockAmount(event.target.value);
  }
  async function handleRestockSoda() {
    const VendingMachineContract = props.VendingmachineContract;
    try {
      const tx = await VendingMachineContract.restockSoda(restockAmount);
      props.handleShowMessage(SuccessMessageType, "Restocking...", true);
      await tx.wait();
      props.handleShowMessage(
        SuccessMessageType,
        "Successfully restocked!",
        true
      );
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
            errorCodeMapping[error.code] || `Restock failed: ${error.message}`,
        });
      }
    }
  }
  return (
    <>
      <h2>Restock Soda</h2>
      <div className="flex items-end">
        <p className="w-1/2 flex flex-col">
          Restock amount:
          <input
            type="text"
            name="restock"
            value={restockAmount}
            onChange={handleChangeRestockSoda}
            className="text-center input input-bordered input-primary input-bordered ml-3"
          />
        </p>
        <button
          onClick={handleRestockSoda}
          className="btn btn-primary w-1/2 m-4 mb-5"
        >
          Restock now!
        </button>
      </div>
    </>
  );
}
