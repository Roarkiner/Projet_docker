import { FC, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { useAuth } from "../../../contexts/AuthContext";
import axiosService from "../../../services/AxiosService";

type Reaction = "like" | "dislike" | "none";

interface ApiImageCounters {
    UrlImage: string;
    LikeCount: number;
    DislikeCount: number;
}

interface CurrentUserReaction {
    UrlImage: string;
    Aime: boolean;
}

// const fileNames = [
//     "image1.png",
//     "image2.png",
//     "image3.png",
//     "image4.png",
//     "overview_pic.jpg"
// ];

const ImagesGrid: FC = () => {
    const [imageNames, setImageNames] = useState<string[]>([]);
    const [counters, setCounters] = useState<Record<number, { like: number; dislike: number }>>({});
    const [reactions, setReactions] = useState<Record<number, Reaction>>({});
    const { isConnected } = useAuth();
    const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch("/images/");
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                const fileNames = Array.from(doc.querySelectorAll("a"))
                    .map((link) => (link as HTMLAnchorElement).href)
                    .filter((href) => href.match(/\.(jpg|jpeg|png|gif|webp)$/i))
                    .map((fullUrl) => fullUrl.split("/").pop() || "");

                const { data: counterData } = await axiosService.get<ApiImageCounters[]>("/image");

                const countersMap: Record<string, { like: number; dislike: number }> = {};
                counterData.forEach((item) => {
                    countersMap[item.UrlImage] = {
                        like: item.LikeCount,
                        dislike: item.DislikeCount,
                    };
                });

                const initialCounters: Record<number, { like: number; dislike: number }> = {};
                const initialReactions: Record<number, Reaction> = {};
                const initialLoading: Record<number, boolean> = {};

                fileNames.forEach((fileName, i) => {
                    const cm = countersMap[fileName];
                    initialCounters[i] = cm ? { like: cm.like, dislike: cm.dislike } : { like: 0, dislike: 0 };
                    initialReactions[i] = "none";
                    initialLoading[i] = false;
                });

                setImageNames(fileNames);
                setCounters(initialCounters);
                setReactions(initialReactions);
                setLoadingStates(initialLoading);

                if (isConnected()) {
                    const { data: currentUserData } = await axiosService.get<CurrentUserReaction[]>("/image/currentUser");
                    const userMap: Record<string, Reaction> = {};

                    currentUserData.forEach((item) => {
                        userMap[item.UrlImage] = item.Aime ? "like" : "dislike";
                    });

                    setReactions((prev) => {
                        const updated = { ...prev };
                        fileNames.forEach((fileName, i) => {
                            if (userMap[fileName] !== undefined) {
                                updated[i] = userMap[fileName];
                            }
                        });
                        return updated;
                    });
                }
            } catch (error) {
                console.error("Failed to load images or user reactions:", error);
            }
        };
        fetchImages();
    }, []);

    const updateReactionOnServer = async (fileName: string, reaction: Reaction, index: number) => {
        if (!fileName) return;
        setLoadingStates((prev) => ({ ...prev, [index]: true }));
        let aime: boolean | null = null;
        if (reaction === "like") aime = true;
        if (reaction === "dislike") aime = false;
        try {
            await axiosService.put("/image/like-dislike", {
                urlImage: fileName,
                aime,
            });
        } catch (error) {
            console.error("Failed to update reaction on server:", error);
        } finally {
            setLoadingStates((prev) => ({ ...prev, [index]: false }));
        }
    };

    const handleLike = async (index: number) => {
        if (!isConnected) return;
        if (loadingStates[index]) return;
        const fileName = imageNames[index];

        setReactions((prevReactions) => {
            const oldReaction = prevReactions[index];
            const newReactions = { ...prevReactions };
            let finalReaction: Reaction;
            if (oldReaction === "like") {
                finalReaction = "none";
            } else if (oldReaction === "dislike") {
                finalReaction = "like";
            } else {
                finalReaction = "like";
            }
            newReactions[index] = finalReaction;

            setCounters((prevCounters) => {
                const newCounters = { ...prevCounters };
                const old = newCounters[index] || { like: 0, dislike: 0 };
                const updated = { ...old };
                if (oldReaction === "like") {
                    updated.like -= 1;
                } else if (oldReaction === "dislike") {
                    updated.dislike -= 1;
                }
                if (finalReaction === "like") {
                    updated.like += 1;
                }
                newCounters[index] = updated;
                return newCounters;
            });

            return newReactions;
        });

        await updateReactionOnServer(fileName, reactions[index] === "like" ? "none" : "like", index);
    };

    const handleDislike = async (index: number) => {
        if (!isConnected) return;
        if (loadingStates[index]) return;
        const fileName = imageNames[index];

        setReactions((prevReactions) => {
            const oldReaction = prevReactions[index];
            const newReactions = { ...prevReactions };
            let finalReaction: Reaction;
            if (oldReaction === "dislike") {
                finalReaction = "none";
            } else if (oldReaction === "like") {
                finalReaction = "dislike";
            } else {
                finalReaction = "dislike";
            }
            newReactions[index] = finalReaction;

            setCounters((prevCounters) => {
                const newCounters = { ...prevCounters };
                const old = newCounters[index] || { like: 0, dislike: 0 };
                const updated = { ...old };
                if (oldReaction === "like") {
                    updated.like -= 1;
                } else if (oldReaction === "dislike") {
                    updated.dislike -= 1;
                }
                if (finalReaction === "dislike") {
                    updated.dislike += 1;
                }
                newCounters[index] = updated;
                return newCounters;
            });

            return newReactions;
        });

        await updateReactionOnServer(fileName, reactions[index] === "dislike" ? "none" : "dislike", index);
    };

    return (
        <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))"
            gap={2}
            p={2}
        >
            {imageNames.map((fileName, index) => {
                const userReaction = reactions[index];
                const isLoading = loadingStates[index];

                return (
                    <Card
                        key={index}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            backgroundColor: "transparent",
                        }}
                    >
                        <CardMedia
                            component="img"
                            image={`/images/${fileName}`}
                            alt={`Image ${index + 1}`}
                            sx={{
                                height: 300,
                                objectFit: "contain",
                                objectPosition: "center",
                                backgroundColor: "black",
                            }}
                        />
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            px={1}
                            py={1}
                            sx={{ backgroundColor: "transparent" }}
                        >
                            <Box display="flex" alignItems="center" gap={1}>
                                <IconButton
                                    onClick={() => handleLike(index) || isLoading}
                                    disabled={!isConnected()}
                                    color={userReaction === "like" ? "primary" : "default"}
                                >
                                    <ThumbUpIcon />
                                </IconButton>
                                <Box>{counters[index]?.like}</Box>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <IconButton
                                    onClick={() => handleDislike(index)}
                                    disabled={!isConnected() || isLoading}
                                    color={userReaction === "dislike" ? "error" : "default"}
                                >
                                    <ThumbDownIcon />
                                </IconButton>
                                <Box>{counters[index]?.dislike}</Box>
                            </Box>
                        </Box>
                    </Card>
                );
            })}
        </Box>
    );
};

export default ImagesGrid;
