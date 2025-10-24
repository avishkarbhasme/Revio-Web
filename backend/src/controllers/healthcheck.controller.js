import {asyncHandler} from "../utils/asyncHandler.js";

import { Tweet } from "../models/tweet.model.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";

const healthcheck = asyncHandler(async (req, res) => {
    //TODO: build a healthcheck response that simply returns the OK status as json with a message
    return res
        .status(200)
        .json(new ApiResponse(200, { message: "Everything is Ok, Don't wary about backend You can do your work easily" }, "200 ,Ok"));
});

export { healthcheck };