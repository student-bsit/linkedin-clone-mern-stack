import uploadOnCloudinary from "../config/cloudinary.config.js";
import { io } from "../index.js";
import Notification from "../model/notification.model.js";
import Post from "../model/post.model.js";

// export const createPost = async (req, res) => {
//     try {
//         let { description } = req.body;
//         let newPost;
//         if (req.file) {
//             let image = await uploadOnCloudinary(req.file.path);
//             newPost = await Post.create({
//                 author: req.userId,
//                 description,
//                 image
//             })
//         } else {

//             newPost = await Post.create({
//                 author: req.userId,
//                 description
//             })
//         }
//         return res.status(201).json(newPost);
//     } catch (error) {
//         return res.status(500).json(`create post error ${error}`)
//     }
// }

export const createPost = async (req, res) => {
    try {
        let { description } = req.body;
        let newPost;

        if (req.file) {
            let image = await uploadOnCloudinary(req.file.path);
            newPost = await Post.create({
                author: req.userId,
                description,
                image
            });
        } else {
            newPost = await Post.create({
                author: req.userId,
                description
            });
        }

        // Populate the author before sending back to frontend
        newPost = await newPost.populate("author", "firstName lastName headline profileImage");

        return res.status(201).json(newPost);
    } catch (error) {
        return res.status(500).json(`create post error ${error}`);
    }
};


export const getPost = async (req, res) => {
    try {
        const post = await Post.find()
            .populate("author", "firstName lastName userName profileImage headline") // ✅ FIXED
            .populate("comment.user", "firstName lastName profileImage headline") // ✅ ADDED
            .sort({ createdAt: -1 });

        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({ message: "get post error" });
    }
};


export const like = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.userId
        const post = await Post.findById(postId);
        
        if (!post) {
            return res.status(400).json({ message: "post not found" })
        }
        if (post.like.includes(userId)) {
            post.like = post.like.filter((id) => id != userId)
        } else {
            post.like.push(userId);
            if (post.author != userId) {
                 let notification=await Notification.create({
                    reciever: post.author,
                    type: "like",
                    relatedUser: userId,
                    relatedPost: postId
                })
            }
        }

        await post.save();
        io.emit("likeUpdated", { postId, likes: post.like })
       
        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({ message: `like error ${error}` })

    }
}

export const comment = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.userId;
        const { content } = req.body;

        const post = await Post.findByIdAndUpdate(postId, {
            $push: { comment: { content, user: userId } }
        }, { new: true })
            .populate("comment.user", "firstName lastName profileImage headline")

        if (post.author != userId) {
            let notification = await Notification.create({
                reciever: post.author,
                type: "comment",
                relatedUser: userId,
                relatedPost: postId
            })
        }

        io.emit("commentAdded", ({ postId, comm: post.comment }))
        return res.status(200).json(post);

    } catch (error) {
        return res.status(500).json({ message: `comment error ${error}` })

    }
}