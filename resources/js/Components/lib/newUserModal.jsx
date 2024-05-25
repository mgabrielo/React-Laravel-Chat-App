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
import Checkbox from "../Checkbox";

const NewUserModal = ({ show = false, onClose = () => {} }) => {
    const { emit } = useEventBus();
    const { data, setData, processing, reset, post, errors } = useForm({
        name: "",
        email: "",
        is_admin: false,
    });

    const onSubmit = (e) => {
        post(route("user.store"), {
            onSuccess: () => {
                emit("toast.show", `The User "${data.name}" was created`);
                closeModal();
            },
        });
    };

    const closeModal = () => {
        reset();
        onClose();
    };

    return (
        <Modal show={show} onClose={closeModal}>
            <form onSubmit={onSubmit} className="p-6 overflow-y-auto">
                <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">
                    Create New User
                </h2>
                <div className="mt-5">
                    <InputLabel htmlFor="name" value={"Name"} />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data?.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        isFocused
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>
                <div className="mt-4">
                    <InputLabel htmlFor="email" value={"Email"} />
                    <TextInput
                        id="email"
                        className="mt-1 block w-full"
                        value={data?.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>
                <div className="mt-4">
                    <InputLabel value={"Select User Role"} />
                    <Checkbox
                        name="is_admin"
                        checked={data?.is_admin}
                        onChange={(e) => setData("is_admin", e.target.checked)}
                    />
                    <span className="ml-3">Is Admin User...?</span>
                    <InputError className="mt-2" message={errors.is_admin} />
                </div>
                <div className="mt-6 flex justify-end items-center gap-2">
                    <SecondaryButton className="p-2" onClick={closeModal}>
                        Cancel
                    </SecondaryButton>
                    <PrimaryButton className="p-2" disabled={processing}>
                        {"Create"}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
};

export default NewUserModal;
