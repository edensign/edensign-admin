import { useEffect, useState } from "react";
import axios from "axios";

const getUsersAPI = () => {
    const [allUsersData, setAllUsersData] = useState([]);

    function getAllUsers() {
      axios.get('http://localhost:5000/api/v1/get-users')
        .then(function (res) {
          console.log(res.data.data)
          setAllUsersData(res.data.data);
        })
        .catch(function (err) {
          console.log(err);
        });
    };

    useEffect(() => {
      getAllUsers();
    }, []);

    return [ allUsersData ];
};

export default getUsersAPI;
