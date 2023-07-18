const express = require('express');
const app = express();
const morgan = require('morgan');
const db = require('./db');
//이미지 저장위해서
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/') // 여기는 파일을 저장할 경로를 설정합니다.
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname) // 저장될 파일의 이름을 설정합니다.
  }
});
const upload = multer({storage: storage});
//
//미들웨어 설정
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//라우팅 설정
app.get('/gymData', (req, res) => {
  db.getGymData((error, gymData) => {
    if(error) {
      res.status(500).send('Internal Server Error');
    } else {
      res.send(gymData);
    }
  });
});

//회원가입위한거
// app.post('/signup', (req, res) => {
//   const memberData = {
//       user_id:req.body.ID,
//       username: req.body.nickname, 
//       password: req.body.password,
//       email: req.body.email,
//       profile_image_path: req.body.imageUrl 
//   };
//   db.insertMemberData(memberData, (error, results) => {
//       if (error) {
//           res.status(500).send('Internal Server Error');
//       } else {
//           res.status(201).send('User created successfully');
//       }
//   });
// });
app.post('/signup', upload.single('image'), (req, res) => {
  const memberData = {
    user_id:req.body.ID,
    username: req.body.nickname, 
    password: req.body.password,
    email: req.body.email,
    profile_image_path: req.file.path // multer를 사용하면 요청의 file 속성에 파일 정보가 저장됩니다.
  };
  db.insertMemberData(memberData, (error, results) => {
    if (error) {
      res.status(500).send('Internal Server Error');
    } else {
      res.status(201).send('User created successfully');
    }
  });
});

//로그인
app.post('/login', (req, res) => {
  const { user_id, password } = req.body;

  db.login(user_id, password, (error, result) => {
      if (error) {
          res.status(500).send('Internal Server Error');
      } else {
          if (result) {
              res.status(200).send('Login successful');
          } else {
              res.status(401).send('Login failed');
          }
      }
  });
});

//리뷰 등록
app.post('/review', (req, res)=> {
  const { gym_id, rating, review_text, image_path } = req.body;

  db.insertReview(gym_id, rating, review_text, image_path, (error)=> {
    if(error) {
      res.status(500).send('Internal Server Error');
    } else {
      res.send('Review inserted successfully');
    }
  });
});

//fragment 2
app.get('/crew/:user_id', (req, res) => {
  const user_id = req.params.user_id;

  db.getCrewData(user_id, (error, crewData) => {
    if(error) {
      res.status(500).send('Internal Server Error');
    } else {
      res.send(crewData);
    }
  });
});

//frag2에서 crew정보 가져오기
app.get('/group/:crew_name', (req, res)=> {
  const crew_name = req.params.crew_name;

  db.getGroupData(crew_name, (error, groupData) => {
    if(error) {
      res.status(500).send('Internal Server Error');
    } else {
      res.send(groupData);
    }
  });
});

app.get('/group', (req, res) => {
  db.getGroupData((error, groupData) => {
    if(error) {
      res.status(500).send('Internal Server Error');
    } else {
      res.send(groupData);
    }
  });
});

//uploadcrew
app.post('/uploadCrew', upload.single('crew_image_path'), (req, res) => {
  const crewName = req.body.crew_name;
  const crewDistrict = req.body.crew_district;
  const maxMember = parseInt(req.body.max_member);
  const explanation = req.body.explanation;

  let imagePath = '';
  if (req.file) {
    imagePath = req.file.path;
  }

  const crewData = {
    crew_name: crewName,
    crew_district: crewDistrict,
    max_member: maxMember,
    explanation: explanation,
    crew_image_path: imagePath
  };

  db.insertCrew(crewData, (error) => {
    if (error) {
      console.error('Failed to insert crew:', error);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Crew inserted successfully');
      res.sendStatus(200);
    }
  });
});

//fragment 5
app.get('/profile/:user_id', (req, res) => {
  const user_id = req.params.user_id;

  db.getProfileData(user_id, (error, profileData) => {
    if (error) {
      res.status(500).send('Internal Server Error');
    } else {
      res.send(profileData);
    }
  });
});
app.post('/uploadPost', upload.array('images', 5), (req, res) => {
  const { user_ID, category, post_text } = req.body;
  const images = req.files.map((file) => file.path);

  if (images.length > 5) {
    res.status(400).send('Maximum 5 images can be uploaded');
    return;
  }

  db.insertPost(user_ID, category, post_text, images, (error) => {
    if (error) {
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send('Post uploaded successfully');
    }
  });
});
app.get('/posts', (req, res) => {
  db.getPosts((error, posts) => {
    if (error) {
      res.status(500).send('Internal Server Error');
    } else {
      res.send(posts);
    }
  });
});

//서버 시작
const port = 80;
app.listen(port, () => {
  console.log(`App server is running at https://localhost:${port}`);
});