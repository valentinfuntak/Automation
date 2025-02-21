import 'flowbite';
export default function MainLayout(props) {
  return (
    <>
      <div class="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">{props.children}</div>
    </>
  );
}