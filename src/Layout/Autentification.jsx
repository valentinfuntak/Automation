export default function RegLogLayout(props) {
    return (
        <>
            <div class="bg-base-200 text-gray-100 min-h-screen">
                <div class="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">{props.children}</div>
                <footer class="bg-base-200">
                    <div class="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
                    </div>
                </footer>
            </div>
        </>
    );
}