import uploadOnCloudinary from "../config/cloudinary.config.js"
import User from "../model/user.model.js"


export const getCurrentUser = async (req, res) => {
    try {
        let id = req.userId
        const user = await User.findById(id).select("-password")
        if (!user) return res.status(404).json({ msg: "User not found" })
        res.status(200).json(user)
    } catch (error) {
        console.log(error.message)

        res.status(500).json({ msg: "get current user failed" })
    }
}


export const updatePofile = async (req, res) => {
    console.log("FILES RECEIVED:", req.files);
    console.log("Profile Image Path:", req?.files?.profileImage?.[0]?.path);
    console.log("Cover Image Path:", req?.files?.coverImage?.[0]?.path);

    try {
        const { firstName, lastName, userName, headline, location, gender } = req.body
        let skills = req.body.skills ? JSON.parse(req.body.skills) : [];
        let education = req.body.education ? JSON.parse(req.body.education) : [];
        let experience = req.body.experience ? JSON.parse(req.body.experience) : [];

        console.log(req.files)
        let profileImage;
        let coverImage;
        console.log(req.files.profileImage)
        console.log(req.files.coverImage)
        if (req.files.profileImage) {
            console.log(req.files.profileImage)
            profileImage = await uploadOnCloudinary(req.files.
                profileImage[0].path);

        }

        if (req.files.coverImage) {
            coverImage = await uploadOnCloudinary(req.files.coverImage[0].path);
        }

        const user = await User.findByIdAndUpdate(req.userId, {
            firstName,
            lastName,
            userName,
            headline,
            location,
            gender,
            skills,
            education,
            experience,
            profileImage,
            coverImage
        }, { new: true }).select("-password")

        return res.status(200).json(user)

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "update profile error"
        })
    }
}

export const getProfile = async (req, res) => {
    try {
        let { userName } = req.params;
        let user = await User.findOne({ userName }).select("-password");
        if (!user) {
            return res.status(400).json({ message: "userName does not exist" });
        }

        return res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "get profile error" })
    }
}

export const search = async (req, res) => {
    try {
        let { query } = req.query;
        const users = await User.find({
            $or: [
                { firstName: { $regex: query, $options: "i" } },
                { lastName: { $regex: query, $options: "i" } },
                { userName: { $regex: query, $options: "i" } },
                { skills: { $in: [query] } }
            ]
        })

        if (!query || query.trim() === "") {
            return res.json([]); // return empty list if query empty
        }

        return res.status(200).json(users)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "search error" })
    }
}


export const getSuggestedUser = async (req, res) => {
    try {
        let currUser = await User.findById(req.userId).select("connections");

        const suggestedUsers = await User.find({
            _id: {
                $ne: currUser,
                $nin: currUser.connections
            }

        }).select("-password")

        return res.status(200).json(suggestedUsers);
    } catch (error) {
        return res.status(500).json({ message: `get seggested user error ${error}` })

    }
}