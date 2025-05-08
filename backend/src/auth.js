import { expressjwt } from 'express-jwt'
import jwksRsa from 'jwks-rsa'
import dotenv from 'dotenv'

dotenv.config()
const checkJwt = () => {
    return expressjwt({
        secret: jwksRsa.expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: process.env.KEYCLOAK_CERTS,
        }),

        audience: 'backend-client',
        issuer: process.env.KEYCLOAK_REALM_URI,
        algorithms: ['RS256'],
        credentialsRequired: false, 
    })
}

export default checkJwt
