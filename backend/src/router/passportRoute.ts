import express from "express";
import passport from 'passport';

const router = express.Router()

router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account' // Forces Google to show the account selection screen
  }));
  
  // after google login it wil redirect to this
  router.get('/auth/google/callback', passport.authenticate('google'),
    (req, res) => {
      res.redirect('http://localhost:3000/home')
    }
  );
  
  router.get('/api/current_user', (req, res) => {
    res.send(req.user);
    console.log(req.user)
  });
  

  export default router
  