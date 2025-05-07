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
            jwksUri: 'http://keycloak:8080/realms/korepetycje/protocol/openid-connect/certs',
        }),

        audience: 'backend-client',
        issuer: 'http://keycloak:8080/realms/korepetycje',
        algorithms: ['RS256'],
        credentialsRequired: false, 
    })
}

export default checkJwt;
