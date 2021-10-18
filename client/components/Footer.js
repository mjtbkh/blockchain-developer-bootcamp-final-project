export default function Footer() {
  return (
    <footer className="flex items-center justify-center dark:text-white dark:bg-gradient-to-br from-blue-700 to-indigo-700 bg-opacity-80 w-full py-24 h-24 shadow-inner bottom-0 z-0">
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
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
      &nbsp;
      <a
        className="underline"
        href="https://github.com/mjtbkh/blockchain-developer-bootcamp-final-project.git"
        target="_blank"
        rel="noopener noreferrer"
      >
        EthRadio
      </a>
      &nbsp;developed by&nbsp;
      <a
        className="underline"
        href="https://github.com/mjtbkh/"
        target="_blank"
        rel="noopener noreferrer"
      >
        @mjtbkh
      </a>
    </footer>
  );
}
