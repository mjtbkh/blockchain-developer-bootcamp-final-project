import { useContext, useState } from "react";
import { FormContext } from "../contexts/FormContext";

export default function PublishForm() {
  const { isFormOpen, episodeObject, setEpisodeObject } =
    useContext(FormContext);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [pledge, setPledge] = useState("");

  return (
    <>
      {isFormOpen && (
        <dialog className="flex flex-col top-1/3 w-1/2 text-center ring-2 ring-gray-300 dark:ring-gray-600 bg-gray-200 border z-20 text-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:border-0 p-0 rounded-md shadow-lg">
          <h2 className="py-4">Publish a new episode</h2>
          <form className="flex flex-col gap-4 px-4 py-6 bg-white dark:bg-gray-700 dark:text-white align-middle justify-center">
            <div className="flex flex-row gap-2 justify-between items-center">
              <label htmlFor="title">title</label>
              <input
                className="p-2 dark:bg-gray-600 ring-2 ring-gray-500 rounded-sm text-white w-5/6"
                type="text"
                id="title"
                name="title"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="London hard-fork: What EIP-1559 did"
              />
            </div>
            <div className="flex flex-row gap-2 justify-between items-center">
              <label htmlFor="link">link</label>
              <input
                className="p-2 dark:bg-gray-600 ring-2 ring-gray-500 rounded-sm text-white w-5/6"
                type="text"
                id="link"
                name="link"
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://link.to/episode"
              />
            </div>
            <div className="flex flex-row gap-2 justify-between items-center">
              <label htmlFor="pledge">pledge</label>
              <input
                className="p-2 dark:bg-gray-600 ring-2 ring-gray-500 rounded-sm text-white w-5/6"
                type="text"
                id="pledge"
                name="pledge"
                onChange={(e) => setPledge(e.target.value)}
                placeholder="0.0005"
              />
            </div>

            <button
              type="submit"
              className="flex flex-row gap-2 justify-center bg-blue-500 hover:bg-blue-600 transition-colors duration-300 shadow-inner rounded-md text-white w-1/2 mx-auto py-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Publish now
            </button>
          </form>
        </dialog>
      )}
    </>
  );
}
