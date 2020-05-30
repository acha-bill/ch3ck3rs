// const userService = require('../../src/services/users');
// const AccountService = require('../../src/models/account');
// const firebaseAuthService = require('../../src/services/payment');

// const email = 'test@gmail.com';
// const password = 'test1234';

// const createUser = async function (role) {
//   const user = await userService.createUser({
//     email: email,
//     password: password,
//     userRole: role,
//     displayName: 'test1'
//   });
//   return user;
// };
// const signIn = async function (email, password) {
//   const cred = await firebaseAuthService.signInWithEmailAndPassword(email, password);
//   const idToken = (await cred.user.getIdToken()).toString();
//   return idToken;
// };
// module.exports.createAndSignInAdminUser = async function () {
//   const user = await createUser(UserRoles.ADMIN);
//   const idToken = await signIn(email, password);
//   const account = await AccountService.create({
//     userId: user.id
//   });
//   return {
//     user: user.toJSON(),
//     idToken,
//     account: account.toJSON()
//   };
// };
// module.exports.createAndSignInUser = async function () {
//   const user = await createUser(UserRoles.USER);
//   const idToken = await signIn(email, password);
//   const account = await AccountService.create({
//     userId: user.id
//   });
//   return {
//     user: user.toJSON(),
//     idToken,
//     account: account.toJSON()
//   };
// };
