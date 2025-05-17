import KeycloakAdminClient from "@keycloak/keycloak-admin-client"

const getKeycloakAdminClient = async () => {
  const kcAdminClient = new KeycloakAdminClient({
    baseUrl: process.env.KEYCLOAK_BASE_URL,
    realmName: "master", 
  })

  await kcAdminClient.auth({
    username: process.env.KEYCLOAK_ADMIN_USER,
    password: process.env.KEYCLOAK_ADMIN_PASSWORD,
    grantType: "password",
    clientId: "admin-cli",
  })

  kcAdminClient.setConfig({
    realmName: "korepetycje",
  })

  return kcAdminClient
}

export default getKeycloakAdminClient
