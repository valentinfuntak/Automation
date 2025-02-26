import { createSignal } from 'solid-js';

export default function MainLayout(props) {
  const [sidebarOpen, setSidebarOpen] = createSignal(false);

  return (
    <div class="flex min-h-screen w-full">
      {/* Sidebar Container */}
      <div class={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${sidebarOpen() ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 mt-10 sm:mt-0 `}>
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
              <a href="/Home/Accounts" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="30" viewBox="0 0 470 468" id="account">
                  <defs>
                    <filter id="filter-2" width="111.8%" height="111.9%" x="-5.9%" y="-3.9%" filterUnits="objectBoundingBox">
                      <feOffset dy="5" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                      <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="4"></feGaussianBlur>
                      <feColorMatrix in="shadowBlurOuter1" result="shadowMatrixOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.078125 0"></feColorMatrix>
                      <feOffset dy="4" in="SourceAlpha" result="shadowOffsetOuter2"></feOffset>
                      <feGaussianBlur in="shadowOffsetOuter2" result="shadowBlurOuter2" stdDeviation="5.5"></feGaussianBlur>
                      <feColorMatrix in="shadowBlurOuter2" result="shadowMatrixOuter2" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.210824275 0"></feColorMatrix>
                      <feMerge>
                        <feMergeNode in="shadowMatrixOuter1"></feMergeNode>
                        <feMergeNode in="shadowMatrixOuter2"></feMergeNode>
                      </feMerge>
                    </filter>
                    <path id="path-1" d="M9.635 132.808C24.782 59.782 71.388 19.109 144.085 6.822c53.74-9.081 107.5-9.196 161.15.255 74.852 13.185 119.85 56.23 134.185 130.36 11.075 57.29 11.249 115.191-.174 172.427-15.324 72.52-63.132 117.285-135.561 129.527-53.74 9.08-107.5 9.195-161.15-.255-74.852-13.186-120.05-58.38-134.384-132.509-11.64-57.668-10.52-115.935 1.484-173.82z"></path>
                  </defs>
                  <g id="S8-/-S8+-icons" fill="none" fill-rule="evenodd" stroke="none" stroke-width="1">
                    <g id="icons" transform="translate(-21 -26)">
                      <g id="samsung_account">
                        <g transform="translate(32 33)">
                          <use xlink:href="#path-1" fill="#000" filter="url(#filter-2)"></use>
                          <use xlink:href="#path-1" fill="#2C8BE2"></use>
                        </g>
                        <path fill="#FFF" d="M224.5 348.733c-30.971 0-59.241-11.243-81.081-29.803 16.061-30.317 46.375-42.475 81.081-42.475 34.705 0 65.02 12.159 81.08 42.475-21.839 18.56-50.108 29.803-81.08 29.803M224.5 79C304.191 79 369 143.81 369 223.5c0 79.692-64.809 144.5-144.5 144.5-41.004 0-78.049-17.175-104.37-44.69.6-1.18 9.099-18.476 9.141-18.428 19.843-33.312 55.062-47.694 95.229-47.694s75.386 14.382 95.229 47.694c18.699-21.877 30.004-50.282 30.004-81.382 0-69.279-55.955-125.234-125.233-125.234S99.267 154.221 99.267 223.5c0 14.569 2.481 28.546 7.04 41.536-5.889 2.738-11.555 5.873-17.094 9.238C83.264 258.469 80 241.36 80 223.5 80 143.81 144.809 79 224.5 79zM187.544 187.44c0-20.586 17.107-37.342 38.726-37.342 21.617 0 38.724 16.756 38.724 37.342s-17.107 37.342-38.724 37.342c-21.62 0-38.726-16.756-38.726-37.342zm94.047 0c0-29.827-24.998-53.939-55.321-53.939-30.324 0-55.323 24.112-55.323 53.939 0 29.828 24.999 53.939 55.323 53.939 30.323 0 55.32-24.111 55.32-53.939" transform="translate(32 33)"></path>
                      </g>
                    </g>
                  </g>
                </svg>
                <span class="ml-3">Accounts</span>
              </a>
            </li>

          </ul>
        </aside>
      </div>

      {/* Main Content */}
      <div class="flex-1 bg-gradient-to-r from-gray-800 to-gray-900  pl-16 pr-16 py-5 lg:py-6 ml-0 sm:ml-64">
        <div class="mx-auto w-full max-w-screen-l relative">{props.children}</div>
      </div>

      {/* Sidebar Toggle Button for Small Screens */}
      <button
        class="absolute top-0 left-0 w-full p-3 bg-gray-900 hover:bg-gray-800 text-white z-50 sm:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen())}
      >
        ☰
      </button>


    </div>
  );
}
