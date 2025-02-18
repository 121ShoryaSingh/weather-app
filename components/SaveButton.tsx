import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { savebuttonprops } from "@/types/types";

const SaveButton = ({ latitude, longitude }: savebuttonprops) => {
    const { toast } = useToast();
    const [bookMarked, setBookMarked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (!latitude || !longitude) return;

        const checkSavedLocation = async () => {
            try {
                const response = await axios.get("/api/check-saved-location", {
                    params: { latitude, longitude },
                });

                if (response.data.success) {
                    setBookMarked(true);
                } else {
                    setBookMarked(false);
                }

                setChecked(true);
            } catch (err) {
                toast({
                    title: "Error",
                    description: "Failed to check saved location.",
                    variant: "destructive",
                });
                setChecked(true);
                console.log(err)
            }
        };

        checkSavedLocation();
    }, [latitude, longitude]);

    const handleBookmarkToggle = async () => {
        if (!latitude || !longitude) return;
        setLoading(true);

        try {
            if (bookMarked) {
                // DELETE request to remove saved location
                const response = await axios.delete("/api/remove-save-city", {
                    data: { latitude, longitude },
                });

                if (response.data.success) {
                    setBookMarked(false);
                    toast({ title: "Location Removed", description: response.data.message });
                }
            } else {
                // POST request to save location
                const response = await axios.post("/api/save-city", { latitude, longitude });

                if (response.data.success) {
                    setBookMarked(true);
                    toast({ title: "Location Saved", description: response.data.message });
                }
            }
        } catch (err) {
            toast({
                title: "Error",
                description: "An error occurred. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            className="p-2 bg-white text-black rounded flex items-center gap-2"
            onClick={handleBookmarkToggle}
            disabled={loading || !checked} 
        >
            {loading ? (
                "Processing..."
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

export default SaveButton;

