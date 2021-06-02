import "./Post.css";
import Avatar from '@material-ui/core/Avatar';
import ClearIcon from '@material-ui/icons/Clear';
import { db,auth } from "./firebase";
import { useEffect, useState } from "react";



function Post({image,caption,username,code,displayName}) {
    const [user, setUser] = useState(null);

    useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((authUser) => {
			if (authUser) {
				

				setUser(authUser);
			} else {
				setUser(null);
			}
		});
		return () => {
			//perform clean action;
			unsubscribe();
		};
	}, [user, username]);
    console.log(user)
    
    

    const deletepost = () =>{
        
      
    
        if(user.displayName===null)
        {

        }
        else{
            
            if(username===user.displayName){
                db.collection("posts").doc(code)
            .delete()
            .then(() => {
                console.log("Document successfully deleted!");
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
            }
            else if(username !== user.displayName){
                alert("you cannot delete other user's photo")
            }
        }
          


    }

   

    return (
        <div className="post">
            <div className="post__header">
                <div className="left">
                <Avatar 
            className="post__avatar"
            alt={username}
            src="/statis/images/avatar/1.jpg"
            />
            <h3>{username}</h3>

                </div>
            
            {
                user && username===user.displayName ? <ClearIcon onClick={deletepost} className="button"  />: ""
            }
            



            </div>
            
            <img  className="post__image" src={image} alt="" />
            <h4 className="Post_text"><strong>{username} :</strong>  {caption}</h4>
        </div>
    )
}

export default Post
