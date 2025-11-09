import path from "path";

const makeURL = (
  filename: string,
  filetype: "image/jpg" | "image/png",
  folder: "products" | "users"
): string => {
  // Ensure BASE_URL is defined in your environment variables in the frontend if you intend to use this there
  const baseURL = process.env.BASE_URL as string;

  return new URL(
    path.join("/static", folder, `${filename}.${filetype.split("/")[1]}`),
    baseURL
  ).toString();
};

export { makeURL };
