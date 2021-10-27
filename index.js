

var Twit = require('twit');
var axios=require("axios").default;
const imageToBase64=require("image-to-base64");
require('dotenv').config();

var T=new Twit({
    
        consumer_key:process.env.consumer_key,
      consumer_secret:process.env.consumer_secret,
      access_token:process.env.access_token,
      access_token_secret:process.env.access_token_secret
    
})


 
async function getmeme(id,text1,text2){
    var options = {
        method: 'POST',
        url: process.env.memeurl,
        params: {
            template_id : id,
            username:process.env.usern,
             password:process.env.password,
             text0:text1,
             text1:text2
        },
      };
      var url=null;
      try{
    var response=await axios.request(options);
if(response.data.success===false) throw response.data.error_message;
         url=response.data.data.url;
         console.log(url);
         return {status:true,url:url};
    //   })
    }catch(err){
        console.log(err);
        return  {status:false,url:""};
    }
     
}

// getmeme(87743020,"hi","hi2").then((res)=>{
//   if(!res.status) throw "error";
//   console.log("gg"+res)
// }).catch((err)=>{
//   console.log("hehe"+err)
// })



 function sorttweet(tweet){
    const textar=tweet.text.split("-");
  // const textar="@bot -slap 'hello' 'shutup'".split(" ");
//   console.log(textar[2].slice(1,-1));
  const textar1=textar[0].split(" ");
  const textar2=textar[1].split(" ");

    if(textar.length>=2){
        switch(textar2[0]){
            case 'slap':
                return  {id:438680,text2:textar2.pop().slice(1,-1),text1:textar2.pop().slice(1,-1)};
  
  
          case 'confuse':
                 return {id:87743020,text2:textar2.pop().slice(1,-1),text1:textar2.pop().slice(1,-1)};
              
  
               default:
                return  {id:438680,text2:textar2.pop().slice(1,-1),text1:textar2.pop().slice(1,-1)};
  
        }
    }
  }

//  sorttweet({
//     created_at: 'Sat Oct 23 22:58:42 +0000 2021',
//     id: 1452046855102091300,
//     id_str: '1452046855102091270',
//     text: "@Swasthikjp -slap 'video' 'vedio'",
//     source: '<a href="https://mobile.twitter.com" rel="nofollow">Twitter Web App</a>',
//     truncated: false,
//     in_reply_to_status_id: null,
//     in_reply_to_status_id_str: null,
//     in_reply_to_user_id: 1176367529956036600,
//     in_reply_to_user_id_str: '1176367529956036608',
//     in_reply_to_screen_name: 'SwasthikJp',
//     user: {
//       id: 1451822863766352000,
//       id_str: '1451822863766351881',
//       name: 'respondwithmeme',
//       screen_name: 'respondwithmeme',
//       location: null,
//       url: null,
//       description: 'bot',
//       translator_type: 'none',
//       protected: false,
//       verified: false,
//       followers_count: 0,
//       friends_count: 0,
//       listed_count: 0,
//       favourites_count: 0,
//       statuses_count: 32,
//       created_at: 'Sat Oct 23 08:08:59 +0000 2021',
//       utc_offset: null,
//       time_zone: null,
//       geo_enabled: false,
//       lang: null,
//       contributors_enabled: false,
//       is_translator: false,
//       profile_background_color: 'F5F8FA',
//       profile_background_image_url: '',
//       profile_background_image_url_https: '',
//       profile_background_tile: false,
//       profile_link_color: '1DA1F2',
//       profile_sidebar_border_color: 'C0DEED',
//       profile_sidebar_fill_color: 'DDEEF6',
//       profile_text_color: '333333',
//       profile_use_background_image: true,
//       profile_image_url: 'http://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png',        
//       profile_image_url_https: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png', 
//       default_profile: true,
//       default_profile_image: false,
//       following: null,
//       follow_request_sent: null,
//       notifications: null,
//       withheld_in_countries: []
//     },
//     geo: null,
//     coordinates: null,
//     place: null,
//     contributors: null,
//     is_quote_status: false,
//     quote_count: 0,
//     reply_count: 0,
//     retweet_count: 0,
//     favorite_count: 0,
//     entities: { hashtags: [], urls: [], user_mentions: [ [Object] ], symbols: [] },
//     favorited: false,
//     retweeted: false,
//     filter_level: 'low',
//     lang: 'it',
//     timestamp_ms: '1635029922639'
//   })
 
// This function finds the latest tweet with the @respondwithmeme tag
function streamtweet() {
  

	var stream = T.stream('statuses/filter', { track: '@respondwithmeme' });
 
stream.on('tweet',async function (tweet) {
  console.log(tweet)

var obj= sorttweet(tweet);
getmeme(obj.id,obj.text1,obj.text2).then((res)=>{

  if(!res.status) throw "error";
console.log("hehe"+res.url)
var mm=null;
imageToBase64(res.url) // Image URL
.then(
    (response) => {
        mm=response;


//   var b64content = fs.readFileSync('./images/meme1.jpg', { encoding: 'base64' });

  T.post('media/upload', { media_data:mm}, function (err, data, response) {
    var mediaIdStr = data.media_id_string
    var altText = "meme"
    var meta_params = { media_id: mediaIdStr, alt_text: { text: altText },
 }
   
console.log("heeeeee"+tweet.id_str);
    T.post('media/metadata/create', meta_params, function (err, data, response) {
      if (!err) {
        // now we can reference the media and post a tweet (media will attach to the tweet)
        var params = { status: '@' + tweet.user.screen_name,
        media_ids:[mediaIdStr],
        in_reply_to_status_id: '' +tweet.id_str
     }
   
        T.post('statuses/update', params, function (err, data, response) {
          console.log(data)
        })
      }
    })
  });

// T.post('statuses/update', {
//     status: 'This is a tweet @' + tweet.user.screen_name,
//     in_reply_to_status_id: '' + tweet.id_str
//   }, function(err, data, response) {
//     console.log(data)
//   });

}
)
.catch(
    (error) => {
        console.log("hehes"+error); // Logs an error if there was one
    }
)
});
})
}


// streamtweet();






// sorttweet();


