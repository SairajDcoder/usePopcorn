import { useEffect } from "react";

export function useKey(key, action) {
    useEffect(function () {
        // if (selectedId)
        function callBack(e) {
            e.code.toLowerCase() === key.toLowerCase() && action(null);
        }
        document.addEventListener("keydown", callBack)

        return function () {
            document.removeEventListener("keydown", callBack)
        }
    }, [action, key])
}