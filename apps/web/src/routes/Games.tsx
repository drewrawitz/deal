import Chat from "../components/Chat";
import GamesTable from "../components/GamesTable";

export default function Games() {
  return (
    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
      <div className="grid grid-cols-1 gap-4 lg:col-span-2">
        <div className="space-y-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <GamesTable
              heading="Waiting to join (2)"
              data={[
                {
                  id: 1,
                  owner: {
                    id: "123",
                    username: "defekt7x",
                  },
                  status: "waiting",
                },
                {
                  id: 2,
                  owner: {
                    id: "123",
                    username: "kimmy1285",
                  },
                  status: "waiting",
                },
              ]}
            />
          </div>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <GamesTable
              heading="In progress (3)"
              data={[
                {
                  id: 1,
                  owner: {
                    id: "123",
                    username: "DASdealer",
                  },
                  status: "in_progress",
                },
                {
                  id: 2,
                  owner: {
                    id: "123",
                    username: "AlexisBWinning",
                  },
                  status: "in_progress",
                },
                {
                  id: 3,
                  owner: {
                    id: "123",
                    username: "knoX",
                  },
                  status: "in_progress",
                },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="grid grid-cols-1 gap-4">
        <section aria-labelledby="section-2-title">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-6 py-4 flex items-center justify-between mb-4 border-b">
              <h2 className="text-xl font-semibold leading-6 text-body">
                Chat
              </h2>
              <div className="flex items-center space-x-2 text-sm">
                <div className="flex-none rounded-full p-1 text-green-500 bg-green-500/20">
                  <div className="h-1.5 w-1.5 rounded-full bg-current" />
                </div>
                <span className="text-green-600 font-medium">32 online</span>
              </div>
            </div>
            <Chat />
          </div>
        </section>
      </div>
    </div>
  );
}
