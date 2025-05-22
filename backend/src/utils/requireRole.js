import jwt from 'jsonwebtoken'

const requireRoles = (roles = []) => {
  return (req, res, next) => {
    const token = req.cookies.auth_token
    if (!token) {
      return res.status(401).json({ message: 'Access denied, no token provided' })
    }

    try {
      const decoded = jwt.decode(token)
      const userRoles = decoded?.realm_access?.roles || []
      console.log("userRoles: ", userRoles)

      const hasRole = roles.some(role => userRoles.includes(role))
      console.log("hasRole: ", hasRole)
      if (hasRole) {
        req.user = {
          username: decoded?.preferred_username || decoded?.sub,
          roles: userRoles,
        }
        return next()
      } else {
        return res.status(403).json({ message: 'Forbidden, insufficient role' })
      }
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
  }
}

export default requireRoles
