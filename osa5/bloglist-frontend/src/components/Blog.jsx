import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Divider,
} from '@mui/material'

const Blog = ({ blog, user, handleLike, handleDeleteBlog }) => {
  if (!blog) {
    return null
  }

  const isBlogOwner = user?.username === blog.user?.username

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" component="h2">
          {blog.title}
        </Typography>

        <Typography variant="body2" sx={{ mt: 2 }}>
          By: {blog.author}
        </Typography>

        <Typography
          variant="body1"
          component="a"
          href={`https://${blog.url}`}
          target="_blank"
          rel="noreferrer"
        >
          {blog.url}
        </Typography>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Added by: {blog.user.username}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography>
            likes {blog.likes}
          </Typography>
        </Stack>

        {user && (
          <Button
            variant="contained"
            size="small"
            onClick={() => handleLike(blog)}
          >
            like
          </Button>
        )}

        {isBlogOwner && (
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() => handleDeleteBlog(blog)}
          >
            delete
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default Blog