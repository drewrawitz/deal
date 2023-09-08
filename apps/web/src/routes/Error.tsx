import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError() as any;
  console.error(error);

  return (
    <div className="flex items-center justify-center h-screen flex-col space-y-4">
      <h1 className="text-3xl font-bold">Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p className="text-gray-400">
        <em>{error.statusText || error.message}</em>
      </p>
    </div>
  );
}
