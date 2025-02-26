import { createEffect, createSignal, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import { useAuth } from "../Auth/AuthProvider.jsx";
import { supabase } from "../Supabase/Supabase.js";

export default function AccountData() {
    const id = useParams().id;
    const session = useAuth();

    const [data, setData] = createSignal([]);

    createEffect(async () => {
        await handleLoad();
    });

    async function handleLoad() {
        const { data: loadedData, error } = await supabase
            .from("AccountData")
            .select("*")
            .eq("id", id);
        if (error) {
            alert("Operacija nije uspjela.");
            console.log(error);
        } else {
            setData(loadedData);
            console.log(loadedData);
        }
    }

    return (
        <Show when={data()}>
            <For each={data()} fallback={<div class="text-red-600 text-xl">Nema podataka.</div>}>
                {(item) => {
                    return (
                        <div class="mt-10 sm:mt-1 flex flex-col gap-3 bg-white text-black p-6 rounded-lg shadow-lg relative">
                            <h2 class="text-3xl font-bold text-start text-black">Račun {item.id}</h2>
                            <p><span class="font-semibold text-blue-600">FirstName:</span> {item.firstName}</p>
                            <p><span class="font-semibold text-blue-600">LastName:</span> {item.lastName}</p>
                            <p><span class="font-semibold text-blue-600">Gender:</span> {item.gender}</p>
                            <p><span class="font-semibold text-blue-600">Email:</span> {item.email}</p>
                            <p><span class="font-semibold text-blue-600">Password:</span> {item.password}</p>
                            <p><span class="font-semibold text-blue-600">Date:</span> {item.day}. {item.month}. {item.year}</p>
                            <p><span class="font-semibold text-blue-600">Registered:</span> {item.registered ? "True" : "False"}</p>
                        </div>
                    );
                }}
            </For>
        </Show>
    );
}