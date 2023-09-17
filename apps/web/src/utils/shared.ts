import toast from "react-hot-toast";

export const handleError = (err: any) => {
  console.error("Something went wrong", err);
  toast.error(err?.response?.data?.message ?? "Something went wrong");
};
