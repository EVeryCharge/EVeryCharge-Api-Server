import { useEffect } from "react"
import { useLocation } from "react-router-dom"

const UsernameStorage = () => {
    const location = useLocation();

    useEffect(() => {
        //url에서 쿼리 파라미터 파싱
        const queryParams = new URLSearchParams(location.search);
        const username = queryParams.get('kakaousername');

        if(username){
            sessionStorage.setItem('username', username);
        }
    }, [location]);

    return null;
};

export default UsernameStorage;

