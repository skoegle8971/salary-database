const serverUrl =
  import.meta.env.VITE_ENV === "local"
    ? import.meta.env.VITE_LOCAL_URL
    : import.meta.env.VITE_WEB_URL;

export const apiUrl = `${serverUrl}`;
