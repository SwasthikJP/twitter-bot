

var Twit = require('twit');
var axios=require("axios").default;
const imageToBase64=require("image-to-base64");
require('dotenv').config({path:`.env`});

var T=new Twit({
    
        consumer_key:process.env.consumer_key,
      consumer_secret:process.env.consumer_secret,
      access_token:process.env.access_token,
      access_token_secret:process.env.access_token_secret
    
})

const memes=[
  {
    cmd:'slap',
    id:438680,
    caplist:[true,true,true,true]
  },

{
  cmd:'confuse',
  id:87743020,
  caplist:[true,true,true,true]
},
  {
  cmd:'sharpturn',
  id:124822590,
  caplist:[true,true,true,true]
  },
  {
    cmd:'sexyaccent',
    id:71428573,
    caplist:[true,true]
  },
  {
    cmd:'rockshock',
    id:21735,
    caplist:[false,false]
  },
  {
    cmd:'scrolltruth',
    id:123999232,
    caplist:[false,true]
  },
  {
    cmd:'shockpikachu',
    id:155067746,
    caplist:[false,false,false]
  },
  {
    cmd:'dudewithsign',
    id:216951317,
    caplist:[false,false]
  },
  {
    cmd:'makeup',
    id:195515965,
    caplist:[false,false,false,false]
  },
  {
    cmd:'drake',
    id:181913649,
    caplist:[false,false]
  },
  {
    cmd:'gorden',
    id:1894566,
    caplist:[true,true]
  },
  {
    cmd:'mind3',
    id:128933819,
    caplist:[true,true,true]
  },
  {
    cmd:'mind4',
    id:95614466,
    caplist:[true,true,true,true]
  }
];


 
async function getmeme(obj){

    var options = {
        method: 'POST',
        url: process.env.memeurl
      };
      var params={
        template_id : obj.id,
        username:process.env.usern,
         password:process.env.password,
         text0:"dd",
         text1:"dd"
        //  'boxes[0][text]' :text0,
    };
obj.textar.forEach((ele,index)=>{
 params[`boxes[${index}][text]`]=ele;
});

options['params']=params;

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



// getmeme({id:87743020,textar:["",""]}).then((res)=>{
//   if(!res.status) throw "error";
//   console.log("gg"+res)
// }).catch((err)=>{
//   console.log("hehe"+err)
// })

function caps(strg,cond){
  if(cond){
    return strg.toUpperCase();
  }else{
    return strg;
  }
}

function getmemeobj(id,textar,caplist){
  textar.shift();
 textar=textar.map((ele,index) => caps(ele,caplist[index]) );
  var obj={
    status:true,
    id:id,
    textar
  };
    // obj[`text`+index]=ele||"";
  console.log(obj);
return obj;
}


 function sorttweet(tweet){
   console.log("hehe text" +tweet.text)
    const textar=tweet.text.split("-");
    // var st="@swasthikjp @respond -confuse,hello how you,iam fine";
//   console.log(textar[2].slice(1,-1));
  const textar2=textar[1].split(",");
console.log(textar2)

// console.log(textar2.pop().slice(1,-1))
    if(textar.length>=2){

      var memeobj=memes.find(ele=>ele.cmd===textar2[0].trim());
     if(memeobj){
       return getmemeobj(memeobj.id,textar2,memeobj.caplist)
     }else{
       return {status:false,id:0,textar:[""]};
     }
    }
    return  {status:false,id:0,textar:[""]};
  }



// This function finds the latest tweet with the @respondwithmeme tag
function streamtweet() {
  

	var stream = T.stream('statuses/filter', { track: '@'+process.env.bottag });
 
stream.on('tweet',async function (tweet) {
  console.log(tweet)
  console.log(tweet.entities.user_mentions);
if(tweet.user.screen_name!==process.env.bottag){

var obj= sorttweet(tweet);
if(obj.status){
getmeme(obj).then((res)=>{

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
        var params = { status: getusernames(tweet.user.screen_name,tweet.entities.user_mentions) ,
        media_ids:[mediaIdStr],
        in_reply_to_status_id:''+ tweet.id_str
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
})
.catch((err)=>{
  console.log("meme error"+err);
});
}
}
}
);
}


// sorttweet(tweet);



function getusernames(muser,users){
//  var tags='@'+users.shift().screen_name;
//  users.pop();
users.pop();
var tags='@'+muser+" ";
tags=tags+users.map((ele)=>'@'+ele.screen_name).join(" ");
 
 console.log(tags)
 return tags;
}

// getusernames(users)

streamtweet();

