import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import {Subscription} from "../models/subscription.model.js"


const genrateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.genrateAccessToken()
        const refreshToken = user.genrateRefreshToken()
       
        user.refreshToken =refreshToken
        await user.save({validateBeforeSave:false})
        
        

        return {accessToken,refreshToken}

    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refresh and access token")
    }
}


const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const {fullName, email, username, password } = req.body
    //console.log("email: ", email);

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    //console.log(req.files);

    // const avatarLocalPath = req.files?.avatar[0]?.path;
    //console.log(req.files, req.body)
   
    let avatarLocalPath;
    if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
        avatarLocalPath = req.files.avatar[0].path
    }
    
    
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
   

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )


const loginUser =asyncHandler(async(req,res) => {
    //req.body - data
    //username or email 
    //find user
    //password check
    //access and refresh token
    //send cookie
    const {username,email,password} =req.body

    if(!username && !email){
        throw new ApiError(400,"username or email is requried")
    }

    const user = await User.findOne({
        $or: [{username},{email}]
    })

    if(!user){
        throw new ApiError(400,"User does not exist")
    }
    
    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,"iInvalid user credentials")
    }

    const {accessToken, refreshToken} = await genrateAccessAndRefreshTokens(user._id)
    
    const loggedInUser= await User.findById(user._id)
    .select("-password -refreshToken")

    const options = {
        httpOnly :true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse (
            200,
            {
            user:loggedInUser,accessToken,refreshToken
        },
        "User logged In Successfully"
    )
    )

})

const logoutUser = asyncHandler(async(req,res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset : {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly:true,
        secure: true
    }


    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User Logout Successfully"))
})


const refreshAccessToken = asyncHandler(async(req,res) =>{
    try {
        const inncomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    
        if(!inncomingRefreshToken){
            throw new ApiError(401,"Unauthorized request")
        }
    
        const decodedToken = jwt.verify(
            inncomingRefreshToken, process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401,"Invalid Refresh Token")
        }
    
        if(inncomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401,"Refresh token is expired or used")
        }
    
        const options = {
            httpOnly :true,
            secure : true
        }
    
        const {accessToken,newRefreshToken} =await genrateAccessAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {accessToken,newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid refresh token")
    }
})


const forgotPassword = asyncHandler(async(req,res) => {
    const { username, email ,newPassword} = req.body
   
    if(!username && ! email){
        throw new ApiError(400," username and password is requried")
    }
    const user = await User.findOne({
        $or: [{ username }, { email }],
    }); 
    
    if(!user){
        throw new ApiError(400,"User not found")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})
    
     return res
     .status(200)
     .json(
        new ApiResponse(200,"Password reset successfully")
     )
})


const changeCurrentPassword = asyncHandler(async(req,res) => {
    const {oldPassword, newPassword} = req.body
    
    const user = await User.findById(req.user?._id)
    const isPassCorrect = await user.isPasswordCorrect(oldPassword)
    if(!isPassCorrect){
        throw new ApiError(400," Oldpassword was incorrect")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})
    
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "Password Changed Succesfully"
        )
    )

})


const getCurrentUser = asyncHandler(async(req,res ) => {
    return res 
    .status(200)
    .json(new ApiResponse(200,req.user,"current user fetched successfully"))
})

const updateAccountDetails = asyncHandler(async(req,res) => {
    // Destructure the fields from the request body
    const {fullName, email, username, avatar, coverImage} = req.body

    // 💡 CHANGE IS HERE 💡
    // This check is: IF NOT fullName AND NOT email AND NOT username
    // This logic means: if the user sends NO fullName AND NO email AND NO username, then throw the error.
    if(!fullName && !email && !username){
        // You should probably change the error message too, as ALL fields are NOT required, 
        // but at least ONE field for updating is expected.
        throw new ApiError(400,"Please provide at least one field (fullName, email, or username) to update.")
    }

    // You also need to complete the $set object for the update.
    // Use an object to dynamically build the fields to update.
    const fieldsToUpdate = {};
    if (fullName) fieldsToUpdate.fullName = fullName;
    if (email) fieldsToUpdate.email = email;
    if (username) fieldsToUpdate.username = username;
    // Add other fields (avatar, coverImage) if you want them to be updatable in this function

    // Prevent overwriting with undefined if only one field is sent
    if (Object.keys(fieldsToUpdate).length === 0) {
        // This check is a failsafe if the initial check was too simple.
        throw new ApiError(400, "No valid fields provided for update.");
    }


    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : fieldsToUpdate 
            // The $set operator will only contain the fields that were actually provided in the request body.
        },
        {new: true} // 'new: true' returns the updated document
    ).select("-password")

    // Check if user was actually found and updated
    if (!user) {
        throw new ApiError(404, "User not found.")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Account details updated successfully")
    )
})


