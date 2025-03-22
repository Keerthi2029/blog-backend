import Blog from "../models/blogModel.js"

// @desc    Create a new blog
// @route   POST /api/blogs
// @access  Private
const createBlog = async (req, res) => {
  const { title, content } = req.body

  try {
    const blog = await Blog.create({
      title,
      content,
      author: req.user.username,
      authorId: req.user._id,
    })

    res.status(201).json(blog)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 })
    res.json(blogs)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get a single blog
// @route   GET /api/blogs/:id
// @access  Public
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)

    if (blog) {
      res.json(blog)
    } else {
      res.status(404).json({ message: "Blog not found" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private
const updateBlog = async (req, res) => {
  const { title, content } = req.body

  try {
    const blog = await Blog.findById(req.params.id)

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" })
    }

    // Check if user is the author of the blog
    if (blog.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this blog" })
    }

    blog.title = title
    blog.content = content

    const updatedBlog = await blog.save()
    res.json(updatedBlog)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" })
    }

    // Check if user is the author of the blog
    if (blog.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this blog" })
    }

    await blog.deleteOne()
    res.json({ message: "Blog removed" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog }

