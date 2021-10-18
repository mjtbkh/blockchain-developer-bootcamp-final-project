export default function Cast({ link, title, desc }) {
    return (
        <a
            href={link}
            className="bg-white dark:bg-gray-700 dark:border-gray-800 dark:hover:text-blue-300 dark:bg-opacity-50 bg-opacity-30 p-6 mt-6 text-left border border-gray-50 w-96 rounded-xl hover:text-blue-600 focus:text-blue-600 shadow-lg backdrop-blur-md"
          >
            <h3 className="text-2xl font-bold">{title} &rarr;</h3>
            <p className="mt-4 text-xl">
              {desc}
            </p>
          </a>
    )
}