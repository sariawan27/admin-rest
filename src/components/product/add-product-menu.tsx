import cn from "classnames";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import Avatar from "@components/common/avatar";
import Link from "@components/ui/link";
import { siteSettings } from "@settings/site.settings";
import { useTranslation } from "next-i18next";
import { useMeQuery } from "@data/user/use-me.query";
import { ROUTES } from "@utils/routes";
import { useModalAction } from "@components/ui/modal/modal.context";

export default function AddProductMenu() {
    const { data } = useMeQuery();
    const { t } = useTranslation("common");

    const { openModal } = useModalAction();

    function handleImport() {
        openModal("EXPORT_IMPORT_PRODUCT");
    }
    // Again, we're using framer-motion for the transition effect
    return (
        <Menu as="div" className="relative inline-block text-left m-2">
            <Menu.Button className="flex items-center flex-shrink-0 text-sm md:text-base font-semibold h-11 focus:outline-none text-heading xl:px-4 bg-light xl:text-accent xl:min-w-150 rounded">
                Add Products
                {/* <Avatar
                    src={
                        data?.profile?.avatar?.thumbnail ??
                        siteSettings?.avatar?.placeholder
                    }
                    alt="avatar"
                /> */}
            </Menu.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items
                    as="ul"
                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    style={{ zIndex: 100 }}
                >
                    <Menu.Item>
                        {({ active }) => (
                            <li className="border-b border-gray-100 cursor-pointer last:border-0">
                                <button className="block px-4 py-3 text-sm capitalize font-semibold transition duration-200 hover:text-accent w-full text-left" onClick={handleImport}>Import</button>
                                {/* <Link
                                    href={``}
                                    className={cn(
                                        "flex space-s-4 items-center w-full px-5 py-2.5 text-sm font-semibold capitalize  transition duration-200 hover:text-accent focus:outline-none",
                                        active ? "text-accent" : "text-heading"
                                    )}
                                >
                                    Import
                                </Link> */}
                            </li>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <li className="border-b border-gray-100 cursor-pointer last:border-0">
                                <Link
                                    href={`${ROUTES.PRODUCTS}/create`}
                                    className={cn(
                                        "block px-4 py-3 text-sm capitalize font-semibold transition duration-200 hover:text-accent",
                                        active ? "text-accent" : "text-heading"
                                    )}
                                >
                                    Manual
                                </Link>
                            </li>
                        )}
                    </Menu.Item>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}
