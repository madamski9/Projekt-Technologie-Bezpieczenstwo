import jwt from 'jsonwebtoken'

const requireRoles = (roles = []) => {
  return (req, res, next) => {
    let token = null

    if (req.cookies && req.cookies.auth_token) {
      token = req.cookies.auth_token
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({ message: 'Brak tokenu uwierzytelniającego' })
    }

    try {
      const decoded = jwt.decode(token)
      const userRoles = decoded?.realm_access?.roles || []

      const hasRole = roles.some(role => userRoles.includes(role))
      if (hasRole) {
        req.user = {
          username: decoded?.preferred_username || decoded?.sub,
          roles: userRoles,
        }
        return next()
      } else {
        return res.status(403).json({ message: 'Brak wymaganej roli' })
      }
    } catch (error) {
      return res.status(500).json({ message: 'Błąd serwera', error: error.message })
    }
  }
}

export default requireRoles
