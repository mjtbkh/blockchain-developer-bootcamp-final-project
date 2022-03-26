import { useState, useContext } from "react";
import { PublisherContext } from "../contexts";
import ConnectContract from '../hooks/connectContract';

export default function PublishersForm() {
  const [toInvite, setToInvite] = useState("");
  const [toRevoke, setToRevoke] = useState("");
  const { isPublishersOpen } = useContext(PublisherContext);

  return (
    <>
      {isPublishersOpen && (
        <dialog className="flex flex-col top-1/4 w-1/2 text-center ring-2 ring-gray-300 dark:ring-gray-600 bg-gray-200 border z-20 text-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:border-0 p-0 rounded-md shadow-lg">
          <h2 className="py-4">Manage publishers</h2>
          <section className="flex flex-col w-full justify-items-stretch gap-4 p-4 dark:bg-gray-700 bg-white">
            <section className="flex flex-row gap-4 items-center justify-between">
              <label htmlFor="invitePub">Invite publsiher</label>
              <input
                type="text"
                id="invitePub"
                name="invitePub"
                placeholder="0x00...1234"
                className="dark:bg-gray-600 ring-2 ring-gray-400 p-2 w-96 rounded-sm h-8"
                onChange={(e) => setToInvite(e.target.value)}
              />
              <button onClick={e => ConnectContract.invitePublisher(toInvite)} className="rounded-md p-2 w-24 text-center bg-blue-500 shadow-inner text-white">Invite</button>
            </section>
            <section className="flex flex-row gap-4 items-center justify-between">
              <label htmlFor="revokePub">Revoke publsiher</label>
              <input
                type="text"
                id="revokePub"
                name="revokePub"
                placeholder="0x00...1234"
                className="dark:bg-gray-600 ring-2 ring-gray-400 p-2 w-96 rounded-sm h-8"
                onChange={(e) => setToRevoke(e.target.value)}
              />
              <button onClick={e => ConnectContract.revokePublisher(toRevoke)} className="rounded-md p-2 w-24 text-center bg-red-400 shadow-inner text-white">Revoke</button>
            </section>
          </section>
        </dialog>
      )}
    </>
  );
}
