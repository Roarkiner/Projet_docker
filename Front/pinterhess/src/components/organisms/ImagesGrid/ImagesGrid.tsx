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
                    .map((fullUrl) => {
                        return fullUrl.split("/").pop() || "";
                    });

                const { data } = await axiosService.get<ApiImageCounters[]>("/image");

                const countersMap: Record<string, { like: number; dislike: number }> = {};
                data.forEach((item) => {
                    countersMap[item.UrlImage] = {
                        like: item.LikeCount,
                        dislike: item.DislikeCount,
                    };
                });

                const initialCounters: Record<number, { like: number; dislike: number }> = {};
                const initialReactions: Record<number, Reaction> = {};

                fileNames.forEach((fileName, i) => {
                    if (countersMap[fileName]) {
                        initialCounters[i] = { ...countersMap[fileName] };
                    } else {
                        initialCounters[i] = { like: 0, dislike: 0 };
                    }
                    initialReactions[i] = "none";
                });

                setImageNames(fileNames);
                setCounters(initialCounters);
                setReactions(initialReactions);
            } catch (error) {
                console.error("Failed to load images:", error);
            }
        };
        fetchImages();
    }, []);

    const handleLike = (index: number) => {
        if (!isConnected) return;
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
    };

    const handleDislike = (index: number) => {
        if (!isConnected) return;
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
                                    onClick={() => handleLike(index)}
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
                                    disabled={!isConnected()}
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
