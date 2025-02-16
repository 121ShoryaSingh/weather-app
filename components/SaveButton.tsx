import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Bookmark, BookmarkCheck } from "lucide-react";

const Savebutton = ({ latitude, longitude }: { latitude: number | null; longitude: number| null }) => {
    const { toast } = useToast();
    const [bookMarked, setBookMarked] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!latitude || !longitude) return;

        const fetchLocationStatus = async () => {
            try {
                setLoading(true)
                const response = await axios.post("/api/save-city", { latitude, longitude });

                if (response.data.isLocationRemoved) {
                    setBookMarked(false);
                } else {
                    setBookMarked(true);
                }

                toast({
                    title: "Success",
                    description: response.data.message,
                });
                setLoading(false)
            } catch (err) {
                toast({
                    title: "Error",
                    description: "Failed to save location. Please try again.",
                    variant: "destructive",
                });
            }
        };

        fetchLocationStatus(); 
    }, [latitude, longitude]);

    return (
        <button
            className="p-2 bg-white text-black rounded flex items-center gap-2"
            onClick={() => setBookMarked((prev) => !prev)}
            disabled={loading}
        >
            {loading ? (
                "Saving..."
            ) : bookMarked ? (
                <>
                    <BookmarkCheck size={20} /> Unbookmark
                </>
            ) : (
                <>
                    <Bookmark size={20} /> Bookmark
                </>
            )}
        </button>
    );
};

export default Savebutton;
