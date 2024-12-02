const userModel = require('../Models/user');
const imageModel = require('../Models/images');
const CommentModel = require('../Models/Comments');

const createCommente = async (req, res) => {
    const id = req.user._id;
    const { commentText } = req.body;
    const imageId = req.params.id;

    const user = await userModel.findById(id);
    const image = await imageModel.findById(imageId);

    if (!user) {
      return res.status(404).send('Please login first');
  }

    const newComment = new CommentModel({
        comments: commentText,
        image: imageId,
        user: id
    });

    image.comments.push(newComment._id);
    await image.save();

    await newComment.save();
    return res.status(200).send(newComment);
}

const getComments = async (req, res) => {
  const imageId = req.params.id;
  const userId = req.user._id;


  const user = await userModel.findById(userId);
  if (!user) {
      return res.status(404).send('Please login first');
  }

  try {
      const comments = await CommentModel.find({ image: imageId });
      return res.send(comments);
  } catch (error) {
      console.error("Error fetching comments:", error);
      return res.status(500).send("Internal Server Error");
  }
};

module.exports = { createCommente, getComments };
