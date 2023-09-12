import { useState } from "react";
import { useAuthQuery, useChatMutations } from "@deal/hooks";

export default function CommentInput() {
  const [message, setMessage] = useState("");
  const { data: currentUser } = useAuthQuery();
  const { createChatMutation } = useChatMutations();

  const onSubmit = async (e: React.FormEvent) => {
    createChatMutation
      .mutateAsync({
        content: message,
      })
      .then(() => {
        setMessage("");
      });

    e.preventDefault();
  };

  if (!currentUser) {
    return (
      <p className="text-center font-medium text-sm border-t pt-4">
        You must be logged in to post in the chat.
      </p>
    );
  }

  return (
    <div className="flex items-start space-x-4">
      <div className="min-w-0 flex-1">
        <form onSubmit={onSubmit} className="relative">
          <div className="overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-1 focus-within:ring-body">
            <label htmlFor="comment" className="sr-only">
              Message
            </label>
            <textarea
              rows={3}
              name="comment"
              id="comment"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Write something here..."
            />
          </div>
          <div className="text-right mt-4">
            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-body px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-body/80 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-body"
            >
              Post Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
