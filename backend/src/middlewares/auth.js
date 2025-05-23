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
        issuer: ['http://keycloak:8080/realms/korepetycje', process.env.KEYCLOAK_REALM_URI],
        algorithms: ['RS256'],
        credentialsRequired: true, 
        getToken: (req) => {
            console.log("req.headers.authorization", req.headers.authorization)
            console.log("req cookies auth token: ", req.cookies.auth_token)
            if (req.headers.authorization) {
                return req.headers.authorization.split(' ')[1];
            } else if (req.cookies && req.cookies.auth_token) {
                return req.cookies.auth_token;
            }
            return null
        }
    })
}

export default checkJwt
