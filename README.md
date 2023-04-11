# Objectives:
This project showcases the author's Web Development capabilities by building a Multi Factor Authentication (MFA) mechanism with:
- React Frontend: techniques and best practices, especially various use cases of React Hooks in  UI.
- Node Express Backend for authentication process. It also equips with capability to send MFA code to user, and with a road map to include rate limiting to prevent user from abusing the system

Tech Stack: Typescript, Node Express, Sqlite database engine, React.

# Disclaimer:
The scope of this project does not include or intend to venture in encryption techniques in masking MFA code stored in the database. It neither includes the user authentication/ user management/ session management as typically seen in production apps.



# First time setup:

## Prerequisites:
- Node https://nodejs.org/en/download/. If multiple Node versions needed for different projects on the same dev machine, use https://github.com/volta-cli
- Git Setup https://gist.github.com/tinutmap/c217e1a1693b5e422290a32d4d3c0060
## Create React App:
- `npx create-react-app mfa_code_input --template typescript`
- For adding ESLint and Prettier, see 'Add eslint' and 'Add prettier' commits.
- Setup Node Express with Typescript https://blog.logrocket.com/how-to-set-up-node-typescript-express/

# References:

- https://reactjs.org/docs/create-a-new-react-app.html
- https://create-react-app.dev/docs/getting-started