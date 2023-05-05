import { sendForm } from "@emailjs/browser";
import { useRef, useState } from "react";
import {
  ErrorMessageType,
  SuccessMessageType,
} from "../../constants/MessageTypes";
import Message from "../Messages/Message";
import "./dialog_styles.css";
export default function EmailFeedback() {
  const feedback_form = useRef();
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [message, setMessage] = useState("");
  const [messageVisible, setMessageVisible] = useState(false);
  const [displayMessage, setDisplayMessage] = useState("");
  const [messageType, setMessageType] = useState();

  function openDialog() {
    const feedbackDialog = document.getElementById("EmailFeedback");
    feedbackDialog.showModal();
  }

  function closeDialog() {
    const feedbackDialog = document.getElementById("EmailFeedback");
    feedbackDialog.close();
  }
  function resetMessage() {
    setMessageVisible(false);
    setDisplayMessage("");
    setMessageType(null);
  }
  const sendFeedback = (e) => {
    e.preventDefault();
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (
      name.trim().length <= 0 ||
      mail.trim().length <= 0 ||
      message.trim().length <= 0
    ) {
      setMessageVisible(true);
      setDisplayMessage("Please fill out all textboxes!");
      setMessageType(ErrorMessageType);
      return;
    }
    if (!emailRegex.test(mail.trim())) {
      setMessageVisible(true);
      setDisplayMessage("Please provide a valid mail!");
      setMessageType(ErrorMessageType);
      return;
    }
    sendForm(
      "SnowmanSoda_Service",
      "template_ek4ew4i",
      feedback_form.current,
      "1T0CyJ0kULNj5pROU"
    ).then(
      (result) => {
        setMessageVisible(true);
        setDisplayMessage("Feedback sent successfully! Thank you!");
        setMessageType(SuccessMessageType);
        e.target.reset();
      },
      (error) => {
        setMessageVisible(true);
        setDisplayMessage(
          "Error while trying to send the feedback! Try again!"
        );
        setMessageType(ErrorMessageType);
      }
    );
    closeDialog();
  };
  return (
    <div>
      <p>
        You can leave a feedback{"  "}
        <button onClick={openDialog} className="btn btn-primary">
          Here!
        </button>
      </p>

      <dialog id="EmailFeedback" className="items-center w-1/2 border rounded">
        <h2 className="mt-0">Feedback form</h2>
        <form
          ref={feedback_form}
          onSubmit={sendFeedback}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="input input-bordered input-primary text-center"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          ></input>
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="textarea input-bordered input-primary text-center"
            required
            value={mail}
            onChange={(event) => setMail(event.target.value.trim())}
          ></input>
          <textarea
            name="message"
            id=""
            placeholder="Your Feedback"
            rows="7"
            className="textarea w-full input-bordered input-primary"
            required
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <div className="flex items-end">
            <div className="w-1/2 flex flex-col">
              <button
                formmethod="dialog"
                onClick={closeDialog}
                type="button"
                className="btn btn-secondary m-4"
              >
                Close
              </button>
            </div>
            <div className="w-1/2 flex flex-col">
              <button type="submit" className="btn btn-primary m-4">
                Send Feedback!
              </button>
            </div>
          </div>
        </form>
      </dialog>

      <Message
        MessageVisible={messageVisible}
        Message={displayMessage}
        MessageType={messageType}
        handleResetMessage={resetMessage}
      />
    </div>
  );
}
