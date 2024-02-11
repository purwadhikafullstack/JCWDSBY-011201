export const customTextInputTheme = {
  field: {
    input: {
      withAddon: {
        off: 'rounded-l-lg rounded-r-none'
      }
    }
  }
};

export const customTable = {
  root: {
    base: "w-full text-left text-sm text-gray-500 dark:text-gray-400",
    shadow: "absolute bg-white dark:bg-black w-full h-full top-0 left-0 rounded-lg drop-shadow-xl -z-10",
    wrapper: "relative border rounded-lg"
  },
  head: {
    base: "group/head text-xs uppercase text-white dark:text-gray-400 text-center border-b-2 border-b-slate-300",
    cell: {
      base: "group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg bg-indigo-800 dark:bg-gray-700 px-6 py-3"
    }
  },
  row: {
    striped: "odd:bg-white even:bg-blue-100 odd:dark:bg-gray-800 even:dark:bg-gray-700"
  }
};

export const customButton = {
  color: {
    primary: "font-bold text-white bg-indigo-700 border border-transparent enabled:hover:bg-indigo-900 focus:ring-4 focus:ring-transparent dark:bg-indigo-800 dark:enabled:hover:bg-indigo-700 dark:focus:ring-0 dark:border-indigo-700",
    secondary: "font-bold text-indigo-800 bg-white border-2 border-indigo-800 enabled:hover:bg-indigo-900 enabled:hover:text-white focus:ring-4 focus:ring-transparent",
  },
  size: {
    responsive : "text-xs px-2 py-1 lg:text-sm lg:px-4 lg:py-2"
  }
}

export const customSidebar = {
  root: {
    base: "h-full shadow-2xl",
  },
  item: {
    base: "flex items-center justify-center rounded-lg p-2 text-base font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
    active: "bg-gray-900 dark:bg-gray-700",
    icon: {
      base: "h-6 w-6 flex-shrink-0 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
      active: "text-gray-700 dark:text-gray-100"
    },
  },
  collapse: {
    button: "group flex w-full items-center rounded-lg p-2 text-base font-semibold text-gray-500 hover:text-gray-900 transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
    icon: {
      base: "h-6 w-6 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
      open: {
        off: "",
        on: "text-gray-400"
      }
    },
  }
}
