import api from "./api";

export const fetchAllData = async () => {
  const resp = await api.get(`/random`);
  return resp.data;
};

export const searchRepos = async (filters) => {
  const query = new URLSearchParams(filters).toString();
  const resp = await api.get(`/search?${query}`);
  return resp.data;
};

export const createRepoData = async (data) => {
  const resp = await api.post("/save", data);
  return resp.data;
};

export const fetchGithubRepos = async () => {
  const resp = await api.get("/github-repos");
  return resp.data;
};