import { useState, useEffect } from "react";
import { fetchAllData,searchRepos,createRepoData,fetchGithubRepos } from "./userApi";

export const useUser = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);

      const res = await fetchAllData();
      const newData = Array.isArray(res) ? res : res.content || [];

      setData((prev) => {
        const merged = [ ...newData];

        const unique = Array.from(
          new Map(merged.map(item => [item.id, item])).values()
        );

        return unique;
      });

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(); // initial load
  }, []);

  return { data, loading, refetch: getData };
};



export const useRepoSearch = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async (filters) => {
    try {
      setLoading(true);

      const res = await searchRepos(filters);

      setData(res.content || []);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, search };
};

export const useCreateRepo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const createRepo = async (payload) => {
    try {
      setLoading(true);
      setError("");
      setSuccess(false);

      const res = await createRepoData(payload);

      setSuccess(true);
      return res;
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    createRepo,
    loading,
    error,
    success,
  };
};

export const useGithubRepos = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getRepos = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetchGithubRepos();
      setRepos(res || []);
    } catch (err) {
      setError(
        err.response?.data?.error || 
        err.message || 
        "Failed to fetch GitHub repositories."
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    repos,
    loading,
    error,
    fetchRepos: getRepos,
  };
};