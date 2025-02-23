export default function RegLogLayout(props) {
    return (
        <>
            <div class="min-h-screen w-full bg-gray-900 p-4 py-6 lg:py-8">
                <div class="mx-auto w-full max-w-screen-xl">{props.children}</div>
            </div>
        </>
    );
}
