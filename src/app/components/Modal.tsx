"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-[101] overflow-y-auto">
          <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom={
                isMobile
                  ? "translate-y-full"
                  : "translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
              }
              enterTo={
                isMobile
                  ? "translate-y-0"
                  : "translate-y-0 opacity-100 sm:scale-100"
              }
              leave="ease-in duration-200"
              leaveFrom={
                isMobile
                  ? "translate-y-0"
                  : "translate-y-0 opacity-100 sm:scale-100"
              }
              leaveTo={
                isMobile
                  ? "translate-y-full"
                  : "translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
              }
            >
              <Dialog.Panel
                className={`relative w-full transform overflow-hidden bg-white text-left shadow-xl transition-all
                  ${
                    isMobile
                      ? "rounded-t-3xl"
                      : "rounded-2xl sm:my-8 sm:w-full sm:max-w-lg"
                  }`}
              >
                {/* Mobile Pull Indicator */}
                {isMobile && (
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-300 rounded-full" />
                )}

                {/* Close Button */}
                <div className="absolute right-4 top-4">
                  <button
                    type="button"
                    className="p-2 -m-2 text-gray-400 hover:text-gray-500 transition-colors touch-none"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8">
                  <Dialog.Title
                    as="h3"
                    className="text-lg sm:text-xl font-semibold text-gray-900 pr-8"
                  >
                    {title}
                  </Dialog.Title>
                  <div className="mt-4 sm:mt-6">{children}</div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
