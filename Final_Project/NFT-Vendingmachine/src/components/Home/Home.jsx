import EmailFeedback from "../Feedback/EmailFeedback";
export default function Home() {
  return (
    <div className="prose  p-4 items-center">
      <h1>Snowman Soda!</h1>
      <p>
        This project is my final project for the{" "}
        <a
          className="text-blue-400"
          href="https://www.alchemy.com/"
          target={"_blank"}
        >
          Alchemy University
        </a>{" "}
        Ethereum Developer Bootcamp!
      </p>
      <p>
        This is my first React project I've build on my own without following a
        tutorial!
      </p>
      <p>This app is currently only deployed on the Sepolia Network!</p>
      <h2 className="mb-0">Ressources:</h2>
      <ul>
        <li className="list-none">Vite and React</li>
        <li className="list-none">Daisy UI and Tailwind CSS for Styling</li>
        <li className="list-none">Solidity to write Smartcontracts</li>
        <li className="list-none">Alchemy University API for NFT-Metadata</li>
        <li className="list-none">
          ethers.js for connecting to the Blockchain
        </li>
        <li className="list-none">NFT generated by Midjourney</li>
      </ul>
      <EmailFeedback />
    </div>
  );
}
