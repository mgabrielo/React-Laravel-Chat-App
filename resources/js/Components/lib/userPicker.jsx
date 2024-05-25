import { useState, Fragment } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";

const UserPicker = ({ value, options, onSelect }) => {
    const [selected, setSelected] = useState(value);
    const [query, setQuery] = useState("");
    const filteredPeople =
        query == ""
            ? options
            : options.filter((person) => {
                  return person.name
                      .toLowerCase()
                      .replace(/\s+/g, "")
                      .includes(query.toLowerCase().replace(/\s+/g, ""));
              });

    const onSelected = (persons) => {
        setSelected(persons);
        onSelect(persons);
    };
    return (
        <>
            <Combobox value={selected} onChange={onSelected} multiple>
                <div className="relative mt-1">
                    <div
                        className={`relative w-full cursor-default overflow-hidden sm:text-sm
                    rounded-lg text-left shadow-md focus:outline-none focus-visible:ring-2
                    focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300`}
                    >
                        <Combobox.Input
                            className={`border-gray-300 dark:border-gray-700 dark:bg-gray-800 
                        dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-indigo-500
                        dark:focus:ring-indigo-600 rounded-md shadow-md mt-1 block w-full`}
                            displayValue={(persons) =>
                                persons?.length > 0
                                    ? `${persons?.length} user(s) selected`
                                    : ""
                            }
                            placeholder="Select Users..."
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <Combobox.Button
                            className={`absolute inset-y-0 right-0 flex items-center pr-2`}
                        >
                            <ChevronUpDownIcon className="size-5 text-gray-400" />
                        </Combobox.Button>
                    </div>
                    <Transition
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery("")}
                        as={Fragment}
                    >
                        <Combobox.Options
                            className={`absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-900
                        py-1 text-base shadow-md ring-1 ring-black/5 focus:outline sm:text-sm`}
                        >
                            {filteredPeople.length === 0 && query !== "" ? (
                                <div className="relative cursor-default select-none px-4 py-2 text-gray-600">
                                    Nothing found
                                </div>
                            ) : (
                                filteredPeople.map((person) => (
                                    <Combobox.Option
                                        key={person.id}
                                        value={person}
                                        className={({ active }) => `${
                                            active
                                                ? "bg-teal-600 text-white"
                                                : "bg-gray-900 text-gray-100"
                                        } 
                                        relative cursor-default select-none pl-10 pr-4 py-2`}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span
                                                    className={`block truncate text-wrap ${
                                                        selected
                                                            ? "font-medium"
                                                            : "font-normal"
                                                    }`}
                                                >
                                                    {person.name}
                                                </span>
                                                {selected ? (
                                                    <span
                                                        className={` absolute inset-y-0 left-0 flex items-center
                                                    pl-3 text-white`}
                                                    >
                                                        <CheckIcon
                                                            className="size-5"
                                                            aria-hidden={"true"}
                                                        />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Combobox.Option>
                                ))
                            )}
                        </Combobox.Options>
                    </Transition>
                </div>
            </Combobox>
            {selected && (
                <div className="flex gap-2 mt-2 flex-wrap">
                    {selected.map((person) => (
                        <div
                            key={person.id}
                            className="badge badge-primary gap-2 p-2"
                        >
                            {person.name}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default UserPicker;
