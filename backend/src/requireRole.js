const requireRole = (role) => {
    return (req, res, next) => {
        const token = req.cookies.auth_token 
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' })
        }
    
        try {
            const decoded = jwt.decode(token)
            if (decoded && decoded.realm_access && decoded.realm_access.roles) {
            if (decoded.realm_access.roles.includes(role)) {
                return next()
            }
            return res.status(403).json({ message: 'Forbidden. You do not have the necessary role.' })
            } else {
            return res.status(400).json({ message: 'Invalid token.' })
            }
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error', error: error.message })
        }
    }
}
  
export default requireRole
  