import {Grid,Button} from "@mui/material";
import { AuthContext } from "../context/auth";
import { useContext } from "react";

export default function header(){
    const {logout} =useContext(AuthContext);
    return(<>
        <header>
        <nav>
         <Grid size={12} sx={{display:"flex",justifyContent:"end" }}>
          <Button onClick={()=>logout()}>logout</Button>
         </Grid>
        </nav>
        </header>
        </>)
}