import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body
    if(!content){
        throw new ApiError(400,"content is requried")
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user?._id
    })

    if(!tweet){
        throw new ApiError(400,"failed during creating tweet")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,tweet,"tweet created successfully")
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.params
   
    

    if(!isValidObjectId(userId)){
        throw new ApiError(400,"User not found")
    }

    const tweets = await Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "tweet",
                as: "likeDetails",
                pipeline: [
                    {
                        $project: {
                            likedBy: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$likeDetails",
                },
                ownerDetails: {
                    $arrayElemAt: ["$ownerDetails", 0] ,
                },
                isLiked: {
                    $cond: {
                        if: {$in: [new mongoose.Types.ObjectId(req.user?._id), "$likeDetails.likedBy"]},
                        then: true,
                        else: false
                    }
                }
            },
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $project: {
                content: 1,
                ownerDetails: 1,
                likesCount: 1,
                createdAt: 1,
                isLiked: 1,
               
            },
        },
    ])


    
    if(!tweets){
        throw new ApiError(500,"failed to featch the tweets ")
    }
    
    return res
    .status(200)
    .json(
        new ApiResponse(200,tweets,"tweets featched successfully")
    )

})

const getAllTweets = asyncHandler(async (req, res) => {
  const tweets = await Tweet.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
        pipeline: [{ $project: { username: 1, avatar: 1 } }],
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "tweet",
        as: "likeDetails",
        pipeline: [{ $project: { likedBy: 1 } }],
      },
    },
    {
      $addFields: {
        likesCount: { $size: "$likeDetails" },
        ownerDetails: { $arrayElemAt: ["$ownerDetails", 0] },
        isLiked: {
          $cond: {
            if: { $in: [new mongoose.Types.ObjectId(req.user?._id), "$likeDetails.likedBy"] },
            then: true,
            else: false,
          },
        },
      },
    },
    { $sort: { createdAt: -1 } },
    { $project: { content: 1, ownerDetails: 1, likesCount: 1, createdAt: 1, isLiked: 1 } },
  ]);

  return res.status(200).json({ status: 200, data: tweets, message: "Tweets fetched successfully" });
});



const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet

    const { tweetId} = req.params
    const { content } = req.body


    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"tweetId not Found")
    }

    if(!content){
        throw new ApiError(400,"Content is requried")
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    if (tweet?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "only owner can edit thier tweet");
    }

    const newTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content
            },
        },
        {
            new:true
        }
    )

    if(!newTweet){
        throw new ApiError(501," there was an issue editing your content")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,newTweet,"Content is Updated successfully")
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId }= req.params

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"tweetId not found")
    }

     const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    if (tweet?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "only owner can delete thier tweet");
    }

    await Tweet.findByIdAndDelete(tweetId);

    return res
        .status(200)
        .json(new ApiResponse(200, tweetId, "Tweet deleted successfully"));
})

export {
    createTweet,
    getUserTweets,
    getAllTweets,
    updateTweet,
    deleteTweet
}