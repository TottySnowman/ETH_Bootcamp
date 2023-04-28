import { useEffect } from "react";
import {
  SuccessMessageType,
  ErrorMessageType,
} from "../../constants/MessageTypes";
export default function SuccessMessage({ ...props }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      props.handleResetMessage();
    }, 6000);
    return () => timer;
  }, [props.MessageVisible]);
  if (props.MessageType == SuccessMessageType) {
    return (
      <div
        className={`flex p-4 justify-center items-center h-screen ${
          props.MessageVisible ? "fixed inset-0" : "hidden"
        }`}
      >
        <div className={`max-w-md alert alert-success shadow-lg`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="font-bold text-black">{props.Message}</h3>
        </div>
      </div>
    );
  } else if (props.MessageType == ErrorMessageType) {
    return (
      <div className="p-4 justify-center items-center h-2">
        <div
          className={`alert alert-error shadow-lg w-64 h-32 ${
            props.MessageVisible ? "fixed  inset-0" : "hidden"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="font-bold text-black">{props.Message}</h3>
        </div>
      </div>
    );
  }
}
