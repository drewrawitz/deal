import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { IconMenu2, IconX, IconBell } from "@tabler/icons-react";
import { useLocation, useNavigate, Link, Outlet } from "react-router-dom";
import { classNames, getAvatarUrl } from "@deal/utils-client";
import Logo from "./components/Logo";
import { useAuthMutations, useAuthQuery } from "@deal/hooks";

const guestNavigation = [{ name: "Sign in", href: "/login" }];

export default function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { data: currentUser } = useAuthQuery();
  const { logoutMutation } = useAuthMutations();

  const onClickLogout = () => {
    logoutMutation.mutate();
    navigate("/login");
  };

  const navigation = [
    { name: "Lobby", href: "/", current: pathname === "/" },
    { name: "Games", href: "/games", current: pathname === "/games" },
    { name: "My Profile", href: "/games", current: false },
    { name: "Stats", href: "/games", current: false },
    { name: "Leaderboard", href: "/games", current: false },
    { name: "Help", href: "/games", current: false },
  ];
  const userNavigation = [
    { name: "Your Profile", href: "#" },
    { name: "Settings", href: "#" },
    { name: "Sign out", onClick: onClickLogout },
  ];

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="border-b border-gray-700">
                  <div className="flex h-20 items-center justify-between px-4 sm:px-0">
                    <div className="flex items-center">
                      <div className="w-24 text-white">
                        <Link to="/" className="block">
                          <Logo />
                        </Link>
                      </div>
                      <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                          {navigation.map((item) => (
                            <Link
                              key={item.name}
                              to={item.href}
                              className={classNames(
                                item.current
                                  ? "bg-gray-900 text-white"
                                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                "rounded-md px-3 py-2 text-sm font-medium"
                              )}
                              aria-current={item.current ? "page" : undefined}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="hidden md:block">
                      <div className="ml-4 flex items-center md:ml-6">
                        {currentUser ? (
                          <>
                            <button
                              type="button"
                              className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                            >
                              <span className="absolute -inset-1.5" />
                              <span className="sr-only">
                                View notifications
                              </span>
                              <IconBell
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>

                            {/* Profile dropdown */}
                            <Menu as="div" className="relative ml-3">
                              <div>
                                <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                  <span className="absolute -inset-1.5" />
                                  <span className="sr-only">
                                    Open user menu
                                  </span>
                                  <img
                                    className="h-8 w-8 rounded-full"
                                    src={getAvatarUrl(currentUser.username)}
                                    alt=""
                                  />
                                </Menu.Button>
                              </div>
                              <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                              >
                                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                  {userNavigation.map((item) => (
                                    <Menu.Item key={item.name}>
                                      {({ active }) => (
                                        <>
                                          {item.href ? (
                                            <Link
                                              to={item.href}
                                              className={classNames(
                                                active ? "bg-gray-100" : "",
                                                "block px-4 py-2 text-sm text-gray-700"
                                              )}
                                            >
                                              {item.name}
                                            </Link>
                                          ) : (
                                            <button
                                              onClick={item.onClick}
                                              className="block w-full text-left px-4 py-2 text-sm text-gray-700"
                                            >
                                              {item.name}
                                            </button>
                                          )}
                                        </>
                                      )}
                                    </Menu.Item>
                                  ))}
                                </Menu.Items>
                              </Transition>
                            </Menu>
                          </>
                        ) : (
                          <>
                            <Link
                              to="/login"
                              className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                            >
                              Sign in
                            </Link>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="-mr-2 flex md:hidden">
                      {/* Mobile menu button */}
                      <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                          <IconX className="block h-6 w-6" aria-hidden="true" />
                        ) : (
                          <IconMenu2
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        )}
                      </Disclosure.Button>
                    </div>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="border-b border-gray-700 md:hidden">
                <div className="space-y-1 px-2 py-3 sm:px-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "block rounded-md px-3 py-2 text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="border-t border-gray-700 pb-3 pt-4">
                  {currentUser ? (
                    <>
                      <div className="flex items-center px-5">
                        <div className="flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={getAvatarUrl(currentUser.username)}
                            alt=""
                          />
                        </div>
                        <div className="ml-3">
                          <div className="text-base font-medium leading-none text-white">
                            {currentUser.username}
                          </div>
                          <div className="text-sm font-medium leading-none text-gray-400">
                            {currentUser.email}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">View notifications</span>
                          <IconBell className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>

                      <div className="mt-3 space-y-1 px-2">
                        {userNavigation.map((item) => (
                          <Disclosure.Button
                            key={item.name}
                            as="a"
                            href={item.href}
                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                          >
                            {item.name}
                          </Disclosure.Button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="px-2">
                      {guestNavigation.map((item, idx) => (
                        <Link
                          key={idx}
                          to={item.href}
                          className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Outlet />
      </div>
    </>
  );
}
