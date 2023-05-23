import { useRouter } from "next/navigation";
import { SafeUser } from "../types";
import useLoginModal from "./useLoginModal";
import { useCallback, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface IFavoriteProps{
    listingId:string;
    currentUser?:SafeUser | null;

}

//Hook

const useFavorites = ({
    listingId,
    currentUser
}:IFavoriteProps) => {
    const router = useRouter();
    const loginModal= useLoginModal();

    const hasFavorited = useMemo(()=>{

        //get the list of favorites from current user, or empty array if there is no favorites
        const list = currentUser?.favoriteIds || [];
        return list.includes(listingId);
    },[currentUser, listingId]);
    //Function to toggle on and off the favorite
    const toggleFavorite = useCallback(async (
        event: React.MouseEvent<HTMLDivElement>
    )=>{
        event.stopPropagation();
        //check if there is current User or not
        if(!currentUser){
            return loginModal.onOpen();
        }

        try{
            let request;

            if(hasFavorited){
                request = ()    => {
                    axios.delete(`/api/favorites/${listingId}`);
                };
                await request();
                router.refresh();
                toast.success('Deleted from Favorites');
            }
            else{
                request = () => {
                    axios.post(`/api/favorites/${listingId}`);
                }
                await request();
                router.refresh();
                toast.success('Added to Favorites');
            }
        }
        catch(error){
            toast.error('Something went wrong, Try again');
        }
        
    },[currentUser, listingId, hasFavorited, loginModal,router]);

    return{
        hasFavorited,
        toggleFavorite
    }
}

export default useFavorites;
