import { useEffect } from "react";

// Sets the browser tab title for the current page
function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | CampusKart` : "CampusKart";
    return () => {
      document.title = "CampusKart";
    };
  }, [title]);
}

export default usePageTitle;
