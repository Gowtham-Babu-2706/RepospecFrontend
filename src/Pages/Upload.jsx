import React, { useState } from "react";
import { useCreateRepo, useGithubRepos } from "../utils/axios/useUser";
import { Loader2, Check, AlertCircle } from "lucide-react";

const Github = ({ size = 18, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Upload = () => {
  const [activeTab, setActiveTab] = useState("manual");
  const { createRepo, loading: createLoading, success: createSuccess, error: createError } = useCreateRepo();
  const { repos, loading: reposLoading, error: reposError, fetchRepos } = useGithubRepos();

  const [formData, setFormData] = useState({
    name: "",
    fullName: "",
    description: "",
    language: "",
    topics: "",
  });

  // Keep track of which repo is currently importing
  const [importingRepoId, setImportingRepoId] = useState(null);
  const [successRepos, setSuccessRepos] = useState({});
  const [errorRepos, setErrorRepos] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createRepo(formData);
    setFormData({
      name: "",
      fullName: "",
      description: "",
      language: "",
      topics: "",
    });
  };

  const handleImport = async (repo) => {
    setImportingRepoId(repo.id);
    // Clear previous success/error states for this repo
    setSuccessRepos(prev => ({ ...prev, [repo.id]: false }));
    setErrorRepos(prev => ({ ...prev, [repo.id]: null }));

    const payload = {
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description || "",
      language: repo.language || "",
      topics: repo.topics ? repo.topics.join(", ") : "",
    };

    try {
      await createRepo(payload);
      setSuccessRepos(prev => ({ ...prev, [repo.id]: true }));
    } catch (err) {
      setErrorRepos(prev => ({ ...prev, [repo.id]: err.message || "Failed to import" }));
    } finally {
      setImportingRepoId(null);
    }
  };

  const handleLinkGithub = () => {
    window.location.href = "https://repospecbackend-1.onrender.com/oauth2/authorization/github";
  };

  return (
    <div className="w-full flex justify-center px-4 py-10 bg-white">
      <div className="w-full max-w-4xl bg-gray-50 border border-gray-200 rounded-2xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-center mb-2 text-black">
          Submit Repository
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Add your open source repository to the RepoSpec specialized directory
        </p>

        {/* Tab Header */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            type="button"
            className={`py-3 px-6 font-semibold border-b-2 transition cursor-pointer ${
              activeTab === "manual"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("manual")}
          >
            Manual Form
          </button>
          <button
            type="button"
            className={`py-3 px-6 font-semibold border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === "github"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
            onClick={() => {
              setActiveTab("github");
              fetchRepos();
            }}
          >
            <Github size={18} />
            Import from GitHub
          </button>
        </div>

        {/* Manual Upload Form */}
        {activeTab === "manual" && (
          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
            {[
              ["name", "Repository Name", "e.g. react"],
              ["fullName", "Full Name", "e.g. facebook/react"],
              ["description", "Description", "Short, focused explanation of what the repo does"],
              ["language", "Language", "e.g. JavaScript, Rust, Go"],
              ["topics", "Topics", "Comma separated, e.g. frontend, library, state-management"],
            ].map(([key, label, placeholder]) => (
              <div key={key} className="flex flex-col">
                <label className="text-sm font-semibold mb-2 text-gray-800">
                  {label}
                </label>

                {key === "description" ? (
                  <textarea
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    rows="4"
                    placeholder={placeholder}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black transition bg-white text-gray-900"
                  />
                ) : (
                  <input
                    type="text"
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black transition bg-white text-gray-900"
                  />
                )}
              </div>
            ))}

            {createSuccess && (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 p-4 rounded-xl border border-green-200 animate-fade-in">
                <Check size={18} />
                <p className="font-medium">Repo uploaded successfully ✅</p>
              </div>
            )}

            {createError && (
              <div className="flex items-center gap-2 text-red-700 bg-red-50 p-4 rounded-xl border border-red-200 animate-fade-in">
                <AlertCircle size={18} />
                <p className="font-medium">{createError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={createLoading}
              className="w-full bg-black hover:bg-gray-800 text-white py-3.5 rounded-xl font-semibold disabled:opacity-50 transition cursor-pointer flex items-center justify-center gap-2"
            >
              {createLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Repository"
              )}
            </button>
          </form>
        )}

        {/* GitHub Import Component */}
        {activeTab === "github" && (
          <div className="space-y-6">
            {/* Status alerts */}
            {reposError && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center max-w-xl mx-auto space-y-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto text-amber-700">
                  <AlertCircle size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">GitHub Integration Required</h3>
                <p className="text-sm text-gray-600">
                  To view and import your repositories, you need to sign in or authorize using GitHub.
                </p>
                <button
                  onClick={handleLinkGithub}
                  className="px-6 py-2.5 bg-black text-white hover:bg-gray-800 font-semibold rounded-xl transition flex items-center gap-2 mx-auto cursor-pointer"
                >
                  <Github size={18} />
                  Authorize with GitHub
                </button>
              </div>
            )}

            {reposLoading && (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-500">
                <Loader2 size={36} className="animate-spin text-black" />
                <p className="text-sm font-medium">Fetching repositories from GitHub...</p>
              </div>
            )}

            {!reposLoading && !reposError && repos.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                <p className="text-lg font-semibold">No repositories found</p>
                <p className="text-sm">We couldn't find any public repositories on your GitHub account.</p>
              </div>
            )}

            {!reposLoading && !reposError && repos.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2">
                {repos.map((repo) => {
                  const isImporting = importingRepoId === repo.id;
                  const isSuccess = successRepos[repo.id] || false;
                  const specificError = errorRepos[repo.id];

                  return (
                    <div
                      key={repo.id}
                      className="bg-white border border-gray-200 hover:border-gray-400 p-5 rounded-2xl transition flex flex-col justify-between shadow-sm relative group"
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h3 className="font-bold text-gray-900 truncate group-hover:text-black">
                            {repo.name}
                          </h3>
                          {repo.language && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                              {repo.language}
                            </span>
                          )}
                        </div>

                        <p className="text-gray-500 text-xs mb-3 truncate">
                          {repo.full_name}
                        </p>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
                          {repo.description || "No description provided."}
                        </p>
                      </div>

                      <div className="border-t border-gray-100 pt-4 mt-auto flex items-center justify-between">
                        {/* Tags / Topics */}
                        <div className="flex flex-wrap gap-1 max-w-[70%]">
                          {repo.topics && repo.topics.slice(0, 2).map(topic => (
                            <span key={topic} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                              #{topic}
                            </span>
                          ))}
                        </div>

                        {/* Import button */}
                        {isSuccess ? (
                          <span className="text-green-600 font-semibold text-sm flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                            <Check size={14} />
                            Imported
                          </span>
                        ) : (
                          <button
                            onClick={() => handleImport(repo)}
                            disabled={isImporting || importingRepoId !== null}
                            className="bg-black text-white hover:bg-gray-800 disabled:opacity-50 text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                          >
                            {isImporting ? (
                              <>
                                <Loader2 size={12} className="animate-spin" />
                                Importing
                              </>
                            ) : (
                              "Import"
                            )}
                          </button>
                        )}
                      </div>

                      {specificError && (
                        <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {specificError}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;