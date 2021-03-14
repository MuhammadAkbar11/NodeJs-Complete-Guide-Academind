exports.getPosts = (req, res, next) => {
  res.status(200).json({
    message: "success to fetching ",
    posts: [{ title: "post 1", content: "this the first post" }],
  });
};

exports.createPost = (req, res) => {
  const title = req.body.title;
  const content = req.body.content;

  res.status(201).json({
    message: "Post created successfully",
    post: { id: new Date().toISOString(), title: title, content: content },
  });
};
