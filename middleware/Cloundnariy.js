const cloudinary =require('cloudinary').v2
const apiSecret = cloudinary.config().api_secret;

cloudinary.config({
    cloud_name: 'codesoftic-com', 
    api_key: 288149184289838,
    api_secret: 'YYLXx0k0jwIU2vxz6ILyDilfA_E',
  })


//   const signuploadwidget = () => {
//     const timestamp = Math.round((new Date).getTime()/1000);
  
//     const signature = cloudinary.utils.api_sign_request({
//       timestamp: timestamp,
//       source: 'uw',
//       folder: 'signed_upload_demo_uw'}, process.env.CLOUD_SECRET);
    
//     return { timestamp, signature }
//   }
  
  module.exports = cloudinary


  
// module.exports.signUpload=signUpload