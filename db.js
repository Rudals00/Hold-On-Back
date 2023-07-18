//mysql 모듈 import
const mysql = require('mysql');
const dbConfig = {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '1234',
    database: 'holdondb'
};
const connection = mysql.createConnection(dbConfig);

//모듈 exports
module.exports = {
    getGymData: function (callback) {
        //select 쿼리문 작성
        const query = 'SELECT * FROM climbing_gyms';

        //연결 설정 및 쿼리 실행
        connection.query(query, (error, results) => {
            if(error) {
                console.error('데이터 조회 실패:', error);
                return callback(error);
            }
            //조회 결과 반환
            callback(null, results);
        });
    },
    insertMemberData: function (memberData, callback) {
        // insert 쿼리문 작성
        const query = 'INSERT INTO users SET ?';  // 'users'로 변경
    
        // 연결 설정 및 쿼리 실행
        connection.query(query, memberData, (error, results) => {
            if(error) {
                console.error('데이터 삽입 실패:', error);
                return callback(error);
            }
            // 삽입 성공 결과 반환
            callback(null, results);
        });
    },

    insertReview: function(gymId, rating, reviewText, imagePath, callback) {
        const reviewData = {
            gym_id: gymId,
            rating: rating,
            review_text: reviewText,
            review_image_path: imagePath
        };


        const query = 'INSERT INTO reviews SET ?';

        connection.query(query, reviewData, (error, results)=> {
            if(error) {
                console.error('Failed to insert review: ', error);
                return callback(error);
            }
            console.log('Review inserted successfully');
            callback(null);
        });
    },
    //로그인
    login: function (user_id, password, callback) {
        const query = 'SELECT * FROM users WHERE user_id = ? AND password = ?';
        connection.query(query, [user_id, password], (error, results) => {
            if (error) {
                console.error('Failed to login:', error);
                return callback(error);
            }
    
            if (results.length > 0) {
                // 로그인 성공
                callback(null, true);
            } else {
                // 로그인 실패
                callback(null, false);
            }
        });
    },

    //frag2
    getCrewData: function(user_id, callback) {
      const query = 'SELECT * FROM users WHERE user_id = ?';
      connection.query(query, [user_id], (error, results) => {
        if(error) {
          console.error('Failed to get crew data:', error);
          return callback(error);
        }

        if(results.length >0) {
          const crewData = {
            crew1: results[0].crew1,
            crew2: results[0].crew2,
            crew3: results[0].crew3,
            crew4: results[0].crew4,
            crew5: results[0].crew5
          };
          callback(null, crewData);
        } else {
          callback(null, null);
        }
      });
    },

    getGroupData: function(crew_name, callback) {
      const query = 'SELECT * FROM crews WHERE crew_name = ?';
      connection.query(query, [crew_name], (error, results) => {
        if(error) {
          console.error('Failed to get group data:', error);
          return callback(error);
        }

        if(results.length>0) {
          const groupData = {
            crew_name: results[0].crew_name,
            crew_district: results[0].crew_district,
            max_member: results[0].max_member,
            num_member: results[0].num_member,
            crew_image_path: results[0].crew_image_path
          };
        }
      });
    },

    //fragment5
    getProfileData: function (user_id, callback) {
        const query = 'SELECT * FROM users WHERE user_id = ?';
        connection.query(query, [user_id], (error, results) => {
          if (error) {
            console.error('Failed to get profile data:', error);
            return callback(error);
          }
      
          if (results.length > 0) {
            const profileData = {
              profile_image_path: results[0].profile_image_path,
              nickname: results[0].username
            };
            callback(null, profileData);
          } else {
            callback(null, null);
          }
        });
      },
      insertPost: function (user_ID, category, post_text, images, callback) {
        const postData = {
          user_id: user_ID,
          category: category,
          post_text: post_text,
          img_path_1: images[0] || null,
          img_path_2: images[1] || null,
          img_path_3: images[2] || null,
          img_path_4: images[3] || null,
          img_path_5: images[4] || null
        };
      
        const query = 'INSERT INTO posts SET ?';
      
        connection.query(query, postData, (error, results) => {
          if (error) {
            console.error('Failed to insert post:', error);
            return callback(error);
          }
      
          console.log('Post inserted successfully');
          callback(null, results); // 성공적으로 삽입되었음을 알려줌
        });
        
    },
    getPosts: function(callback) {
        const query = 'SELECT * FROM posts';
      
        connection.query(query, (error, results) => {
          if (error) {
            console.error('데이터 조회 실패:', error);
            return callback(error);
          }
          callback(null, results);
        });
      },
      insertCrew: function(crewData, callback) {
        const query = 'INSERT INTO crews (crew_name, crew_district, max_member, num_member, explanation, crew_image_path) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [crewData.crew_name, crewData.crew_district, crewData.max_member, 0, crewData.explanation, crewData.crew_image_path];
      
        connection.query(query, values, (error, results) => {
          if (error) {
            console.error('Failed to insert crew:', error);
            return callback(error);
          }
      
          console.log('Crew inserted successfully');
          callback(null);
        });
      },
      getGroupData: function (callback) {
        const query = 'SELECT * FROM crews';
        connection.query(query, (error, results) => {
          if (error) {
            console.error('Failed to get group data:', error);
            return callback(error);
          }
      
          if (results.length > 0) {
            const groupData = results.map(result => ({
              crew_name: result.crew_name,
              crew_district: result.crew_district,
              max_member: result.max_member,
              num_member: result.num_member,
              crew_image_path: result.crew_image_path,
              explanation: result.explanation
            }));
            callback(null, groupData);
          } else {
            callback(null, []);
          }
        });
      },

      
    
    //   insertPostImages: function (postId, images, callback) {
    //     const updateImageQuery = 'UPDATE posts SET ';
    //     const imageValues = [
    //       images[0] || null,
    //       images[1] || null,
    //       images[2] || null,
    //       images[3] || null,
    //       images[4] || null,
    //       postId
    //     ];
      
    //     let updateImageQueryValues = '';
    //     let placeholderIndex = 1;
    //     const updateImageColumns = ['img_path_1', 'img_path_2', 'img_path_3', 'img_path_4', 'img_path_5'];
      
    //     for (let i = 0; i < images.length; i++) {
    //       if (images[i]) {
    //         updateImageQueryValues += `${updateImageColumns[i]} = ?`;
    //         imageValues.splice(i, 1, images[i]);
    //         placeholderIndex++;
    //         if (placeholderIndex <= images.length) {
    //           updateImageQueryValues += ', ';
    //         }
    //       }
    //     }
      
    //     const query = updateImageQuery + updateImageQueryValues + ' WHERE post_id = ?';
      
    //     connection.query(query, imageValues, (error, results) => {
    //       if (error) {
    //         console.error('게시물 이미지 업데이트 실패:', error);
    //         return callback(error);
    //       }
      
    //       console.log('게시물이 성공적으로 등록되었습니다.');
    //       callback(null);
    //     });}
      
      
};