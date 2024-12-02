const express = require('express');
const { register, login, logout, profile,editprofile } = require('../Controllers/user.controller');
const { upload, uploadToCloudinary } = require('./multer');
const authorization = require('../Controllers/auth.controller');
const {uploadimage,getpost, getallposts} = require('../Controllers/post.controller');
const {postlikes , getlikes}=require('../Controllers/likes.controller');
const {uploaddp,getalluploadeddp,getdp, getofotheruser}=require('../Controllers/dp.controller');
const {uploadreel}=require('./multerReel');
const {uploadReel,getreel,getallreel}=require('../Controllers/Reel.controller');
const {uploadlive}=require('./multerlive');
const {uploadlivee}=require('../Controllers/live.controller');
const {getallusers}=require('../Controllers/Search.controller');
const { otherprofile, othergetpost, othergetreel } = require('../Controllers/otherprofile');
const  { follow, unfollow }  = require('../Controllers/follow.controller');
const { createCommente,getComments } = require('../Controllers/Comment.controller');
const {uploadstoryy}=require('../views/multerstory');
const { uploadstory, fetchstory } = require('../Controllers/story.controller');
const { status } = require('../Controllers/profilestatus.controller');
const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/upload').post(authorization, upload.single('file'), uploadimage);
router.route('/profile').get(authorization, profile);
router.route('/logout').post(logout);
router.route('/getpost').get(authorization,getpost);
router.route('/like/:id').post(authorization,postlikes);
router.route('/totallike/:id').get(authorization,getlikes);
router.route('/uploaddp').post(authorization, upload.single('file'),uploaddp);
router.route('/getdp').get(authorization,getalluploadeddp);
router.route('/editProfile').post(authorization,editprofile);
router.route('/uploadreel').post(authorization,uploadreel.single('file'),uploadReel);
router.route('/getreel').get(authorization,getreel);
// router.route('/uploadlive').post(authorization,uploadlivee)
router.route('/searchuser/:username').get(authorization,getallusers);
router.route('/getdp/:picture').get(authorization,getdp);
router.route('/profile/:id').get(authorization, otherprofile);
router.route('/getpost/:id').get(authorization,othergetpost);
router.route('/getreel/:id').get(authorization,othergetreel);
router.route('/getallreel').get(authorization,getallreel);
router.route('/follow/:id').post(authorization,follow);
router.route('/unfollow/:id').post(authorization,unfollow);
router.route('/comment/:id').post(authorization,createCommente);
router.route('/comments/image/:id').get(authorization,getComments);
router.route('/uploadstory').post(authorization,uploadstoryy.array('files'),uploadstory);
router.route('/fetchstory').get(authorization,fetchstory);
router.route('/allposts').get(authorization,getallposts);
router.route('/status').post(authorization,status);
router.route('/dp/:userId/:id').get(authorization,getofotheruser);








module.exports = router;
