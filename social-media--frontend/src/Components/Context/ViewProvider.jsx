import React, { createContext, useState } from "react";

const ViewContext = createContext(null);

const ViewProvider = ({ children }) => {
    const [id, setid] = useState();
    const [comments, setcomments] = useState();
    const [x, setx] = useState(true); // State variable to determine visibility
 
 
    const [myid,setmyid]=useState();// Changed 'setid' to 'setId' for consistency
    const [z,setz]=useState();
    return (
        <ViewContext.Provider value={{ id, setid,myid,setmyid,setcomments,comments ,x,setx,z,setz}}>
            {children}
        </ViewContext.Provider>
    );
};

export { ViewProvider, ViewContext };
