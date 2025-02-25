import { createSignal } from 'solid-js';

export default function MainLayout(props) {
  const [sidebarOpen, setSidebarOpen] = createSignal(false);

  return (
    <div class="flex min-h-screen w-full">
      {/* Sidebar Container */}
      <div class={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${sidebarOpen() ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}>
        <aside id="default-sidebar" class="h-full overflow-y-auto py-5 px-3">
          <ul class="space-y-2">
            <li>
              <a href="/Home" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <svg aria-hidden="true" class="w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                </svg>
                <span class="ml-3">Home</span>
              </a>
            </li>
            <li>
              <a href="/Home/Programs" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <svg aria-hidden="true" class="flex-shrink-0 w-6 h-6 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"></path>
                </svg>
                <span class="ml-3">Programs</span>
              </a>
            </li>
            <li>
              <a href="/Home/Automation" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <svg aria-hidden="true" class="flex-shrink-0 w-6 h-6 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"></path>
                </svg>
                <span class="ml-3">Automation</span>
              </a>
            </li>
          </ul>
        </aside>
      </div>
      
      {/* Main Content */}
      <div class="flex-1 bg-gray-900  pl-5 pr-16 py-5 lg:py-6 ml-0 sm:ml-64">
        <div class="mx-auto w-full max-w-screen-l relative">{props.children}</div>
      </div>

      {/* Sidebar Toggle Button for Small Screens */}
      <button 
        class="absolute top-4 right-4 z-50 p-3 bg-gray-800 text-white rounded-md sm:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen())}
      >
        ☰
      </button>
    </div>
  );
}
