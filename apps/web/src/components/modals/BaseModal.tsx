import { Dialog, Transition } from "@headlessui/react";
import { IconX } from "@tabler/icons-react";
import React, { Fragment } from "react";

interface BaseModalProps {
  heading?: string;
  show: boolean;
  children: React.ReactNode;
  onClose: () => void;
}

const BaseModal: React.FC<BaseModalProps> = ({
  heading,
  show,
  children,
  onClose,
}) => {
  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog as="div" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-80 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full justify-center items-center p-4 sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden bg-white rounded-lg text-left shadow-xl transition-all min-w-[400px]">
                {heading && (
                  <div className="bg-white border-b px-4 py-3 flex items-center space-between">
                    <div className="flex-1">
                      <Dialog.Title
                        as="h1"
                        className="text-xl font-medium text-gray-900"
                      >
                        {heading}
                      </Dialog.Title>
                    </div>
                    <button
                      type="button"
                      className="hover:bg-sand-200 p-1 rounded-md"
                      onClick={onClose}
                    >
                      <IconX className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default BaseModal;