const updateUserAvatar = asyncHandler(async(req,res) => {
    
    const avatarLocalePath = req.file?.path

    if(!avatarLocalePath){
        throw new ApiError(400,"Avatar file is missing")
    }

    // const user = await User.findById(req.user?._id);

    // if (!user) {
    //   throw new ApiError(404, "User not found");
    // }

    // // Extract public_id from old avatar URL if exists
    // if (user.avatar) {
    //   try {
    // // Example URL: https://res.cloudinary.com/demo/image/upload/v1234567890/foldername/abcd1234.jpg
    //     const publicId = user.avatar.split("/").pop().split(".")[0]; // "abcd1234"
    //     await cloudinary.uploader.destroy(publicId);
    //   } catch (err) {
    //     console.error("Failed to delete old avatar:", err.message);
    //   }
    // }
 

    const avatar =await uploadOnCloudinary(avatarLocalePath)

    if(!avatar){
        throw new ApiError(400,"Error while uploading on avatar")
    }

    const userUpdated = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar :avatar.url
            }
        },
        {new: true}
    ).select("-password")

    // fs.unlinkSync(avatarLocalePath);

    return res
    .status(200)
    .json(
      new ApiResponse(200,userUpdated,"Avatar updated successfully"))
})


const updateUserCoverImage = asyncHandler(async(req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing")
    }

    //TODO: delete old image - assignment


    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on avatar")
        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage: coverImage.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(
          new ApiResponse( 200, user, "Cover image updated successfully"))
    )
})

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const { toggle } = req.query; // Optional query param: toggle=true
  const userId = req.user?._id;

  if (!username?.trim()) {
    throw new ApiError(400, "username is missing");
  }

  // First fetch the channel info with subscription details
  let channel = await User.aggregate([
    {
      $match: { username: { $regex: `^${username}$`, $options: "i" } },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subcribersCount: { $size: "$subscribers" },
        channelsSubscribedToCount: { $size: "$subscribedTo" },
        isSubscribed: {
          $cond: {
            if: { $in: [userId, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        email: 1,
        avatar: 1,
        coverImage: 1,
        subcribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(404, "channel does not exist");
  }

  // channel is an array, so get the first result
  channel = channel[0];

  // Toggle subscription if requested and user is not subscribing to self
  if (toggle === "true" && userId.toString() !== channel._id.toString()) {
    const existingSub = await Subscription.findOne({
      channel: channel._id,
      subscriber: userId,
    });

    if (existingSub) {
      await Subscription.deleteOne({ _id: existingSub._id });
    } else {
      await Subscription.create({ channel: channel._id, subscriber: userId });
    }

    // Refetch updated channel subscription info after toggle
    const updatedChannel = await User.aggregate([
      {
        $match: { username: { $regex: `^${username}$`, $options: "i" } },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscribers",
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "subscriber",
          as: "subscribedTo",
        },
      },
      {
        $addFields: {
          subcribersCount: { $size: "$subscribers" },
          channelsSubscribedToCount: { $size: "$subscribedTo" },
          isSubscribed: {
            $cond: {
              if: { $in: [userId, "$subscribers.subscriber"] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          fullName: 1,
          username: 1,
          email: 1,
          avatar: 1,
          coverImage: 1,
          subcribersCount: 1,
          channelsSubscribedToCount: 1,
          isSubscribed: 1,
        },
      },
    ]);

    channel = updatedChannel[0];
  }

  return res
    .status(200)
    .json(new ApiResponse(200, channel, "User channel fetched successfully"));
});


const getWatchHistory = asyncHandler(async (req, res) => {
  const { filter = "latest" } = req.query; // "latest" or "oldest"

  // Determine sort order
  const sortOrder = filter === "oldest" ? 1 : -1; // latest = -1, oldest = 1

  const user = await User.aggregate([
    {
      $match: {
        _id: req.user._id
      }
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          // Sort videos by createdAt
          { $sort: { createdAt: sortOrder } },

          // Lookup owner info
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1
                  }
                }
              ]
            }
          },
          {
            $addFields: {
              owner: { $first: "$owner" } // Flatten owner array
            }
          }
        ]
      }
    }
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, user[0].watchHistory, "Watch History fetched successfully")
    );
});


export {registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory,
    forgotPassword
}