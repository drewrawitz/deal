export default function CommentInput() {
  return (
    <div className="flex items-start space-x-4">
      <div className="min-w-0 flex-1">
        <form action="#" className="relative">
          <div className="overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-1 focus-within:ring-body">
            <label htmlFor="comment" className="sr-only">
              Add your comment
            </label>
            <textarea
              rows={3}
              name="comment"
              id="comment"
              className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Add your comment..."
              defaultValue={""}
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
