import { useEffect, useState } from "react";
import TextAreaInput from "@/Components/lib/textAreaInput";
import UserPicker from "@/Components/lib/userPicker";

import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import { useForm, usePage } from "@inertiajs/react";
import { useEventBus } from "@/eventBus";

const GroupModal = ({ show = false, onClose = () => {} }) => {
    const page = usePage();
    const conversations = page.props.conversations;
    const { on, emit } = useEventBus();
    const [group, setGroup] = useState({});
    const { data, setData, processing, reset, post, put, errors } = useForm({
        id: "",
        name: "",
        description: "",
        user_ids: [],
    });

    const users = conversations.filter(
        (conversation) => !conversation.is_group
    );

    const createOrUpdateGroup = (e) => {
        e.preventDefault();
        console.log(group.id, "groupid");
        if (group?.id) {
            put(route("group.update", group.id), {
                onSuccess: () => {
                    closeModal();
                    emit("toast.show", `The Group "${data.name}" was updated`);
                },
            });
        } else if (group?.id == null) {
            post(route("group.store"), {
                onSuccess: () => {
                    closeModal();
                    emit("toast.show", `The Group "${data.name}" was created`);
                },
            });
        }
    };

    const closeModal = () => {
        reset();
        onClose();
    };

    useEffect(() => {
        return on("GroupModal.show", (group) => {
            setData({
                name: group?.name,
                description: group?.description,
                user_ids: group?.users
                    ?.filter((user) => group?.owner_id !== user?.id)
                    .map((user) => user.id),
            });
            setGroup(group);
        });
    }, [on]);
    return (
        <Modal show={show} onClose={closeModal}>
            <form
                onSubmit={createOrUpdateGroup}
                className="p-6 overflow-y-auto"
            >
                <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">
                    {group.id ? `Edit Group ${group.name} ` : "Create Group"}
                </h2>
                <div className="mt-5">
                    <InputLabel htmlFor="name" value={"Name"} />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data?.name}
                        disabled={!!group.id}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        isFocused
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>
                <div className="mt-4">
                    <InputLabel htmlFor="description" value={"Description"} />
                    <TextInput
                        id="description"
                        className="mt-1 block w-full"
                        value={data?.description}
                        onChange={(e) => setData("description", e.target.value)}
                        required
                        isFocused
                    />
                    <InputError className="mt-2" message={errors.description} />
                </div>
                <div className="mt-4">
                    <InputLabel value={"Select Users"} />
                    <UserPicker
                        value={
                            users
                                ? users.filter(
                                      (user) =>
                                          group.owner_id !== user.id &&
                                          data.user_ids.includes(user.id)
                                  )
                                : []
                        }
                        options={users}
                        onSelect={(users) =>
                            setData(
                                "user_ids",
                                users.map((user) => user.id)
                            )
                        }
                    />
                    <InputError className="mt-2" message={errors.user_ids} />
                </div>
                <div className="mt-6 flex justify-end items-center gap-2">
                    <SecondaryButton className="p-2" onClick={closeModal}>
                        Cancel
                    </SecondaryButton>
                    <PrimaryButton className="p-2" disabled={processing}>
                        {group.id ? "Update" : "Create"}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
};

export default GroupModal;
