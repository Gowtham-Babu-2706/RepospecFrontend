import React from 'react'

const Card = ({repo}) => {
  return (
    <div className="border rounded-xl p-6">
            <p className="text-xs text-gray-400">
              {repo.fullName}
            </p>

            <h2 className="text-xl font-semibold mt-1">
              {repo.name}
            </h2>

            <p className="text-sm mt-2 text-gray-700">
              {repo.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {repo.topics?.split(",").slice(0, 3).map((topic, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                >
                  {topic.trim()}
                </span>
              ))}
            </div>

            <div className="flex justify-between mt-5 text-sm">
              <span>⭐ {repo.stars}</span>
              <span>{repo.language || "Unknown"}</span>
            </div>
     
            <a
              href={`https://github.com/${repo.fullName}`}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-4 font-medium"
            >
              View Repository →
            </a>
          </div>
  )
}

export default Card