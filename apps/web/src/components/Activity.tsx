import { classNames } from "@deal/utils-client";

const activity = [
  {
    id: 1,
    username: "defekt7x",
    action: "draws 2 cards",
  },
  {
    id: 2,
    username: "defekt7x",
    action: "banks",
    image: "/5m.jpeg",
  },
  {
    id: 3,
    username: "defekt7x",
    action: "ends turn",
  },
  {
    id: 4,
    username: "kimmy1285",
    action: "draws 2 cards",
  },
  {
    id: 5,
    username: "kimmy1285",
    action: "plays card",
    image: "/prop-wild.jpeg",
  },
  {
    id: 6,
    username: "kimmy1285",
    action: "plays card",
    image: "/red-property-card.jpeg",
  },
  {
    id: 7,
    username: "kimmy1285",
    action: "charges defekt7x 2M",
    image: "/rent-wild.jpeg",
  },
  {
    id: 8,
    username: "defekt7x",
    action: "pays with",
    image: "/5m.jpeg",
  },
  {
    id: 9,
    username: "kimmy1285",
    action: "ends turn",
  },
];

export default function Activity() {
  return (
    <ul role="list" className="space-y-6">
      {activity.map((activityItem, activityItemIdx) => (
        <li key={activityItem.id} className="relative flex gap-x-4">
          <div
            className={classNames(
              activityItemIdx === activity.length - 1 ? "h-6" : "-bottom-6",
              "absolute left-0 top-0 flex w-6 justify-center"
            )}
          >
            <div className="w-px bg-gray-200" />
          </div>

          <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
            <div className="h-6 w-6 text-xs font-semibold flex items-center justify-center rounded-full bg-gray-100 ring-1 ring-gray-300">
              {activityItemIdx + 1}
            </div>
          </div>
          <div className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
            <div>
              <span className="font-medium text-gray-900">
                {activityItem.username}
              </span>{" "}
              {activityItem.action}
            </div>

            {activityItem.image && (
              <img src={activityItem.image} className="max-w-[40px] mt-2" />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
